/**
 * normalize-images.ts
 * Descarga cada imagen de producto del bucket Supabase,
 * la procesa con Sharp (fondo blanco, 400×400, producto centrado)
 * y la re-sube como WebP optimizado.
 *
 * Uso: npx tsx scripts/normalize-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  const content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const sb = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_ANON_KEY!
);

const SIZE = 400;
const PADDING = 32; // px de margen interior para que el producto no toque el borde

// Imágenes a NO procesar (portadas de locales, banners, combos con diseño propio)
const SKIP = new Set([
  'assets', // carpeta
  'abarrotes.png','abarrotes_1.png','bebidas.png','bebidas_cervezas.png',
  'chuletas.png','chuletas_1.png','enlatado_diablitos.png','enlatado_diablitos1.png',
  'golosinas.png','golosinas_1.png','harinas1.png','queso_lacteos.png',
  'queso_llanero_lacteos.png','salsas.png','salsas1.png','snacks.png','snacks1.png',
  'tequenos_y_quesos1.png',
  // portadas de locales
  'portada_araguaney.png','portada_bahareque.png','portada_bajonmarket.png',
  'portada_elpuestico.png','portada_elrincon_delmorocho.png','portada_mordiscos_house.png',
  'portada_pancheria_once1.png','portada_tequetok.png','portada_venefood.png',
  'portada_venemarket.png',
  // combos con diseño propio
  'combo_arepero.png','combo_cachapero.png','combo_desayuno_criollo.png',
  'combo_dulces_de_Venezuela.png','combo_empanadas_venezolanas.png',
  'combo_fiesta_venezolana.png','combo_merienda_venezolana.png','combo_pabellon.png',
]);

async function processImage(buffer: Buffer): Promise<Buffer> {
  const inner = SIZE - PADDING * 2;

  // 1. Obtener metadata para detectar si tiene transparencia
  const meta = await sharp(buffer).metadata();
  const hasAlpha = meta.hasAlpha ?? false;

  // 2. Redimensionar con padding interior (contain dentro de 336x336)
  let pipeline = sharp(buffer).resize(inner, inner, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: hasAlpha ? 0 : 1 },
  });

  // 3. Si tiene canal alfa, aplanar sobre blanco
  if (hasAlpha) {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  // 4. Convertir a PNG para poder extender el canvas
  const resizedBuf = await pipeline.png().toBuffer();

  // 5. Extender a 400×400 con fondo blanco (centrado)
  const finalBuf = await sharp(resizedBuf)
    .extend({
      top: PADDING, bottom: PADDING, left: PADDING, right: PADDING,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  return finalBuf;
}

async function main() {
  // Obtener lista de todos los img_path activos en la DB
  const { data: products, error: dbErr } = await sb
    .from('products')
    .select('id, name, img_path')
    .eq('is_active', true)
    .not('img_path', 'is', null);

  if (dbErr) throw dbErr;

  // Solo procesar las imágenes que usan los productos activos
  const toProcess = (products ?? []).filter(p =>
    p.img_path && !SKIP.has(p.img_path) && !p.img_path.startsWith('combo_')
  );

  // Eliminar duplicados de img_path
  const seen = new Set<string>();
  const unique = toProcess.filter(p => {
    if (seen.has(p.img_path)) return false;
    seen.add(p.img_path);
    return true;
  });

  console.log(`\n🎨 Normalizando ${unique.length} imágenes (fondo blanco 400×400)...\n`);

  let ok = 0; let skipped = 0; let errors = 0;

  for (const { img_path, name } of unique) {
    process.stdout.write(`  ${img_path} → `);

    try {
      // Descargar del bucket
      const { data, error } = await sb.storage.from('imagenes').download(img_path);
      if (error || !data) throw new Error(error?.message ?? 'Sin datos');

      const buffer = Buffer.from(await data.arrayBuffer());
      if (buffer.length < 1000) throw new Error('Archivo vacío o inválido');

      // Procesar
      const processed = await processImage(buffer);

      // Determinar nombre de salida (siempre .webp)
      const outName = img_path.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');

      // Re-subir como .webp
      const { error: uploadErr } = await sb.storage
        .from('imagenes')
        .upload(outName, processed, { contentType: 'image/webp', upsert: true });

      if (uploadErr) throw uploadErr;

      // Si el nombre cambió (era .jpg/.png), actualizar la DB
      if (outName !== img_path) {
        await sb.from('products')
          .update({ img_path: outName })
          .eq('img_path', img_path);
      }

      console.log(`✅ ${Math.round(processed.length / 1024)}KB → ${outName}`);
      ok++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`❌ ${msg}`);
      errors++;
    }
  }

  console.log('\n─────────────────────────────────────────────');
  console.log(`   ✅ Procesadas : ${ok}`);
  console.log(`   ⏭️  Saltadas  : ${skipped}`);
  console.log(`   ❌ Errores   : ${errors}`);
  console.log('─────────────────────────────────────────────\n');
  console.log('🎉 Todas las imágenes tienen ahora fondo blanco y tamaño uniforme.');
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
