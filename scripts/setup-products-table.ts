/**
 * setup-products-table.ts
 * Crea la tabla products en Supabase e inserta los 12 productos y 9 combos.
 *
 * Requisitos:
 *   - DATABASE_DIRECT_URL o DATABASE_URL en .env.local
 *   - paquete pg instalado: npm install pg @types/pg
 *
 * Uso:
 *   npx tsx scripts/setup-products-table.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

// ---------------------------------------------------------------------------
// 1. Cargar .env.local manualmente
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
// 2. DDL — ENUM y tabla
// ---------------------------------------------------------------------------
const SQL_SETUP = `
-- ENUM de categorías (idempotente)
DO $$ BEGIN
  CREATE TYPE product_category AS ENUM (
    'Harinas', 'Lácteos', 'Congelados', 'Bebidas',
    'Chucherías', 'Salsas', 'Almacén', 'Promociones'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabla products (drop y recrear)
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id                      INTEGER PRIMARY KEY,
  name                    TEXT NOT NULL,
  price                   INTEGER NOT NULL,
  old_price               INTEGER,
  category                product_category NOT NULL,
  img_path                TEXT,
  usage_info              TEXT,
  is_combo                BOOLEAN NOT NULL DEFAULT false,
  store_id                TEXT REFERENCES stores(slug),
  available_in_store_ids  TEXT[],
  is_active               BOOLEAN NOT NULL DEFAULT true,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_combo  ON products(is_combo);
`;

// ---------------------------------------------------------------------------
// 3. Datos — 12 productos regulares + 9 combos
// ---------------------------------------------------------------------------
interface ProductRow {
  id: number;
  name: string;
  price: number;
  old_price: number | null;
  category: string;
  img_path: string | null;
  usage_info: string | null;
  is_combo: boolean;
  store_id: string | null;
  available_in_store_ids: string[] | null;
}

const PRODUCTS: ProductRow[] = [
  {
    id: 1, name: 'Cereales Flips Dulce de Leche (220g)', price: 3500, old_price: null,
    category: 'Chucherías', img_path: 'flips_dulcedeleche_1.png',
    usage_info: 'Cereal relleno sabor a dulce de leche, ideal para merendar.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-11'],
  },
  {
    id: 2, name: 'Cerelac (400g)', price: 4200, old_price: null,
    category: 'Almacén', img_path: 'cerelac.png',
    usage_info: 'Cereal a base de trigo y leche, el sabor de la infancia.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-12'],
  },
  {
    id: 3, name: 'Chocolate Savoy Carré', price: 2500, old_price: null,
    category: 'Chucherías', img_path: 'savoy_carre.png',
    usage_info: 'Chocolate premium con avellanas enteras.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-2', 'real-7', 'real-9'],
  },
  {
    id: 4, name: 'Harina Doña Arepa Blanca (1kg)', price: 2600, old_price: null,
    category: 'Harinas', img_path: 'harina_dona_arepa.png',
    usage_info: 'Harina de maíz blanco precocida, extra suave.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-4', 'real-5', 'real-11'],
  },
  {
    id: 5, name: 'Pirulín (155g)', price: 2800, old_price: null,
    category: 'Chucherías', img_path: 'caja_de_pirulin.png',
    usage_info: 'Barquillas rellenas de chocolate y avellana.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-9'],
  },
  {
    id: 6, name: 'Malta +58 (Lata 473 ml)', price: 2300, old_price: null,
    category: 'Bebidas', img_path: 'malta_58.png',
    usage_info: 'Bebida de malta con el auténtico sabor venezolano.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-6', 'real-10'],
  },
  {
    id: 7, name: 'Re-Ko Malta (Lata 355ml)', price: 1000, old_price: null,
    category: 'Bebidas', img_path: 're-ko_malta.png',
    usage_info: 'Malta refrescante y nutritiva para cualquier hora.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-2', 'real-5', 'real-12'],
  },
  {
    id: 8, name: 'Re-Kolita (Lata 355ml)', price: 1000, old_price: null,
    category: 'Bebidas', img_path: 'rekolita.png',
    usage_info: 'Refresco sabor a colita, dulce y burbujeante.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-7', 'real-11'],
  },
  {
    id: 9, name: 'Ron Premium Santa Teresa 1796', price: 38000, old_price: null,
    category: 'Bebidas', img_path: 'botella_de_ron_santa_teresa_1796.png',
    usage_info: 'Es uno de los mas conocidos de Venezuela, cuenta con sabores ligeros y suaves ideal para mezclar con lima o soda de limón. Presentacion de 750ml. Importado directo de Venezuela.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-3', 'real-8', 'real-9'],
  },
  {
    id: 10, name: 'Chocolate Savoy Cri Cri', price: 1500, old_price: null,
    category: 'Chucherías', img_path: 'savoy_cricri.png',
    usage_info: 'Chocolate con arroz tostado crujiente.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-10'],
  },
  {
    id: 11, name: 'Samba de Fresa', price: 1200, old_price: null,
    category: 'Chucherías', img_path: 'savoy_samba.png',
    usage_info: 'Galleta cubierta de chocolate con relleno de fresa.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-2', 'real-6', 'real-11'],
  },
  {
    id: 12, name: 'Galleta Susy', price: 1200, old_price: null,
    category: 'Chucherías', img_path: 'susy.png',
    usage_info: 'Galleta tipo wafer rellena de crema de chocolate.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-4', 'real-7', 'real-12'],
  },
  // Combos
  {
    id: 101, name: 'Combo Arepero Full', price: 10500, old_price: 12500,
    category: 'Promociones', img_path: 'combo_arepero.png',
    usage_info: 'Harina P.A.N., Diablitos y Queso Llanero.',
    is_combo: true, store_id: 'real-11', available_in_store_ids: null,
  },
  {
    id: 105, name: 'Combo Perro Callejero', price: 8500, old_price: 10200,
    category: 'Promociones', img_path: null,
    usage_info: 'Pan de perro caliente, salchichas, papitas tipo hilo, salsa de ajo y picante, salsa Maiz y Pance.',
    is_combo: true, store_id: 'real-1', available_in_store_ids: null,
  },
  {
    id: 106, name: 'Combo Empanadas Venezolanas', price: 9200, old_price: 11500,
    category: 'Promociones', img_path: 'combo_empanadas_venezolanas.png',
    usage_info: '2 × Harina P.A.N., queso blanco, salsa guasacaca.',
    is_combo: true, store_id: 'real-2', available_in_store_ids: null,
  },
  {
    id: 107, name: 'Combo Desayuno Criollo', price: 15400, old_price: 18900,
    category: 'Promociones', img_path: 'combo_desayuno_criollo.png',
    usage_info: '1 × Harina P.A.N., queso llanero, mantequilla, café venezolano, Nata, casabe, papelon.',
    is_combo: true, store_id: 'real-3', available_in_store_ids: null,
  },
  {
    id: 108, name: 'Combo Dulces de Venezuela', price: 7800, old_price: 9500,
    category: 'Promociones', img_path: 'pirulin.png',
    usage_info: 'Pirulín, Samba, Susy, 2 × Maltas.',
    is_combo: true, store_id: 'real-5', available_in_store_ids: null,
  },
  {
    id: 109, name: 'Combo Pabellón en Casa', price: 12600, old_price: 15200,
    category: 'Promociones', img_path: 'combo_pabellon.png',
    usage_info: 'Caraotas negras, plátanos maduros, queso blanco rallado, Nata.',
    is_combo: true, store_id: 'real-6', available_in_store_ids: null,
  },
  {
    id: 110, name: 'Combo Reunión Venezolana', price: 22500, old_price: 28000,
    category: 'Promociones', img_path: null,
    usage_info: 'Tequeños, salsa tartara o guasacaca, 6 × Maltín Polar, snacks venezolanos, chicharron, obleas.',
    is_combo: true, store_id: 'real-8', available_in_store_ids: null,
  },
  {
    id: 111, name: 'Combo Merienda Venezolana', price: 6400, old_price: 7900,
    category: 'Promociones', img_path: 'combo_merienda_venezolana.png',
    usage_info: 'Cocosette, Susy, café venezolano, catalinas.',
    is_combo: true, store_id: 'real-10', available_in_store_ids: null,
  },
  {
    id: 112, name: 'Combo Fiesta Venezolana', price: 24800, old_price: 31000,
    category: 'Promociones', img_path: 'combo_fiesta_venezolana.png',
    usage_info: 'Tequeños, mini empanadas, salsa guasacaca, 6 × Maltín Polar, 1 dulce venezolano, Chicharron.',
    is_combo: true, store_id: 'real-12', available_in_store_ids: null,
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

    console.log('🏗️  Creando ENUM y tabla products...');
    await client.query(SQL_SETUP);
    console.log('✅ Estructura lista.\n');

    console.log('📦 Insertando productos y combos...');
    let inserted = 0;
    let skipped = 0;

    for (const p of PRODUCTS) {
      const result = await client.query(
        `INSERT INTO products
           (id, name, price, old_price, category, img_path, usage_info,
            is_combo, store_id, available_in_store_ids)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO NOTHING`,
        [
          p.id, p.name, p.price, p.old_price, p.category, p.img_path,
          p.usage_info, p.is_combo, p.store_id, p.available_in_store_ids,
        ]
      );

      const label = p.is_combo ? '🍱 combo' : '🛒 producto';
      if (result.rowCount && result.rowCount > 0) {
        console.log(`  ✅ [${label}] id=${p.id} – ${p.name}`);
        inserted++;
      } else {
        console.log(`  ⏭️  [${label}] id=${p.id} – ${p.name} (ya existía, omitido)`);
        skipped++;
      }
    }

    const countResult = await client.query('SELECT COUNT(*) FROM products');
    const total = parseInt(countResult.rows[0].count, 10);
    const combos = PRODUCTS.filter(p => p.is_combo).length;
    const regular = PRODUCTS.filter(p => !p.is_combo).length;

    console.log('\n─────────────────────────────────');
    console.log('📊 Resumen:');
    console.log(`   Productos regulares : ${regular}`);
    console.log(`   Combos              : ${combos}`);
    console.log(`   Insertados          : ${inserted}`);
    console.log(`   Omitidos            : ${skipped}`);
    console.log(`   Total en tabla      : ${total} filas`);
    console.log('─────────────────────────────────\n');
    console.log('🎉 Listo. La tabla products está configurada en Supabase.');

  } catch (err) {
    console.error('\n❌ Error durante la ejecución:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
