/**
 * fix-margarita-food.ts
 * Corrige imagen e nombres de productos de Margarita Food.
 * Uso: npx tsx scripts/fix-margarita-food.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();
const connectionString = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) { console.error('❌ Falta DATABASE_URL'); process.exit(1); }

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Conectado.\n');

  // 1. Corregir imagen (subdirectorio margaritafood/)
  await client.query(`
    UPDATE stores
    SET img_path = 'margaritafood/logo_margaritafood.png'
    WHERE slug = 'real-13'
  `);
  console.log('✅ Imagen actualizada → margaritafood/logo_margaritafood.png\n');

  // 2. Corregir nombres de productos al exacto que envió el usuario
  const fixes: [number, string][] = [
    [310, 'Perro Caliente'],
    [312, 'Plátano'],
    [313, 'Queso Semi Duro'],
    [314, 'Caraotas'],
    [315, 'Chuleta'],
  ];

  console.log('📝 Corrigiendo nombres de productos...');
  for (const [id, name] of fixes) {
    await client.query(`UPDATE products SET name = $1 WHERE id = $2`, [name, id]);
    console.log(`  ✅ ID ${id} → "${name}"`);
  }

  // 3. Eliminar el combo que agregué sin pedirlo
  await client.query(`DELETE FROM products WHERE id = 309`);
  console.log('\n🗑️  Combo 3 Empanadas eliminado (no fue solicitado)\n');

  // 4. Verificar estado final
  const res = await client.query(`
    SELECT id, name, price, category
    FROM products WHERE store_id = 'real-13'
    ORDER BY id
  `);
  console.log('📋 Productos finales de Margarita Food:');
  res.rows.forEach(r => console.log(`  [${r.id}] ${r.name} — $${r.price} (${r.category})`));
  console.log(`\n✅ Total: ${res.rows.length} productos`);

  await client.end();
}

main().catch(e => { console.error('❌', e); process.exit(1); });
