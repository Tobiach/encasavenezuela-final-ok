/**
 * Normalize all product images assigned to minimarket-vibe
 * Pipeline: fetch from Supabase bucket → Sharp 344x344 contain white bg + 28px pad → 400x400 WebP q87 → re-upload
 */
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const m = line.match(/^([^=]+)=(.+)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SERVICE_KEY  = env.VITE_SUPABASE_SERVICE_ROLE;
const ANON_KEY     = env.VITE_SUPABASE_ANON_KEY?.replace(/\s/g, ''); // remove any whitespace
const BUCKET = 'imagenes';

if (!SUPABASE_URL) { console.error('VITE_SUPABASE_URL not found in .env.local'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);

console.log(`Using Supabase: ${SUPABASE_URL}`);
console.log(`Auth: ${SERVICE_KEY ? 'service_role' : 'anon'}\n`);

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 15000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function normalizeImage(inputBuffer) {
  return sharp(inputBuffer)
    .resize(344, 344, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .extend({
      top: 28, bottom: 28, left: 28, right: 28,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .webp({ quality: 87 })
    .toBuffer();
}

async function main() {
  // Query products with minimarket-vibe in available_in_store_ids
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, img_path, available_in_store_ids')
    .contains('available_in_store_ids', ['minimarket-vibe']);

  if (error) {
    console.error('Error querying products:', JSON.stringify(error));
    process.exit(1);
  }

  console.log(`Found ${products.length} products assigned to minimarket-vibe:\n`);
  products.forEach(p => console.log(`  [${p.id}] ${p.name} → ${p.img_path}`));
  console.log('');

  let ok = 0, skipped = 0, fail = 0;
  const renamed = [];

  for (const product of products) {
    const imgPath = product.img_path;
    if (!imgPath) {
      console.log(`[${product.id}] ${product.name}: no img, skip`);
      skipped++;
      continue;
    }

    // Build public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(imgPath);
    const publicUrl = urlData.publicUrl;

    process.stdout.write(`[${product.id}] ${product.name} (${imgPath})... `);

    try {
      const inputBuf = await fetchBuffer(publicUrl);
      const meta = await sharp(inputBuf).metadata();
      const alreadyNormalized = meta.width === 400 && meta.height === 400 && meta.format === 'webp';

      if (alreadyNormalized) {
        console.log(`✓ already 400x400 WebP`);
        ok++;
        continue;
      }

      process.stdout.write(`(${meta.width}x${meta.height} ${meta.format}) → normalizing... `);

      const normalized = await normalizeImage(inputBuf);

      // Output filename: always .webp
      const baseName = imgPath.replace(/\.[^.]+$/, '');
      const newPath = baseName + '.webp';

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(newPath, normalized, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (upErr) throw new Error(`upload: ${upErr.message}`);

      // Update DB if filename changed
      if (newPath !== imgPath) {
        const { error: dbErr } = await supabase
          .from('products')
          .update({ img_path: newPath })
          .eq('id', product.id);
        if (dbErr) throw new Error(`db update: ${dbErr.message}`);
        renamed.push({ id: product.id, name: product.name, old: imgPath, new: newPath });
        console.log(`✓ renamed + uploaded (${imgPath} → ${newPath})`);
      } else {
        console.log(`✓ re-uploaded normalized`);
      }

      ok++;
    } catch (e) {
      console.log(`✗ FAILED: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n─── Done: ${ok} normalized/ok, ${skipped} skipped, ${fail} failed ───`);
  if (renamed.length > 0) {
    console.log('\nDB img paths updated (also update fallbackProducts.ts):');
    renamed.forEach(r => console.log(`  [${r.id}] ${r.name}: "${r.old}" → "${r.new}"`));
  }
}

main().catch(console.error);
