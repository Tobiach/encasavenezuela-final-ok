import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/catalogData';

const CategoryCarousel: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryName: string) => {
    navigate('/catalog', { state: { category: categoryName } });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const doubleCategories = [...categories, ...categories];

  return (
    <section className="py-12 bg-venezuela-dark border-b border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-venezuela-brown">
            Explora nuestras <span className="text-ven-yellow">categorías</span>
          </h2>
          <div className="h-1 w-12 bg-ven-yellow mt-2 rounded-full" />
        </div>
        
        {/* Botones solo visibles en desktop */}
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full border border-black/10 hover:bg-black/5 text-gray-500 transition-all active:scale-90 bg-black/5 z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full border border-black/10 hover:bg-black/5 text-gray-500 transition-all active:scale-90 bg-black/5 z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Contenedor con scroll horizontal táctil en mobile */}
      <div 
        ref={scrollRef}
        className="relative flex overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth touch-pan-x"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x proximity'
        }}
      >
        <div className="flex gap-6 md:gap-10 px-6 py-8 md:animate-marquee md:whitespace-nowrap">
          {doubleCategories.map((cat, idx) => (
            <div 
              key={`${cat.name}-${idx}`}
              onClick={() => handleCategoryClick(cat.name)}
              className="inline-block min-w-[140px] md:min-w-[260px] group cursor-pointer flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[32px] md:rounded-[48px] overflow-hidden border border-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] mb-6 group-hover:border-ven-yellow/40 transition-all duration-700 group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_-20px_rgba(255,204,0,0.2)]">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-[0.95] group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                   <div className="w-full bg-white/20 backdrop-blur-3xl border border-white/30 px-4 py-6 rounded-[32px] opacity-0 group-hover:opacity-100 transition-all translate-y-10 group-hover:translate-y-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] flex flex-col items-center gap-1.5 transform scale-90 group-hover:scale-100 duration-500">
                      <div className="w-8 h-1 bg-ven-yellow rounded-full mb-1 opacity-60" />
                      <span className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Explorar</span>
                      <p className="text-[9px] text-ven-yellow font-black uppercase tracking-widest opacity-90">{cat.subtitle || 'Ver productos'}</p>
                   </div>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="text-xs md:text-sm font-black text-venezuela-brown uppercase tracking-[0.3em] group-hover:text-ven-yellow transition-colors duration-500">
                  {cat.name}
                </h3>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* Animación marquee solo en desktop */
        @media (min-width: 768px) {
          .md\\:animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
        }
        
        /* Mobile: scroll manual con touch */
        @media (max-width: 767px) {
          .md\\:animate-marquee {
            animation: none;
            width: auto;
          }
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }

        /* Smooth scroll en iOS */
        .scroll-smooth {
          scroll-behavior: smooth;
        }

        /* Touch gestures optimizados */
        .touch-pan-x {
          touch-action: pan-x;
        }
      `}</style>
    </section>
  );
};

export default CategoryCarousel;