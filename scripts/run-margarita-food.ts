/**
 * run-margarita-food.ts
 * Inserta Margarita Food en Supabase (store + productos).
 * Uso: npx tsx scripts/run-margarita-food.ts
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
    console.error('❌ No se encontró .env.local');
    process.exit(1);
  }
}

loadEnv();

const connectionString = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) { console.error('❌ Falta DATABASE_URL en .env.local'); process.exit(1); }

async function main() {
  const client = new Client({ connectionString });
  try {
    console.log('🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conectado.\n');

    // ── STORE ──────────────────────────────────────────────────────
    console.log('📍 Insertando local Margarita Food...');
    await client.query(`
      INSERT INTO stores (
        slug, name, address, neighborhood, city,
        type, plan, is_prepared_food,
        tags, rating, review_count,
        google_maps_url, img_path, is_active
      ) VALUES (
        'real-13', 'Margarita Food', 'Medrano 495', 'Almagro', 'CABA',
        'comida', 'premium', true,
        ARRAY['Empanadas', 'Comida venezolana', 'Bebidas'],
        4.9, 0,
        'https://maps.app.goo.gl/2uXKL1va8uM33UXx9',
        'logo_margaritafood.png',
        true
      )
      ON CONFLICT (slug) DO UPDATE SET
        name           = EXCLUDED.name,
        address        = EXCLUDED.address,
        neighborhood   = EXCLUDED.neighborhood,
        plan           = EXCLUDED.plan,
        tags           = EXCLUDED.tags,
        rating         = EXCLUDED.rating,
        google_maps_url= EXCLUDED.google_maps_url,
        img_path       = EXCLUDED.img_path,
        is_active      = EXCLUDED.is_active
    `);
    console.log('✅ Local insertado/actualizado.\n');

    // lat/lng para el mapa
    try {
      await client.query(`UPDATE stores SET lat = -34.6104, lng = -58.4287 WHERE slug = 'real-13'`);
      console.log('✅ Coordenadas del mapa seteadas.\n');
    } catch {
      console.log('⚠️  Columnas lat/lng no existen aún (mapa pendiente).\n');
    }

    // ── PRODUCTOS ─────────────────────────────────────────────────
    console.log('📦 Insertando productos...');
    const products = [
      // Empanadas clásicas
      [300, 'Empanada de Queso',           3500, 'Almacén',    'Empanada venezolana frita con queso derretido. Crujiente por fuera, cremosa por dentro.',        false],
      [301, 'Empanada de Plátano y Queso', 3500, 'Almacén',    'Tajadas de plátano maduro con queso criollo. Combinación dulce-salada, un clásico venezolano.',   false],
      [302, 'Empanada de Jamón y Queso',   3500, 'Almacén',    'Empanada con jamón cocido y queso fundido. Ideal para el desayuno o la merienda.',                false],
      [303, 'Empanada de Molida',          3500, 'Almacén',    'Rellena con carne molida sazonada al estilo venezolano con cebolla, ají y especias.',             false],
      [304, 'Empanada de Pollo',           3500, 'Almacén',    'Pollo desmechado con sofrito criollo. Jugosa y llena de sabor casero.',                          false],
      [305, 'Empanada Domino',             3500, 'Almacén',    'Caraotas negras con queso. La combinación icónica venezolana.',                                   false],
      // Empanadas especiales
      [306, 'Empanada de Mechada',         4000, 'Almacén',    'Carne mechada de res cocinada lento con sofrito. El relleno más pedido de Venezuela.',            false],
      [307, 'Empanada de Pescado',         4000, 'Almacén',    'Pescado desmenuzado con ajo, pimentón y limón. Fresca y sabrosa.',                               false],
      [308, 'Empanada Pabellón',           4000, 'Almacén',    'El plato nacional venezolano en formato empanada: carne, caraotas, tajadas y queso.',            false],
      // Combo
      [309, 'Combo 3 Empanadas',           8000, 'Promociones','Elegí 3 empanadas clásicas al precio especial. Combiná los rellenos.',                            true],
      // Perro
      [310, 'Perro Caliente Venezolano',   3500, 'Almacén',    'Hot dog estilo venezolano con papas fritas, mayonesa y salsa rosa.',                              false],
      // Almacén / frescos
      [311, 'Harina Morixe',               3000, 'Harinas',    'Harina de trigo ideal para arepas y empanadas. Bolsa 1kg.',                                       false],
      [312, 'Plátano Maduro',              3000, 'Almacén',    'Plátano venezolano maduro para tajadas y tostones. Precio por kilo.',                             false],
      [313, 'Queso Semi Duro',            10000, 'Lácteos',    'Queso venezolano semi duro, ideal para rallar o trocear. Precio por kilo.',                      false],
      [314, 'Caraotas Negras',             2000, 'Almacén',    'Caraotas negras secas para el pabellón criollo. Precio por kilo.',                                false],
      [315, 'Chuleta de Cerdo',           14000, 'Almacén',    'Chuleta de cerdo fresca para freír o a la plancha. Precio por kilo.',                            false],
      // Bebidas
      [316, 'Malta +58',                   3000, 'Bebidas',    'Malta venezolana de la marca +58. Dulce, nutritiva y nostálgica.',                                false],
      [317, 'Reko Malta',                  3000, 'Bebidas',    'Bebida de malta Reko, suave y refrescante.',                                                      false],
      [318, 'Reko Lita',                   3000, 'Bebidas',    'Refresco Reko Lita. Sabor frutal y refrescante.',                                                 false],
      [319, 'Reko Manzana',                3000, 'Bebidas',    'Refresco Reko sabor manzana.',                                                                    false],
      [320, 'Reko Tea Durazno',            3000, 'Bebidas',    'Té helado sabor durazno de la línea Reko.',                                                       false],
      [321, 'Reko Tea Limón',              3000, 'Bebidas',    'Té helado sabor limón de la línea Reko. Refrescante y cítrico.',                                  false],
    ] as const;

    let inserted = 0;
    for (const [id, name, price, category, usage_info, is_combo] of products) {
      const r = await client.query(
        `INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids)
         VALUES ($1,$2,$3,$4,$5,$6,'real-13',ARRAY['real-13'])
         ON CONFLICT (id) DO NOTHING`,
        [id, name, price, category, usage_info, is_combo]
      );
      if (r.rowCount && r.rowCount > 0) { console.log(`  ✅ ${name}`); inserted++; }
      else { console.log(`  ⏭️  ${name} (ya existía)`); }
    }

    // ── VERIFICACIÓN ──────────────────────────────────────────────
    const storeRes = await client.query(`SELECT slug, name, neighborhood, plan, img_path, is_active FROM stores WHERE slug = 'real-13'`);
    const prodRes  = await client.query(`SELECT COUNT(*) FROM products WHERE store_id = 'real-13'`);

    console.log('\n─────────────────────────────────');
    console.log('📊 Resultado:');
    console.log('   Local:', storeRes.rows[0]);
    console.log(`   Productos insertados: ${inserted} / ${products.length}`);
    console.log(`   Productos en DB: ${prodRes.rows[0].count}`);
    console.log('─────────────────────────────────');
    console.log('\n🎉 Margarita Food está live en EnCasa Venezuela.');

  } catch (err) {
    console.error('\n❌ Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
