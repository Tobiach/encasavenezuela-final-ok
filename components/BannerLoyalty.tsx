import React from 'react';
import { useNavigate } from 'react-router-dom';

const BannerLoyalty: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 my-4">
      <div className="bg-ven-yellow/15 border border-ven-yellow/20 rounded-2xl px-4 py-4 flex justify-between items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">¡Pedí y sumá beneficios 🎁</h3>
          <p className="text-gray-600 text-xs mt-1 leading-snug">
            Con cada compra acumulás puntos para tu próximo pedido.
          </p>
          <button
            onClick={() => navigate('/loyalty')}
            className="mt-2 bg-black text-white text-xs rounded-full px-4 py-1.5 font-semibold hover:bg-gray-800 active:scale-95 transition-all"
          >
            Conocer más →
          </button>
        </div>
        <span className="text-5xl shrink-0 select-none">🛒</span>
      </div>
    </div>
  );
};

export default BannerLoyalty;
