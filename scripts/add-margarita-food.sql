-- ============================================================
-- MARGARITA FOOD — Onboarding a Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Fecha: 12 abril 2026
-- ============================================================

-- ── 1. INSERTAR LOCAL ────────────────────────────────────────
INSERT INTO stores (
  slug, name, address, neighborhood, city,
  type, plan, is_prepared_food,
  tags, rating, review_count,
  google_maps_url, img_path, is_active
) VALUES (
  'real-13',
  'Margarita Food',
  'Medrano 495',
  'Almagro',
  'CABA',
  'comida',
  'premium',
  true,
  ARRAY['Empanadas', 'Comida venezolana', 'Bebidas'],
  4.9,
  0,
  'https://maps.app.goo.gl/2uXKL1va8uM33UXx9',
  'portada_margarita_food.png',  -- ⚠️ verificar nombre exacto del archivo subido
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name             = EXCLUDED.name,
  address          = EXCLUDED.address,
  neighborhood     = EXCLUDED.neighborhood,
  plan             = EXCLUDED.plan,
  tags             = EXCLUDED.tags,
  rating           = EXCLUDED.rating,
  google_maps_url  = EXCLUDED.google_maps_url,
  img_path         = EXCLUDED.img_path,
  is_active        = EXCLUDED.is_active;

-- Añadir lat/lng para que aparezca en el mapa (Medrano 495, Almagro)
-- Solo ejecutar si la tabla tiene columnas lat y lng:
UPDATE stores SET lat = -34.6104, lng = -58.4287 WHERE slug = 'real-13';


-- ── 2. INSERTAR PRODUCTOS ────────────────────────────────────
-- Los IDs arrancan en 300 para no colisionar con productos existentes.

-- Empanadas clásicas ($3.500 c/u)
INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids) VALUES
(300, 'Empanada de Queso',          3500, 'Almacén', 'Empanada venezolana frita con queso derretido. Crujiente por fuera, cremosa por dentro.',           false, 'real-13', ARRAY['real-13']),
(301, 'Empanada de Plátano y Queso',3500, 'Almacén', 'Combinación dulce-salada: tajadas de plátano maduro con queso criollo. Un clásico venezolano.',     false, 'real-13', ARRAY['real-13']),
(302, 'Empanada de Jamón y Queso',  3500, 'Almacén', 'Empanada con jamón cocido y queso fundido. Ideal para el desayuno o la merienda.',                  false, 'real-13', ARRAY['real-13']),
(303, 'Empanada de Molida',         3500, 'Almacén', 'Rellena con carne molida sazonada al estilo venezolano con cebolla, ají y especias.',               false, 'real-13', ARRAY['real-13']),
(304, 'Empanada de Pollo',          3500, 'Almacén', 'Pollo desmechado con sofrito criollo. Jugosa y llena de sabor casero.',                             false, 'real-13', ARRAY['real-13']),
(305, 'Empanada Domino',            3500, 'Almacén', 'La favorita: rellena de caraotas negras y queso. Combinación icónica venezolana.',                   false, 'real-13', ARRAY['real-13'])
ON CONFLICT (id) DO NOTHING;

-- Empanadas especiales ($4.000 c/u)
INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids) VALUES
(306, 'Empanada de Mechada',        4000, 'Almacén', 'Carne mechada de res cocinada lento con sofrito. El relleno más pedido de Venezuela.',              false, 'real-13', ARRAY['real-13']),
(307, 'Empanada de Pescado',        4000, 'Almacén', 'Pescado desmenuzado con ajo, pimentón y limón. Fresca y sabrosa.',                                  false, 'real-13', ARRAY['real-13']),
(308, 'Empanada Pabellón',          4000, 'Almacén', 'El plato nacional venezolano en formato empanada: carne, caraotas, tajadas y queso.',               false, 'real-13', ARRAY['real-13'])
ON CONFLICT (id) DO NOTHING;

-- Combo empanadas ($8.000 x 3)
INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids) VALUES
(309, 'Combo 3 Empanadas',          8000, 'Promociones', 'Elegí 3 empanadas clásicas al precio especial. Combiná los rellenos que quieras.',              true,  'real-13', ARRAY['real-13'])
ON CONFLICT (id) DO NOTHING;

-- Perro caliente
INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids) VALUES
(310, 'Perro Caliente Venezolano',  3500, 'Almacén', 'Hot dog estilo venezolano con papas fritas, mayonesa y salsa rosa. El antojo de siempre.',           false, 'real-13', ARRAY['real-13'])
ON CONFLICT (id) DO NOTHING;

-- Almacén / frescos
INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids) VALUES
(311, 'Harina Morixe',              3000, 'Harinas',  'Harina de trigo ideal para arepas, empanadas y pan venezolano. Bolsa 1kg.',                        false, 'real-13', ARRAY['real-13']),
(312, 'Plátano Maduro',             3000, 'Almacén',  'Plátano venezolano maduro para tajadas, tostones y postres. Precio por kilo.',                     false, 'real-13', ARRAY['real-13']),
(313, 'Queso Semi Duro',           10000, 'Lácteos',  'Queso venezolano semi duro, ideal para rallar o trocear. Precio por kilo.',                        false, 'real-13', ARRAY['real-13']),
(314, 'Caraotas Negras',            2000, 'Almacén',  'Caraotas negras secas para el pabellón criollo y el domino. Precio por kilo.',                     false, 'real-13', ARRAY['real-13']),
(315, 'Chuleta de Cerdo',          14000, 'Almacén',  'Chuleta de cerdo fresca para freír o a la plancha. Precio por kilo.',                              false, 'real-13', ARRAY['real-13'])
ON CONFLICT (id) DO NOTHING;

-- Bebidas
INSERT INTO products (id, name, price, category, usage_info, is_combo, store_id, available_in_store_ids) VALUES
(316, 'Malta +58',                  3000, 'Bebidas',  'Malta venezolana de la marca +58. Dulce, nutritiva y nostálgica.',                                  false, 'real-13', ARRAY['real-13']),
(317, 'Reko Malta',                 3000, 'Bebidas',  'Bebida de malta Reko, suave y refrescante. Sabor auténtico venezolano.',                            false, 'real-13', ARRAY['real-13']),
(318, 'Reko Lita',                  3000, 'Bebidas',  'Refresco Reko Lita. Sabor frutal, refrescante y liviano.',                                          false, 'real-13', ARRAY['real-13']),
(319, 'Reko Manzana',               3000, 'Bebidas',  'Refresco Reko sabor manzana. Perfecto para acompañar empanadas.',                                   false, 'real-13', ARRAY['real-13']),
(320, 'Reko Tea Durazno',           3000, 'Bebidas',  'Té helado sabor durazno de la línea Reko. Suave y dulce.',                                          false, 'real-13', ARRAY['real-13']),
(321, 'Reko Tea Limón',             3000, 'Bebidas',  'Té helado sabor limón de la línea Reko. Refrescante y cítrico.',                                    false, 'real-13', ARRAY['real-13'])
ON CONFLICT (id) DO NOTHING;


-- ── 3. VERIFICAR ─────────────────────────────────────────────
SELECT slug, name, neighborhood, plan, is_active FROM stores WHERE slug = 'real-13';
SELECT id, name, price, category FROM products WHERE store_id = 'real-13' ORDER BY id;
