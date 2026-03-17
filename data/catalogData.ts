import { Product } from '../types';
import { getImageUrl } from '../lib/supabase';

export const allProducts: Product[] = [
  { 
    id: 1, name: "Cereales Flips Dulce de Leche (220g)", price: 3500, category: "Golosinas", 
    img: getImageUrl("flips_dulcedeleche_1.png"),
    usageInfo: "Cereal relleno sabor a dulce de leche, ideal para merendar.",
    availableInStoreIds: ['real-1', 'real-5', 'real-11']
  },
  { 
    id: 2, name: "Cerelac (400g)", price: 4200, category: "Almacén", 
    img: getImageUrl("cerelac.png"),
    usageInfo: "Cereal a base de trigo y leche, el sabor de la infancia.",
    availableInStoreIds: ['real-5', 'real-8', 'real-12']
  },
  { 
    id: 3, name: "Chocolate Savoy Carré", price: 2500, category: "Golosinas", 
    img: getImageUrl("chocolate_savoy_carre.png"),
    usageInfo: "Chocolate premium con avellanas enteras.",
    availableInStoreIds: ['real-2', 'real-7', 'real-9']
  },
  { 
    id: 4, name: "Harina Doña Arepa Blanca (1kg)", price: 2600, category: "Harinas", 
    img: getImageUrl("harina_dona_arepa.png"),
    usageInfo: "Harina de maíz blanco precocida, extra suave.",
    availableInStoreIds: ['real-4', 'real-5', 'real-11']
  },
  { 
    id: 5, name: "Pirulín (155g)", price: 2800, category: "Golosinas", 
    img: getImageUrl("caja_de_pirulin.png"),
    usageInfo: "Barquillas rellenas de chocolate y avellana.",
    availableInStoreIds: ['real-5', 'real-7', 'real-9']
  },
  { 
    id: 6, name: "Malta +58 (Lata 473 ml)", price: 2300, category: "Bebidas", 
    img: getImageUrl("lata_de_58_malta_artesanal.png"),
    usageInfo: "Bebida de malta con el auténtico sabor venezolano.",
    availableInStoreIds: ['real-1', 'real-6', 'real-10']
  },
  { 
    id: 7, name: "Re-Ko Malta (Lata 355ml)", price: 1000, category: "Bebidas", 
    img: getImageUrl("re-ko_malta.png"),
    usageInfo: "Malta refrescante y nutritiva para cualquier hora.",
    availableInStoreIds: ['real-2', 'real-5', 'real-12']
  },
  { 
    id: 8, name: "Re-Kolita (Lata 355ml)", price: 1000, category: "Bebidas", 
    img: getImageUrl("re-kolita.png"),
    usageInfo: "Refresco sabor a colita, dulce y burbujeante.",
    availableInStoreIds: ['real-1', 'real-7', 'real-11']
  },
  { 
    id: 9, name: "Ron Premium Santa Teresa 1796", price: 38000, category: "Bebidas", 
    img: getImageUrl("botella_de_ron_santa_teresa_1796.png"),
    usageInfo: "Es uno de los mas conocidos de Venezuela, cuenta con sabores ligeros y suaves ideal para mezclar con lima o soda de limón. Presentacion de 750ml. Importado directo de Venezuela.",
    availableInStoreIds: ['real-3', 'real-8', 'real-9']
  },
  { 
    id: 10, name: "Chocolate Savoy Cri Cri", price: 1500, category: "Golosinas", 
    img: getImageUrl("savoy_cricri.png"),
    usageInfo: "Chocolate con arroz tostado crujiente.",
    availableInStoreIds: ['real-1', 'real-5', 'real-10']
  },
  { 
    id: 11, name: "Samba de Fresa", price: 1200, category: "Golosinas", 
    img: getImageUrl("savoy_samba.png"),
    usageInfo: "Galleta cubierta de chocolate con relleno de fresa.",
    availableInStoreIds: ['real-2', 'real-6', 'real-11']
  },
  { 
    id: 12, name: "Galleta Susy", price: 1200, category: "Golosinas", 
    img: getImageUrl("susy.png"),
    usageInfo: "Galleta tipo wafer rellena de crema de chocolate.",
    availableInStoreIds: ['real-4', 'real-7', 'real-12']
  }
];

export const promoCombos: (Product & { storeId: string })[] = [
  { 
    id: 101, name: "Combo Arepero Full", price: 10500, oldPrice: 12500, category: "Promociones", 
    img: getImageUrl("combo_arepero.png") , isCombo: true,
    usageInfo: "Harina P.A.N., Diablitos y Queso Llanero.",
    storeId: 'real-11'
  },
  { 
    id: 105, name: "Combo Perro Callejero", price: 8500, oldPrice: 10200, category: "Promociones", 
    img: "https://picsum.photos/seed/hotdog/400/400", isCombo: true,
    usageInfo: "Pan de perro caliente, salchichas, papitas tipo hilo, salsa de ajo y picante, salsa Maiz y Pance.",
    storeId: 'real-1'
  },
  { 
    id: 106, name: "Combo Empanadas Venezolanas", price: 9200, oldPrice: 11500, category: "Promociones", 
    img: getImageUrl("combo_empanadas_venezolanas.png"), isCombo: true,
    usageInfo: "2 × Harina P.A.N., queso blanco, salsa guasacaca.",
    storeId: 'real-2'
  },
  { 
    id: 107, name: "Combo Desayuno Criollo", price: 15400, oldPrice: 18900, category: "Promociones", 
    img: getImageUrl("combo_desayuno_criollo.png"), isCombo: true,
    usageInfo: "1 × Harina P.A.N., queso llanero, mantequilla, café venezolano, Nata, casabe, papelon.",
    storeId: 'real-3'
  },
  { 
    id: 108, name: "Combo Dulces de Venezuela", price: 7800, oldPrice: 9500, category: "Promociones", 
    img: getImageUrl("pirulin.png"), isCombo: true,
    usageInfo: "Pirulín, Samba, Susy, 2 × Maltas.",
    storeId: 'real-5'
  },
  { 
    id: 109, name: "Combo Pabellón en Casa", price: 12600, oldPrice: 15200, category: "Promociones", 
    img: getImageUrl("combo_pabellon.png"), isCombo: true,
    usageInfo: "Caraotas negras, plátanos maduros, queso blanco rallado, Nata.",
    storeId: 'real-6'
  },
  { 
    id: 110, name: "Combo Reunión Venezolana", price: 22500, oldPrice: 28000, category: "Promociones", 
    img: "https://picsum.photos/seed/party/400/400", isCombo: true,
    usageInfo: "Tequeños, salsa tartara o guasacaca, 6 × Maltín Polar, snacks venezolanos, chicharron, obleas.",
    storeId: 'real-8'
  },
  { 
    id: 111, name: "Combo Merienda Venezolana", price: 6400, oldPrice: 7900, category: "Promociones", 
    img: getImageUrl("combo_merienda_venezolana.png"), isCombo: true,
    usageInfo: "Cocosette, Susy, café venezolano, catalinas.",
    storeId: 'real-10'
  },
  { 
    id: 112, name: "Combo Fiesta Venezolana", price: 24800, oldPrice: 31000, category: "Promociones", 
    img: getImageUrl("combo_fiesta_venezolana.png"), isCombo: true,
    usageInfo: "Tequeños, mini empanadas, salsa guasacaca, 6 × Maltín Polar, 1 dulce venezolano, Chicharron.",
    storeId: 'real-12'
  },
];

export const categories = [
  { name: "Quesos y Tequeños", subtitle: "El alma de la fiesta", image: getImageUrl("tequenos_y_quesos1.png") },
  { name: "Harinas", subtitle: "Para tus arepas y más", image: getImageUrl("harinas1.png") },
  { name: "Lácteos", subtitle: "Quesos y derivados frescos", image: getImageUrl("queso_lacteos.png") },
  { name: "Congelados", subtitle: "Listos para preparar", image: getImageUrl("chuletas_1.png") },
  { name: "Bebidas", subtitle: "Refrescos y maltas", image: getImageUrl("bebidas_cervezas.png") },
  { name: "Salsas", subtitle: "El toque especial", image: getImageUrl("salsas1.png") },
  { name: "Enlatados", subtitle: "Conservas de calidad", image: getImageUrl("enlatado_diablitos1.png") },
  { name: "Snacks", subtitle: "Para picar entre horas", image: getImageUrl("snacks1.png") },
  { name: "Almacén", subtitle: "Lo esencial de la despensa", image: getImageUrl("abarrotes_1.png") },
  { name: "Golosinas", subtitle: "Dulces recuerdos", image: getImageUrl("golosinas_1.png") },
];
