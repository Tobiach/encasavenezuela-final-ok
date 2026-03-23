/**
 * update-combo-callejero.ts
 * Reemplaza el "Combo Perro Callejero" (id=105) por "Combo Cachapero" en Supabase.
 *
 * Uso:
 *   npx tsx scripts/update-combo-callejero.ts
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
  console.error('❌ Falta DATABASE_URL (o DATABASE_DIRECT_URL) en .env.local');
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();

  // Verificar estado actual
  const before = await client.query('SELECT id, name, price, img_path FROM products WHERE id = $1', [105]);
  if (before.rows.length === 0) {
    console.error('❌ No se encontró ningún producto con id=105 en Supabase.');
    await client.end();
    process.exit(1);
  }
  console.log('🔍 Estado actual:', before.rows[0]);

  // Ejecutar el UPDATE
  const result = await client.query(
    `UPDATE products
     SET
       name       = $1,
       usage_info = $2,
       img_path   = $3
     WHERE id = $4
     RETURNING id, name, price, usage_info, img_path`,
    [
      'Combo Cachapero',
      'Cachapas de maíz tierno con queso de mano derretido, jamón, nata fresca y tequeños crujientes. Todo el sabor venezolano en un solo combo.',
      null,
      105,
    ]
  );

  if (result.rowCount === 0) {
    console.error('❌ UPDATE no afectó ninguna fila.');
  } else {
    console.log('✅ Producto actualizado:');
    console.table(result.rows);
  }

  await client.end();
}

main().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
