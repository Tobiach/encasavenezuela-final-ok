import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeroProps {
  onCatalogClick: () => void;
  onLearnMoreClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  return (
    <section className="bg-white px-4 pt-8 pb-6 overflow-hidden">
      {/* Badge */}
      <div className="flex justify-center mb-5">
        <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-xs rounded-full px-3 py-1 border border-[#8B1A1A]/20">
          🇻🇪 La comunidad venezolana en Argentina
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black leading-tight text-[#1A1A1A] uppercase tracking-tight">
          EL SABOR DE TU TIERRA,<br />
          <span className="text-ven-yellow">EN CASA</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Los mejores locales venezolanos de Buenos Aires, con delivery directo a tu casa.
        </p>
      </div>

      {/* CTA */}
      <div className="max-w-sm mx-auto mb-7">
        <button
          onClick={onCatalogClick}
          className="w-full bg-[#8B1A1A] text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-[#8B1A1A]/20 hover:brightness-110"
        >
          <ShoppingBag size={18} />
          Explorar locales →
        </button>
      </div>

      {/* Sabores 100% nuestros */}
      <div className="max-w-sm mx-auto">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">
          Sabores 100% nuestros
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] text-xs font-bold rounded-full px-3 py-1.5 border border-[#8B1A1A]/15">
            🫓 Arepas
          </span>
          <span className="bg-ven-yellow/15 text-[#7A6010] text-xs font-bold rounded-full px-3 py-1.5 border border-ven-yellow/25">
            🧀 Tequeños
          </span>
          <span className="bg-[#002FA7]/10 text-[#002FA7] text-xs font-bold rounded-full px-3 py-1.5 border border-[#002FA7]/15">
            🥤 Malta
          </span>
          <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] text-xs font-bold rounded-full px-3 py-1.5 border border-[#8B1A1A]/15">
            🍫 Savoy
          </span>
          <span className="bg-ven-yellow/15 text-[#7A6010] text-xs font-bold rounded-full px-3 py-1.5 border border-ven-yellow/25">
            🫙 Harina PAN
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
