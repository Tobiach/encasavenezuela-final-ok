import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../lib/hooks/useProducts';

const CategoriesNew: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    sessionStorage.setItem('encasa_scroll_/', String(window.scrollY));
    navigate(`/categoria/${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-6 bg-white border-b border-black/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-4">
          <h2 className="font-black text-xl text-gray-900">Explorá por categoría</h2>
          <p className="text-xs text-gray-400 mt-0.5">Deslizá para ver todas</p>
        </div>

        <div
          className="cat-scroll flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="snap-start shrink-0 active:scale-95 transition-transform duration-200"
              style={{ width: 120, height: 100, flexShrink: 0 }}
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-sm w-full h-full"
                style={{ width: 120, height: 100 }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 px-2 pb-2 text-white font-bold text-[11px] leading-tight">
                  {cat.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default CategoriesNew;
