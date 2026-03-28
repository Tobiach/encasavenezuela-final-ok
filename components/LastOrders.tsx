import React, { useEffect, useState } from 'react';
import { RotateCcw, ShoppingBag } from 'lucide-react';
import { PurchaseHistoryItem, Product } from '../types';
import { useProducts } from '../lib/hooks/useProducts';

interface LastOrdersProps {
  onAddToCart: (product: Product, storeId?: string) => void;
}

const LastOrders: React.FC<LastOrdersProps> = ({ onAddToCart }) => {
  const [history, setHistory] = useState<PurchaseHistoryItem[]>([]);
  const { allProducts } = useProducts();

  useEffect(() => {
    const saved: PurchaseHistoryItem[] = JSON.parse(localStorage.getItem('encasa_history') || '[]');
    setHistory(saved.slice(0, 3));
  }, []);

  if (history.length === 0) return null;

  const handleReorder = (purchase: PurchaseHistoryItem) => {
    purchase.items.forEach((item) => {
      const fullProduct = allProducts.find(p => p.id === item.id);
      const productToAdd: Product = fullProduct ?? {
        id: item.id,
        name: item.name,
        price: item.price,
        category: '',
        img: '',
      };
      if (purchase.store_id) {
        onAddToCart(productToAdd, purchase.store_id);
      }
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-ven-yellow rounded-lg flex items-center justify-center text-white shadow-lg">
          <RotateCcw size={16} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter text-venezuela-brown">
          Tus últimas <span className="text-ven-yellow">compras</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {history.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-black/[0.03] border border-black/5 rounded-[20px] p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-ven-yellow/10 rounded-xl flex items-center justify-center shrink-0">
                <ShoppingBag size={18} className="text-ven-yellow" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-venezuela-brown truncate">
                  {purchase.items.map(i => i.name).join(', ')}
                </p>
                <p className="text-[10px] text-gray-500 font-bold">
                  {new Date(purchase.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  {' · '}
                  <span className="text-ven-yellow font-black">${purchase.total.toLocaleString('es-AR')}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => handleReorder(purchase)}
              disabled={!purchase.store_id}
              className="shrink-0 px-4 py-2 bg-ven-yellow text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-venezuela-orange transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Volver a pedir
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LastOrders;
