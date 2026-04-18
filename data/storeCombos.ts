export interface ComboVariantItem {
  name: string;
  options: string[];
}

export interface StoreCombo {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  imgPath: string;       // filename in Supabase Storage
  storeId: string;
  storeType: 'productos' | 'all';
  items: string[];
  variantItems?: ComboVariantItem[];
}

export const STORE_COMBOS: StoreCombo[] = [
  {
    id: 9001,
    name: 'Combo Cachapero',
    price: 33000,
    oldPrice: 41000,
    imgPath: 'cachapas_congeladas.webp',
    storeId: 'minimarket-vibe',
    description: 'Cachapas congeladas, queso de mano, nata y manteca, chuleta ahumada',
    storeType: 'productos',
    items: ['Cachapas congeladas', 'Queso de mano', 'Nata y manteca'],
    variantItems: [
      { name: 'Chuleta ahumada', options: ['500g', '1 kg'] },
    ],
  },
  {
    id: 9002,
    name: 'Combo Arepero Full',
    price: 22200,
    oldPrice: 27000,
    imgPath: 'harina_pan_1kg.webp',
    storeId: 'minimarket-vibe',
    description: '2 harinas PAN, queso duro, manteca y un Nestea',
    storeType: 'productos',
    items: ['2x Harina PAN', 'Manteca', 'Nestea'],
    variantItems: [
      { name: 'Queso duro', options: ['Medio kilo', '1 kg'] },
    ],
  },
  {
    id: 9003,
    name: 'Combo Pabellón en Casa',
    price: 23500,
    oldPrice: 29500,
    imgPath: 'caraotas_negras.webp',
    storeId: 'minimarket-vibe',
    description: 'Caraotas, plátano maduro, queso duro y una nata',
    storeType: 'productos',
    items: ['Plátano maduro', 'Nata criolla'],
    variantItems: [
      { name: 'Caraotas', options: ['Medio kilo', '1 kg'] },
      { name: 'Queso duro', options: ['Medio kilo', '1 kg'] },
    ],
  },
  {
    id: 9004,
    name: 'Combo Desayuno Criollo',
    price: 30000,
    oldPrice: 38000,
    imgPath: 'harina_pan_1kg.webp',
    storeId: 'minimarket-vibe',
    description: 'Harina PAN, huevos y queso duro — desayuno completo venezolano',
    storeType: 'productos',
    items: ['Harina PAN'],
    variantItems: [
      { name: 'Huevos', options: ['6 unidades', '12 unidades', 'Maple x30'] },
      { name: 'Queso duro', options: ['Medio kilo', '1 kg'] },
    ],
  },
  {
    id: 9005,
    name: 'Combo Empanadas Venezolanas',
    price: 21000,
    oldPrice: 26500,
    imgPath: 'salsa_guasacaca.webp',
    storeId: 'minimarket-vibe',
    description: 'Harina PAN, queso duro, guasacaca y aceite',
    storeType: 'productos',
    items: ['Harina PAN', 'Guasacaca', 'Aceite'],
    variantItems: [
      { name: 'Queso duro', options: ['Medio kilo', '1 kg'] },
    ],
  },
  {
    id: 9006,
    name: 'Combo Merienda Venezolana',
    price: 20000,
    oldPrice: 25000,
    imgPath: 'cocosette_real.webp',
    storeId: 'minimarket-vibe',
    description: 'Café Fama, Cocosette, 2 Pirulín y Catalinas',
    storeType: 'productos',
    items: ['Café Fama de América', 'Cocosette', '2x Pirulín', 'Catalinas'],
  },
];
