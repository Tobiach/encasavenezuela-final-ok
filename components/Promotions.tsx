
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Plus, Flame, Store, Clock } from 'lucide-react';
import { Product } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { promoCombos } from '../data/catalogData';

interface PromotionsProps {
  onAddToCart: (product: Product, storeId?: string) => void;
}

const Promotions: React.FC<PromotionsProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-venezuela-dark">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 text-ven-yellow font-bold mb-2 bg-ven-yellow/10 px-4 py-1.5 rounded-full border border-ven-yellow/20">
            <Flame size={18} className="animate-pulse" />
            <span className="uppercase tracking-[0.2em] text-[10px]">Promociones Relámpago</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mt-2 uppercase tracking-tighter text-venezuela-brown">Combos <span className="text-ven-yellow">Especiales</span></h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm md:text-base font-medium">
            Armamos los mejores paquetes para que ahorres y disfrutes como en casa.
          </p>
        </div>

        <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto pb-8 -mx-6 px-6 md:pb-0 md:mx-auto md:px-0">
          {promoCombos.map(combo => {
            const store = LOCALES_VENEZOLANOS.find(s => s.id === combo.storeId);
            const savings = combo.oldPrice ? combo.oldPrice - combo.price : 0;
            const savingsPercent = combo.oldPrice ? Math.round((savings / combo.oldPrice) * 100) : 0;

            return (
              <div 
                key={combo.id} 
                onClick={() => navigate(`/promotion/${combo.id}`)}
                className="min-w-[320px] md:min-w-0 bg-white rounded-[40px] border-2 border-black/5 p-5 md:p-7 flex flex-row items-center gap-5 md:gap-8 group hover:border-ven-yellow transition-all duration-500 relative overflow-hidden cursor-pointer shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-ven-yellow/5 via-transparent to-ven-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative w-32 h-32 md:w-44 md:h-44 shrink-0 rounded-[32px] overflow-hidden shadow-2xl border-2 border-black/5 bg-white">
                  <img src={combo.img} alt={combo.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700 object-center" />
                  <div className="absolute top-3 left-3 bg-white/40 backdrop-blur-md text-venezuela-brown px-3 py-1 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-xl border border-white/20">
                    <Zap size={10} fill="currentColor" className="text-ven-yellow" /> DESTACADO
                  </div>
                  {savingsPercent > 0 && (
                    <div className="absolute bottom-3 right-3 bg-ven-red/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-[10px] font-black shadow-2xl border border-white/20">
                      -{savingsPercent}%
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                     <Store size={12} className="text-ven-yellow" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em]">{store?.name || 'Local Aliado'}</span>
                  </div>
                  <h3 className="text-lg md:text-2xl font-black mb-2 group-hover:text-venezuela-orange transition-colors leading-tight uppercase tracking-tight text-venezuela-brown">
                    {combo.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-white/40 backdrop-blur-md text-ven-red text-[9px] font-black px-3 py-1 rounded-lg uppercase flex items-center gap-1.5 border border-white/20 shadow-sm">
                      <Flame size={10} fill="currentColor" /> Relámpago
                    </span>
                    <span className="bg-white/40 backdrop-blur-md text-ven-blue text-[9px] font-black px-3 py-1 rounded-lg uppercase flex items-center gap-1.5 border border-white/20 shadow-sm">
                      <Clock size={10} /> Limitado
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      {combo.oldPrice && (
                        <span className="text-[11px] text-gray-400 line-through font-bold mb-0.5">${combo.oldPrice}</span>
                      )}
                      <span className="text-2xl md:text-3xl font-black text-venezuela-brown tracking-tighter">${combo.price}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart(combo, combo.storeId); }}
                      className="bg-gradient-to-br from-ven-yellow to-venezuela-orange text-white p-3.5 md:p-4 rounded-2xl hover:scale-110 active:scale-90 transition-all shadow-2xl shadow-venezuela-orange/30 border border-white/20"
                    >
                      <Plus size={24} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Promotions;
