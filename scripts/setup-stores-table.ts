/**
 * setup-stores-table.ts
 * Crea la tabla stores en Supabase e inserta los 12 locales venezolanos.
 *
 * Requisitos:
 *   - DATABASE_URL en .env.local (connection string de PostgreSQL de Supabase)
 *   - paquete pg instalado: npm install pg @types/pg
 *
 * Uso:
 *   npx tsx scripts/setup-stores-table.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

// ---------------------------------------------------------------------------
// 1. Cargar .env.local manualmente (sin depender de dotenv en el proyecto)
// ---------------------------------------------------------------------------
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

const DATABASE_DIRECT_URL = process.env.DATABASE_DIRECT_URL;
const DATABASE_URL = process.env.DATABASE_URL;

const connectionString = DATABASE_DIRECT_URL || DATABASE_URL;

if (!connectionString) {
  console.error('❌ Falta DATABASE_URL (o DATABASE_DIRECT_URL) en .env.local');
  console.error('   DATABASE_URL        : pooler   – puerto 6543');
  console.error('   DATABASE_DIRECT_URL : directo  – puerto 5432');
  process.exit(1);
}

const usingDirect = !!DATABASE_DIRECT_URL;
console.log(`🔗 Usando: ${usingDirect ? 'DATABASE_DIRECT_URL (direct, puerto 5432)' : 'DATABASE_URL (pooler, puerto 6543)'}`);

// ---------------------------------------------------------------------------
// 2. DDL — ENUMs y tabla
// ---------------------------------------------------------------------------
const SQL_SETUP = `
-- ENUMs (idempotente)
DO $$ BEGIN
  CREATE TYPE store_type AS ENUM ('comida', 'productos');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE store_plan AS ENUM ('basic', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabla stores (drop y recrear)
DROP TABLE IF EXISTS stores CASCADE;
CREATE TABLE IF NOT EXISTS stores (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  address          TEXT NOT NULL,
  neighborhood     TEXT,
  city             TEXT NOT NULL DEFAULT 'CABA',
  type             store_type NOT NULL,
  plan             store_plan NOT NULL DEFAULT 'basic',
  is_prepared_food BOOLEAN NOT NULL DEFAULT false,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  rating           NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  review_count     INTEGER DEFAULT 0,
  google_maps_url  TEXT,
  img_path         TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

// ---------------------------------------------------------------------------
// 3. Datos de los 12 locales
// ---------------------------------------------------------------------------
interface StoreRow {
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  type: 'comida' | 'productos';
  plan: 'basic' | 'premium';
  is_prepared_food: boolean;
  tags: string[];
  rating: number;
  review_count: number;
  google_maps_url: string;
  img_path: string;
}

const STORES: StoreRow[] = [
  {
    slug: 'real-1', name: 'Tequetok',
    address: 'Moreno 2698, C1083', neighborhood: 'Balvanera', city: 'CABA',
    type: 'comida', plan: 'premium', is_prepared_food: true,
    tags: ['Pasapalos', 'Snacks'], rating: 4.2, review_count: 161,
    google_maps_url: 'https://maps.app.goo.gl/TW3hDC7BEHJcbB1w9',
    img_path: 'portada_tequetok.png',
  },
  {
    slug: 'real-2', name: 'Pancheria Veneco Argentina',
    address: 'Plaza Miserere, C1039', neighborhood: 'Once', city: 'CABA',
    type: 'comida', plan: 'basic', is_prepared_food: true,
    tags: ['Fast Food', 'Panchos'], rating: 4.2, review_count: 59,
    google_maps_url: 'https://maps.app.goo.gl/1RquHfDKeeDEWcpK8',
    img_path: 'portada_pancheria_once1.png',
  },
  {
    slug: 'real-3', name: 'Mordiscos House',
    address: 'Av. Jujuy 505, C1083', neighborhood: 'Balvanera', city: 'CABA',
    type: 'comida', plan: 'premium', is_prepared_food: true,
    tags: ['Fast Food', 'Burgers'], rating: 4.3, review_count: 71,
    google_maps_url: 'https://maps.app.goo.gl/pZdazrtejbaFTjbB6',
    img_path: 'portada_mordiscos_house.png',
  },
  {
    slug: 'real-4', name: 'Bahareque Comida Venezolana',
    address: 'Riobamba 296, C1025', neighborhood: 'Balvanera', city: 'CABA',
    type: 'comida', plan: 'premium', is_prepared_food: true,
    tags: ['Comida Casera', 'Tradicional'], rating: 5.0, review_count: 104,
    google_maps_url: 'https://maps.app.goo.gl/QLtAV28cHRUvWGQT9',
    img_path: 'portada_bahareque.png',
  },
  {
    slug: 'real-5', name: 'Bajon Market',
    address: 'Av. San Juan 2820, C1232', neighborhood: 'San Cristóbal', city: 'CABA',
    type: 'productos', plan: 'premium', is_prepared_food: false,
    tags: ['Market', 'Importados'], rating: 4.3, review_count: 63,
    google_maps_url: 'https://maps.app.goo.gl/b4LGCygfxAYSvYQSA',
    img_path: 'portada_bajonmarket.png',
  },
  {
    slug: 'real-6', name: 'El Puestico',
    address: 'Anchorena 605, C1189', neighborhood: 'Abasto', city: 'CABA',
    type: 'comida', plan: 'basic', is_prepared_food: true,
    tags: ['Fast Food', 'Street Food'], rating: 5.0, review_count: 33,
    google_maps_url: 'https://maps.app.goo.gl/F9Jydc1owzMEtAWA7',
    img_path: 'portada_elpuestico.png',
  },
  {
    slug: 'real-7', name: 'Venefood – Sucursal Palermo',
    address: 'Soler 5547, C1414', neighborhood: 'Palermo', city: 'CABA',
    type: 'productos', plan: 'basic', is_prepared_food: false,
    tags: ['Market', 'Importados'], rating: 4.1, review_count: 36,
    google_maps_url: 'https://maps.app.goo.gl/ts74Hktj7pYaf3MU7',
    img_path: 'portada_venefood.png',
  },
  {
    slug: 'real-8', name: 'Venefood – Sucursal San Cristóbal',
    address: 'Chile 2151, C1227', neighborhood: 'San Cristóbal', city: 'CABA',
    type: 'productos', plan: 'basic', is_prepared_food: false,
    tags: ['Market', 'Víveres'], rating: 2.9, review_count: 138,
    google_maps_url: 'https://maps.app.goo.gl/QfSFgtMQ4k1Bg5x57',
    img_path: 'portada_venefood.png',
  },
  {
    slug: 'real-9', name: 'Venefood – Sucursal Recoleta',
    address: 'Sánchez de Bustamante 2012, C1425', neighborhood: 'Recoleta', city: 'CABA',
    type: 'productos', plan: 'basic', is_prepared_food: false,
    tags: ['Market', 'Antojos'], rating: 3.3, review_count: 12,
    google_maps_url: 'https://maps.app.goo.gl/in2VcEfRawtjqKk47',
    img_path: 'portada_venefood.png',
  },
  {
    slug: 'real-10', name: 'El Araguaney',
    address: 'Hipólito Yrigoyen 2359, C1089', neighborhood: 'Balvanera', city: 'CABA',
    type: 'comida', plan: 'premium', is_prepared_food: true,
    tags: ['Comida Casera', 'Tradicional'], rating: 4.7, review_count: 6,
    google_maps_url: 'https://maps.app.goo.gl/owHAXLFKJEtwcpwP8',
    img_path: 'portada_araguaney.png',
  },
  {
    slug: 'real-11', name: 'VeneMarket',
    address: 'Venezuela 2678, C1096', neighborhood: 'Balvanera', city: 'CABA',
    type: 'productos', plan: 'premium', is_prepared_food: false,
    tags: ['Market', 'Golosinas'], rating: 4.9, review_count: 8,
    google_maps_url: 'https://maps.app.goo.gl/v5dyLdS5r5eDazZ27',
    img_path: 'portada_venemarket.png',
  },
  {
    slug: 'real-12', name: 'El Rincón del Morocho',
    address: 'Rincón 289, C1081', neighborhood: 'Balvanera', city: 'CABA',
    type: 'comida', plan: 'premium', is_prepared_food: true,
    tags: ['Comida Casera', 'Abundante'], rating: 4.6, review_count: 292,
    google_maps_url: 'https://maps.app.goo.gl/vqeKwbXF77bUnxmd6',
    img_path: 'portada_elrincon_delmorocho.png',
  },
];

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------
async function main() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conectado.\n');

    // Crear ENUMs y tabla
    console.log('🏗️  Creando ENUMs y tabla stores...');
    await client.query(SQL_SETUP);
    console.log('✅ Estructura lista.\n');

    // Insertar locales con ON CONFLICT DO NOTHING (idempotente)
    console.log('📦 Insertando locales...');
    let inserted = 0;
    let skipped = 0;

    for (const store of STORES) {
      const result = await client.query(
        `INSERT INTO stores
           (slug, name, address, neighborhood, city, type, plan,
            is_prepared_food, tags, rating, review_count, google_maps_url, img_path)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (slug) DO NOTHING`,
        [
          store.slug, store.name, store.address, store.neighborhood, store.city,
          store.type, store.plan, store.is_prepared_food, store.tags,
          store.rating, store.review_count, store.google_maps_url, store.img_path,
        ]
      );

      if (result.rowCount && result.rowCount > 0) {
        console.log(`  ✅ ${store.slug} – ${store.name}`);
        inserted++;
      } else {
        console.log(`  ⏭️  ${store.slug} – ${store.name} (ya existía, omitido)`);
        skipped++;
      }
    }

    // Conteo final
    const countResult = await client.query('SELECT COUNT(*) FROM stores');
    const total = parseInt(countResult.rows[0].count, 10);

    console.log('\n─────────────────────────────────');
    console.log(`📊 Resumen:`);
    console.log(`   Insertados : ${inserted}`);
    console.log(`   Omitidos   : ${skipped}`);
    console.log(`   Total en tabla : ${total} filas`);
    console.log('─────────────────────────────────\n');
    console.log('🎉 Listo. La tabla stores está configurada en Supabase.');

  } catch (err) {
    console.error('\n❌ Error durante la ejecución:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
