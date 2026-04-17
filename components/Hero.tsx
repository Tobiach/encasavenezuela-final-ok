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
        <span className="bg-[#FF6B35]/10 text-[#FF6B35] font-bold text-xs rounded-full px-3 py-1 border border-[#FF6B35]/20">
          🇻🇪 La comunidad venezolana en Argentina
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-5">
        <h1 className="text-3xl font-black leading-tight text-[#2D1618]">
          El sabor de tu tierra,{' '}
          <span className="text-[#FF6B35]">en tu puerta.</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Los mejores locales venezolanos de Buenos Aires, con delivery directo a tu casa.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex justify-center items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <span className="bg-[#2D1618]/5 text-[#2D1618] rounded-full px-3 py-1 font-semibold">12 locales</span>
        <span className="text-gray-300">·</span>
        <span className="bg-[#FF6B35]/8 text-[#FF6B35] rounded-full px-3 py-1 font-semibold">40+ productos</span>
        <span className="text-gray-300">·</span>
        <span className="bg-gray-100 rounded-full px-3 py-1">Pedí por WhatsApp</span>
      </div>

      {/* CTAs */}
      <div className="max-w-sm mx-auto space-y-3">
        <button
          onClick={onCatalogClick}
          className="w-full text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-orange-500/20"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E55A25 100%)' }}
        >
          <ShoppingBag size={18} />
          Explorar locales →
        </button>
        <button
          onClick={() => navigate('/locales-map')}
          className="w-full border border-gray-200 text-[#2D1618] rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all font-semibold"
        >
          <MapPin size={16} className="text-[#FF6B35]" />
          Ver el mapa
          <ArrowRight size={14} className="text-gray-400" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
