import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Zap, Sparkles, ArrowLeft, LayoutGrid, Utensils, Beaker, IceCream, Pizza, Package, MapPin, ChevronRight, Star, Clock, CheckCircle, Truck } from 'lucide-react';
import { Product, PartnerStore } from '../types';
import ProductDetailView from './ProductDetailView';
import PromoDetailModal, { PromoEntry } from './PromoDetailModal';
import DeliveryZonesModal from './DeliveryZonesModal';
import { useProducts } from '../lib/hooks/useProducts';
import { useOrderCounts } from '../lib/hooks/useOrderCounts';
import { useNavigate, useLocation } from 'react-router-dom';
import storesPromotions from '../data/stores-promotions.json' assert { type: 'json' };
import storesDelivery from '../data/stores-delivery.json' assert { type: 'json' };

type DeliveryEntry = { freeDelivery: boolean; zones?: string[] };
const deliveryData = storesDelivery as unknown as Record<string, DeliveryEntry>;
function hasFreeDelivery(storeId: string): boolean {
  return deliveryData[storeId]?.freeDelivery === true;
}

const promoData = storesPromotions as unknown as Record<string, PromoEntry>;
function getActivePromo(storeId: string): PromoEntry | null {
  const promo = promoData[storeId];
  if (!promo || !promo.validUntil) return null;
  return new Date(promo.validUntil) > new Date() ? promo : null;
}


/// MODO DEMO: Si es true, todos los locales muestran todos los productos
const DEMO_MODE = true;

const categoryIcons: Record<string, React.ElementType> = {
  'Todos': LayoutGrid,
  'Harinas': Utensils,
  'Lácteos': Pizza,
  'Congelados': IceCream,
  'Bebidas': Beaker,
  'Chucherías': Sparkles,
  'Salsas': Utensils,
  'Almacén': Package,
  'Tequeños y Quesos': Pizza
};

interface CatalogViewProps {
  stores: PartnerStore[];
  onAddToCart: (product: Product, storeId?: string) => void;
  selectedStore: PartnerStore | null;
  onSelectStore: (store: PartnerStore | null) => void;
}

const CatalogView: React.FC<CatalogViewProps> = ({ stores, onAddToCart, selectedStore, onSelectStore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allProducts } = useProducts();
  const orderCounts = useOrderCounts();
  const [category, setCategory] = useState(location.state?.category || 'Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [promoModal, setPromoModal] = useState<{ store: PartnerStore; promo: PromoEntry } | null>(null);
  const [deliveryModal, setDeliveryModal] = useState<PartnerStore | null>(null);

  const track = (type: string, id: string, name: string) => {
    const win = window as unknown as { encasaTrack?: (e: string, d: Record<string, unknown>) => void };
    win.encasaTrack?.('element_clicked', { element_type: type, element_id: id, element_name: name, timestamp: Date.now() });
  };

  // Scroll al inicio cuando se selecciona un local
  useEffect(() => {
    if (selectedStore) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const win = window as unknown as { encasaTrack?: (event: string, data: Record<string, unknown>) => void };
      win.encasaTrack?.('store_view', { store_id: selectedStore.id, store_name: selectedStore.name });
    }
  }, [selectedStore]);

  // Filtrado de Locales por Producto (Marketplace Inteligente)
  const displayedStores = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let baseStores = stores;

    // 1. Filtrar por Categoría (si viene de la navegación de categorías)
    if (category !== 'Todos') {
      const storesWithCategory = new Set(
        allProducts
          .filter(p => p.category === category)
          .flatMap(p => p.availableInStoreIds || [])
      );
      baseStores = baseStores.filter(s => storesWithCategory.has(s.id));
    }

    // 2. Filtrar por término de búsqueda
    if (term !== '') {
      // 1. Encontrar IDs de locales que tienen productos que coinciden con la búsqueda
      const matchingProductStoreIds = new Set(
        allProducts
          .filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            (p.usageInfo && p.usageInfo.toLowerCase().includes(term))
          )
          .flatMap(p => p.availableInStoreIds || [])
      );

      // 2. Filtrar locales: que tengan el producto O que el nombre/barrio del local coincida
      baseStores = baseStores.filter(s =>
        matchingProductStoreIds.has(s.id) ||
        s.name.toLowerCase().includes(term) ||
        s.neighborhood?.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term)
      );
    }

    // Ordenar: Premium primero, pero manteniendo el filtro
    return [...baseStores].sort((a, b) => {
      if (a.plan === 'premium' && b.plan !== 'premium') return -1;
      if (a.plan !== 'premium' && b.plan === 'premium') return 1;
      return 0;
    });
  }, [stores, searchTerm, category, allProducts]);

  const premiumStores = useMemo(() => {
    return stores.filter(s => s.plan === 'premium');
  }, [stores]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesCat = category === 'Todos' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Lógica de filtrado por Local + DEMO_MODE + Regla Legacy
      let matchesStore = true;
      if (!DEMO_MODE && selectedStore) {
        const hasStoreIds = p.availableInStoreIds && p.availableInStoreIds.length > 0;
        if (hasStoreIds && p.availableInStoreIds) {
          matchesStore = p.availableInStoreIds.includes(selectedStore.id);
        } else {
          // REGLA LEGACY: Si no tiene IDs o está vacío, se muestra siempre (compatibilidad)
          matchesStore = true;
        }
      }

      return matchesCat && matchesSearch && matchesStore;
    });
  }, [category, searchTerm, selectedStore, allProducts]);

  const categories = ['Todos', 'Harinas', 'Lácteos', 'Congelados', 'Bebidas', 'Chucherías', 'Salsas', 'Almacén', 'Promociones'];

  return (
    <>
    <div className={`max-w-7xl mx-auto px-4 md:px-6 ${selectedStore ? 'pt-0 pb-12' : 'py-8 md:py-12'}`}>
      {viewingProduct && (
        <ProductDetailView
          product={viewingProduct}
          allProducts={allProducts}
          stores={stores}
          onClose={() => setViewingProduct(null)}
          onAddToCart={onAddToCart}
          onSelectStore={(s) => {
            onSelectStore(s);
            setViewingProduct(null);
          }}
          storeId={selectedStore?.id}
        />
      )}

      {/* STORE HERO — solo cuando hay local seleccionado */}
      {selectedStore && (
        <div className="-mx-4 md:-mx-6 animate-in fade-in duration-500">
          {/* Imagen hero del local */}
          <div className="relative h-52 md:h-72 overflow-hidden">
            <img
              src={selectedStore.img}
              alt={selectedStore.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Botón volver */}
            <button
              onClick={() => onSelectStore(null)}
              className="absolute top-4 left-4 p-2.5 bg-black/40 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-black/60 transition-all active:scale-90 shadow-lg"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Badges top-right */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
              <div className="bg-black/30 backdrop-blur-sm text-white/60 px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wide flex items-center gap-1 border border-white/10">
                <CheckCircle size={7} /> VERIFICADO
              </div>
              {selectedStore.plan === 'premium' && (
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#C9A227] text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wide flex items-center gap-1 border border-white/20 shadow-md">
                  <Zap size={9} fill="currentColor" /> PREMIUM
                </div>
              )}
            </div>

            {/* Nombre + rating sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 md:px-6 md:pb-6">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-1.5">
                {selectedStore.name}
              </h1>
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star size={13} className="fill-ven-yellow text-ven-yellow" />
                  <span className="text-sm font-black text-white">{selectedStore.rating.toFixed(1)}</span>
                  <span className="text-xs text-white/60 font-medium">({selectedStore.review_count})</span>
                </div>
                <span className="text-white/30 font-bold">·</span>
                <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold">
                  <MapPin size={11} className="text-ven-yellow shrink-0" />
                  {selectedStore.neighborhood}
                </div>
              </div>
            </div>
          </div>

          {/* Chips de info del local */}
          <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <Clock size={13} className="text-ven-yellow shrink-0" />
              <span className="text-[11px] font-black text-gray-700">{selectedStore.deliveryTime || '30-45 min'}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
              <MapPin size={13} className="text-ven-yellow shrink-0" />
              <span className="text-[11px] font-black text-gray-700">{selectedStore.coverageArea || 'CABA'}</span>
            </div>
            {hasFreeDelivery(selectedStore.id) && (
              <button
                onClick={() => setDeliveryModal(selectedStore)}
                className="flex items-center gap-2 shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors animate-delivery-glow active:scale-95"
              >
                <Truck size={13} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-black text-emerald-700">🚚 Envío gratis</span>
                <ChevronRight size={10} className="text-emerald-400" />
              </button>
            )}
            {(() => { const p = getActivePromo(selectedStore.id); return p ? (
              <button
                onClick={() => setPromoModal({ store: selectedStore, promo: p })}
                className="flex items-center gap-2 shrink-0 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors animate-promo-glow active:scale-95"
              >
                <span className="text-[11px]">🔥</span>
                <span className="text-[11px] font-black text-venezuela-orange">{p.label}</span>
                <ChevronRight size={10} className="text-orange-400" />
              </button>
            ) : null; })()}
          </div>

          {/* Barra sticky: search + categorías tipo tabs */}
          <div className="sticky top-28 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 md:px-6 pt-3 pb-0">
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar en ${selectedStore.name}...`}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-ven-yellow focus:bg-white transition-all text-sm text-gray-800"
              />
            </div>
            <div className="flex gap-0 overflow-x-auto no-scrollbar">
              {categories.map(cat => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { track('category', cat, cat); setCategory(cat); }}
                    className={`shrink-0 px-4 py-2.5 text-[11px] font-black uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${
                      isActive
                        ? 'border-ven-yellow text-ven-yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header marketplace (sin local seleccionado) */}
      {!selectedStore && (
        <div className="flex flex-col gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:bg-ven-yellow hover:text-venezuela-dark transition-all shadow-lg active:scale-90"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none text-venezuela-brown">
                Marketplace Locales
              </h1>
              <p className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-2 italic">
                Busca por local o por tu producto favorito, pana
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué se te antoja hoy? (Harina, Malta, etc.)"
              className="w-full bg-white border border-black/10 rounded-[24px] py-4.5 pl-14 pr-6 focus:outline-none focus:border-ven-yellow transition-all text-sm shadow-inner text-venezuela-brown"
            />
          </div>
        </div>
      )}

      {!selectedStore ? (
        // VISTA DE LOCALES (MARKETPLACE)
        <div className="animate-in fade-in duration-700 space-y-12">
          {/* Sección Premium Destacada */}
          {searchTerm === '' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ven-yellow rounded-lg flex items-center justify-center text-white shadow-lg">
                  <Zap size={18} fill="currentColor" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-venezuela-brown">Locales <span className="text-ven-yellow">Premium</span></h2>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                {premiumStores.map(store => (
                  <div
                    key={`premium-${store.id}`}
                    onClick={() => { track('store', store.id, store.name); onSelectStore(store); }}
                    className="group min-w-[280px] md:min-w-[320px] bg-white rounded-[32px] border-2 border-ven-yellow/30 overflow-hidden transition-all duration-300 hover:border-ven-yellow hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(212,175,55,0.25)] cursor-pointer flex flex-col shadow-2xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={store.img} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                      {/* Badge stack izquierda */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <div className="bg-black/30 backdrop-blur-sm text-white/55 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wide flex items-center gap-0.5 border border-white/10">
                          <CheckCircle size={6} /> VERIFICADO
                        </div>
                        <div className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-[length:200%_auto] animate-shimmer text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-ven-yellow/40 border border-white/30">
                          <Zap size={8} fill="currentColor" /> RECOMENDADO
                        </div>
                        {getActivePromo(store.id) && (
                          <div
                            className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-[length:200%_auto] animate-shimmer text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-orange-500/40 border border-white/20 cursor-pointer"
                            onClick={e => { e.stopPropagation(); const p = getActivePromo(store.id); if (p) setPromoModal({ store, promo: p }); }}
                          >
                            🔥 OFERTA
                          </div>
                        )}
                      </div>
                      {/* Rating derecha */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                        <Star size={13} className="fill-ven-yellow text-ven-yellow" />
                        <span className="text-base font-black text-white">{store.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg md:text-xl font-black text-venezuela-brown leading-tight mb-2 group-hover:text-ven-yellow transition-colors truncate uppercase tracking-tight">{store.name}</h3>
                      {/* Promo activa */}
                      {(() => { const p = getActivePromo(store.id); return p ? (
                        <div
                          className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 mb-3 flex items-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors active:scale-95"
                          onClick={e => { e.stopPropagation(); setPromoModal({ store, promo: p }); }}
                        >
                          <span className="text-[11px] shrink-0">🔥</span>
                          <p className="text-[9px] font-black text-orange-600 uppercase tracking-wide truncate flex-1">{p.label}</p>
                          <ChevronRight size={10} className="text-orange-400 shrink-0" />
                        </div>
                      ) : null; })()}
                      {/* Contador de pedidos */}
                      {orderCounts[store.id] > 0 && (
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mb-3">
                          📦 {orderCounts[store.id]} pedidos este mes
                        </p>
                      )}
                      {/* Info ubicación */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={12} className="text-ven-red shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-wide">{store.neighborhood}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={12} className="text-ven-yellow shrink-0" />
                          <span className="text-[10px] font-bold">{store.deliveryTime || '30-45 min'}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-black/5">
                        {/* Badge cobertura */}
                        <div className="bg-ven-yellow/10 border border-ven-yellow/20 rounded-xl px-3 py-2 mb-2">
                          <p className="text-[9px] font-black text-ven-yellow uppercase tracking-widest text-center">
                            🛵 {store.coverageArea || 'CABA completa'}
                          </p>
                        </div>
                        {/* Badge envío gratis */}
                        {hasFreeDelivery(store.id) && (
                          <div
                            className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-3 cursor-pointer hover:bg-emerald-100 transition-colors animate-delivery-glow flex items-center justify-center gap-2 active:scale-95"
                            onClick={e => { e.stopPropagation(); setDeliveryModal(store); }}
                          >
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">🚚 Delivery gratis</p>
                            <ChevronRight size={9} className="text-emerald-400" />
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <MapPin size={12} className="text-ven-red" /> {store.location}
                          </div>
                          <ChevronRight size={20} className="text-ven-yellow group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter text-venezuela-brown">Todos los <span className="text-gray-500">Locales</span></h2>
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{displayedStores.length} resultados</p>
            </div>
            {displayedStores.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayedStores.map(store => (
                  <div
                    key={store.id}
                    onClick={() => { track('store', store.id, store.name); onSelectStore(store); }}
                    className={`group bg-white rounded-[32px] border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer flex flex-col shadow-2xl ${store.plan === 'premium' ? 'border-ven-yellow/30 shadow-ven-yellow/10 hover:shadow-[0_16px_40px_rgba(212,175,55,0.4)]' : 'border-black/5 hover:border-ven-yellow/50 hover:shadow-[0_16px_40px_rgba(212,175,55,0.4)]'}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={store.img} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {/* LOCAL VERIFICADO — todos los locales activos */}
                        <div className="bg-black/30 backdrop-blur-sm text-white/55 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wide flex items-center gap-0.5 border border-white/10">
                          <CheckCircle size={6} /> VERIFICADO
                        </div>
                        {/* RECOMENDADO — locales premium */}
                        {store.plan === 'premium' && (
                          <div className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-[length:200%_auto] animate-shimmer text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-ven-yellow/40 border border-white/30">
                            <Zap size={8} fill="currentColor" /> RECOMENDADO
                          </div>
                        )}
                        {/* OFERTA — promo activa con validUntil en el futuro */}
                        {getActivePromo(store.id) && (
                          <div
                            className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-[length:200%_auto] animate-shimmer text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-orange-500/40 border border-white/20 cursor-pointer"
                            onClick={e => { e.stopPropagation(); const p = getActivePromo(store.id); if (p) setPromoModal({ store, promo: p }); }}
                          >
                            🔥 OFERTA
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                        <Star size={10} className="fill-ven-yellow text-ven-yellow" />
                        <span className="text-[11px] font-black text-white">{store.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="font-black text-venezuela-brown uppercase tracking-tight truncate mb-1 text-sm md:text-base group-hover:text-ven-yellow transition-colors">{store.name}</h3>
                      {(() => { const p = getActivePromo(store.id); return p ? (
                        <div
                          className="bg-orange-50 border border-orange-200 rounded-xl px-2.5 py-1.5 mb-2 flex items-center gap-1.5 cursor-pointer hover:bg-orange-100 transition-colors active:scale-95"
                          onClick={e => { e.stopPropagation(); setPromoModal({ store, promo: p }); }}
                        >
                          <span className="text-[10px] shrink-0">🔥</span>
                          <p className="text-[8px] font-black text-orange-600 uppercase tracking-wide truncate flex-1">{p.label}</p>
                          <ChevronRight size={9} className="text-orange-400 shrink-0" />
                        </div>
                      ) : null; })()}
                      {orderCounts[store.id] > 0 && (
                        <p className="text-[9px] font-bold text-gray-400 flex items-center gap-1 mb-1">
                          📦 {orderCounts[store.id]} pedidos este mes
                        </p>
                      )}

                      {/* INFO DE UBICACIÓN */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          <MapPin size={10} className="text-ven-red shrink-0" /> {store.neighborhood}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
                          <Clock size={10} className="text-ven-yellow shrink-0" /> {store.deliveryTime || '30-45 min'}
                        </div>
                      </div>

                      {/* BADGE DE COBERTURA */}
                      <div className="bg-ven-yellow/10 border border-ven-yellow/20 rounded-lg px-2 py-1.5">
                        <p className="text-[8px] font-black text-ven-yellow uppercase tracking-widest text-center">
                          🛵 {store.coverageArea || 'CABA'}
                        </p>
                      </div>
                      {/* BADGE ENVÍO GRATIS */}
                      {hasFreeDelivery(store.id) && (
                        <div
                          className="bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5 mt-1.5 mb-auto cursor-pointer hover:bg-emerald-100 transition-colors animate-delivery-glow flex items-center justify-center gap-1.5 active:scale-95"
                          onClick={e => { e.stopPropagation(); setDeliveryModal(store); }}
                        >
                          <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">🚚 Delivery gratis</p>
                          <ChevronRight size={8} className="text-emerald-400" />
                        </div>
                      )}
                    </div>
                    <div className="px-5 pb-5 mt-auto">
                      <div className="w-full bg-black/5 py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-ven-yellow group-hover:bg-gradient-to-r group-hover:from-ven-yellow group-hover:to-[#C9A227] group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-ven-yellow/20">
                        Ver local
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-black/5 rounded-[40px] border border-black/5 flex flex-col items-center gap-4">
                <Package className="text-gray-400" size={48} />
                <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.2em]">No encontramos locales con ese producto, pana.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // VISTA DE PRODUCTOS DEL LOCAL
        <div className="animate-in slide-in-from-right duration-500 -mx-4 md:-mx-6 px-4 md:px-6 bg-gray-50 min-h-[60vh] pb-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 flex flex-col items-center gap-4 mt-4 mx-0">
              <Package className="text-gray-400" size={48} />
              <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.2em]">No hay productos en esta sección, pana.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pt-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => { track('product', String(product.id), product.name); setViewingProduct(product); }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md hover:border-ven-yellow/40 transition-all duration-200 flex flex-col"
                >
                  {/* Imagen con botón + en esquina */}
                  <div className="aspect-square overflow-hidden relative bg-gray-50">
                    <img
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.oldPrice && (
                      <div className="absolute top-2 left-2 bg-venezuela-orange text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                        OFERTA
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          const win = window as unknown as { encasaTrack?: (event: string, data: Record<string, unknown>) => void };
                          win.encasaTrack?.("add_to_cart", {
                            productId: product.id,
                            productName: product.name,
                            price: product.price,
                            category: product.category,
                            storeId: selectedStore?.id || (product as { storeId?: string }).storeId || null,
                            source: "catalog",
                            ts: Date.now(),
                          });
                        } catch (err) {
                          // silencio
                        }
                        onAddToCart(product, selectedStore?.id);
                      }}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-ven-yellow rounded-full flex items-center justify-center shadow-lg shadow-ven-yellow/40 hover:bg-yellow-400 active:scale-90 transition-all border-2 border-white shrink-0"
                    >
                      <Plus size={17} strokeWidth={3} className="text-venezuela-dark" />
                    </button>
                  </div>

                  {/* Info del producto */}
                  <div className="p-3 flex flex-col flex-grow">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{product.category}</p>
                    <h4 className="font-black text-[12px] md:text-[13px] text-gray-900 leading-tight line-clamp-2 mb-auto">{product.name}</h4>
                    <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center gap-1.5">
                      {product.oldPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">${product.oldPrice.toLocaleString('es-AR')}</span>
                      )}
                      <span className="text-[15px] font-black text-gray-900">${product.price.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        @keyframes promo-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
          50% { box-shadow: 0 0 0 3px rgba(249,115,22,0.3), 0 0 10px rgba(249,115,22,0.12); }
        }
        .animate-promo-glow { animation: promo-glow 2s ease-in-out infinite; }
        @keyframes delivery-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50% { box-shadow: 0 0 0 3px rgba(16,185,129,0.25), 0 0 10px rgba(16,185,129,0.1); }
        }
        .animate-delivery-glow { animation: delivery-glow 2.5s ease-in-out infinite; }
      `}</style>
    </div>

    {/* Modal de detalle de promo */}
    {promoModal && (
      <PromoDetailModal
        store={promoModal.store}
        promo={promoModal.promo}
        onClose={() => setPromoModal(null)}
        onGoToStore={() => { setPromoModal(null); onSelectStore(promoModal.store); }}
      />
    )}

    {/* Modal de zonas de delivery gratis */}
    {deliveryModal && (
      <DeliveryZonesModal
        store={deliveryModal}
        onClose={() => setDeliveryModal(null)}
        onGoToStore={() => { setDeliveryModal(null); onSelectStore(deliveryModal); }}
      />
    )}
    </>
  );
};

export default CatalogView;