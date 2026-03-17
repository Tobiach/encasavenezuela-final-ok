
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/catalogData';

interface CategoriesProps {
  onCategorySelect: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  return (
    <section className="py-12 bg-venezuela-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-venezuela-brown">Explora nuestras categorías</h2>
            <p className="text-gray-600">Todo lo que extrañas de Venezuela a un clic.</p>
          </div>
          <button 
            onClick={onCategorySelect}
            className="flex items-center gap-2 text-ven-yellow font-bold hover:underline"
          >
            Ver todas <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={onCategorySelect}
              className="relative aspect-square rounded-[32px] overflow-hidden group cursor-pointer border border-black/5"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 category-overlay flex flex-col justify-end p-6">
                <h4 className="text-lg font-bold text-white">{cat.name}</h4>
                <p className="text-xs text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
