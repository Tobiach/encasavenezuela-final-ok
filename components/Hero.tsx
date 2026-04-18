import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeroProps {
  onCatalogClick: () => void;
  onLearnMoreClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  return (
    <section className="bg-white px-4 pt-8 pb-7 overflow-hidden">
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

      {/* Sabores 100% nuestros — recuadro tricolor Venezuela */}
      <div className="max-w-sm mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
          {/* Franja tricolor superior */}
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(to right, #8B1A1A 33.3%, #FFD700 33.3%, #FFD700 66.6%, #002FA7 66.6%)' }}
          />
          <div className="px-5 py-3 flex items-center justify-center gap-2.5">
            <span className="text-lg">🇻🇪</span>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1F2937]">
              Sabores 100% nuestros
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
