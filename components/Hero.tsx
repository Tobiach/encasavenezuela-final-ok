import React from 'react';
import { ArrowRight, ShoppingBag, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onCatalogClick: () => void;
  onLearnMoreClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-4 pt-8 pb-6">
      {/* Badge pill */}
      <div className="flex justify-center mb-5">
        <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-xs rounded-full px-3 py-1 border border-[#8B1A1A]/20">
          🇻🇪 La comunidad venezolana en Argentina
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-5">
        <h1 className="text-3xl font-black leading-tight text-[#1A1A1A]">
          El sabor de tu tierra,{' '}
          <span className="text-ven-yellow">en tu puerta.</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Los mejores locales venezolanos de Buenos Aires, con delivery directo a tu casa.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex justify-center items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <span className="bg-[#8B1A1A]/8 text-[#8B1A1A] rounded-full px-3 py-1 font-semibold">12 locales</span>
        <span className="text-gray-300">·</span>
        <span className="bg-ven-yellow/15 text-[#1A1A1A] rounded-full px-3 py-1 font-semibold">40+ productos</span>
        <span className="text-gray-300">·</span>
        <span className="bg-gray-100 rounded-full px-3 py-1">Pedí por WhatsApp</span>
      </div>

      {/* CTAs */}
      <div className="max-w-sm mx-auto space-y-3">
        <button
          onClick={onCatalogClick}
          className="w-full bg-[#8B1A1A] text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-[#8B1A1A]/20 hover:brightness-110"
        >
          <ShoppingBag size={18} />
          Explorar locales →
        </button>
        <button
          onClick={() => navigate('/locales-map')}
          className="w-full border border-[#8B1A1A]/30 text-[#8B1A1A] rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-[#8B1A1A]/5 active:scale-[0.98] transition-all font-semibold"
        >
          <MapPin size={16} className="text-ven-yellow" />
          Ver el mapa
          <ArrowRight size={14} className="text-[#8B1A1A]/50" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
