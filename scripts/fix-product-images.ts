/**
 * fix-product-images.ts
 * Corrige los img_path incorrectos en la tabla products.
 *
 * Productos afectados:
 *   id=3  savoy_carre.png         → chocolate_savoy_carre1.png
 *   id=8  rekolita.png            → re-kolita_white.png
 *
 * Uso:
 *   npx tsx scripts/fix-product-images.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  try {
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
  } catch {
    console.error('❌ No se encontró .env.local en la raíz del proyecto.');
    process.exit(1);
  }
}

loadEnv();

const connectionString = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Falta DATABASE_URL o DATABASE_DIRECT_URL en .env.local');
  process.exit(1);
}

const FIXES = [
  { id: 3,  old: 'savoy_carre.png',  correct: 'chocolate_savoy_carre1.png' },
  { id: 8,  old: 'rekolita.png',     correct: 're-kolita_white.png' },
];

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Conectado a Supabase\n');

  for (const fix of FIXES) {
    const res = await client.query(
      `UPDATE products SET img_path = $1 WHERE id = $2 RETURNING id, name, img_path`,
      [fix.correct, fix.id]
    );
    if (res.rowCount === 0) {
      console.warn(`⚠️  id=${fix.id}: no se encontró la fila`);
    } else {
      const row = res.rows[0];
      console.log(`✅ id=${row.id} "${row.name}" → img_path = ${row.img_path}`);
    }
  }

  await client.end();
  console.log('\n✅ Correcciones aplicadas.');
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
