import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Star, MapPin, Clock, ChevronRight, Zap, SlidersHorizontal } from 'lucide-react';
import { useStores } from '../lib/hooks/useStores';
import { useProducts, categories as CAT_LIST } from '../lib/hooks/useProducts';
import { PartnerStore } from '../types';

// Descuentos deterministas por posición (igual que PartnerStores)
const DISCOUNTS_P = [20, 25, 30, 15, 22];
const DISCOUNTS_B = [10, 12, 15, 18, 10];
function getDiscount(plan: string, idx: number) {
  return plan === 'premium'
    ? DISCOUNTS_P[idx % DISCOUNTS_P.length]
    : DISCOUNTS_B[idx % DISCOUNTS_B.length];
}

// Distancia ficticia determinista por store (hasta tener GPS real)
const FAKE_KM = [0.8, 1.2, 1.5, 2.0, 2.4, 3.1, 0.6, 1.9, 2.7, 1.1];
function getFakeKm(idx: number) {
  return FAKE_KM[idx % FAKE_KM.length];
}

const BARRIOS = ['Todos', 'Palermo', 'Caballito', 'Almagro', 'Once', 'Belgrano', 'Villa Crespo', 'Boedo', 'Balvanera'];

const CategoryStoresView: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { stores } = useStores();
  const { allProducts } = useProducts();

  const [search, setSearch] = useState('');
  const [barrio, setBarrio] = useState('Todos');
  const [sortBy, setSortBy] = useState<'cercanos' | 'rating' | 'descuento'>('cercanos');
  const [showFilters, setShowFilters] = useState(false);

  const categoryName = decodeURIComponent(name || '');
  const catMeta = CAT_LIST.find(c => c.name === categoryName);

  // Stores que tienen productos de esta categoría
  const storesWithCategory = useMemo(() => {
    const storeIdsWithCat = new Set<string>();
    allProducts.forEach(p => {
      if (p.category !== categoryName) return;
      if (p.storeId) storeIdsWithCat.add(p.storeId);
      p.availableInStoreIds?.forEach(id => storeIdsWithCat.add(id));
    });

    // Si no hay matches exactos (demo mode), mostrar todos los de tipo 'productos'
    const base = storeIdsWithCat.size > 0
      ? stores.filter(s => storeIdsWithCat.has(s.id))
      : stores.filter(s => s.type === 'productos');

    return base.length > 0 ? base : stores;
  }, [stores, allProducts, categoryName]);

  const filtered = useMemo(() => {
    let result = [...storesWithCategory];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) || (s.neighborhood || '').toLowerCase().includes(q)
      );
    }
    if (barrio !== 'Todos') {
      result = result.filter(s => (s.neighborhood || '').toLowerCase().includes(barrio.toLowerCase()));
    }
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'descuento') result.sort((a, b) => (b.plan === 'premium' ? 1 : 0) - (a.plan === 'premium' ? 1 : 0));

    return result;
  }, [storesWithCategory, search, barrio, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-24">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 hover:bg-[#6B1D1D] hover:text-white rounded-2xl flex items-center justify-center text-gray-600 transition-all active:scale-90 shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-[#2E1A14] leading-tight tracking-tight truncate">
              {categoryName}
            </h1>
            <p className="text-[11px] text-gray-400 font-semibold">
              {filtered.length} local{filtered.length !== 1 ? 'es' : ''} disponible{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          {catMeta?.image && (
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img src={catMeta.image} alt={categoryName} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Buscador */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar locales..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#2E1A14] placeholder-gray-400 focus:outline-none focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/20 transition-all"
          />
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {(['cercanos', 'rating', 'descuento'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all border ${
                sortBy === opt
                  ? 'bg-[#6B1D1D] border-[#6B1D1D] text-white'
                  : 'bg-gray-100 border-gray-100 text-gray-500 hover:border-gray-300'
              }`}
            >
              {opt === 'cercanos' ? '📍 Más cercanos' : opt === 'rating' ? '⭐ Mejor rating' : '🔥 Mayor descuento'}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all border ${
              barrio !== 'Todos'
                ? 'bg-[#F4C542] border-[#F4C542] text-black'
                : 'bg-gray-100 border-gray-100 text-gray-500 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={10} /> Barrio
          </button>
        </div>

        {/* Filtro barrios (desplegable) */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 pb-0.5">
            {BARRIOS.map(b => (
              <button
                key={b}
                onClick={() => { setBarrio(b); setShowFilters(false); }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap ${
                  barrio === b
                    ? 'bg-[#2E1A14] border-[#2E1A14] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de locales */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🏪</div>
            <p className="font-bold text-gray-500 text-sm">No hay locales disponibles</p>
            <button
              onClick={() => { setSearch(''); setBarrio('Todos'); }}
              className="text-[#6B1D1D] text-xs font-black uppercase tracking-widest"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filtered.map((store, idx) => (
            <StoreCard key={store.id} store={store} idx={idx} onSelect={() => {
              sessionStorage.setItem(`encasa_scroll_${pathname}`, String(window.scrollY));
              navigate(`/tienda/${store.id}`);
            }} />
          ))
        )}
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};

const StoreCard: React.FC<{ store: PartnerStore; idx: number; onSelect: () => void }> = ({ store, idx, onSelect }) => {
  const discount = getDiscount(store.plan, idx);
  const km = getFakeKm(idx);

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.99] transition-all hover:shadow-md"
    >
      {/* Imagen */}
      <div className="relative h-36 bg-gray-100 overflow-hidden">
        <img
          src={store.img}
          alt={store.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge descuento */}
        <div className="absolute top-3 left-3 bg-white text-[#2E1A14] font-black text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          🎁 {discount}% OFF
        </div>

        {/* Badge premium */}
        {store.plan === 'premium' && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-[#F4C542] to-[#F4C542] text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wide">
            <Zap size={8} fill="currentColor" /> Top
          </div>
        )}

        {/* Tiempo de entrega sobre imagen */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock size={10} /> {store.deliveryTime || '30-45 min'}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Logo pequeño */}
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm -mt-7 ring-2 ring-white">
          <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-[#2E1A14] text-sm leading-tight truncate">{store.name}</h3>
            <ChevronRight size={14} className="text-gray-300 shrink-0 mt-0.5" />
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-600">{store.rating.toFixed(1)}</span>
              <span className="text-[10px] text-gray-400">({store.review_count})</span>
            </div>

            {/* Distancia */}
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
              <MapPin size={10} className="text-[#6B1D1D]" />
              {km} km · {store.neighborhood}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStoresView;
