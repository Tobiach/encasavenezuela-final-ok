/**
 * migrate-products-v2.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * 1. Agrega nuevos valores al ENUM product_category
 * 2. Actualiza precios de productos existentes
 * 3. Inserta nuevos productos (con ON CONFLICT DO UPDATE)
 *
 * Uso:
 *   npx tsx scripts/migrate-products-v2.ts
 *
 * Requiere:
 *   - DATABASE_DIRECT_URL o DATABASE_URL en .env.local
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

// ── Cargar .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key   = trimmed.slice(0, eqIndex).trim();
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

// ── SQL: extender el ENUM product_category ───────────────────────────────────
const SQL_ADD_ENUM_VALUES = `
DO $$ BEGIN
  -- Nuevas categorías
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Cereales';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Granos';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Secos';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Carnes';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Condimentos';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Untables';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Snacks';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Preparados';
  ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'Hogar';
  -- Normalizar 'Almacén' como 'Granos' ya existe, pero dejamos Almacén también
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ENUM ya actualizado: %', SQLERRM;
END $$;
`;

// ── SQL: actualizar precios de productos existentes ──────────────────────────
const SQL_UPDATE_PRICES = `
UPDATE products SET price = 2900 WHERE id = 4;   -- Harina Doña Arepa → base 2900
UPDATE products SET price = 22500 WHERE id = 5;  -- Pirulín
UPDATE products SET price = 3000  WHERE id = 6;  -- Malta +58
UPDATE products SET price = 2500  WHERE id = 7;  -- Re-Ko Malta
UPDATE products SET price = 2500  WHERE id = 8;  -- Re-Kolita
UPDATE products SET price = 35000 WHERE id = 9;  -- Ron Santa Teresa
UPDATE products SET price = 5000  WHERE id = 10; -- Cri-Cri
UPDATE products SET price = 2800  WHERE id = 11; -- Samba
UPDATE products SET price = 3000  WHERE id = 12; -- Galleta Susy
UPDATE products SET price = 4500  WHERE id = 1;  -- Flips chico
UPDATE products SET price = 9800  WHERE id = 3;  -- Savoy Carré
UPDATE products SET price = 16000 WHERE id = 2;  -- Cerelac
`;

// ── Productos nuevos ─────────────────────────────────────────────────────────
// IDs a partir de 20 (1–19 reservados para expansión de los existentes)
// available_in_store_ids distribuidos entre las tiendas de tipo 'productos':
//   real-5 (Bajon Market), real-7/8/9 (Venefood), real-11 (VeneMarket)
// + algunas tiendas 'comida' que también venden productos: real-1, real-3, real-10, real-12

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

const NEW_PRODUCTS: ProductRow[] = [
  // ── HARINAS ────────────────────────────────────────────────────────────────
  {
    id: 20, name: 'Harina PAN Blanca 1kg', price: 2900, old_price: null,
    category: 'Harinas', img_path: 'harina_pan_blanca.webp',
    usage_info: 'Harina de maíz blanco precocida, la original venezolana. Ideal para arepas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 21, name: 'Harina PAN Amarilla 1kg', price: 2900, old_price: null,
    category: 'Harinas', img_path: 'harina_pan_amarilla.webp',
    usage_info: 'Harina de maíz amarillo precocida. Perfecta para cachapas y arepas amarillas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 22, name: 'Harina Maseca 1kg', price: 2400, old_price: null,
    category: 'Harinas', img_path: 'harina_maseca.webp',
    usage_info: 'Harina de maíz nixtamalizado, versátil para arepas y tamales.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 23, name: 'Harina Morixe 1kg', price: 2500, old_price: null,
    category: 'Harinas', img_path: 'harina_morixe.webp',
    usage_info: 'Harina de trigo argentina, ideal para preparaciones venezolanas que la requieran.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-11'],
  },
  {
    id: 24, name: 'Harina para Cachapas', price: 3500, old_price: null,
    category: 'Harinas', img_path: 'harina_cachapas.webp',
    usage_info: 'Mezcla especial lista para preparar cachapas venezolanas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 25, name: 'Casabe', price: 4000, old_price: null,
    category: 'Harinas', img_path: 'casabe.webp',
    usage_info: 'Pan plano y crujiente de yuca, tradicional indígena venezolano.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-9', 'real-11'],
  },

  // ── CEREALES ───────────────────────────────────────────────────────────────
  {
    id: 30, name: 'Fororo', price: 1900, old_price: null,
    category: 'Cereales', img_path: 'fororo.webp',
    usage_info: 'Grano de maíz molido grueso, base del fororo venezolano.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },

  // ── GRANOS ─────────────────────────────────────────────────────────────────
  {
    id: 35, name: 'Caraotas Negras 500gr', price: 2500, old_price: null,
    category: 'Granos', img_path: 'caraotas_negras.webp',
    usage_info: 'Caraotas negras venezolanas, esenciales para el pabellón criollo.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },

  // ── SECOS ──────────────────────────────────────────────────────────────────
  {
    id: 40, name: 'Papelón Molido', price: 3800, old_price: null,
    category: 'Secos', img_path: 'papelon_molido.webp',
    usage_info: 'Azúcar de caña sin refinar en polvo. Para papelón con limón y cocina criolla.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 41, name: 'Papelón en Panela', price: 3300, old_price: null,
    category: 'Secos', img_path: 'papelon_panela.webp',
    usage_info: 'Bloque sólido de papelón (panela) venezolano, sabor auténtico.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-9', 'real-11'],
  },

  // ── LÁCTEOS ────────────────────────────────────────────────────────────────
  {
    id: 45, name: 'Queso Duro 1kg', price: 14700, old_price: null,
    category: 'Lácteos', img_path: 'queso_duro.webp',
    usage_info: 'Queso duro venezolano para rallar. Sabor intenso e inconfundible.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 46, name: 'Queso de Mano', price: 7000, old_price: null,
    category: 'Lácteos', img_path: 'queso_de_mano.webp',
    usage_info: 'Queso fresco venezolano de textura suave y semiblanda.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 47, name: 'Nata Criolla', price: 4800, old_price: null,
    category: 'Lácteos', img_path: 'nata_criolla.webp',
    usage_info: 'Crema de leche venezolana, imprescindible para acompañar arepas y cachapas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-11'],
  },

  // ── CARNES ─────────────────────────────────────────────────────────────────
  {
    id: 50, name: 'Chuleta Ahumada', price: 13000, old_price: null,
    category: 'Carnes', img_path: 'chuleta_ahumada.webp',
    usage_info: 'Chuleta de cerdo ahumada al estilo venezolano. Lista para cocinar.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 51, name: 'Huesos Ahumados', price: 8500, old_price: null,
    category: 'Carnes', img_path: 'huesos_ahumados.webp',
    usage_info: 'Huesos de cerdo ahumados, base de sopas y guisos criollos.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 52, name: 'Chicharrón', price: 5400, old_price: null,
    category: 'Carnes', img_path: 'chicharron.webp',
    usage_info: 'Chicharrón de cerdo crujiente, snack venezolano por excelencia.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-8', 'real-10', 'real-11'],
  },

  // ── CONDIMENTOS ────────────────────────────────────────────────────────────
  {
    id: 55, name: 'Adobo Criollo', price: 2500, old_price: null,
    category: 'Condimentos', img_path: 'adobo_criollo.webp',
    usage_info: 'Mezcla de especias venezolanas para carnes y guisos. Sabor casero garantizado.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 56, name: 'Ají', price: 2000, old_price: null,
    category: 'Condimentos', img_path: 'aji_condimento.webp',
    usage_info: 'Ají venezolano seco. Toque picante y aromático para cualquier plato.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },

  // ── SALSAS ─────────────────────────────────────────────────────────────────
  {
    id: 60, name: 'Salsa Inglesa', price: 3500, old_price: null,
    category: 'Salsas', img_path: 'salsa_inglesa.webp',
    usage_info: 'Salsa worcestershire venezolana, toque especial para carnes y sopas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 61, name: 'Salsa de Maíz', price: 4500, old_price: null,
    category: 'Salsas', img_path: 'salsa_maiz.webp',
    usage_info: 'Salsa de maíz venezolana, clásica para perros calientes y snacks.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 62, name: 'Salsa Ahumada', price: 4500, old_price: null,
    category: 'Salsas', img_path: 'salsa_ahumada.webp',
    usage_info: 'Salsa con sabor ahumado intenso. Perfecta para carnes a la parrilla.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 63, name: 'Salsa Picante', price: 2000, old_price: null,
    category: 'Salsas', img_path: 'salsa_picante.webp',
    usage_info: 'Salsa picante venezolana. Arremete en cada bocado.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 64, name: 'Salsa Cheddar', price: 8000, old_price: null,
    category: 'Salsas', img_path: 'salsa_cheddar.webp',
    usage_info: 'Salsa de queso cheddar cremosa para papas, nachos y sándwiches.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-8', 'real-11'],
  },
  {
    id: 65, name: 'Salsa Guasacaca', price: 6500, old_price: null,
    category: 'Salsas', img_path: 'salsa_guasacaca.webp',
    usage_info: 'Guasacaca venezolana, el aguacate convertido en salsa. Imprescindible.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },

  // ── UNTABLES ───────────────────────────────────────────────────────────────
  {
    id: 70, name: 'Mantequilla Qualy', price: 2600, old_price: null,
    category: 'Untables', img_path: 'mantequilla_qualy.webp',
    usage_info: 'Margarina vegetal Qualy, el untable favorito de los venezolanos.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 71, name: 'Mantequilla Danica', price: 2600, old_price: null,
    category: 'Untables', img_path: 'mantequilla_danica.webp',
    usage_info: 'Mantequilla Danica, cremosa y suave para untar en arepas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 72, name: 'Mavesa Mayonesa', price: 14000, old_price: null,
    category: 'Untables', img_path: 'mavesa_mayonesa.webp',
    usage_info: 'La mayonesa venezolana original. Sabor inconfundible en perros y empanadas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 73, name: 'Diablito', price: 12000, old_price: null,
    category: 'Untables', img_path: 'diablito_underwood.webp',
    usage_info: 'Paté de jamón Underwood en lata, clásico venezolano para untar.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 74, name: 'Rikesa', price: 12000, old_price: null,
    category: 'Untables', img_path: 'rikesa.webp',
    usage_info: 'Crema de chocolate y avellana venezolana. La alternativa criolla.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },

  // ── BEBIDAS ────────────────────────────────────────────────────────────────
  {
    id: 80, name: 'Café Fama de América', price: 18000, old_price: null,
    category: 'Bebidas', img_path: 'cafe_fama_america.webp',
    usage_info: 'El café venezolano premium. Aroma y cuerpo intenso, de exportación.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 81, name: 'Toddy', price: 9300, old_price: null,
    category: 'Bebidas', img_path: 'toddy.webp',
    usage_info: 'Bebida chocolatada en polvo venezolana. El desayuno de la infancia.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 82, name: 'Nesquik', price: 12500, old_price: null,
    category: 'Bebidas', img_path: 'nesquik.webp',
    usage_info: 'Polvo chocolatado Nesquik enriquecido con vitaminas.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 83, name: 'Nestea', price: 14500, old_price: null,
    category: 'Bebidas', img_path: 'nestea.webp',
    usage_info: 'Té helado en polvo Nestea. Refrescante y sin preparación compleja.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-11'],
  },
  {
    id: 84, name: 'Tamarindo', price: 1500, old_price: null,
    category: 'Bebidas', img_path: 'tamarindo_bebida.webp',
    usage_info: 'Refresco de tamarindo venezolano, dulce y ácido, perfectamente equilibrado.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 85, name: 'Reko Uva', price: 2500, old_price: null,
    category: 'Bebidas', img_path: 'reko_uva.webp',
    usage_info: 'Refresco sabor uva Re-Ko, el favorito de los chamos venezolanos.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 86, name: 'Reko Piña', price: 2500, old_price: null,
    category: 'Bebidas', img_path: 'reko_pina.webp',
    usage_info: 'Refresco sabor piña Re-Ko. Dulce y tropical.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 87, name: 'Reko Manzana', price: 2500, old_price: null,
    category: 'Bebidas', img_path: 'reko_manzana.webp',
    usage_info: 'Refresco sabor manzana Re-Ko. Refrescante y afrutado.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },

  // ── CHUCHERÍAS ─────────────────────────────────────────────────────────────
  {
    id: 90, name: 'Obleas', price: 3000, old_price: null,
    category: 'Chucherías', img_path: 'obleas.webp',
    usage_info: 'Obleas venezolanas crujientes. El snack dulce de toda la vida.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 91, name: 'Pinguinito', price: 4300, old_price: null,
    category: 'Chucherías', img_path: 'pinguinito.webp',
    usage_info: 'Pastelito relleno de chocolate Savoy, suave y delicioso.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 92, name: 'Flips Grande', price: 14900, old_price: null,
    category: 'Chucherías', img_path: 'flips_grande.webp',
    usage_info: 'Cereales Flips sabor dulce de leche en presentación grande (450g).',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 93, name: 'Cocosete', price: 2800, old_price: null,
    category: 'Chucherías', img_path: 'cocosete.webp',
    usage_info: 'Barrita de coco Savoy. Dulce, crujiente y tropical.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 94, name: 'Chupetas', price: 500, old_price: null,
    category: 'Chucherías', img_path: 'chupetas.webp',
    usage_info: 'Chupetas venezolanas de colores y sabores surtidos.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 95, name: 'Catalina', price: 2000, old_price: null,
    category: 'Chucherías', img_path: 'catalina_galleta.webp',
    usage_info: 'Galleta Catalina de papelón y anís. Tradición venezolana en cada mordida.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },

  // ── SNACKS ─────────────────────────────────────────────────────────────────
  {
    id: 100, name: 'Torontos', price: 1000, old_price: null,
    category: 'Snacks', img_path: 'torontos.webp',
    usage_info: 'Snack venezolano crujiente tipo maíz. El picaíto de siempre.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 102, name: 'Savoy', price: 5000, old_price: null,
    category: 'Snacks', img_path: 'savoy_chocolate.webp',
    usage_info: 'Chocolate Savoy clásico venezolano. El favorito de todas las generaciones.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 103, name: 'Platanito', price: 2000, old_price: null,
    category: 'Snacks', img_path: 'platanito.webp',
    usage_info: 'Chips de plátano venezolano, crujientes y con sabor auténtico.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },

  // ── PREPARADOS ─────────────────────────────────────────────────────────────
  {
    id: 115, name: 'Arepas', price: 4600, old_price: null,
    category: 'Preparados', img_path: 'arepas.webp',
    usage_info: 'Arepas venezolanas listas, preparadas artesanalmente. ¡Solo calentar y rellenar!',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-1', 'real-3', 'real-5', 'real-10', 'real-11'],
  },

  // ── CONGELADOS ─────────────────────────────────────────────────────────────
  {
    id: 120, name: 'Tequeños Congelados', price: 6000, old_price: null,
    category: 'Congelados', img_path: 'tequenos_congelados.webp',
    usage_info: 'Tequeños rellenos de queso venezolano. Congelados listos para freír u hornear.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },
  {
    id: 121, name: 'Tetas de Leche', price: 2000, old_price: null,
    category: 'Congelados', img_path: 'tetas_congeladas.webp',
    usage_info: 'Dulce venezolano de leche y azúcar en bolsita. Para chupar y disfrutar.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-8', 'real-11'],
  },
  {
    id: 122, name: 'Cachapas Congeladas', price: 7600, old_price: null,
    category: 'Congelados', img_path: 'cachapas_congeladas.webp',
    usage_info: 'Cachapas de maíz tierno venezolanas, congeladas. Solo calentar y servir.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-7', 'real-8', 'real-9', 'real-11'],
  },

  // ── HOGAR ──────────────────────────────────────────────────────────────────
  {
    id: 130, name: 'Budare', price: 55000, old_price: null,
    category: 'Hogar', img_path: 'budare.webp',
    usage_info: 'Plancha circular de hierro para cocinar arepas y cachapas al estilo venezolano.',
    is_combo: false, store_id: null,
    available_in_store_ids: ['real-5', 'real-11'],
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conectado.\n');

    // 1. Extender ENUM
    console.log('🏷️  Agregando nuevas categorías al ENUM...');
    await client.query(SQL_ADD_ENUM_VALUES);
    console.log('✅ ENUM actualizado.\n');

    // 2. Actualizar precios existentes
    console.log('💰 Actualizando precios de productos existentes...');
    const updateResult = await client.query(SQL_UPDATE_PRICES);
    console.log(`✅ Precios actualizados (${updateResult.rowCount ?? 'N/A'} filas afectadas).\n`);

    // 3. Insertar nuevos productos
    console.log('📦 Insertando nuevos productos...');
    let inserted = 0;
    let updated = 0;

    for (const p of NEW_PRODUCTS) {
      const result = await client.query(
        `INSERT INTO products
           (id, name, price, old_price, category, img_path, usage_info,
            is_combo, store_id, available_in_store_ids)
         VALUES ($1,$2,$3,$4,$5::product_category,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET
           name                   = EXCLUDED.name,
           price                  = EXCLUDED.price,
           old_price              = EXCLUDED.old_price,
           category               = EXCLUDED.category,
           img_path               = EXCLUDED.img_path,
           usage_info             = EXCLUDED.usage_info,
           available_in_store_ids = EXCLUDED.available_in_store_ids`,
        [
          p.id, p.name, p.price, p.old_price, p.category, p.img_path,
          p.usage_info, p.is_combo, p.store_id, p.available_in_store_ids,
        ]
      );

      const wasInsert = (result.rowCount ?? 0) > 0;
      if (wasInsert) {
        console.log(`  ✅ id=${p.id} – ${p.name} (${p.category}) $${p.price.toLocaleString('es-AR')}`);
        inserted++;
      } else {
        updated++;
      }
    }

    const countResult = await client.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const total = parseInt(countResult.rows[0].count, 10);

    console.log('\n─────────────────────────────────────────────────');
    console.log('📊 Resumen de migración:');
    console.log(`   Productos nuevos insertados : ${inserted}`);
    console.log(`   Productos actualizados      : ${updated}`);
    console.log(`   Total activos en tabla      : ${total} filas`);
    console.log('─────────────────────────────────────────────────\n');
    console.log('🎉 Migración completada exitosamente.');
    console.log('\n⚠️  RECORDÁ subir las imágenes WebP nuevas al bucket "imagenes" de Supabase.');
    console.log('   Podés hacerlo con: npx tsx scripts/upload-new-images.ts');

  } catch (err) {
    console.error('\n❌ Error durante la migración:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
