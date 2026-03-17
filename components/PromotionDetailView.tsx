
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Plus, Trophy, PackageCheck, Store, ArrowRight } from 'lucide-react';
import { Product, Reward, PartnerStore } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';

const allProducts: Product[] = [
  { 
    id: 101, name: "Combo Arepero Full", price: 10500, category: "Promociones", 
    img: "/imagenes_combos/combo_arepero.png", isCombo: true,
    usageInfo: "Harina P.A.N., Diablitos y Queso Llanero.",
    storeId: 'real-11'
  },
  { 
    id: 105, name: "Combo Perro Callejero", price: 8500, category: "Promociones", 
    img: "https://picsum.photos/seed/hotdog/400/400", isCombo: true,
    usageInfo: "Pan de perro caliente, salchichas, papitas tipo hilo, salsa de ajo y picante, salsa Maiz y Pance.",
    storeId: 'real-1'
  },
  { 
    id: 106, name: "Combo Empanadas Venezolanas", price: 9200, category: "Promociones", 
    img: "/imagenes_combos/combo_empanadas_venezolanas.png", isCombo: true,
    usageInfo: "2 × Harina P.A.N., queso blanco, salsa guasacaca.",
    storeId: 'real-2'
  },
  { 
    id: 107, name: "Combo Desayuno Criollo", price: 15400, category: "Promociones", 
    img: "/imagenes_combos/combo_desayuno_criollo.png", isCombo: true,
    usageInfo: "1 × Harina P.A.N., queso llanero, mantequilla, café venezolano, Nata, casabe, papelon.",
    storeId: 'real-3'
  },
  { 
    id: 108, name: "Combo Dulces de Venezuela", price: 7800, category: "Promociones", 
    img: "https://picsum.photos/seed/pirulin/400/400", isCombo: true,
    usageInfo: "Pirulín, Samba, Susy, 2 × Maltas.",
    storeId: 'real-5'
  },
  { 
    id: 109, name: "Combo Pabellón en Casa", price: 12600, category: "Promociones", 
    img: "/imagenes_combos/combo_pabellon.png", isCombo: true,
    usageInfo: "Caraotas negras, plátanos maduros, queso blanco rallado, Nata.",
    storeId: 'real-6'
  },
  { 
    id: 110, name: "Combo Reunión Venezolana", price: 22500, category: "Promociones", 
    img: "https://picsum.photos/seed/party/400/400", isCombo: true,
    usageInfo: "Tequeños, salsa tartara o guasacaca, 6 × Maltín Polar, snacks venezolanos, chicharron, obleas.",
    storeId: 'real-8'
  },
  { 
    id: 111, name: "Combo Merienda Venezolana", price: 6400, category: "Promociones", 
    img: "/imagenes_combos/combo_merienda_venezolana.png", isCombo: true,
    usageInfo: "Cocosette, Susy, café venezolano, catalinas.",
    storeId: 'real-10'
  },
  { 
    id: 112, name: "Combo Fiesta Venezolana", price: 24800, category: "Promociones", 
    img: "/imagenes_combos/combo_fiesta_venezolana.png", isCombo: true,
    usageInfo: "Tequeños, mini empanadas, salsa guasacaca, 6 × Maltín Polar, 1 dulce venezolano, Chicharron.",
    storeId: 'real-12'
  },
];

const comboDefinitions: Record<number, { name: string, qty: string, price?: number, yield?: string, suggest?: string }[]> = {
  101: [
    { name: "Harina P.A.N. Blanca 1kg", qty: "1 unidad", price: 1800, yield: "15 arepas", suggest: "Desayuno clásico" },
    { name: "Diablitos Underwood 115g", qty: "2 unidades", price: 1900 },
    { name: "Queso Llanero Premium 500g", qty: "1 unidad", price: 3200 },
    { name: "Margarina Mavesa 500g", qty: "1 unidad", price: 1600 }
  ],
  105: [
    { name: "Pan de Perro Caliente", qty: "6 unidades" },
    { name: "Salchichas de Copetín", qty: "1 pack" },
    { name: "Papitas tipo Hilo", qty: "1 bolsa" },
    { name: "Salsas (Ajo, Picante, Maíz)", qty: "Set de potes" }
  ],
  106: [
    { name: "Harina P.A.N. Blanca 1kg", qty: "2 unidades" },
    { name: "Queso Blanco Duro 500g", qty: "1 unidad" },
    { name: "Salsa Guasacaca EnCasa", qty: "1 pote" }
  ],
  107: [
    { name: "Harina P.A.N. Blanca 1kg", qty: "1 unidad" },
    { name: "Queso Llanero 500g", qty: "1 unidad" },
    { name: "Mantequilla Mavesa", qty: "1 unidad" },
    { name: "Café Venezolano Fama de América", qty: "1 pack" },
    { name: "Nata Criolla", qty: "1 pote" },
    { name: "Casabe Horneado", qty: "1 pack" },
    { name: "Papelón con Limón", qty: "1 unidad" }
  ],
  108: [
    { name: "Pirulín Lata 155g", qty: "1 unidad" },
    { name: "Samba de Chocolate", qty: "1 unidad" },
    { name: "Susy Galleta", qty: "1 unidad" },
    { name: "Malta Polar", qty: "2 unidades" }
  ],
  109: [
    { name: "Caraotas Negras Listas", qty: "1 pote" },
    { name: "Plátanos Maduros", qty: "2 unidades" },
    { name: "Queso Blanco Rallado", qty: "250g" },
    { name: "Nata Criolla", qty: "1 pote" }
  ],
  110: [
    { name: "Tequeños de Queso", qty: "24 unidades" },
    { name: "Salsa Tártara/Guasacaca", qty: "2 potes" },
    { name: "Maltín Polar", qty: "6 unidades" },
    { name: "Snacks Venezolanos Mixtos", qty: "2 bolsas" },
    { name: "Chicharrón Crujiente", qty: "1 bolsa" },
    { name: "Obleas con Arequipe", qty: "1 pack" }
  ],
  111: [
    { name: "Cocosette Maxi", qty: "1 unidad" },
    { name: "Susy Galleta", qty: "1 unidad" },
    { name: "Café Venezolano", qty: "1 pack" },
    { name: "Catalinas Suaves", qty: "1 pack" }
  ],
  112: [
    { name: "Tequeños de Queso", qty: "50 unidades" },
    { name: "Mini Empanadas Mixtas", qty: "24 unidades" },
    { name: "Salsa Guasacaca", qty: "2 potes" },
    { name: "Maltín Polar", qty: "6 unidades" },
    { name: "Dulce Venezolano (Suritdo)", qty: "1 pack" },
    { name: "Chicharrón Crujiente", qty: "1 bolsa" }
  ]
};

const rewards: Reward[] = [
  { id: '1', title: 'Bono $2000', pointsCost: 150, type: 'discount', description: '' },
  { id: '2', title: 'Tequeños Regalo', pointsCost: 300, type: 'product', description: '' },
];

interface PromotionDetailViewProps {
  userPoints: number;
  onAddToCart: (product: Product, storeId?: string) => void;
  onSelectStore: (store: PartnerStore | null) => void;
  showLoyalty?: boolean;
}

const PromotionDetailView: React.FC<PromotionDetailViewProps> = ({ userPoints, onAddToCart, onSelectStore, showLoyalty = true }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const combo = allProducts.find(p => p.id === Number(id));

  if (!combo) return null;

  const store = LOCALES_VENEZOLANOS.find(s => s.id === combo.storeId);
  const comboItems = comboDefinitions[combo.id] || [];
  const pointsEarned = Math.floor(combo.price / 10000);
  const nextReward = [...rewards].find(r => r.pointsCost > userPoints) || rewards[0];
  const progressPercent = Math.min(100, (userPoints / nextReward.pointsCost) * 100);

  const handleGoToStore = () => {
    if (store) {
      onSelectStore(store);
      navigate('/catalog');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-8 md:py-12 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-venezuela-orange transition-colors mb-8 group"
      >
        <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-venezuela-orange/10 transition-all">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Volver al Marketplace</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Imagen y Badges */}
        <div className="relative">
          <div className="aspect-square rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative">
            <img src={combo.img} alt={combo.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
          
          <div className="absolute -top-4 -right-4 bg-ven-red p-5 rounded-[32px] shadow-[0_20px_40px_rgba(207,20,43,0.3)] border border-white/20 transform rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="flex flex-col items-center">
              <p className="text-[9px] text-white/80 font-black uppercase tracking-[0.2em] mb-1">¡OFERTA!</p>
              <p className="text-xs text-white/90 font-bold uppercase tracking-tight">Ahorras</p>
              <p className="text-2xl font-black text-white leading-none tracking-tighter">$1.500</p>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <div className="bg-venezuela-orange text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl border border-white/10 backdrop-blur-md">
              <Zap size={14} fill="currentColor" /> Oferta Relámpago
            </div>
            {store && (
              <div className="bg-black/60 text-white/90 px-4 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center gap-2 shadow-2xl border border-white/10 backdrop-blur-md">
                <Store size={12} className="text-venezuela-orange" /> {store.name}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-2 uppercase tracking-tighter leading-none">{combo.name}</h1>
            <p className="text-gray-500 text-sm italic">"{combo.usageInfo}"</p>
          </div>

          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 space-y-6 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">Precio del Combo</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-black text-white tracking-tighter">${combo.price}</p>
                  <p className="text-sm text-gray-600 line-through font-bold">${combo.price + 1500}</p>
                </div>
              </div>
              {showLoyalty && (
                <div className="bg-venezuela-orange/10 border border-venezuela-orange/20 px-4 py-3 rounded-2xl text-center shadow-inner">
                   <p className="text-[9px] text-venezuela-orange font-black uppercase tracking-widest mb-1">Club Puntos</p>
                   <p className="text-xl font-black text-venezuela-orange">+{pointsEarned}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => { onAddToCart(combo, combo.storeId); alert("¡Combo agregado al pedido!"); }}
                className="w-full bg-gradient-to-r from-[#F58220] to-[#E86D00] text-white py-5 rounded-[24px] font-black text-sm tracking-widest transition-all shadow-xl shadow-orange-500/30 active:scale-95 flex items-center justify-center gap-3 uppercase border border-white/10"
              >
                <Plus size={22} strokeWidth={4} />
                Agregar al pedido
              </button>

              <button 
                onClick={handleGoToStore}
                className="w-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-4 rounded-[24px] font-black text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 uppercase border border-white/5"
              >
                Seguir agregando más productos
                <ArrowRight size={14} />
              </button>
              
              <p className="text-[9px] text-gray-600 font-bold italic text-center px-4 leading-relaxed uppercase tracking-widest">
                La disponibilidad se confirma al momento del pedido con el local.
              </p>
            </div>
          </div>

          {/* Progreso del Club - Condicional */}
          {showLoyalty && (
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance Club: {userPoints} pts</span>
                <Trophy size={16} className="text-venezuela-orange" />
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-venezuela-orange transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Qué incluye este combo */}
      <div className="mt-12">
        <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
          <PackageCheck className="text-venezuela-orange" size={24} />
          ¿Qué incluye este combo?
        </h3>

        <div className="grid gap-3">
          {comboItems.map((item, index) => (
            <div key={index} className="bg-white/[0.03] p-4 rounded-[24px] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-venezuela-orange opacity-60"></div>
                 <div>
                   <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{item.name}</p>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.qty} {item.yield ? `• Rinde ${item.yield}` : ''}</p>
                 </div>
              </div>
              {item.suggest && (
                <span className="hidden sm:block bg-venezuela-orange/10 text-venezuela-orange text-[8px] font-black px-2 py-1 rounded-lg uppercase">
                  {item.suggest}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailView;
