
import React, { useMemo, useState, useEffect } from 'react';
import { Repeat, Zap, Gift, Plus } from 'lucide-react';
import { Product, PurchaseHistoryItem } from '../types';

// Mock database de productos para recomponer objetos Product desde el ID del historial
const productDB: Record<number, Partial<Product>> = {
  1: { id: 1, name: "Harina P.A.N.", price: 1800, img: "https://images.unsplash.com/photo-1621501103258-0e282496a45c?auto=format&fit=crop&q=80&w=600", category: "Harinas", storeId: 'real-1' },
  2: { id: 2, name: "Maltín Polar", price: 1200, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600", category: "Bebidas", storeId: 'real-1' },
  3: { id: 3, name: "Tequeños", price: 4500, img: "/imagenes_productos/tequeños_y_quesos.png", category: "Congelados", storeId: 'real-1' },
  4: { id: 4, name: "Queso Llanero", price: 3200, img: "https://images.unsplash.com/photo-1486297678162-ad2a19b85f5d?auto=format&fit=crop&q=80&w=600", category: "Lácteos", storeId: 'real-4' },
  7: { id: 7, name: "Diablitos", price: 1900, img: "https://images.unsplash.com/photo-1563220436-398328c0397f?auto=format&fit=crop&q=80&w=400", category: "Almacén", storeId: 'real-1' }
};

interface RepeatOrderPanelProps {
  onAddToCart: (p: Product, storeId?: string) => void;
}

const RepeatOrderPanel: React.FC<RepeatOrderPanelProps> = ({ onAddToCart }) => {
  const [history, setHistory] = useState<PurchaseHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('encasa_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const topItems = useMemo(() => {
    const counts: Record<number, number> = {};
    history.forEach(p => p.items.forEach(i => {
      counts[i.id] = (counts[i.id] || 0) + i.qty;
    }));
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => Number(id));
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-500 border border-white/5">
          <Repeat size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4">Aún no tienes historial de compras</h2>
        <p className="text-gray-400 max-w-sm mx-auto italic">
          Cuando hagas tu primer pedido por WhatsApp, aquí aparecerán tus productos de siempre para pedirlos de nuevo con un solo clic.
        </p>
      </div>
    );
  }

  const lastPurchase = history[history.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2">Mis Compras de <span className="text-ven-yellow">Siempre</span></h1>
          <p className="text-gray-400 font-medium italic">Detectamos lo que más te gusta, pana. ¡Pide de nuevo al toque!</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total pedidos:</span>
          <span className="ml-2 text-ven-yellow font-black">{history.length}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Card 1: Repetir más pedido */}
        <div className="gradient-card p-8 rounded-[40px] border border-ven-yellow/20 relative overflow-hidden group shadow-xl">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Repeat size={120} /></div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <Repeat className="text-ven-yellow" size={20} />
            Top Favoritos
          </h3>
          <div className="space-y-4 mb-8">
            {topItems.map(id => (
              <div key={id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 overflow-hidden shrink-0">
                  <img src={productDB[id]?.img} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold text-gray-300 flex-grow truncate">{productDB[id]?.name || "Producto"}</span>
                <span className="text-xs text-ven-yellow font-black">${productDB[id]?.price}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              topItems.forEach(id => {
                const p = productDB[id];
                if (p) onAddToCart(p as Product, p.storeId);
              });
              alert("¡Tus favoritos han sido agregados al carrito!");
            }}
            className="w-full bg-ven-yellow hover:bg-yellow-500 text-ven-blue py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
          >
            AÑADIR FAVORITOS
          </button>
        </div>

        {/* Card 2: Repetir con beneficio */}
        <div className="gradient-card p-8 rounded-[40px] border border-yellow-500/20 relative overflow-hidden group shadow-xl">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={120} /></div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <Zap className="text-yellow-500" size={20} />
            Último Pedido
          </h3>
          <p className="text-xs text-gray-400 mb-6 italic leading-relaxed">
            ¿Quieres lo mismo de la última vez? Repite tu pedido del {new Date(lastPurchase.date).toLocaleDateString()} rápidamente.
          </p>
          <div className="mb-8 p-4 bg-black/30 rounded-2xl border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Resumen:</p>
            <p className="text-sm font-black">{lastPurchase.items.length} productos diferentes</p>
            <p className="text-sm text-ven-yellow font-black">Total: ${lastPurchase.total}</p>
          </div>
          <button 
            onClick={() => {
              lastPurchase.items.forEach(i => {
                const p = productDB[i.id];
                if (p) onAddToCart(p as Product, p.storeId);
              });
              alert("¡Último pedido cargado en el carrito!");
            }}
            className="w-full bg-ven-yellow text-ven-blue py-4 rounded-2xl font-black text-xs tracking-widest transition-all hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-500/10"
          >
            REPETIR PEDIDO
          </button>
        </div>

        {/* Card 3: Combo inteligente */}
        <div className="gradient-card p-8 rounded-[40px] border border-ven-blue/20 relative overflow-hidden group shadow-xl">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Gift size={120} /></div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <Plus className="text-ven-blue" size={20} />
            Sugerencia EnCasa
          </h3>
          <p className="text-xs text-gray-400 mb-6 italic leading-relaxed">
            Vemos que te gusta la Harina P.A.N. ¿Qué tal si hoy sumas unos Diablitos para armar las arepas perfectas?
          </p>
          <div className="flex items-center gap-4 mb-8">
             <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-venezuela-dark bg-white/10 flex items-center justify-center text-xs">🫓</div>
                <div className="w-10 h-10 rounded-full border-2 border-venezuela-dark bg-white/10 flex items-center justify-center text-xs">🥫</div>
             </div>
             <span className="text-[10px] font-black uppercase text-ven-blue">Combo Arepero Express</span>
          </div>
          <button 
            onClick={() => { 
              onAddToCart(productDB[1] as Product, productDB[1].storeId); 
              onAddToCart(productDB[7] as Product, productDB[7].storeId);
              alert("¡Combo sugerido agregado!");
            }}
            className="w-full bg-ven-blue hover:bg-ven-blue/80 text-white py-4 rounded-2xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-ven-blue/20"
          >
            LLEVAR SUGERENCIA
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepeatOrderPanel;
