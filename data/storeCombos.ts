export interface ComboVariantItem {
  name: string;
  options: string[];
}

export interface StoreCombo {
  id: number;
  name: string;
  price: number;
  description: string;
  emoji: string;
  storeType: 'productos' | 'all';
  items: string[];
  variantItems?: ComboVariantItem[];
}

export const STORE_COMBOS: StoreCombo[] = [
  {
    id: 9001,
    name: 'Combo Cachapero',
    price: 33000,
    emoji: '🌽',
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
    emoji: '🫓',
    description: '2 harinas, queso duro, manteca y un Nestea',
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
    emoji: '🍽️',
    description: 'Caraotas, plátano maduro, queso duro y una nata',
    storeType: 'productos',
    items: ['Plátano maduro', 'Nata'],
    variantItems: [
      { name: 'Caraotas', options: ['Medio kilo', '1 kg'] },
      { name: 'Queso duro', options: ['Medio kilo', '1 kg'] },
    ],
  },
  {
    id: 9004,
    name: 'Combo Desayuno Criollo',
    price: 30000,
    emoji: '🥚',
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
    emoji: '🫔',
    description: 'Harina, queso duro, guasacaca y aceite — todo para tus empanadas',
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
    emoji: '☕',
    description: 'Café, Cocosette, 2 Pirulín y Catalinas — la merienda perfecta',
    storeType: 'productos',
    items: ['Café', 'Cocosette', '2x Pirulín', 'Catalinas'],
  },
];
