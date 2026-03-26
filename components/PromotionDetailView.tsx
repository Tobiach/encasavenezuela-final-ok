
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Plus, Trophy, PackageCheck, Store, ArrowRight, ImageOff } from 'lucide-react';
import { Product, Reward, PartnerStore } from '../types';
import { useStores } from '../lib/hooks/useStores';
import { useProducts } from '../lib/hooks/useProducts';

// Fallback hardcodeado — solo se usa si el combo no se encuentra en Supabase por ID
const fallbackCombos: Product[] = [
  {
    id: 101, name: "Combo Arepero Full", price: 10500, oldPrice: 12000, category: "Promociones",
    img: "", isCombo: true,
    usageInfo: "Todo lo que necesitás para unas arepas completas en casa 🇻🇪",
    storeId: 'real-11'
  },
  {
    id: 105, name: "Combo Cachapero", price: 8500, category: "Promociones",
    img: '', isCombo: true,
    usageInfo: "Cachapas de maíz tierno con queso de mano, jamón, nata fresca y tequeños.",
    storeId: 'real-1'
  },
  {
    id: 106, name: "Combo Empanadas Venezolanas", price: 9200, category: "Promociones",
    img: "", isCombo: true,
    usageInfo: "2 × Harina P.A.N., queso blanco, salsa guasacaca.",
    storeId: 'real-2'
  },
  {
    id: 107, name: "Combo Desayuno Criollo", price: 15400, category: "Promociones",
    img: "", isCombo: true,
    usageInfo: "Harina P.A.N., queso llanero, mantequilla, café venezolano, nata, casabe, papelón.",
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
    img: "", isCombo: true,
    usageInfo: "Caraotas negras, plátanos maduros, queso blanco rallado, Nata.",
    storeId: 'real-6'
  },
  {
    id: 110, name: "Combo Reunión Venezolana", price: 22500, category: "Promociones",
    img: "https://picsum.photos/seed/party/400/400", isCombo: true,
    usageInfo: "Tequeños, salsa guasacaca, 6 × Maltín Polar, snacks venezolanos, chicharrón, obleas.",
    storeId: 'real-8'
  },
  {
    id: 111, name: "Combo Merienda Venezolana", price: 6400, category: "Promociones",
    img: "", isCombo: true,
    usageInfo: "Cocosette, Susy, café venezolano, catalinas.",
    storeId: 'real-10'
  },
  {
    id: 112, name: "Combo Fiesta Venezolana", price: 24800, category: "Promociones",
    img: "", isCombo: true,
    usageInfo: "Tequeños, mini empanadas, salsa guasacaca, 6 × Maltín Polar, dulce venezolano, chicharrón.",
    storeId: 'real-12'
  },
];

interface ComboItem {
  name: string;
  qty: string;
  emoji?: string;
  yield?: string;
  suggest?: string;
}

// Items detallados por combo — usados para la sección "¿Qué incluye?"
const comboDefinitions: Record<number, ComboItem[]> = {
  101: [
    { name: "Harina P.A.N.", qty: "2 unidades", emoji: "🫓" },
    { name: "Nestea", qty: "1 unidad", emoji: "🧃" },
    { name: "Mantequilla Qualy", qty: "1 unidad", emoji: "🧈" },
    { name: "Queso venezolano", qty: "500g", emoji: "🧀" },
  ],
  105: [
    { name: "Cachapas de Maíz Tierno", qty: "4 unidades", emoji: "🌽", yield: "4 porciones" },
    { name: "Queso de Mano", qty: "1 unidad", emoji: "🧀" },
    { name: "Jamón Ahumado", qty: "200g", emoji: "🥩" },
    { name: "Nata Criolla", qty: "1 pote", emoji: "🥛" },
    { name: "Tequeños", qty: "6 unidades", emoji: "🥖" },
  ],
  106: [
    { name: "Harina P.A.N. Blanca 1kg", qty: "2 unidades", emoji: "🫓" },
    { name: "Queso Blanco Duro 500g", qty: "1 unidad", emoji: "🧀" },
    { name: "Salsa Guasacaca EnCasa", qty: "1 pote", emoji: "🥗" },
  ],
  107: [
    { name: "Harina P.A.N. Blanca 1kg", qty: "1 unidad", emoji: "🫓" },
    { name: "Queso Llanero 500g", qty: "1 unidad", emoji: "🧀" },
    { name: "Mantequilla Mavesa", qty: "1 unidad", emoji: "🧈" },
    { name: "Café Fama de América", qty: "1 pack", emoji: "☕" },
    { name: "Nata Criolla", qty: "1 pote", emoji: "🥛" },
    { name: "Casabe Horneado", qty: "1 pack", emoji: "🍞" },
    { name: "Papelón con Limón", qty: "1 unidad", emoji: "🍋" },
  ],
  108: [
    { name: "Pirulín Lata 155g", qty: "1 unidad", emoji: "🍭" },
    { name: "Samba de Chocolate", qty: "1 unidad", emoji: "🍫" },
    { name: "Susy Galleta", qty: "1 unidad", emoji: "🍪" },
    { name: "Malta Polar", qty: "2 unidades", emoji: "🧃" },
  ],
  109: [
    { name: "Caraotas Negras Listas", qty: "1 pote", emoji: "🫘" },
    { name: "Plátanos Maduros", qty: "2 unidades", emoji: "🍌" },
    { name: "Queso Blanco Rallado", qty: "250g", emoji: "🧀" },
    { name: "Nata Criolla", qty: "1 pote", emoji: "🥛" },
  ],
  110: [
    { name: "Tequeños de Queso", qty: "24 unidades", emoji: "🥖" },
    { name: "Salsa Tártara / Guasacaca", qty: "2 potes", emoji: "🥗" },
    { name: "Maltín Polar", qty: "6 unidades", emoji: "🧃" },
    { name: "Snacks Venezolanos Mixtos", qty: "2 bolsas", emoji: "🍿" },
    { name: "Chicharrón Crujiente", qty: "1 bolsa", emoji: "🥓" },
    { name: "Obleas con Arequipe", qty: "1 pack", emoji: "🍬" },
  ],
  111: [
    { name: "Cocosette Maxi", qty: "1 unidad", emoji: "🍫" },
    { name: "Susy Galleta", qty: "1 unidad", emoji: "🍪" },
    { name: "Café Venezolano", qty: "1 pack", emoji: "☕" },
    { name: "Catalinas Suaves", qty: "1 pack", emoji: "🍪" },
  ],
  112: [
    { name: "Tequeños de Queso", qty: "50 unidades", emoji: "🥖" },
    { name: "Mini Empanadas Mixtas", qty: "24 unidades", emoji: "🥟" },
    { name: "Salsa Guasacaca", qty: "2 potes", emoji: "🥗" },
    { name: "Maltín Polar", qty: "6 unidades", emoji: "🧃" },
    { name: "Dulce Venezolano (Surtido)", qty: "1 pack", emoji: "🍬" },
    { name: "Chicharrón Crujiente", qty: "1 bolsa", emoji: "🥓" },
  ],
};

// Si no hay definición local, parsear usageInfo como lista
function getComboItems(combo: Product): ComboItem[] {
  if (comboDefinitions[combo.id]) return comboDefinitions[combo.id];
  if (combo.usageInfo) {
    return combo.usageInfo
      .split(/[,•]/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => ({ name: s, qty: '', emoji: '📦' }));
  }
  return [];
}

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
  const { stores } = useStores();
  const { promoCombos } = useProducts();
  const [imgError, setImgError] = useState(false);

  // Buscar primero en Supabase (datos reales), luego en fallback hardcodeado
  const combo = promoCombos.find(p => p.id === Number(id)) || fallbackCombos.find(p => p.id === Number(id));

  if (!combo) return null;

  const store = stores.find(s => s.id === combo.storeId);
  const comboItems = getComboItems(combo);
  const savings = combo.oldPrice ? combo.oldPrice - combo.price : null;
  const hasImage = !!combo.img && !imgError;
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
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      {/* Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-venezuela-orange transition-colors mb-7 group"
      >
        <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-venezuela-orange/10 transition-all">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest">Volver</span>
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-start">

        {/* ── IMAGEN ────────────────────────────────── */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/8 shadow-2xl bg-white/5">
            {hasImage ? (
              <>
                <img
                  src={combo.img}
                  alt={combo.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center">
                  <ImageOff size={28} className="text-gray-600" />
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">Imagen no disponible</span>
              </div>
            )}

            {/* Badge oferta — esquina inferior izquierda */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <div className="bg-ven-yellow text-black px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5 shadow-lg">
                <Zap size={11} fill="currentColor" /> Oferta Relámpago
              </div>
              {store && (
                <div className="bg-black/60 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg border border-white/10">
                  <Store size={10} className="text-ven-yellow" /> {store.name}
                </div>
              )}
            </div>

            {/* Badge ahorro — esquina superior derecha */}
            {savings && (
              <div className="absolute top-4 right-4 bg-ven-red text-white px-3 py-2 rounded-xl shadow-lg border border-white/20 text-center leading-none">
                <p className="text-[8px] font-black uppercase tracking-wide opacity-80 mb-0.5">Ahorrás</p>
                <p className="text-[15px] font-black">${savings.toLocaleString('es-AR')}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── INFO PRINCIPAL ────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-2 text-venezuela-brown">
              {combo.name}
            </h1>
            {combo.usageInfo && (
              <p className="text-gray-500 text-sm italic leading-relaxed">
                "{combo.usageInfo}"
              </p>
            )}
          </div>

          {/* Bloque de precio + CTA */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/8 backdrop-blur-md shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1.5">Precio del Combo</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-black text-white tracking-tighter leading-none">
                    ${combo.price.toLocaleString('es-AR')}
                  </p>
                  {combo.oldPrice && (
                    <p className="text-sm text-gray-600 line-through font-bold">
                      ${combo.oldPrice.toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
              </div>
              {showLoyalty && (
                <div className="bg-ven-yellow/10 border border-ven-yellow/20 px-4 py-3 rounded-xl text-center shrink-0">
                  <p className="text-[9px] text-ven-yellow font-black uppercase tracking-widest mb-1">Club Puntos</p>
                  <p className="text-xl font-black text-ven-yellow leading-none">+{pointsEarned}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { onAddToCart(combo, combo.storeId); alert("¡Combo agregado al pedido!"); }}
                className="w-full bg-gradient-to-r from-[#F58220] to-[#E86D00] text-white py-5 rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-3 uppercase border border-white/10"
              >
                <Plus size={20} strokeWidth={3} />
                Agregar al pedido
              </button>

              <button
                onClick={handleGoToStore}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 py-3.5 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase border border-white/5"
              >
                Seguir agregando productos
                <ArrowRight size={13} />
              </button>

              <p className="text-[9px] text-gray-600 font-bold italic text-center leading-relaxed uppercase tracking-widest px-2">
                Disponibilidad confirmada por el local al momento del pedido.
              </p>
            </div>
          </div>

          {/* Progreso del Club */}
          {showLoyalty && (
            <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Club: {userPoints} pts
                </span>
                <Trophy size={14} className="text-venezuela-orange" />
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-venezuela-orange rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── QUÉ INCLUYE ───────────────────────────── */}
      {comboItems.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-black uppercase tracking-tight mb-5 flex items-center gap-2.5 text-venezuela-brown">
            <PackageCheck className="text-venezuela-orange" size={20} />
            ¿Qué incluye este combo?
          </h3>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {comboItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/[0.03] hover:bg-white/[0.06] px-4 py-3.5 rounded-2xl border border-white/5 flex items-center gap-3 transition-colors"
              >
                <span className="text-xl shrink-0 w-8 text-center leading-none">{item.emoji || '✓'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white leading-none mb-0.5 truncate">{item.name}</p>
                  {(item.qty || item.yield) && (
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {item.qty}{item.yield ? ` · rinde ${item.yield}` : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionDetailView;
