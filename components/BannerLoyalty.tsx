import React from 'react';
import { useNavigate } from 'react-router-dom';

const BannerLoyalty: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 pb-4">
      <div className="relative rounded-[24px] overflow-hidden bg-ven-yellow/15 border border-ven-yellow/25">
        {/* Franja bandera */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[24px]" style={{ background: 'linear-gradient(to bottom, #8B1A1A 33%, #D4AF37 33%, #D4AF37 66%, #002FA7 66%)' }} />

        <div className="flex justify-between items-center px-5 py-4 gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#8B1A1A]/60 mb-1">Solo en EnCasa</span>
            <h3 className="font-black text-[#1A1A1A] text-base leading-tight">
              Cada pedido te<br />acerca a más 🎁
            </h3>
            <p className="text-gray-500 text-[11px] mt-1 leading-snug font-medium">
              Productos venezolanos con descuentos reales para la comunidad.
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="mt-3 bg-[#8B1A1A] text-white text-[11px] rounded-full px-4 py-1.5 font-black tracking-wide hover:brightness-110 active:scale-95 transition-all"
            >
              Empezar a pedir →
            </button>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[52px] leading-none drop-shadow-sm select-none">🥘</span>
            <div className="bg-ven-yellow/20 rounded-full px-2 py-0.5">
              <span className="text-[9px] font-black text-[#1A1A1A]/60 uppercase tracking-widest">+40 productos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerLoyalty;
