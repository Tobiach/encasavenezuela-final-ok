
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
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 pb-3"
          style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={onCategorySelect}
              className="snap-start shrink-0 w-[160px] h-[160px] relative rounded-[28px] overflow-hidden group cursor-pointer border border-black/5 active:scale-95 transition-all shadow-lg"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 category-overlay flex flex-col justify-end p-4">
                <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{cat.name}</h4>
                <p className="text-[10px] text-gray-200 mt-0.5 leading-tight line-clamp-2">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
