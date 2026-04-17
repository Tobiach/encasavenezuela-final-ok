import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onCatalogClick: () => void;
  onLearnMoreClick: () => void;
}

const SLIDES = [
  {
    badge: '🇻🇪 La comunidad venezolana en Argentina',
    title: 'El sabor de tu tierra,',
    titleAccent: 'en tu puerta.',
    subtitle: 'Los mejores locales venezolanos de Buenos Aires, con delivery directo a tu casa.',
    cta: 'Explorar locales',
    ctaSecondary: 'Ver el mapa',
  },
  {
    badge: '🛒 Más de 40 productos disponibles',
    title: 'Productos venezolanos,',
    titleAccent: 'directo a tu puerta 🛒',
    subtitle: 'Harina, Malta, Chocolates Savoy y mucho más. Sin salir de casa.',
    cta: 'Ver catálogo',
    ctaSecondary: 'Ver locales',
  },
  {
    badge: '📲 Pedí en segundos por WhatsApp',
    title: 'Tu local venezolano favorito,',
    titleAccent: 'ahora online 📲',
    subtitle: 'Pedí por WhatsApp en segundos. Rápido, simple y directo.',
    cta: 'Pedir ahora',
    ctaSecondary: 'Ver el mapa',
  },
];

const Hero: React.FC<HeroProps> = ({ onCatalogClick }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, [isPaused]);

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent(c => (c + 1) % SLIDES.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
    setIsPaused(false);
  };

  const slide = SLIDES[current];

  return (
    <section
      className="bg-white px-4 pt-8 pb-6 relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide content */}
      <div
        key={current}
        className="animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {/* Badge pill */}
        <div className="flex justify-center mb-5">
          <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-xs rounded-full px-3 py-1 border border-[#8B1A1A]/20">
            {slide.badge}
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-black leading-tight text-[#1A1A1A]">
            {slide.title}{' '}
            <span className="text-ven-yellow">{slide.titleAccent}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            {slide.subtitle}
          </p>
        </div>

        {/* Stats row — solo slide 1 */}
        {current === 0 && (
          <div className="flex justify-center items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
            <span className="bg-[#8B1A1A]/8 text-[#8B1A1A] rounded-full px-3 py-1 font-semibold">12 locales</span>
            <span className="text-gray-300">·</span>
            <span className="bg-ven-yellow/15 text-[#1A1A1A] rounded-full px-3 py-1 font-semibold">40+ productos</span>
            <span className="text-gray-300">·</span>
            <span className="bg-gray-100 rounded-full px-3 py-1">Pedí por WhatsApp</span>
          </div>
        )}
        {current !== 0 && <div className="mb-6" />}

        {/* CTAs */}
        <div className="max-w-sm mx-auto space-y-3">
          <button
            onClick={onCatalogClick}
            className="w-full bg-[#8B1A1A] text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-[#8B1A1A]/20 hover:brightness-110"
          >
            <ShoppingBag size={18} />
            {slide.cta} →
          </button>
          <button
            onClick={() => navigate('/locales-map')}
            className="w-full border border-[#8B1A1A]/30 text-[#8B1A1A] rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-[#8B1A1A]/5 active:scale-[0.98] transition-all font-semibold"
          >
            <MapPin size={16} className="text-ven-yellow" />
            {slide.ctaSecondary}
          </button>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button onClick={prev} className="p-1 text-gray-300 hover:text-[#8B1A1A] transition-colors">
          <ChevronLeft size={16} />
        </button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-2 bg-[#8B1A1A]' : 'w-2 h-2 bg-gray-200'}`}
          />
        ))}
        <button onClick={next} className="p-1 text-gray-300 hover:text-[#8B1A1A] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
