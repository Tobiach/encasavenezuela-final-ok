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
    <section className="bg-gradient-to-b from-amber-50 to-white px-4 pt-8 pb-10">
      {/* Badge pill */}
      <div className="flex justify-center mb-5">
        <span className="bg-ven-yellow/20 text-ven-yellow font-semibold text-xs rounded-full px-3 py-1 border border-ven-yellow/30">
          🇻🇪 +40 productos venezolanos en CABA
        </span>
      </div>

      {/* Headline */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-black leading-tight text-gray-900">
          El sabor de tu tierra,{' '}
          <span className="text-ven-yellow">en tu puerta.</span>
        </h1>
        <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Los mejores locales venezolanos de Buenos Aires, con delivery directo a tu casa.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex justify-center items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
        <span className="bg-gray-100 rounded-full px-3 py-1">12 locales</span>
        <span className="text-gray-300">·</span>
        <span className="bg-gray-100 rounded-full px-3 py-1">40+ productos</span>
        <span className="text-gray-300">·</span>
        <span className="bg-gray-100 rounded-full px-3 py-1">Pago por WhatsApp</span>
      </div>

      {/* CTAs */}
      <div className="max-w-sm mx-auto space-y-3">
        <button
          onClick={onCatalogClick}
          className="w-full bg-ven-yellow text-black font-bold rounded-2xl py-3 flex items-center justify-center gap-2 hover:brightness-95 active:scale-[0.98] transition-all shadow-md shadow-yellow-400/20"
        >
          <ShoppingBag size={18} />
          Explorar locales →
        </button>
        <button
          onClick={() => navigate('/locales-map')}
          className="w-full border border-gray-200 text-gray-700 rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <MapPin size={16} className="text-ven-yellow" />
          Ver el mapa →
          <ArrowRight size={14} className="text-gray-400" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
