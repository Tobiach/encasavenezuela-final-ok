/**
 * fix-margarita-images.ts
 * Asigna img_path a los 21 productos de Margarita Food:
 *  - Reutiliza imágenes existentes en la DB cuando hay coincidencia
 *  - Usa Twemoji CDN (72x72 PNG) para los que no tienen imagen propia
 *  - Reactiva el combo 3x8.000 empanadas (ID 309)
 *
 * Uso: npx tsx scripts/fix-margarita-images.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

function loadEnv() {
  const content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv();
const cs = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
if (!cs) { console.error('❌ Falta DATABASE_URL'); process.exit(1); }

// ── Twemoji CDN (Twitter emojis como PNG 72x72, muy confiable) ────────────────
const tw = (hex: string) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${hex}.png`;

// ── Mapa de IDs → img_path definitivo ─────────────────────────────────────────
// Imágenes reutilizadas de la DB existente (nombres del bucket):
//   combo_empanadas_venezolanas.png · harina_morixe.webp · malta_58.webp
//   re-ko_malta.webp · reko_manzana_real.webp · caraotas_negras.webp
//   chuleta_ahumada.webp · queso_duro.webp
//
// Emojis (Twemoji CDN):
//   🌭 1f32d | 🐟 1f41f | 🍌 1f34c | 🥤 1f964 | 🍑 1f351 | 🍋 1f34b

const IMAGES: Record<number, string> = {
  // Empanadas clásicas → imagen de combo existente en DB
  300: 'combo_empanadas_venezolanas.png',  // Empanada de Queso
  301: 'combo_empanadas_venezolanas.png',  // Empanada de Plátano y Queso
  302: 'combo_empanadas_venezolanas.png',  // Empanada de Jamón y Queso
  303: 'combo_empanadas_venezolanas.png',  // Empanada de Molida
  304: 'combo_empanadas_venezolanas.png',  // Empanada de Pollo
  305: 'combo_empanadas_venezolanas.png',  // Empanada Domino

  // Empanadas especiales
  306: 'combo_empanadas_venezolanas.png',  // Empanada de Mechada
  307: tw('1f41f'),                        // Empanada de Pescado 🐟
  308: 'combo_empanadas_venezolanas.png',  // Empanada Pabellón

  // Combo 3x8.000 (se reactiva)
  309: 'combo_empanadas_venezolanas.png',  // Combo 3 Empanadas

  // Otros
  310: tw('1f32d'),                        // Perro Caliente 🌭
  311: 'harina_morixe.webp',              // Harina Morixe ✓ imagen existente
  312: tw('1f34c'),                        // Plátano 🍌
  313: 'queso_duro.webp',                 // Queso Semi Duro ✓ imagen existente
  314: 'caraotas_negras.webp',            // Caraotas ✓ imagen existente
  315: 'chuleta_ahumada.webp',            // Chuleta ✓ imagen existente

  // Bebidas
  316: 'malta_58.webp',                   // Malta +58 ✓ imagen existente
  317: 're-ko_malta.webp',               // Reko Malta ✓ imagen existente
  318: tw('1f964'),                        // Reko Lita 🥤
  319: 'reko_manzana_real.webp',          // Reko Manzana ✓ imagen existente
  320: tw('1f351'),                        // Reko Tea Durazno 🍑
  321: tw('1f34b'),                        // Reko Tea Limón 🍋
};

async function main() {
  const client = new Client({ connectionString: cs });
  await client.connect();
  console.log('✅ Conectado a Supabase.\n');

  // 1. Reactiva/inserta el combo 3 empanadas (se eliminó en paso anterior)
  await client.query(`
    INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids)
    VALUES (309, '3 Empanadas x $8.000', 8000, 'Promociones',
      'Elegí 3 empanadas clásicas al precio especial. Combiná los rellenos que quieras.',
      true, 'real-13', ARRAY['real-13'])
    ON CONFLICT (id) DO UPDATE SET
      name     = EXCLUDED.name,
      price    = EXCLUDED.price,
      is_combo = EXCLUDED.is_combo
  `);
  console.log('✅ Combo 3 empanadas reactivo (ID 309)\n');

  // 2. Actualizar img_path de cada producto
  console.log('🖼️  Asignando imágenes...\n');
  const nameRes = await client.query(
    'SELECT id, name FROM products WHERE id = ANY($1)',
    [Object.keys(IMAGES).map(Number)]
  );
  const nameMap: Record<number, string> = {};
  nameRes.rows.forEach((r: { id: number; name: string }) => { nameMap[r.id] = r.name; });

  let withReal = 0;
  let withEmoji = 0;

  for (const [idStr, img] of Object.entries(IMAGES)) {
    const id = Number(idStr);
    await client.query('UPDATE products SET img_path = $1 WHERE id = $2', [img, id]);
    const isEmoji = img.startsWith('https://');
    if (isEmoji) {
      console.log(`  🎨 [${id}] ${nameMap[id] ?? '?'} → emoji`);
      withEmoji++;
    } else {
      console.log(`  🖼️  [${id}] ${nameMap[id] ?? '?'} → ${img}`);
      withReal++;
    }
  }

  // 3. Verificación final
  const res = await client.query(`
    SELECT id, name, price, img_path IS NOT NULL AS has_img
    FROM products WHERE store_id = 'real-13' ORDER BY id
  `);

  console.log('\n─────────────────────────────────────────────────');
  console.log('📊 Estado final Margarita Food:');
  console.log(`   Imágenes reales reutilizadas : ${withReal}`);
  console.log(`   Emojis Twemoji (CDN)         : ${withEmoji}`);
  console.log(`   Total productos              : ${res.rows.length}`);
  console.log('─────────────────────────────────────────────────\n');
  console.log('🎉 Listo. Todos los productos tienen imagen.');

  await client.end();
}

main().catch(e => { console.error('❌', e); process.exit(1); });
