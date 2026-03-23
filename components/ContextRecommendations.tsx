
import React, { useMemo, useState, useEffect } from 'react';
import { Coffee, Sun, Moon, Sparkles, Plus, UtensilsCrossed, Store } from 'lucide-react';
import { Product } from '../types';
import { useStores } from '../lib/hooks/useStores';
import { useProducts } from '../lib/hooks/useProducts';

interface ContextRecommendationsProps {
  onAddToCart: (p: Product, storeId?: string) => void;
}

const ContextRecommendations: React.FC<ContextRecommendationsProps> = ({ onAddToCart }) => {
  const { stores } = useStores();
  const { allProducts } = useProducts();
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    if (stores.length === 0) return;
    // Rotación cada 15 minutos basada en la hora actual
    const updateRotation = () => {
      const now = new Date();
      const minutesSinceEpoch = Math.floor(now.getTime() / (1000 * 60));
      const intervalIndex = Math.floor(minutesSinceEpoch / 15);
      setRotationIndex(intervalIndex % stores.length);
    };

    updateRotation();
    const interval = setInterval(updateRotation, 60000); // Revisar cada minuto
    return () => clearInterval(interval);
  }, [stores.length]);

  const currentStore = stores[rotationIndex];

  const context = useMemo(() => {
    if (!currentStore) return { id: 'loading', title: '', subtitle: '', icon: null, items: [] };

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
  }, [currentStore, allProducts]);

  if (!currentStore || context.items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-b from-orange-50 via-yellow-50 to-white rounded-[40px] p-8 flex flex-col items-start gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Sparkles size={80} /></div>

        <div className="flex items-center gap-6 z-10 w-full">
          <div className="bg-ven-yellow/10 p-5 rounded-3xl shrink-0">
            {context.icon}
          </div>
          <div>
            <h4 className="text-2xl font-black mb-1 leading-tight text-gray-900">{context.title}</h4>
            <div className="flex items-center gap-2">
              <Store size={12} className="text-ven-yellow" />
              <p className="text-sm text-gray-500 italic">{context.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Lista Vertical tipo Feed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 z-10 w-full">
          {context.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md border-2 border-ven-yellow/20 shadow-xl p-4 rounded-3xl hover:shadow-2xl hover:border-ven-yellow/40 hover:scale-[1.02] transition-all duration-300 w-full">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-ven-yellow/30 shadow-lg bg-white shrink-0">
                  <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 truncate max-w-[150px]">{item.name}</p>
                  <p className="text-[9px] text-gray-600 italic truncate max-w-[150px] mb-1">
                    {item.usageInfo || `${item.category} de calidad.`}
                  </p>
                  <p className="text-xl font-black text-venezuela-orange">${item.price}</p>
                </div>
              </div>
              <button
                onClick={() => onAddToCart(item, currentStore.id)}
                className="bg-ven-yellow p-3 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-500/20 flex items-center justify-center"
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
