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
  console.log('✅ Conectado a Supabase\n');

  // 1. img_path combo 108
  const r1 = await client.query(
    `UPDATE products SET img_path = 'combo_dulces_de_Venezuela.png' WHERE id = 108 RETURNING id, name, img_path`
  );
  if (r1.rowCount && r1.rowCount > 0) {
    console.log(`✅ [108] ${r1.rows[0].name} → img_path = '${r1.rows[0].img_path}'`);
  } else {
    console.log('❌ [108] No se encontró el registro');
  }

  // 2. img_path combo 105
  const r2 = await client.query(
    `UPDATE products SET img_path = 'combo_cachapero.png' WHERE id = 105 RETURNING id, name, img_path`
  );
  if (r2.rowCount && r2.rowCount > 0) {
    console.log(`✅ [105] ${r2.rows[0].name} → img_path = '${r2.rows[0].img_path}'`);
  } else {
    console.log('❌ [105] No se encontró el registro');
  }

  // 3. is_active = false combo 110
  const r3 = await client.query(
    `UPDATE products SET is_active = false WHERE id = 110 RETURNING id, name, is_active`
  );
  if (r3.rowCount && r3.rowCount > 0) {
    console.log(`✅ [110] ${r3.rows[0].name} → is_active = ${r3.rows[0].is_active}`);
  } else {
    console.log('❌ [110] No se encontró el registro');
  }

  console.log('\n🎉 Los 3 UPDATEs completados.');
  await client.end();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  client.end();
  process.exit(1);
});
