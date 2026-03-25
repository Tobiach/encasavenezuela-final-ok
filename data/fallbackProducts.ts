/**
 * Fallback estático de productos.
 * Se usa cuando Supabase falla Y no hay snapshot en localStorage.
 * Imágenes apuntan al bucket de Storage (separado del DB API — suele estar disponible aunque el DB falle).
 */
import { Product } from '../types';
import { getImageUrl } from '../lib/supabase';

export const FALLBACK_PRODUCTS: Product[] = [
  // ── Productos regulares ──────────────────────────────────────────────────
  // Harinas
  { id: 101, name: 'Harina PAN Blanca 1kg',      price: 3500, category: 'Harinas',           img: getImageUrl('harinas1.png') },
  { id: 102, name: 'Harina PAN Amarilla 1kg',    price: 3800, category: 'Harinas',           img: getImageUrl('harinas1.png') },
  // Quesos y Tequeños
  { id: 103, name: 'Tequeños x12',               price: 5500, category: 'Quesos y Tequeños', img: getImageUrl('tequenos_y_quesos1.png') },
  { id: 104, name: 'Queso Blanco Venezolano',    price: 4800, category: 'Quesos y Tequeños', img: getImageUrl('tequenos_y_quesos1.png'), oldPrice: 5500 },
  // Lácteos
  { id: 105, name: 'Queso Llanero 500g',         price: 4200, category: 'Lácteos',           img: getImageUrl('queso_lacteos.png'), oldPrice: 4800 },
  // Congelados
  { id: 106, name: 'Chuleta de Cerdo x1kg',      price: 5200, category: 'Congelados',        img: getImageUrl('chuletas_1.png') },
  // Bebidas
  { id: 107, name: 'Malta Regional 355ml',       price: 1800, category: 'Bebidas',           img: getImageUrl('bebidas_cervezas.png') },
  { id: 108, name: 'Cerveza Regional Lata',      price: 2200, category: 'Bebidas',           img: getImageUrl('bebidas_cervezas.png'), oldPrice: 2600 },
  // Salsas
  { id: 109, name: 'Salsa Picante La Suprema',   price: 2200, category: 'Salsas',            img: getImageUrl('salsas1.png'), oldPrice: 2800 },
  // Enlatados
  { id: 110, name: 'Diablitos Underwood x2',     price: 2800, category: 'Enlatados',         img: getImageUrl('enlatado_diablitos1.png') },
  // Snacks
  { id: 111, name: 'Doritos Natural 150g',       price: 3200, category: 'Snacks',            img: getImageUrl('snacks1.png') },
  { id: 112, name: 'Pepitos Chocolate x6',       price: 2400, category: 'Snacks',            img: getImageUrl('snacks1.png') },
  // Chucherías
  { id: 113, name: 'Gomitas venezolanas x100g',  price: 1500, category: 'Chucherías',        img: getImageUrl('golosinas_1.png') },
  // Almacén
  { id: 114, name: 'Arroz Mary Tipo A 1kg',      price: 2900, category: 'Almacén',           img: getImageUrl('abarrotes_1.png') },
  { id: 115, name: 'Caraotas Negras x500g',      price: 2400, category: 'Almacén',           img: getImageUrl('abarrotes_1.png') },
  { id: 116, name: 'Azúcar Blanca 1kg',          price: 2100, category: 'Almacén',           img: getImageUrl('abarrotes_1.png') },

  // ── Combos (isCombo: true) — necesarios para sección "Combos Relámpago" ─
  // storeId apunta al store de fallback en fallbackStores.ts
  {
    id: 201,
    name: 'Combo Arepa Completa',
    price: 8900,
    oldPrice: 11500,
    category: 'Combos',
    img: getImageUrl('harinas1.png'),
    isCombo: true,
    storeId: 'encasa-venezuela',
  },
  {
    id: 202,
    name: 'Combo Tequeños + Malta',
    price: 7200,
    oldPrice: 9500,
    category: 'Combos',
    img: getImageUrl('tequenos_y_quesos1.png'),
    isCombo: true,
    storeId: 'encasa-venezuela',
  },
  {
    id: 203,
    name: 'Combo Snack Venezolano',
    price: 5900,
    oldPrice: 7800,
    category: 'Combos',
    img: getImageUrl('snacks1.png'),
    isCombo: true,
    storeId: 'encasa-venezuela',
  },
];
