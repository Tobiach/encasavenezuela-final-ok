import React, { useState } from 'react';
import { ArrowRight, Percent, Zap, Flame, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../lib/hooks/useProducts';
import { useStores } from '../lib/hooks/useStores';
import { getImageUrl } from '../lib/supabase';

const Offers: React.FC = () => {
  const navigate = useNavigate();
  const { stores } = useStores();
  const { allProducts, promoCombos } = useProducts();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Cards de sección — datos reales cacheados de Supabase, sin requests extra
  const sectionCards = [
    {
      key: 'pedido',
      emoji: '🔥', label: 'Lo más pedido',
      subtitle: 'Los favoritos de la comunidad',
      img: getImageUrl('abarrotes_1.png'),
      items: allProducts.slice(0, 8),
    },
    {
      key: 'nuevo',
      emoji: '🆕', label: 'Nuevos ingresos',
      subtitle: 'Descubrí lo nuevo de esta semana',
      img: getImageUrl('harinas1.png'),
      items: allProducts.slice(4, 12),
    },
    {
      key: 'oferta',
      emoji: '🟡', label: 'Ofertas del día',
      subtitle: 'Tiempo limitado',
      img: getImageUrl('golosinas_1.png'),
      items: (() => {
        const withDiscount = allProducts.filter(p => !!p.oldPrice).slice(0, 8);
        return withDiscount.length > 0 ? withDiscount : allProducts.slice(0, 4);
      })(),
    },
    {
      key: 'budget',
      emoji: '💸', label: 'Todo a $5.999',
      subtitle: 'Opciones para comprar y ahorrar',
      img: getImageUrl('snacks1.png'),
      items: allProducts.filter(p => p.price <= 5999).slice(0, 8),
    },
  ].filter(s => s.items.length > 0);

  const activeCard = sectionCards.find(s => s.key === activeSection);

  // Mismo patrón que Promotions.tsx: duplicar items + estado de pausa en touch
  const carouselItems = [...promoCombos, ...promoCombos];
  const [isRailPaused, setIsRailPaused] = useState(false);

  return (
    // ⚠️ SIN overflow-hidden en la section — ese era el bug que bloqueaba el
    // scroll táctil en iOS Safari. Los círculos de blur tienen su propio wrapper.
    <section className="py-16 bg-venezuela-dark relative">
      {/* Círculos decorativos — overflow-hidden solo sobre ellos, no sobre la section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ven-yellow/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ven-blue/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ven-red/10 border border-ven-red/20 text-ven-red text-[10px] font-black uppercase tracking-widest">
              <Percent size={12} />
              Ahorro Real
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-venezuela-brown">
              Explorá según <span className="text-ven-yellow">lo que buscás</span>
            </h2>
            <p className="text-gray-600 max-w-md font-medium text-sm md:text-base">
              Encontrá rápido lo más pedido, novedades, promos del día y opciones para ahorrar.
            </p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="group flex items-center gap-3 bg-black/5 hover:bg-black/10 border border-black/10 px-6 py-3 rounded-2xl transition-all active:scale-95 text-venezuela-brown"
          >
            <span className="text-xs font-black uppercase tracking-widest">Explorar todas las secciones</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cards de sección estilo app — tap para desplegar productos */}
        <div className="mb-16">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {sectionCards.map(card => (
              <div
                key={card.key}
                onClick={() => setActiveSection(activeSection === card.key ? null : card.key)}
                className={`relative rounded-[24px] overflow-hidden h-40 cursor-pointer active:scale-95 transition-all border-2 shadow-xl ${
                  activeSection === card.key
                    ? 'border-ven-yellow shadow-[0_0_24px_rgba(212,175,55,0.35)]'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={card.img}
                  alt={card.label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[11px] font-black text-white uppercase tracking-tight leading-tight">
                    {card.emoji} {card.label}
                  </p>
                  <p className="text-[9px] text-white/70 font-medium mt-0.5 leading-tight line-clamp-2">{card.subtitle}</p>
                </div>
                {activeSection === card.key && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-ven-yellow rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[8px] font-black text-black">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Productos de la sección activa */}
          {activeCard && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-4">
                {activeCard.emoji} {activeCard.label}
              </p>
              <div
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 -mx-6 px-6"
                style={{ touchAction: 'pan-x' }}
              >
                {activeCard.items.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate('/catalog', { state: { category: product.category } })}
                    className="snap-start shrink-0 w-[152px] bg-white border-2 border-black/5 rounded-[24px] p-3 cursor-pointer hover:border-ven-yellow active:scale-95 transition-all"
                  >
                    <div className="aspect-square rounded-[18px] overflow-hidden mb-2 border border-black/5 bg-gray-50">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="block text-[8px] font-black text-ven-yellow uppercase tracking-widest truncate mb-1">
                      {product.category}
                    </span>
                    <p className="text-[11px] font-black text-venezuela-brown uppercase tracking-tight line-clamp-2 leading-tight mb-2">
                      {product.name}
                    </p>
                    <div className="flex flex-col">
                      {product.oldPrice && (
                        <span className="text-[9px] text-gray-400 line-through">${product.oldPrice}</span>
                      )}
                      <span className="text-sm font-black text-venezuela-brown">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative pt-16 border-t border-black/5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-ven-yellow rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Flame size={18} fill="currentColor" className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-venezuela-brown leading-none">
                Combos <span className="text-ven-yellow">Relámpago</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Ofertas por tiempo limitado</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Sale ya</span>
            </div>
          </div>

          {/* Rail — arquitectura idéntica a Promotions.tsx: flex+overflow-x-auto en el mismo div */}
          <div
            className="flex overflow-x-auto no-scrollbar scroll-smooth touch-pan-x -mx-6 px-6 pb-6 pt-2"
            style={{ touchAction: 'pan-x' }}
            onTouchStart={() => setIsRailPaused(true)}
            onTouchEnd={() => setIsRailPaused(false)}
            onTouchCancel={() => setIsRailPaused(false)}
          >
            <div className={`flex w-max gap-5 ${isRailPaused ? '' : 'combo-marquee-anim'}`}>
              {carouselItems.map((promo, idx) => {
                const store = stores.find(s => s.id === promo.storeId);
                const discountPercent = promo.oldPrice
                  ? Math.round(((promo.oldPrice - promo.price) / promo.oldPrice) * 100)
                  : 15;
                return (
                  <div
                    key={`${promo.id}-${idx}`}
                    onClick={() => navigate(`/promotion/${promo.id}`)}
                    style={{ width: '255px', flexShrink: 0 }}
                    className="bg-white border border-black/5 rounded-[26px] p-4 cursor-pointer active:scale-95 transition-transform shadow-lg"
                  >
                    <div className="relative h-48 rounded-[18px] overflow-hidden mb-4 bg-gray-50">
                      <img
                        src={promo.img}
                        alt={promo.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <div className="bg-black/55 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1">
                          <Zap size={9} fill="currentColor" className="text-ven-yellow" /> Relámpago
                        </div>
                        <div className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1">
                          <Flame size={9} fill="currentColor" /> -{discountPercent}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Store size={11} className="text-ven-yellow shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wide truncate text-gray-400">{store?.name || 'Local Vene'}</span>
                      </div>
                      <h4 className="text-[13px] font-black text-venezuela-brown uppercase tracking-tight line-clamp-2 leading-tight">{promo.name}</h4>
                      <div className="flex items-end justify-between pt-1.5">
                        <div>
                          {promo.oldPrice && (
                            <span className="block text-[10px] text-gray-300 line-through font-semibold leading-none mb-0.5">${promo.oldPrice}</span>
                          )}
                          <span className="text-venezuela-orange font-black text-[22px] tracking-tighter leading-none">${promo.price}</span>
                        </div>
                        <div className="w-9 h-9 bg-ven-yellow/10 rounded-xl flex items-center justify-center shrink-0">
                          <ArrowRight size={15} className="text-venezuela-brown" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes combo-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .combo-marquee-anim {
          animation: combo-marquee 32s linear infinite;
        }
        .touch-pan-x {
          touch-action: pan-x;
        }
        @media (prefers-reduced-motion: reduce) {
          .combo-marquee-anim { animation: none !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Offers;
