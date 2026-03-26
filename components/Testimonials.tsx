
import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  { name: "Mariana G.", text: "Los tequeños igualitos a los de allá. El envío fue rapidísimo.", stars: 5, location: "Palermo" },
  { name: "Carlos R.", text: "Por fin Harina P.A.N. fresca en Baires. Me transportó a Caracas.", stars: 5, location: "Almagro" },
  { name: "Elena V.", text: "El Combo Arepero rinde un montón. Muy puntuales.", stars: 5, location: "Belgrano" },
  { name: "José L.", text: "Club EnCasa VEN suma rápido. Súper confiables.", stars: 5, location: "CABA" },
  { name: "Ricardo B.", text: "Atención de primera. Me asesoraron por WhatsApp genial.", stars: 5, location: "Lanús" },
  { name: "Valentina S.", text: "Precios justos y combos que valen la pena.", stars: 5, location: "Caballito" },
  { name: "Héctor J.", text: "Comprar desde el celu es re fácil. Sabor maracucho real.", stars: 5, location: "Recoleta" },
  { name: "Patricia M.", text: "Pagar contra entrega me dio mucha seguridad.", stars: 5, location: "Villa Crespo" },
  { name: "Daniel F.", text: "Ya canjeé mi primer descuento. ¡Excelente iniciativa!", stars: 5, location: "San Isidro" }
];

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-venezuela-dark relative">
      {/* Decorative blur circles — aislados para no bloquear touch scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ven-yellow/3 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ven-blue/3 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div>
          <div className="flex items-center gap-2 text-ven-yellow font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Quote size={12} fill="currentColor" /> Experiencias Reales
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-venezuela-brown uppercase tracking-tighter">
            Lo que están{' '}
            <span className="text-ven-yellow">probando todos</span>
          </h2>
          <p className="text-gray-600 mt-4 text-sm font-medium">
            Pedidos reales y opiniones de quienes ya probaron EnCasa Venezuela.
          </p>
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
        className="flex gap-6 overflow-x-auto no-scrollbar px-6 pb-16 snap-x snap-mandatory relative"
        style={{
          touchAction: 'pan-x',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="min-w-[300px] md:min-w-[420px] snap-center bg-white p-8 md:p-10 rounded-[40px] border border-black/5 relative group transition-all duration-300 hover:border-ven-yellow shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute top-8 right-8 text-black/5 group-hover:text-ven-yellow/15 transition-colors">
              <Quote size={64} fill="currentColor" />
            </div>

            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ven-yellow via-ven-blue to-ven-red flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white/20 shrink-0">
                {rev.name[0]}
              </div>
              <div>
                <p className="font-black text-base text-venezuela-brown uppercase tracking-tight group-hover:text-venezuela-orange transition-colors">{rev.name}</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] bg-black/5 px-2 py-0.5 rounded-lg mt-1 inline-block">{rev.location}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-7 italic font-semibold">
              "{rev.text}"
            </p>

            <div className="flex items-center gap-2 border-t border-black/5 pt-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-ven-yellow text-ven-yellow drop-shadow-sm" />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1">Verificado</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center relative">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Deslizá para leer más opiniones</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Testimonials;
