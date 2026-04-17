
import React, { useState, useMemo } from 'react';
import { MapPin, Star, ChevronRight, ArrowLeft, Clock, Search, Zap, CheckCircle, Sparkles } from 'lucide-react';

// Descuentos deterministas por posición — solo visual en home preview
const DISCOUNTS_PREMIUM = [20, 25, 30, 15];
const DISCOUNTS_BASIC   = [10, 12, 15, 18];
function getStoreDiscount(plan: string, idx: number): number {
  return plan === 'premium'
    ? DISCOUNTS_PREMIUM[idx % DISCOUNTS_PREMIUM.length]
    : DISCOUNTS_BASIC[idx % DISCOUNTS_BASIC.length];
}
import { PartnerStore } from '../types';
import { useNavigate } from 'react-router-dom';
import { useOrderCounts } from '../lib/hooks/useOrderCounts';
import PromoDetailModal, { PromoEntry } from './PromoDetailModal';
import DeliveryZonesModal from './DeliveryZonesModal';
import storesPromotions from '../data/stores-promotions.json' assert { type: 'json' };
import storesDelivery from '../data/stores-delivery.json' assert { type: 'json' };

type DeliveryEntry = { freeDelivery: boolean; zones?: string[] };
const deliveryData = storesDelivery as unknown as Record<string, DeliveryEntry>;
const promoData = storesPromotions as unknown as Record<string, PromoEntry>;

function hasFreeDelivery(storeId: string): boolean {
  return deliveryData[storeId]?.freeDelivery === true;
}
function getActivePromo(storeId: string): PromoEntry | null {
  const promo = promoData[storeId];
  if (!promo || !promo.validUntil) return null;
  return new Date(promo.validUntil) > new Date() ? promo : null;
}

interface PartnerStoresProps {
  stores: PartnerStore[];
  onViewAll?: () => void;
  onOpenMap: (store: PartnerStore) => void;
  limit?: number;
  isFullView?: boolean;
}

const PartnerStores: React.FC<PartnerStoresProps> = ({ stores, onViewAll, onOpenMap, limit = 6, isFullView = false }) => {
  const navigate = useNavigate();
  const orderCounts = useOrderCounts();
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoModal, setPromoModal] = useState<{ store: PartnerStore; promo: PromoEntry } | null>(null);
  const [deliveryModal, setDeliveryModal] = useState<PartnerStore | null>(null);

  const HIDDEN_TAGS = ['Pasapalos', 'Snacks'];

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add('Todos');
    stores.forEach(store => {
      store.tags?.forEach(tag => {
        if (!HIDDEN_TAGS.includes(tag)) tags.add(tag);
      });
    });
    return Array.from(tags);
  }, [stores]);

  const filteredLocales = useMemo(() => {
    return stores.filter(store => {
      const matchesTag = selectedTag === 'Todos' || store.tags?.includes(selectedTag);
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [stores, selectedTag, searchQuery]);

  const displayedLocales = useMemo(() => {
    if (isFullView) return filteredLocales;
    // Priorizar locales premium en el Home
    const premium = stores.filter(s => s.plan === 'premium');
    const prepared = stores.filter(s => s.isPreparedFood && s.plan !== 'premium');
    return [...premium, ...prepared].slice(0, limit);
  }, [stores, isFullView, filteredLocales, limit]);

  const MarketplaceCard: React.FC<{ store: PartnerStore }> = ({ store }) => {
    const activePromo = getActivePromo(store.id);
    return (
      <div
        onClick={() => {
          const win = window as unknown as { encasaTrack?: (e: string, d: Record<string, unknown>) => void };
          win.encasaTrack?.('element_clicked', { element_type: 'store', element_id: store.id, element_name: store.name, timestamp: Date.now() });
          onOpenMap(store);
        }}
        className={`group bg-white rounded-[32px] border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer flex flex-col shadow-2xl ${store.plan === 'premium' ? 'border-ven-yellow/30 shadow-ven-yellow/10 hover:shadow-[0_16px_40px_rgba(212,175,55,0.4)]' : 'border-black/5 hover:border-ven-yellow/50 hover:shadow-[0_16px_40px_rgba(212,175,55,0.4)]'}`}
      >
        <div className="aspect-[4/3] overflow-hidden relative">
          <img src={store.img} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <div className="bg-black/30 backdrop-blur-sm text-white/55 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wide flex items-center gap-0.5 border border-white/10">
              <CheckCircle size={6} /> VERIFICADO
            </div>
            {store.plan === 'premium' && (
              <div className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-[length:200%_auto] animate-shimmer text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-ven-yellow/40 border border-white/30">
                <Zap size={8} fill="currentColor" /> RECOMENDADO
              </div>
            )}
            {activePromo && (
              <div
                className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-[length:200%_auto] animate-shimmer text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg shadow-orange-500/40 border border-white/20 cursor-pointer"
                onClick={e => { e.stopPropagation(); setPromoModal({ store, promo: activePromo }); }}
              >
                🔥 OFERTA
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/20">
            <Star size={10} className="fill-ven-yellow text-ven-yellow" />
            <span className="text-[11px] font-black text-white">{store.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <h3 className="font-black text-venezuela-brown uppercase tracking-tight truncate mb-1 text-sm md:text-base group-hover:text-ven-yellow transition-colors">{store.name}</h3>
          {activePromo && (
            <div
              className="bg-orange-50 border border-orange-200 rounded-xl px-2.5 py-1.5 mb-2 flex items-center gap-1.5 cursor-pointer hover:bg-orange-100 transition-colors animate-promo-glow active:scale-95"
              onClick={e => { e.stopPropagation(); setPromoModal({ store, promo: activePromo }); }}
            >
              <span className="text-[10px] shrink-0">🔥</span>
              <p className="text-[8px] font-black text-orange-600 uppercase tracking-wide truncate flex-1">{activePromo.label}</p>
              <ChevronRight size={9} className="text-orange-400 shrink-0" />
            </div>
          )}
          {orderCounts[store.id] > 0 && (
            <p className="text-[9px] font-bold text-gray-400 flex items-center gap-1 mb-1">
              📦 {orderCounts[store.id]} pedidos este mes
            </p>
          )}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
              <MapPin size={10} className="text-ven-red shrink-0" /> {store.neighborhood}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
              <Clock size={10} className="text-ven-yellow shrink-0" /> {store.deliveryTime || '30-45 min'}
            </div>
          </div>
          <div className="bg-ven-yellow/10 border border-ven-yellow/20 rounded-lg px-2 py-1.5">
            <p className="text-[8px] font-black text-ven-yellow uppercase tracking-widest text-center">
              🛵 {store.coverageArea || 'CABA'}
            </p>
          </div>
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
          <div className="w-full bg-black/5 py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-ven-yellow group-hover:bg-gradient-to-r group-hover:from-ven-yellow group-hover:to-[#C9A227] group-hover:text-white transition-all shadow-sm">
            Ver local
          </div>
        </div>
      </div>
    );
  };

  const PreviewCard: React.FC<{ store: PartnerStore; idx: number }> = ({ store, idx }) => {
    const activePromo = getActivePromo(store.id);
    const discount    = getStoreDiscount(store.plan, idx);
    return (
      <div
        onClick={() => onOpenMap(store)}
        className="group bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* Imagen */}
        <div className="aspect-[4/3] overflow-hidden relative">
          <img src={store.img} alt={store.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {/* Badge descuento */}
          <div className="absolute top-2 left-2 bg-white text-gray-900 font-bold text-xs rounded-full px-2 py-0.5 shadow-sm flex items-center gap-1">
            {discount}% OFF 🎁
          </div>
          {/* Badge premium */}
          {store.plan === 'premium' && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-[#D4AF37] to-[#E5C76B] text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide flex items-center gap-1 shadow-sm">
              <Zap size={8} fill="currentColor" /> TOP
            </div>
          )}
          {/* Rating */}
          {!store.plan || store.plan !== 'premium' ? (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={9} className="fill-ven-yellow text-ven-yellow" />
              <span className="text-[10px] font-black text-white">{store.rating.toFixed(1)}</span>
            </div>
          ) : (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={9} className="fill-ven-yellow text-ven-yellow" />
              <span className="text-[10px] font-black text-white">{store.rating.toFixed(1)}</span>
            </div>
          )}
          {activePromo && (
            <div
              className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase cursor-pointer"
              onClick={e => { e.stopPropagation(); setPromoModal({ store, promo: activePromo }); }}
            >
              🔥 OFERTA
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-bold text-gray-900 text-sm truncate">{store.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-xs text-gray-500">{store.rating.toFixed(1)} ({store.review_count})</span>
            <span className="text-gray-300 mx-1">·</span>
            <span className="text-xs text-gray-400 truncate">🚶 {store.neighborhood}</span>
          </div>
          {hasFreeDelivery(store.id) && (
            <span className="text-[9px] text-emerald-600 font-semibold mt-1">🚚 Delivery gratis</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
    <section className={`bg-venezuela-dark transition-all duration-500 ${isFullView ? 'min-h-screen pt-4 pb-24' : 'py-16'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {isFullView ? (
          <div className="animate-in fade-in duration-700">
            <div className="mb-8 space-y-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-black/5 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-ven-yellow hover:text-white transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-black text-venezuela-brown tracking-tighter uppercase leading-none">Locales <span className="text-ven-yellow">Vene</span></h2>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1.5">Locales Amigos Verificados</p>
                </div>
                <div className="w-10" />
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  placeholder="Busca locales o barrios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-ven-yellow transition-all placeholder:text-gray-400 text-venezuela-brown"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedTag === tag 
                        ? 'bg-ven-yellow border-ven-yellow text-white shadow-lg shadow-yellow-500/20' 
                        : 'bg-black/5 border-black/5 text-gray-600 hover:border-black/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {filteredLocales.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {filteredLocales.map(store => (
                  <MarketplaceCard key={store.id} store={store} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-700">
                  <Search size={32} />
                </div>
                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">No encontramos locales con esa búsqueda</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Header "Los más elegidos" */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-gray-900">Los más elegidos 💛</h2>
                <p className="text-xs text-gray-400 mt-0.5">Locales venezolanos verificados en CABA</p>
              </div>
              {onViewAll && (
                <button
                  onClick={onViewAll}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-ven-yellow transition-colors"
                >
                  Ver todos <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {displayedLocales.map((store, idx) => (
                <PreviewCard key={store.id} store={store} idx={idx} />
              ))}
            </div>

            {/* Nuevos en EnCasa */}
            {(() => {
              const nuevos = stores.filter(s => s.plan === 'basic' && (s.review_count ?? 999) < 50);
              if (nuevos.length === 0) return null;
              return (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-ven-yellow" />
                    <h2 className="font-bold text-lg text-gray-900">Nuevos en EnCasa ✨</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                    {nuevos.map((store, idx) => (
                      <PreviewCard key={store.id} store={store} idx={idx + 10} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-3 opacity-40">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Sistema de Delivery Verificado</p>
           </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        @keyframes promo-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
          50% { box-shadow: 0 0 0 3px rgba(249,115,22,0.3); }
        }
        .animate-promo-glow { animation: promo-glow 2s ease-in-out infinite; }
        @keyframes delivery-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50% { box-shadow: 0 0 0 3px rgba(16,185,129,0.25); }
        }
        .animate-delivery-glow { animation: delivery-glow 2.5s ease-in-out infinite; }
      `}</style>
    </section>

    {promoModal && (
      <PromoDetailModal
        store={promoModal.store}
        promo={promoModal.promo}
        onClose={() => setPromoModal(null)}
        onGoToStore={() => { setPromoModal(null); onOpenMap(promoModal.store); }}
      />
    )}
    {deliveryModal && (
      <DeliveryZonesModal
        store={deliveryModal}
        onClose={() => setDeliveryModal(null)}
        onGoToStore={() => { setDeliveryModal(null); onOpenMap(deliveryModal); }}
      />
    )}
    </>
  );
};

export default PartnerStores;
