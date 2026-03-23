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
  console.error('❌ Falta DATABASE_DIRECT_URL o DATABASE_URL en .env.local');
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();

  const { rows } = await client.query(
    `SELECT id, name, img_path FROM products WHERE is_combo = true ORDER BY id`
  );

  console.log(`\n📦 Combos en Supabase (${rows.length} encontrados):\n`);
  for (const row of rows) {
    const imgStatus = row.img_path ? '✅' : '❌ VACÍO';
    console.log(`  [${row.id}] ${row.name}`);
    console.log(`        img_path: ${row.img_path || '(vacío)'} ${imgStatus}`);
  }

  await client.end();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  client.end();
  process.exit(1);
});
