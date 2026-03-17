
import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react';
import { HERO_SLIDE_1, HERO_SLIDE_2, HERO_SLIDE_3 } from '../src/assets/imagenes';

interface HeroProps {
  onCatalogClick: () => void;
  onLearnMoreClick: () => void;
}

const HERO_SLIDES = [
  {
    image: HERO_SLIDE_1,
    title: "Tradición venezolana en cada bocado",
    badge: "Cachapas tradicionales"
  },
  {
    image: HERO_SLIDE_2,
    title: "Arepas rellenas con amor",
    badge: "Arepas artesanales"
  },
  {
    image: HERO_SLIDE_3,
    title: "Tequeños crujientes y dorados",
    badge: "Pasapalos favoritos"
  }
];

const Hero: React.FC<HeroProps> = ({ onCatalogClick, onLearnMoreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + window.location.hash;
    navigator.clipboard.writeText(url).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative pt-6 pb-12 md:pt-10 md:pb-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-ven-yellow/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-ven-blue/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center md:grid md:grid-cols-[0.7fr_1.3fr] md:items-center md:text-left gap-10 relative z-10">
        <div className="space-y-6 md:space-y-8 w-full">
          <div className="flex flex-col items-center md:items-start">
            <span className="bg-ven-yellow/20 text-ven-yellow px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-ven-yellow/30 inline-block">
              Envíos rápidos en Buenos Aires
            </span>
            <h1 className="text-5xl md:text-8xl font-black mt-4 leading-[0.9] tracking-tighter uppercase text-venezuela-brown">
              El sabor de tu tierra <span className="text-ven-yellow drop-shadow-[0_0_20px_rgba(255,204,0,0.4)]">EnCasa</span>
            </h1>
            <p className="text-gray-700 text-base md:text-2xl mt-6 max-w-lg leading-tight font-bold">
              Hogar, tradición y sabor venezolano al alcance de un click.
              <span className="block mt-4 font-black flex justify-center md:justify-start gap-2 text-lg md:text-xl">
                <span className="text-ven-yellow bg-ven-yellow/10 px-2 py-0.5 rounded-lg border border-ven-yellow/20">Sabores </span>
                <span className="text-ven-blue bg-ven-blue/10 px-2 py-0.5 rounded-lg border border-ven-blue/20">100% </span>
                <span className="text-ven-red bg-ven-red/10 px-2 py-0.5 rounded-lg border border-ven-red/20">nuestros</span>
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center md:justify-start">
            <button 
              onClick={onCatalogClick}
              className="bg-gradient-to-r from-ven-yellow to-venezuela-orange text-white w-full sm:w-auto px-8 py-4 md:py-5 rounded-[24px] flex items-center justify-center gap-3 text-base md:text-lg font-black shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all active:scale-95 uppercase tracking-widest"
            >
              <ShoppingBag size={20} />
              VER CATÁLOGO
            </button>
            <button 
              onClick={onLearnMoreClick}
              className="border border-black/10 bg-black/5 hover:bg-black/10 text-venezuela-brown w-full sm:w-auto px-8 py-4 md:py-5 rounded-[24px] flex items-center justify-center gap-3 text-base md:text-lg font-bold transition-all uppercase tracking-wider"
            >
              CONOCER MÁS
              <ArrowRight size={20} className="text-ven-yellow" />
            </button>
            
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={handleShare}
                className="bg-white border-2 border-ven-yellow/20 text-venezuela-brown w-full sm:w-auto px-8 py-4 md:py-5 rounded-[24px] flex items-center justify-center gap-3 text-base md:text-lg font-black transition-all active:scale-95 uppercase tracking-widest hover:border-ven-yellow shadow-sm"
              >
                {showShareTooltip ? <Check size={20} className="text-green-500" /> : <Share2 size={20} className="text-ven-yellow" />}
                {showShareTooltip ? '¡COPIADO!' : 'COMPARTIR'}
              </button>
              {showShareTooltip && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-venezuela-brown text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 whitespace-nowrap z-20">
                  ¡Link copiado, pana!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[500px] md:max-w-none px-4">
          {/* Contenedor de Carrusel */}
          <div className="relative rounded-[40px] overflow-hidden border-4 border-ven-yellow/30 shadow-2xl group z-0 aspect-[16/9]">
            <div className="absolute inset-0 bg-gradient-to-br from-ven-yellow/20 via-transparent to-ven-red/20 z-10 pointer-events-none"></div>
            {HERO_SLIDES.map((slide, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover transition-transform duration-[5s] ease-linear scale-100 group-hover:scale-110"
                />
              </div>
            ))}

            {/* Controles del carrusel (visibles en hover) */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicadores (dots) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-ven-yellow w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Stickers flotantes eliminados */}
        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 0.5s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
