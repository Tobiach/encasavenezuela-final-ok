import React from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../lib/hooks/useStores';
import { useFavorites } from '../lib/hooks/useFavorites';

const FavoritesView: React.FC = () => {
  const navigate = useNavigate();
  const { stores } = useStores();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteStores = stores.filter(s => favorites.includes(s.id));

  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Mis Favoritos 💛</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tus locales venezolanos guardados</p>
        </div>

        {favoriteStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={28} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-600 text-base">Aún no guardaste favoritos</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs leading-relaxed">
              Tocá el corazón en los locales que más te gusten para guardarlos acá.
            </p>
            <button
              onClick={() => navigate('/partners')}
              className="mt-6 bg-[#6B1D1D] text-white font-bold text-sm rounded-2xl px-6 py-3 active:scale-95 transition-all shadow-sm"
            >
              Explorar locales →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {favoriteStores.map(store => (
              <div
                key={store.id}
                onClick={() => navigate(`/catalog?store=${store.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 duration-200"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                  <button
                    onClick={e => { e.stopPropagation(); toggleFavorite(store.id); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow active:scale-90 transition-all"
                    title="Quitar de favoritos"
                  >
                    <Heart size={14} className="fill-[#6B1D1D] text-[#6B1D1D]" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{store.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                    <span className="text-xs text-gray-500">{store.rating.toFixed(1)}</span>
                    <span className="text-gray-300 mx-1">·</span>
                    <MapPin size={10} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400 truncate">{store.neighborhood}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesView;
