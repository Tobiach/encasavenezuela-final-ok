/**
 * Fallback estático de productos.
 * Se usa cuando Supabase falla Y no hay snapshot en localStorage.
 * Sincronizado con migrate-products-v2 + actualizaciones 04-abr-2026.
 */
import { Product } from '../types';
import { getImageUrl } from '../lib/supabase';

export const FALLBACK_PRODUCTS: Product[] = [
  // ── HARINAS ──────────────────────────────────────────────────────────────
  { id: 20,  name: 'Harina PAN Blanca 1kg',              price: 2900,  category: 'Harinas',     img: getImageUrl('harina_pan_blanca.webp') },
  { id: 4,   name: 'Harina Doña Arepa Blanca 1kg',       price: 2900,  category: 'Harinas',     img: getImageUrl('harina_dona_arepa.webp') },
  { id: 22,  name: 'Harina Maseca 1kg',                  price: 2400,  category: 'Harinas',     img: getImageUrl('harina_maseca.webp') },
  { id: 23,  name: 'Harina Morixe 1kg',                  price: 2500,  category: 'Harinas',     img: getImageUrl('harina_morixe.webp') },
  { id: 24,  name: 'Harina para Cachapas 1kg',           price: 3500,  category: 'Harinas',     img: getImageUrl('harina_cachapas.webp') },
  { id: 25,  name: 'Casabe Gourmet',                     price: 6300,  category: 'Harinas',     img: getImageUrl('casabe_real.webp') },

  // ── CEREALES ─────────────────────────────────────────────────────────────
  { id: 2,   name: 'Cerelac',                            price: 16000, category: 'Cereales',    img: getImageUrl('cerelac.webp') },
  { id: 30,  name: 'Fororo Monay Harina de Maíz Tostado 400g', price: 2000, category: 'Cereales', img: getImageUrl('fororo_real.webp') },

  // ── GRANOS ───────────────────────────────────────────────────────────────
  { id: 35,  name: 'Caraotas Negras 500gr',              price: 2500,  category: 'Granos',      img: getImageUrl('caraotas_negras.webp') },

  // ── SECOS ─────────────────────────────────────────────────────────────────
  { id: 40,  name: 'Papelón Molido',                     price: 3800,  category: 'Secos',       img: getImageUrl('papelon_molido.webp') },
  { id: 41,  name: 'Papelón en Panela',                  price: 3300,  category: 'Secos',       img: getImageUrl('papelon_panela.webp') },

  // ── LÁCTEOS ──────────────────────────────────────────────────────────────
  { id: 45,  name: 'Queso Duro 1kg',                     price: 14700, category: 'Lácteos',     img: getImageUrl('queso_duro.webp') },
  { id: 46,  name: 'Queso de Mano',                      price: 7000,  category: 'Lácteos',     img: getImageUrl('queso_de_mano.webp') },
  { id: 47,  name: 'Nata Criolla',                       price: 4800,  category: 'Lácteos',     img: getImageUrl('nata_criolla.webp') },

  // ── CARNES ───────────────────────────────────────────────────────────────
  { id: 50,  name: 'Chuleta Ahumada',                    price: 13000, category: 'Carnes',      img: getImageUrl('chuleta_ahumada.webp') },
  { id: 51,  name: 'Huesos Ahumados 1kg',                price: 4500,  category: 'Carnes',      img: getImageUrl('huesos_ahumados.webp') },
  { id: 52,  name: 'Chicharrón',                         price: 5400,  category: 'Carnes',      img: getImageUrl('chicharron.webp') },

  // ── CONDIMENTOS ──────────────────────────────────────────────────────────
  { id: 55,  name: 'Adobo La Sazon x 180g',              price: 2500,  category: 'Condimentos', img: getImageUrl('adobo_la_sazon.webp') },
  { id: 56,  name: 'Salsa Ají Picante',                  price: 2500,  category: 'Salsas',      img: getImageUrl('salsa_aji_picante.webp') },

  // ── SALSAS ───────────────────────────────────────────────────────────────
  { id: 60,  name: 'Salsa Inglesa',                      price: 3500,  category: 'Salsas',      img: getImageUrl('salsa_inglesa.webp') },
  { id: 61,  name: 'Salsa de Maíz',                      price: 4500,  category: 'Salsas',      img: getImageUrl('salsa_maiz.webp') },
  { id: 62,  name: 'Salsa Ahumada',                      price: 4500,  category: 'Salsas',      img: getImageUrl('salsa_ahumada.webp') },
  { id: 63,  name: 'Salsa Picante',                      price: 2000,  category: 'Salsas',      img: getImageUrl('salsa_picante.webp') },
  { id: 64,  name: 'Salsa Cheddar',                      price: 8000,  category: 'Salsas',      img: getImageUrl('salsa_cheddar.webp') },
  { id: 65,  name: 'Salsa Guasacaca',                    price: 6500,  category: 'Salsas',      img: getImageUrl('salsa_guasacaca.webp') },

  // ── UNTABLES ─────────────────────────────────────────────────────────────
  { id: 70,  name: 'Mantequilla Qualy',                  price: 2600,  category: 'Untables',    img: getImageUrl('mantequilla_qualy.webp') },
  { id: 71,  name: 'Mantequilla Danica',                 price: 2600,  category: 'Untables',    img: getImageUrl('mantequilla_danica.webp') },
  { id: 72,  name: 'Mavesa Mayonesa',                    price: 14000, category: 'Untables',    img: getImageUrl('mavesa_mayonesa.webp') },
  { id: 73,  name: 'Diablito',                           price: 12000, category: 'Untables',    img: getImageUrl('diablitos.webp') },
  { id: 74,  name: 'Rikesa Cheddar 200gr',               price: 12000, category: 'Untables',    img: getImageUrl('rikesa.webp') },

  // ── BEBIDAS ──────────────────────────────────────────────────────────────
  { id: 6,   name: 'Malta +58 (473ml)',                  price: 3000,  category: 'Bebidas',     img: getImageUrl('malta_58.webp') },
  { id: 7,   name: 'Re-Ko Malta (355ml)',                price: 2500,  category: 'Bebidas',     img: getImageUrl('re-ko_malta.webp') },
  { id: 8,   name: 'Re-Kolita (355ml)',                  price: 2500,  category: 'Bebidas',     img: getImageUrl('re-kolita_white.webp') },
  { id: 80,  name: 'Café Fama de América',               price: 18000, category: 'Bebidas',     img: getImageUrl('cafe_fama_de_america.webp') },
  { id: 81,  name: 'Toddy',                              price: 9300,  category: 'Bebidas',     img: getImageUrl('toddy.webp') },
  { id: 82,  name: 'Nesquik',                            price: 12500, category: 'Bebidas',     img: getImageUrl('nesquik.webp') },
  { id: 83,  name: 'Nestea',                             price: 14500, category: 'Bebidas',     img: getImageUrl('nestea.webp') },
  { id: 84,  name: 'Tamarindo',                          price: 6999,  category: 'Bebidas',     img: getImageUrl('tamarindo_real.webp') },
  { id: 85,  name: 'Reko Uva',                           price: 1499,  category: 'Bebidas',     img: getImageUrl('reko_uva_real.webp') },
  { id: 86,  name: 'Reko Piña',                         price: 2500,  category: 'Bebidas',     img: getImageUrl('reko_pina.webp') },
  { id: 87,  name: 'Reko Manzana',                       price: 1499,  category: 'Bebidas',     img: getImageUrl('reko_manzana_real.webp') },
  { id: 9,   name: 'Ron Santa Teresa 1796',              price: 35000, category: 'Bebidas',     img: getImageUrl('botella_de_ron_santa_teresa_1796.webp') },

  // ── CHUCHERÍAS ───────────────────────────────────────────────────────────
  { id: 5,   name: 'Pirulín (155g)',                     price: 22500, category: 'Chucherías',  img: getImageUrl('caja_de_pirulin.webp') },
  { id: 1,   name: 'Flips Dulce de Leche (220g)',        price: 4500,  category: 'Chucherías',  img: getImageUrl('flips_dulcedeleche_1.webp') },
  { id: 92,  name: 'Flips Grande 200gr Dulce de Leche',  price: 10500, category: 'Chucherías',  img: getImageUrl('flips_grande_real.webp') },
  { id: 10,  name: 'Chocolate Savoy Cri Cri',            price: 5000,  category: 'Chucherías',  img: getImageUrl('savoy_cricri.webp') },
  { id: 3,   name: 'Chocolate Savoy Carré',              price: 9800,  category: 'Chucherías',  img: getImageUrl('chocolate_savoy_carre1.webp') },
  { id: 11,  name: 'Samba de Fresa',                     price: 2800,  category: 'Chucherías',  img: getImageUrl('savoy_samba.webp') },
  { id: 12,  name: 'Galleta Susy',                       price: 3000,  category: 'Chucherías',  img: getImageUrl('susy.webp') },
  { id: 90,  name: 'Obleas',                             price: 2999,  category: 'Chucherías',  img: getImageUrl('obleas_real.webp') },
  { id: 91,  name: 'Pinguinito',                         price: 4300,  category: 'Chucherías',  img: getImageUrl('pinguinito.webp') },
  { id: 93,  name: 'Cocosette c46gr',                    price: 2999,  category: 'Chucherías',  img: getImageUrl('cocosette_real.webp') },
  { id: 94,  name: 'Chupetas',                           price: 500,   category: 'Chucherías',  img: getImageUrl('chupetas.webp') },
  { id: 95,  name: 'Catalinas Doña Carmen x4u',          price: 2899,  category: 'Chucherías',  img: getImageUrl('catalina_real.webp') },

  // ── SNACKS ───────────────────────────────────────────────────────────────
  { id: 100, name: 'Torontos',                           price: 1000,  category: 'Snacks',      img: getImageUrl('torontos.webp') },
  { id: 103, name: 'Platanito',                          price: 2000,  category: 'Snacks',      img: getImageUrl('platanito.webp') },

  // ── CONGELADOS ───────────────────────────────────────────────────────────
  { id: 120, name: 'Tequeños Congelados',                price: 6500,  category: 'Congelados',  img: getImageUrl('tequenos_congelados.webp') },
  { id: 121, name: 'Tetas de Leche',                     price: 2000,  category: 'Congelados',  img: getImageUrl('tetas_congeladas.webp') },
  { id: 122, name: 'Cachapas Congeladas',                price: 7600,  category: 'Congelados',  img: getImageUrl('cachapas_congeladas.webp') },

  // ── HOGAR ─────────────────────────────────────────────────────────────────
  { id: 130, name: 'Budare',                             price: 55000, category: 'Hogar',       img: getImageUrl('budare.webp') },

  // ── COMBOS ────────────────────────────────────────────────────────────────
  { id: 201, name: 'Combo Arepa Completa',  price: 8900,  oldPrice: 11500, category: 'Promociones', img: getImageUrl('harinas1.png'),           isCombo: true, storeId: 'encasa-venezuela' },
  { id: 202, name: 'Combo Tequeños + Malta',price: 7200,  oldPrice: 9500,  category: 'Promociones', img: getImageUrl('tequenos_y_quesos1.png'), isCombo: true, storeId: 'encasa-venezuela' },
  { id: 203, name: 'Combo Snack Venezolano',price: 5900,  oldPrice: 7800,  category: 'Promociones', img: getImageUrl('snacks1.png'),            isCombo: true, storeId: 'encasa-venezuela' },
];
