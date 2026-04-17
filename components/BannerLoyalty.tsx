import React from 'react';
import { useNavigate } from 'react-router-dom';

const BannerLoyalty: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 pb-4">
      <div
        className="relative rounded-[24px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C9A227 55%, #2D1618 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -right-2 w-16 h-16 bg-white/10 rounded-full" />

        <div className="relative flex justify-between items-center px-5 py-4 gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">Solo en EnCasa</span>
            <h3 className="font-black text-black text-base leading-tight">
              Cada pedido te<br />acerca a más 🎁
            </h3>
            <p className="text-black/55 text-[11px] mt-1 leading-snug font-medium">
              Productos venezolanos con descuentos reales para la comunidad.
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="mt-3 bg-black text-ven-yellow text-[11px] rounded-full px-4 py-1.5 font-black tracking-wide hover:bg-[#2D1618] active:scale-95 transition-all"
            >
              Empezar a pedir →
            </button>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[52px] leading-none drop-shadow-sm select-none">🥘</span>
            <div className="bg-black/15 rounded-full px-2 py-0.5">
              <span className="text-[9px] font-black text-black/60 uppercase tracking-widest">+40 productos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerLoyalty;
