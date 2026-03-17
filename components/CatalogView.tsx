
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Zap, Sparkles, ArrowLeft, LayoutGrid, Utensils, Beaker, IceCream, Pizza, Package, MapPin, ChevronRight, Star, Clock } from 'lucide-react';
import { Product, PartnerStore } from '../types';
import ProductDetailView from './ProductDetailView';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { allProducts } from '../data/catalogData';
import { useNavigate, useLocation } from 'react-router-dom';


// MODO DEMO: Si es true, todos los locales muestran todos los productos
const DEMO_MODE = true;

const categoryIcons: Record<string, React.ElementType> = {
  'Todos': LayoutGrid,
  'Harinas': Utensils,
  'Lácteos': Pizza,
  'Congelados': IceCream,
  'Bebidas': Beaker,
  'Golosinas': Sparkles,
  'Salsas': Utensils,
  'Almacén': Package
};

interface CatalogViewProps {
  onAddToCart: (product: Product, storeId?: string) => void;
  selectedStore: PartnerStore | null;
  onSelectStore: (store: PartnerStore | null) => void;
}

const CatalogView: React.FC<CatalogViewProps> = ({ onAddToCart, selectedStore, onSelectStore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState(location.state?.category || 'Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Scroll al inicio cuando se selecciona un local
  useEffect(() => {
    if (selectedStore) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedStore]);

  // Filtrado de Locales por Producto (Marketplace Inteligente)
  const displayedStores = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let baseStores = LOCALES_VENEZOLANOS;
    
    // 1. Filtrar por Categoría (si viene de la navegación de categorías)
    if (category !== 'Todos') {
      const storesWithCategory = new Set(
        allProducts
          .filter(p => p.category === category)
          .flatMap(p => p.availableInStoreIds || [])
      );
      baseStores = baseStores.filter(s => storesWithCategory.has(s.id));
    }

    // 2. Filtrar por término de búsqueda
    if (term !== '') {
      // 1. Encontrar IDs de locales que tienen productos que coinciden con la búsqueda
      const matchingProductStoreIds = new Set(
        allProducts
          .filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.category.toLowerCase().includes(term) ||
            (p.usageInfo && p.usageInfo.toLowerCase().includes(term))
          )
          .flatMap(p => p.availableInStoreIds || [])
      );
      
      // 2. Filtrar locales: que tengan el producto O que el nombre/barrio del local coincida
      baseStores = baseStores.filter(s => 
        matchingProductStoreIds.has(s.id) || 
        s.name.toLowerCase().includes(term) ||
        s.neighborhood?.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term)
      );
    }

    // Ordenar: Premium primero, pero manteniendo el filtro
    return [...baseStores].sort((a, b) => {
      if (a.plan === 'premium' && b.plan !== 'premium') return -1;
      if (a.plan !== 'premium' && b.plan === 'premium') return 1;
      return 0;
    });
  }, [searchTerm, category]);

  const premiumStores = useMemo(() => {
    return LOCALES_VENEZOLANOS.filter(s => s.plan === 'premium');
  }, []);

  const filteredProducts = useMemo(() => {
  return allProducts.filter(p => {
    const matchesCat = category === 'Todos' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Lógica de filtrado por Local + DEMO_MODE + Regla Legacy
    let matchesStore = true;
    if (!DEMO_MODE && selectedStore) {
      const hasStoreIds = p.availableInStoreIds && p.availableInStoreIds.length > 0;
      if (hasStoreIds && p.availableInStoreIds) {
        matchesStore = p.availableInStoreIds.includes(selectedStore.id);
      } else {
        // REGLA LEGACY: Si no tiene IDs o está vacío, se muestra siempre (compatibilidad)
        matchesStore = true;
      }
    }

    return matchesCat && matchesSearch && matchesStore;
  });
}, [category, searchTerm, selectedStore]);


  const categories = ['Todos', 'Harinas', 'Lácteos', 'Congelados', 'Bebidas', 'Golosinas', 'Salsas', 'Almacén'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {viewingProduct && (
        <ProductDetailView 
          product={viewingProduct} 
          allProducts={allProducts}
          onClose={() => setViewingProduct(null)}
          onAddToCart={onAddToCart}
          onSelectStore={(s) => {
            onSelectStore(s);
            setViewingProduct(null);
          }}
          storeId={selectedStore?.id}
        />
      )}

      {/* Header Dinámico */}
      <div className="flex flex-col gap-6 mb-8 md:mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (selectedStore) {
                onSelectStore(null);
              } else {
                navigate(-1); // Volver realmente a la sección anterior
              }
            }}
            className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:bg-ven-yellow hover:text-venezuela-dark transition-all shadow-lg active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none text-venezuela-brown">
              {selectedStore ? selectedStore.name : 'Marketplace Locales'}
            </h1>
            <p className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-2 italic">
              {selectedStore ? `Explorando el sabor en ${selectedStore.neighborhood}` : 'Busca por local o por tu producto favorito, pana'}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={selectedStore ? "¿Qué buscas en este local?" : "¿Qué se te antoja hoy? (Harina, Malta, etc.)"} 
            className="w-full bg-white border border-black/10 rounded-[24px] py-4.5 pl-14 pr-6 focus:outline-none focus:border-ven-yellow transition-all text-sm shadow-inner text-venezuela-brown"
          />
        </div>

        {/* Categorías Mobile */}
        {selectedStore && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 md:hidden">
            {categories.map(cat => {
              const Icon = categoryIcons[cat] || LayoutGrid;
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2.5 shrink-0 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-ven-yellow to-venezuela-orange border-ven-yellow text-white shadow-[0_10px_25px_rgba(212,175,55,0.4)] scale-105' 
                      : 'bg-black/5 border-black/5 text-gray-600 hover:bg-black/10'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-white' : 'text-ven-yellow'} />
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!selectedStore ? (
        // VISTA DE LOCALES (MARKETPLACE)
        <div className="animate-in fade-in duration-700 space-y-12">
          {/* Sección Premium Destacada */}
          {searchTerm === '' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-venezuela-orange rounded-lg flex items-center justify-center text-white shadow-lg">
                  <Zap size={18} fill="currentColor" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-venezuela-brown">Locales <span className="text-venezuela-orange">Premium</span></h2>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                {premiumStores.map(store => (
                    <div 
                      key={`premium-${store.id}`}
                      onClick={() => onSelectStore(store)}
                      className="group min-w-[280px] md:min-w-[320px] bg-white rounded-[32px] border-2 border-venezuela-orange/30 overflow-hidden transition-all duration-300 hover:border-venezuela-orange hover:-translate-y-2 cursor-pointer flex flex-col shadow-2xl relative"
                    >
                      <div className="absolute top-4 left-4 z-10 bg-venezuela-orange text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xl border border-white/20">
                        <Zap size={10} fill="currentColor" /> RECOMENDADO
                      </div>
                      <div className="relative aspect-video overflow-hidden">
                          <img src={store.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                            <Star size={10} className="fill-ven-yellow text-ven-yellow" />
                            <span className="text-[10px] font-black text-white">{store.rating.toFixed(1)}</span>
                          </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                          <div className="mb-3">
                            <h3 className="text-lg md:text-xl font-black text-venezuela-brown leading-tight mb-1 group-hover:text-venezuela-orange transition-colors truncate uppercase tracking-tight">{store.name}</h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={14} className="text-venezuela-orange" />
                              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">30-45 min • Retiro</span>
                            </div>
                          </div>
                          <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest"><MapPin size={12} className="text-ven-red" /> {store.location}</div>
                            <ChevronRight size={20} className="text-venezuela-orange group-hover:translate-x-1 transition-all" />
                          </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter text-venezuela-brown">Todos los <span className="text-gray-500">Locales</span></h2>
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{displayedStores.length} resultados</p>
            </div>
            {displayedStores.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayedStores.map(store => (
                  <div 
                    key={store.id}
                    onClick={() => onSelectStore(store)}
                    className={`group bg-white rounded-[32px] border-2 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col shadow-xl ${store.plan === 'premium' ? 'border-venezuela-orange/40 shadow-venezuela-orange/10' : 'border-black/5 hover:border-ven-yellow/40'}`}
                  >
                    <div className="aspect-video overflow-hidden relative">
                        <img src={store.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {store.plan === 'premium' && (
                            <div className="bg-venezuela-orange text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-lg border border-white/20">
                              <Zap size={8} fill="currentColor" /> Premium
                            </div>
                          )}
                        </div>
                    </div>
                    <div className="p-5 flex-grow">
                        <h3 className="font-black text-venezuela-brown uppercase tracking-tight truncate mb-1 text-sm md:text-base group-hover:text-venezuela-orange transition-colors">{store.name}</h3>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          <MapPin size={12} className="text-ven-red" /> {store.neighborhood}
                        </div>
                    </div>
                    <div className="px-5 pb-5 mt-auto">
                      <div className="w-full bg-black/5 py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-venezuela-orange group-hover:bg-gradient-to-r group-hover:from-ven-yellow group-hover:to-venezuela-orange group-hover:text-white transition-all shadow-sm group-hover:shadow-lg">
                        Ver local
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-black/5 rounded-[40px] border border-black/5 flex flex-col items-center gap-4">
                <Package className="text-gray-400" size={48} />
                <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.2em]">No encontramos locales con ese producto, pana.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // VISTA DE PRODUCTOS DEL LOCAL
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in slide-in-from-right duration-500">
          {/* Categorías Sidebar Desktop */}
          <div className="hidden md:block space-y-2">
            <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-gray-700 mb-6 px-4">Selecciona Categoría</h3>
            <div className="space-y-1.5">
              {categories.map(cat => {
                const Icon = categoryIcons[cat] || LayoutGrid;
                const isActive = category === cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-4 w-full text-left px-6 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                      isActive 
                        ? 'bg-gradient-to-br from-ven-yellow to-venezuela-orange border-ven-yellow/50 text-white shadow-2xl shadow-venezuela-orange/20 translate-x-2' 
                        : 'bg-black/5 border-transparent hover:bg-black/10 text-gray-600 hover:text-venezuela-brown'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-white/10' : 'bg-black/5'}`}>
                      <Icon size={16} className={isActive ? 'text-white' : 'text-ven-yellow'} />
                    </div>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-black/5 rounded-[40px] border border-black/5 flex flex-col items-center gap-4">
                <Package className="text-gray-400" size={48} />
                <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.2em]">No hay productos en esta sección, pana.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => setViewingProduct(product)}
                    className="bg-white rounded-[32px] border-2 border-black/5 p-4 group flex flex-col h-[350px] md:h-[450px] overflow-hidden hover:border-ven-yellow transition-all duration-300 cursor-pointer shadow-xl hover:-translate-y-2"
                  >
                    <div className="aspect-square shrink-0 rounded-[24px] overflow-hidden mb-5 relative border border-black/5">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-ven-blue/80 backdrop-blur-md text-[9px] font-black text-white px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/20 shadow-lg">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-black text-sm md:text-base mb-2 leading-tight h-12 overflow-hidden uppercase tracking-tight text-venezuela-brown group-hover:text-venezuela-orange transition-colors">{product.name}</h4>
                    <p className="text-[10px] md:text-xs text-gray-500 italic line-clamp-2 mb-4 font-bold min-h-[3em] leading-relaxed">
                      {product.usageInfo || `${product.category} de calidad superior, ideal para disfrutar en cualquier momento.`}
                    </p>
                    <div className="mt-auto pt-5 border-t border-black/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Precio</span>
                        <span className="text-venezuela-brown font-black text-xl md:text-2xl tracking-tighter">${product.price}</span>
                      </div>
                      <button 
                        onClick={(e) => {
  e.stopPropagation();

  // tracking seguro (si existe, trackea; si no, no rompe)
  try {
    const win = window as unknown as { encasaTrack?: (event: string, data: Record<string, unknown>) => void };
    win.encasaTrack?.("add_to_cart", {
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
      storeId: selectedStore?.id || (product as { storeId?: string }).storeId || null,
      source: "catalog",
      ts: Date.now(),
    });
  } catch (err) {
    // no hacemos nada: NO debe bloquear el carrito
  }

  onAddToCart(product, selectedStore?.id);
}}
                        className="bg-gradient-to-br from-ven-yellow to-venezuela-orange text-white p-3 md:p-4 rounded-2xl shadow-xl shadow-venezuela-orange/20 active:scale-90 transition-all hover:brightness-110 border border-white/20"
                      >
                        <Plus size={22} strokeWidth={4} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CatalogView;
