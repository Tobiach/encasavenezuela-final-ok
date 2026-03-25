
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { categories } from '../lib/hooks/useProducts';

interface CategoriesProps {
  onCategorySelect: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  return (
    <section className="py-12 bg-venezuela-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-venezuela-brown">Explora nuestras <span className="text-ven-yellow">categorías</span></h2>
            <p className="text-gray-600 text-sm mt-1">Todo lo que extrañás de Venezuela a un clic.</p>
          </div>
          <button
            onClick={onCategorySelect}
            className="flex items-center gap-2 text-ven-yellow font-black text-xs uppercase tracking-widest hover:underline active:scale-95 transition-transform"
          >
            Ver todas <ArrowRight size={16} />
          </button>
        </div>

        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 pb-4"
          style={{
            touchAction: 'pan-x',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={onCategorySelect}
              className="snap-start relative rounded-[28px] overflow-hidden cursor-pointer active:scale-95 transition-all shadow-xl border border-black/5"
              style={{ width: '185px', height: '185px', flexShrink: 0 }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
              >
                <h4 className="text-[13px] font-black text-white uppercase tracking-tight leading-tight">{cat.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
