import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeroProps {
  onCatalogClick: () => void;
  onLearnMoreClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  return (
    <section className="bg-white px-4 pt-8 pb-7 overflow-hidden">
      {/* Badge */}
      <div className="flex justify-center mb-5">
        <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-xs rounded-full px-3 py-1 border border-[#8B1A1A]/20">
          🇻🇪 La comunidad venezolana en Argentina
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black leading-tight text-[#1F2937] uppercase tracking-tight">
          EL SABOR DE TU TIERRA,<br />
          <span className="text-[#FFD700]" style={{ WebkitTextStroke: '0.5px #D4AF37' }}>EN CASA</span>
        </h1>
        <p className="text-[#6B7280] text-sm mt-3 max-w-xs mx-auto leading-relaxed font-medium">
          Hogar, tradición y sabor venezolano al alcance de un click
        </p>
      </div>

      {/* CTA */}
      <div className="max-w-sm mx-auto mb-7">
        <button
          onClick={onCatalogClick}
          className="w-full bg-[#8B1A1A] text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-[#8B1A1A]/25 hover:brightness-110"
        >
          <ShoppingBag size={18} />
          Explorar locales →
        </button>
      </div>

      {/* Sabores 100% nuestros — recuadros bandera Venezuela */}
      <div className="max-w-sm mx-auto">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-[#6B7280] mb-3">
          Sabores 100% nuestros
        </p>
        <div className="grid grid-cols-3 gap-2">
          {/* Rojo */}
          <div className="bg-[#8B1A1A] rounded-2xl px-3 py-4 flex flex-col items-center gap-2">
            <span className="text-2xl">🫓</span>
            <p className="text-white text-[10px] font-black text-center leading-tight uppercase tracking-wide">
              Arepas &<br />Empanadas
            </p>
          </div>
          {/* Amarillo */}
          <div className="bg-[#FFD700] rounded-2xl px-3 py-4 flex flex-col items-center gap-2">
            <span className="text-2xl">🧀</span>
            <p className="text-[#1F2937] text-[10px] font-black text-center leading-tight uppercase tracking-wide">
              Tequeños &<br />Productos
            </p>
          </div>
          {/* Azul */}
          <div className="bg-[#002FA7] rounded-2xl px-3 py-4 flex flex-col items-center gap-2">
            <span className="text-2xl">🛒</span>
            <p className="text-white text-[10px] font-black text-center leading-tight uppercase tracking-wide">
              Almacén &<br />Víveres
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
