
import React, { useMemo, useState, useEffect } from 'react';
import { Coffee, Sun, Moon, Sparkles, Plus, UtensilsCrossed, Store } from 'lucide-react';
import { Product } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { allProducts } from '../data/catalogData';

interface ContextRecommendationsProps {
  onAddToCart: (p: Product, storeId?: string) => void;
}

const ContextRecommendations: React.FC<ContextRecommendationsProps> = ({ onAddToCart }) => {
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    // Rotación cada 15 minutos basada en la hora actual
    const updateRotation = () => {
      const now = new Date();
      const minutesSinceEpoch = Math.floor(now.getTime() / (1000 * 60));
      const intervalIndex = Math.floor(minutesSinceEpoch / 15);
      setRotationIndex(intervalIndex % LOCALES_VENEZOLANOS.length);
    };

    updateRotation();
    const interval = setInterval(updateRotation, 60000); // Revisar cada minuto
    return () => clearInterval(interval);
  }, []);

  const currentStore = LOCALES_VENEZOLANOS[rotationIndex];

  const context = useMemo(() => {
    const hour = new Date().getHours();
    
    // Filtrar productos del local actual
    const storeProducts = allProducts.filter((p: Product) => p.availableInStoreIds?.includes(currentStore.id));
    // Si el local no tiene productos (raro en demo), usar todos
    const pool = storeProducts.length > 0 ? storeProducts : allProducts;
    
    // Seleccionar 5 productos aleatorios del local
    const selectedItems = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);

    if (hour >= 6 && hour < 11) return {
      id: 'morning',
      title: "Buen día ☀️",
      subtitle: `Lo mejor de ${currentStore.name} para empezar con energía.`,
      icon: <Coffee className="text-ven-yellow" />,
      items: selectedItems
    };

    if (hour >= 11 && hour < 15) return {
      id: 'lunch',
      title: "Hora de almorzar 🍽️",
      subtitle: `Descubrí los sabores de ${currentStore.name} hoy.`,
      icon: <UtensilsCrossed className="text-ven-red" />,
      items: selectedItems
    };

    if (hour >= 15 && hour < 19) return {
      id: 'afternoon',
      title: "Momento de un antojo 🍪",
      subtitle: `Tentate con lo que ${currentStore.name} tiene para vos.`,
      icon: <Sun className="text-ven-yellow" />,
      items: selectedItems
    };

    return {
      id: 'night',
      title: "Cena ideal 🌙",
      subtitle: `Cerrá el día con lo mejor de ${currentStore.name}.`,
      icon: <Moon className="text-ven-blue" />,
      items: selectedItems
    };
  }, [currentStore]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-venezuela-dark border border-white/5 rounded-[40px] p-8 flex flex-col items-start gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Sparkles size={80} /></div>
        
        <div className="flex items-center gap-6 z-10 w-full">
          <div className="bg-white/5 p-5 rounded-3xl shrink-0">
            {context.icon}
          </div>
          <div>
            <h4 className="text-2xl font-black mb-1 leading-tight">{context.title}</h4>
            <div className="flex items-center gap-2">
              <Store size={12} className="text-ven-yellow" />
              <p className="text-sm text-gray-500 italic">{context.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Lista Vertical tipo Feed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 z-10 w-full">
          {context.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4 bg-black/40 p-4 rounded-3xl border border-white/5 hover:border-ven-yellow/30 transition-all w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/20 shrink-0">
                  <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter truncate max-w-[150px]">{item.name}</p>
                  <p className="text-[9px] text-gray-600 italic truncate max-w-[150px] mb-1">
                    {item.usageInfo || `${item.category} de calidad.`}
                  </p>
                  <p className="text-sm font-bold text-white">${item.price}</p>
                </div>
              </div>
              <button 
                onClick={() => onAddToCart(item, currentStore.id)}
                className="bg-ven-yellow p-3 rounded-xl hover:scale-110 transition-transform active:scale-90 flex items-center justify-center shadow-lg shadow-yellow-500/20"
              >
                <Plus size={16} strokeWidth={3} className="text-ven-blue" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextRecommendations;
