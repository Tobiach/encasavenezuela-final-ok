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
        <h1 className="leading-tight text-[#1F2937] uppercase tracking-tight">
          <span className="block text-2xl font-black">EL SABOR DE TU TIERRA,</span>
          <span
            className="block text-6xl font-black text-[#FFD700]"
            style={{ WebkitTextStroke: '2px #1F2937', paintOrder: 'stroke fill', textShadow: '0 3px 12px rgba(0,0,0,0.18)' } as React.CSSProperties}
          >EN CASA</span>
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

      {/* Sabores 100% nuestros — pill tricolor */}
      <div className="flex justify-center">
        <div className="inline-block rounded-full overflow-hidden border border-gray-200 shadow-md">
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(to right, #8B1A1A 33.3%, #FFD700 33.3%, #FFD700 66.6%, #002FA7 66.6%)' }}
          />
          <div className="bg-white px-6 py-2.5 flex items-center justify-center gap-2">
            <span className="text-base">🇻🇪</span>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1F2937] whitespace-nowrap">
              Sabores 100% nuestros
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
