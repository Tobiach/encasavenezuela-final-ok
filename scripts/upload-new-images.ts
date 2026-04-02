/**
 * upload-new-images.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Sube todos los WebP de /imagenes_productos/ al bucket "imagenes" de Supabase.
 * Usa VITE_SUPABASE_ANON_KEY (o SERVICE_ROLE si existe).
 *
 * Uso:
 *   npx tsx scripts/upload-new-images.ts
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Cargar .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key   = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.error('❌ No se encontró .env.local'); process.exit(1);
  }
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.VITE_SUPABASE_SERVICE_ROLE
  || process.env.VITE_SUPABASE_ANON_KEY!;
const BUCKET = 'imagenes';
const INPUT_DIR = path.join(process.cwd(), 'imagenes_productos');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Carpeta no encontrada: ${INPUT_DIR}`);
    console.error('   Primero generá las imágenes: npx tsx scripts/generate-placeholder-images.ts');
    process.exit(1);
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
  console.log(`\n📤 Subiendo ${files.length} imágenes al bucket "${BUCKET}"...\n`);

  let ok = 0; let errors = 0;

  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file);
    const buffer = fs.readFileSync(filePath);
    const contentType = file.endsWith('.webp') ? 'image/webp'
      : file.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file, buffer, { contentType, upsert: true });

    if (error) {
      console.error(`  ❌ ${file}: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ ${file} (${Math.round(buffer.length / 1024)}KB)`);
      ok++;
    }
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log(`   ✅ Subidas   : ${ok}`);
  console.log(`   ❌ Errores   : ${errors}`);
  console.log('─────────────────────────────────────────────────');

  if (errors > 0) {
    console.log('\n⚠️  Algunos archivos fallaron. Si es error de permisos (403), necesitás');
    console.log('   agregar SUPABASE_SERVICE_ROLE_KEY en .env.local');
    console.log('   La encontrás en: Supabase Dashboard → Settings → API → service_role key');
  } else {
    console.log('\n🎉 Todas las imágenes están en Supabase. La plataforma las mostrará automáticamente.');
  }
}

main().catch((err) => { console.error('💥', err); process.exit(1); });
