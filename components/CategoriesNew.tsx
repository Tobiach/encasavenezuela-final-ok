import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../lib/hooks/useProducts';

const CategoriesNew: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate('/catalog', { state: { category: categoryName } });
  };

  return (
    <section className="py-6 bg-white border-b border-black/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="font-black text-xl text-gray-900">Explorá por categoría</h2>
          <p className="text-xs text-gray-400 mt-0.5">Deslizá para ver todas</p>
        </div>

        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-x' }}
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="snap-start shrink-0 min-w-[120px] h-[100px] rounded-2xl overflow-hidden relative cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 shadow-sm"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-2 left-2 right-2 text-white font-bold text-[11px] leading-tight">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        section div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default CategoriesNew;
