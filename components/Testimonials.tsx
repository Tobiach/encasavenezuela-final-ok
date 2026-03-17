
import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  { name: "Mariana G.", text: "Los tequeños igualitos a los de allá. El envío fue rapidísimo.", stars: 5, location: "Palermo" },
  { name: "Carlos R.", text: "Por fin Harina P.A.N. fresca en Baires. Me transportó a Caracas.", stars: 5, location: "Almagro" },
  { name: "Elena V.", text: "El Combo Arepero rinde un montón. Muy puntuales.", stars: 5, location: "Belgrano" },
  { name: "José L.", text: "Club EnCasa VEN suma rápido. Súper confiables.", stars: 5, location: "CABA" },
  { name: "Ricardo B.", text: "Atención de panas. Me asesoraron por WhatsApp genial.", stars: 5, location: "Lanús" },
  { name: "Valentina S.", text: "Precios justos y combos que valen la pena.", stars: 5, location: "Caballito" },
  { name: "Héctor J.", text: "Comprar desde el celu es re fácil. Sabor maracucho real.", stars: 5, location: "Recoleta" },
  { name: "Patricia M.", text: "Pagar contra entrega me dio mucha seguridad.", stars: 5, location: "Villa Crespo" },
  { name: "Daniel F.", text: "Ya canjeé mi primer descuento. ¡Excelente iniciativa!", stars: 5, location: "San Isidro" }
];

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 350;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-venezuela-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-ven-yellow font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Quote size={12} fill="currentColor" /> Experiencias Reales
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-venezuela-brown uppercase tracking-tighter">Comunidad <span className="text-ven-yellow">EnCasa</span></h2>
          <p className="text-gray-600 mt-4 text-sm font-medium italic">Lo que dicen los panas que ya probaron el sabor de nuestra tierra.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="w-14 h-14 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center hover:bg-ven-yellow hover:text-white transition-all hover:scale-110 active:scale-90 text-gray-500"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-14 h-14 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center hover:bg-ven-yellow hover:text-white transition-all hover:scale-110 active:scale-90 text-gray-500"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-6 pb-16 snap-x snap-mandatory scrollbar-hide no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((rev, idx) => (
          <div 
            key={idx} 
            className="min-w-[320px] md:min-w-[450px] snap-center bg-white p-12 rounded-[56px] border-2 border-black/5 relative group transition-all duration-500 hover:border-ven-yellow shadow-2xl hover:-translate-y-2"
          >
            <div className="absolute top-10 right-10 text-black/5 group-hover:text-ven-yellow/20 transition-colors">
              <Quote size={80} fill="currentColor" />
            </div>
            
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ven-yellow via-ven-blue to-ven-red flex items-center justify-center text-white font-black text-2xl shadow-2xl border-2 border-white/20">
                {rev.name[0]}
              </div>
              <div>
                <p className="font-black text-lg text-venezuela-brown uppercase tracking-tight group-hover:text-venezuela-orange transition-colors">{rev.name}</p>
                <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] bg-black/5 px-2 py-0.5 rounded-lg mt-1">{rev.location}</p>
              </div>
            </div>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-10 italic font-bold">
              "{rev.text}"
            </p>

            <div className="flex gap-1.5 border-t border-black/5 pt-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-ven-yellow text-ven-yellow drop-shadow-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Desliza para leer más testimonios</p>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
