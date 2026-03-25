import React, { useState } from 'react';
import { ArrowRight, Percent, Zap, Flame, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../lib/hooks/useProducts';
import { useStores } from '../lib/hooks/useStores';

const Offers: React.FC = () => {
  const navigate = useNavigate();
  const { stores } = useStores();
  const { allProducts, promoCombos, loading } = useProducts();
  const [isComboRailPaused, setIsComboRailPaused] = useState(false);
  
  // Secciones estilo app — datos reales de Supabase ya cacheados, sin nuevas requests
  const sections = [
    { emoji: '\uD83D\uDD25', label: 'Lo m\u00e1s pedido',   items: allProducts.slice(0, 8) },
    { emoji: '\uD83C\uDD95', label: 'Nuevos ingresos', items: allProducts.slice(4, 12) },
    { emoji: '\uD83D\uDFE1', label: 'Ofertas del d\u00eda', items: allProducts.filter(p => !!p.oldPrice).slice(0, 8) },
    { emoji: '\uD83D\uDCB8', label: 'Todo a $5.999',   items: allProducts.filter(p => p.price <= 5999).slice(0, 8) },
  ].filter(s => s.items.length > 0);

  const doublePromos = [...promoCombos, ...promoCombos, ...promoCombos];

  const debugPanel = import.meta.env.DEV && !loading && promoCombos.length === 0 ? (
    <div style={{ background: '#ff0', color: '#000', padding: '8px', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>
      Debug: 0 combos cargados | allProducts={allProducts.length} | loading={String(loading)}
    </div>
  ) : null;

  return (
    <section className="py-16 bg-venezuela-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ven-yellow/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ven-blue/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ven-red/10 border border-ven-red/20 text-ven-red text-[10px] font-black uppercase tracking-widest">
              <Percent size={12} />
              Ahorro Real
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-venezuela-brown">
              Ofertas <span className="text-ven-yellow">Imperdibles</span>
            </h2>
            <p className="text-gray-600 max-w-md font-medium text-sm md:text-base">
              Los mejores precios en tus productos favoritos. ¡Solo por tiempo limitado!
            </p>
          </div>
          <button 
            onClick={() => navigate('/catalog')}
            className="group flex items-center gap-3 bg-black/5 hover:bg-black/10 border border-black/10 px-6 py-3 rounded-2xl transition-all active:scale-95 text-venezuela-brown"
          >
            <span className="text-xs font-black uppercase tracking-widest">Ver todo el catálogo</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Secciones horizontales estilo app */}
        <div className="space-y-10 mb-16">
          {sections.map(({ emoji, label, items }) => (
            <div key={label}>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-venezuela-brown mb-4">
                {emoji} {label}
              </h3>
              <div
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 -mx-6 px-6"
                style={{ touchAction: 'pan-x' }}
              >
                {items.map((product) => (
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
          ))}
        </div>

        {debugPanel}
        <div className="relative pt-16 border-t border-black/5 overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-ven-yellow rounded-xl flex items-center justify-center text-white shadow-xl">
              <Flame size={22} className="animate-pulse" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Combos <span className="text-ven-yellow">Relámpago</span></h3>
          </div>

          <div
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar md:overflow-x-hidden -mx-6 px-4 md:mx-0 md:px-0"
            style={{ touchAction: 'pan-x' }}
            onMouseEnter={() => setIsComboRailPaused(true)}
            onMouseLeave={() => setIsComboRailPaused(false)}
            onFocusCapture={() => setIsComboRailPaused(true)}
            onBlurCapture={() => setIsComboRailPaused(false)}
            onTouchStart={() => setIsComboRailPaused(true)}
            onTouchEnd={() => setIsComboRailPaused(false)}
            onTouchCancel={() => setIsComboRailPaused(false)}
          >
            <div className={`flex gap-4 py-6 w-max md:gap-8 ${isComboRailPaused ? '' : 'md:animate-marquee-reverse'}`}>
              {doublePromos.map((promo, idx) => {
                const store = stores.find(s => s.id === promo.storeId);
                const discountPercent = promo.oldPrice ? Math.round(((promo.oldPrice - promo.price) / promo.oldPrice) * 100) : 15;

                return (
                  <div
                    key={`${promo.id}-${idx}`}
                    onClick={() => navigate(`/promotion/${promo.id}`)}
                    className="snap-start shrink-0 inline-block w-[260px] max-w-[280px] bg-white border-2 border-black/5 rounded-[40px] p-4 group cursor-pointer hover:border-ven-yellow transition-all shadow-2xl backdrop-blur-sm hover:scale-[1.03] hover:-translate-y-1"
                  >
                    <div className="relative h-44 rounded-[32px] overflow-hidden mb-4 border border-black/5 bg-white">
                      <img
                        src={promo.img}
                        alt={promo.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <div className="bg-white/40 backdrop-blur-md text-venezuela-brown px-2.5 py-1 rounded-xl text-[8px] font-black uppercase flex items-center gap-1 shadow-2xl border border-white/20">
                          <Zap size={10} fill="currentColor" className="text-ven-yellow" /> Relámpago
                        </div>
                        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-2.5 py-1 rounded-xl text-[8px] font-black uppercase flex items-center gap-1 shadow-md shadow-red-500/50 border border-white/20">
                          <Flame size={10} fill="currentColor" /> -{discountPercent}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 opacity-80">
                        <Store size={12} className="text-ven-yellow" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] truncate max-w-[140px] text-gray-500">{store?.name || 'Local Vene'}</span>
                      </div>
                      <h4 className="text-sm font-black text-venezuela-brown uppercase tracking-tight truncate group-hover:text-venezuela-orange transition-colors">{promo.name}</h4>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          {promo.oldPrice && <span className="text-[9px] text-gray-300 line-through font-bold mb-0.5">${promo.oldPrice}</span>}
                          <span className="text-venezuela-orange font-black text-2xl tracking-tighter">${promo.price}</span>
                        </div>
                        <div className="w-10 h-10 bg-black/5 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-ven-yellow group-hover:to-venezuela-orange group-hover:text-white transition-all shadow-md">
                          <ArrowRight size={18} />
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
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (min-width: 768px) {
          .md\\:animate-marquee-reverse,
          .animate-marquee-reverse {
            display: flex;
            width: max-content;
            animation: marquee-reverse 30s linear infinite;
          }
        }

        @media (max-width: 767px) {
          .md\\:animate-marquee-reverse {
            animation: none;
            width: auto;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-reverse {
            animation: none !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Offers;