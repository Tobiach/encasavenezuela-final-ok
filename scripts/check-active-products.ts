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

const client = new Client({ connectionString: process.env.DATABASE_DIRECT_URL });

async function main() {
  await client.connect();

  const { rows } = await client.query(`
    SELECT id, name, is_combo, is_active
    FROM products
    ORDER BY is_combo DESC, id
  `);

  console.log('\n📊 Estado de productos en Supabase:\n');
  let activeCombos = 0, activeProducts = 0, inactive = 0;
  for (const r of rows) {
    const estado = r.is_active ? '✅ activo' : '❌ INACTIVO';
    if (!r.is_active) inactive++;
    else if (r.is_combo) activeCombos++;
    else activeProducts++;
    console.log(`  [${r.id}] ${r.name} | combo=${r.is_combo} | ${estado}`);
  }
  console.log(`\nResumen: ${activeCombos} combos activos | ${activeProducts} productos activos | ${inactive} inactivos`);

  await client.end();
}

main().catch(err => {
  console.error('Error:', err.message);
  client.end();
  process.exit(1);
});
