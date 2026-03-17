
import React, { useState, useMemo } from 'react';
import { MapPin, Star, ChevronRight, ArrowLeft, Clock, Search, Zap } from 'lucide-react';
import { PartnerStore } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { useNavigate } from 'react-router-dom';

interface PartnerStoresProps {
  onViewAll?: () => void;
  onOpenMap: (store: PartnerStore) => void;
  limit?: number;
  isFullView?: boolean;
}

const PartnerStores: React.FC<PartnerStoresProps> = ({ onViewAll, onOpenMap, limit = 6, isFullView = false }) => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add('Todos');
    LOCALES_VENEZOLANOS.forEach(store => {
      store.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredLocales = useMemo(() => {
    return LOCALES_VENEZOLANOS.filter(store => {
      const matchesTag = selectedTag === 'Todos' || store.tags?.includes(selectedTag);
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           store.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [selectedTag, searchQuery]);

  const displayedLocales = useMemo(() => {
    if (isFullView) return filteredLocales;
    // Priorizar locales premium en el Home
    const premium = LOCALES_VENEZOLANOS.filter(s => s.plan === 'premium');
    const prepared = LOCALES_VENEZOLANOS.filter(s => s.isPreparedFood && s.plan !== 'premium');
    return [...premium, ...prepared].slice(0, limit);
  }, [isFullView, filteredLocales, limit]);

  const MarketplaceCard: React.FC<{ store: PartnerStore }> = ({ store }) => (
    <div 
      onClick={() => onOpenMap(store)}
      className={`group flex flex-col bg-black/[0.03] border rounded-[28px] overflow-hidden transition-all duration-300 active:scale-[0.97] hover:bg-black/[0.06] shadow-xl relative ${store.plan === 'premium' ? 'border-ven-yellow/40 ring-1 ring-ven-yellow/10' : 'border-black/5 hover:border-ven-yellow/30'}`}
    >
      {store.plan === 'premium' && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-ven-yellow text-white px-2 py-1 rounded-lg text-[7px] font-black uppercase flex items-center gap-1 shadow-lg border border-white/10">
            <Zap size={8} fill="currentColor" /> Recomendado
          </div>
        </div>
      )}
      
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={store.img} 
          alt={store.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {/* Eliminado label premium duplicado */}
        </div>
        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
          <Star size={10} className="fill-ven-yellow text-ven-yellow" />
          <span className="text-[10px] font-black text-white">{store.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="text-sm md:text-lg font-black text-venezuela-brown leading-tight mb-2 truncate group-hover:text-venezuela-orange transition-colors uppercase tracking-tight">
          {store.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Clock size={12} className="text-venezuela-orange" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">35-50 min • Retiro</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-auto">
          {store.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-[7px] md:text-[8px] font-black text-gray-500 bg-black/5 px-2 py-0.5 rounded-full uppercase border border-black/5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const PreviewCard: React.FC<{ store: PartnerStore }> = ({ store }) => (
    <div 
      onClick={() => onOpenMap(store)}
      className={`group bg-black/[0.03] border rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 hover:bg-black/[0.06] hover:-translate-y-1 cursor-pointer relative ${store.plan === 'premium' ? 'border-ven-yellow/50 ring-1 ring-ven-yellow/20 shadow-[0_0_30px_rgba(255,204,0,0.1)]' : 'border-black/5 hover:border-ven-yellow/30'}`}
    >
      {store.plan === 'premium' && (
        <div className="absolute top-4 left-4 z-10 bg-ven-yellow text-white px-3 py-1 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 shadow-xl">
          <Zap size={10} fill="currentColor" /> Recomendado
        </div>
      )}

      <div className="relative aspect-video overflow-hidden">
        <img src={store.img} alt={store.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50"></div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Eliminado label premium duplicado */}
        </div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
          <Star size={10} className="fill-ven-yellow text-ven-yellow" />
          <span className="text-[10px] font-bold text-white">{store.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-5 md:p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-base md:text-xl font-black text-venezuela-brown leading-tight mb-2 group-hover:text-venezuela-orange transition-colors truncate uppercase tracking-tight">{store.name}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} className="text-venezuela-orange" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">30-45 min • Retiro</span>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest"><MapPin size={12} className="text-ven-red" /> {store.location}</div>
          <ChevronRight size={20} className="text-venezuela-orange group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );

  return (
    <section className={`bg-venezuela-dark transition-all duration-500 ${isFullView ? 'min-h-screen pt-4 pb-24' : 'py-16'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {isFullView ? (
          <div className="animate-in fade-in duration-700">
            <div className="mb-8 space-y-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate('/')}
                  className="w-10 h-10 bg-black/5 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-ven-yellow hover:text-white transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-black text-venezuela-brown tracking-tighter uppercase leading-none">Locales <span className="text-ven-yellow">Vene</span></h2>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1.5">Locales Amigos Verificados</p>
                </div>
                <div className="w-10" />
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  placeholder="Busca locales o barrios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-ven-yellow transition-all placeholder:text-gray-400 text-venezuela-brown"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedTag === tag 
                        ? 'bg-ven-yellow border-ven-yellow text-white shadow-lg shadow-yellow-500/20' 
                        : 'bg-black/5 border-black/5 text-gray-600 hover:border-black/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {filteredLocales.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {filteredLocales.map(store => (
                  <MarketplaceCard key={store.id} store={store} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-700">
                  <Search size={32} />
                </div>
                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">No encontramos locales con esa búsqueda</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-10 flex items-end justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-venezuela-brown">
                  Locales <span className="text-ven-yellow">Recomendados</span>
                </h2>
                <p className="text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-[0.2em]">
                  Comida preparada al toque 🇻🇪
                </p>
              </div>
              {onViewAll && (
                <button 
                  onClick={onViewAll}
                  className="text-[10px] font-black text-ven-yellow uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  Ver todos <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {displayedLocales.map(store => (
                <PreviewCard key={store.id} store={store} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-3 opacity-40">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Sistema de Delivery Verificado</p>
           </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default PartnerStores;
