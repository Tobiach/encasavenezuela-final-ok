
import React from 'react';
import { Tag, ArrowRight, Percent, Zap, Flame, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allProducts, promoCombos } from '../data/catalogData';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { Product } from '../types';

const Offers: React.FC = () => {
  const navigate = useNavigate();
  
  // Seleccionamos algunos productos para mostrar como ofertas (simuladas con descuento)
  const offerProducts = allProducts.slice(0, 4).map((p: Product) => ({
    ...p,
    discount: Math.floor(Math.random() * 15) + 10, // 10-25% discount
    oldPrice: Math.round(p.price * 1.2)
  }));

  const doublePromos = [...promoCombos, ...promoCombos, ...promoCombos];

  return (
    <section className="py-16 bg-venezuela-dark relative overflow-hidden">
      {/* Decoración de fondo */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {offerProducts.map((product: Product & { discount: number; oldPrice: number }) => (
            <div 
              key={product.id}
              onClick={() => navigate('/catalog', { state: { category: product.category } })}
              className="group bg-white border-2 border-black/5 rounded-[40px] p-6 hover:border-ven-yellow transition-all duration-500 cursor-pointer relative flex flex-col shadow-xl hover:-translate-y-2"
            >
              {/* Badge de Descuento */}
              <div className="absolute top-5 left-5 z-20 bg-ven-red text-white px-3 py-1.5 rounded-xl text-[11px] font-black shadow-2xl flex items-center gap-1.5 border border-white/20">
                <Tag size={12} fill="currentColor" />
                -{product.discount}%
              </div>

              <div className="aspect-square rounded-[32px] overflow-hidden mb-6 relative border border-black/5">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1.5 mb-5">
                <span className="text-[10px] font-black text-ven-yellow uppercase tracking-[0.2em] bg-ven-yellow/10 px-2 py-0.5 rounded-lg border border-ven-yellow/20">
                  {product.category}
                </span>
                <h3 className="text-base md:text-lg font-black text-venezuela-brown uppercase tracking-tight line-clamp-1 group-hover:text-venezuela-orange transition-colors mt-2">
                  {product.name}
                </h3>
              </div>

              <div className="mt-auto flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 line-through font-bold mb-0.5">
                    ${product.oldPrice}
                  </span>
                  <span className="text-2xl font-black text-venezuela-brown tracking-tighter">
                    ${product.price}
                  </span>
                </div>
                <div className="w-12 h-12 bg-ven-yellow/10 rounded-2xl flex items-center justify-center text-ven-yellow group-hover:bg-gradient-to-br group-hover:from-ven-yellow group-hover:to-venezuela-orange group-hover:text-white transition-all shadow-lg">
                  <ArrowRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee de Promociones (Carousel de izquierda a derecha) */}
        <div className="relative pt-16 border-t border-black/5 overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-ven-yellow rounded-xl flex items-center justify-center text-white shadow-xl">
              <Flame size={22} className="animate-pulse" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Combos <span className="text-ven-yellow">Relámpago</span></h3>
          </div>

          <div className="flex overflow-x-hidden no-scrollbar">
            <div className="flex gap-8 animate-marquee-reverse whitespace-nowrap py-6">
              {doublePromos.map((promo, idx) => {
                const store = LOCALES_VENEZOLANOS.find(s => s.id === promo.storeId);
                const discountPercent = promo.oldPrice ? Math.round(((promo.oldPrice - promo.price) / promo.oldPrice) * 100) : 15;

                return (
                  <div 
                    key={`${promo.id}-${idx}`}
                    onClick={() => navigate(`/promotion/${promo.id}`)}
                    className="inline-block min-w-[260px] bg-white border-2 border-black/5 rounded-[40px] p-5 group cursor-pointer hover:border-ven-yellow transition-all shadow-2xl backdrop-blur-sm hover:-translate-y-2"
                  >
                    <div className="relative aspect-square rounded-[32px] overflow-hidden mb-5 border border-black/5 bg-white">
                      <img 
                        src={promo.img} 
                        alt={promo.name} 
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500 object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <div className="bg-white/40 backdrop-blur-md text-venezuela-brown px-2.5 py-1 rounded-xl text-[8px] font-black uppercase flex items-center gap-1 shadow-2xl border border-white/20">
                          <Zap size={10} fill="currentColor" className="text-ven-yellow" /> Relámpago
                        </div>
                        <div className="bg-ven-red/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[8px] font-black uppercase flex items-center gap-1 shadow-2xl border border-white/20">
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
                          {promo.oldPrice && <span className="text-[10px] text-gray-400 line-through font-bold mb-0.5">${promo.oldPrice}</span>}
                          <span className="text-venezuela-orange font-black text-xl tracking-tighter">${promo.price}</span>
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
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Offers;
