import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Clock, Plus, Package, ShoppingBag,
  X, Zap, Flame, Store, CheckCircle, Search,
} from 'lucide-react';
import { useStores } from '../lib/hooks/useStores';
import { useProducts } from '../lib/hooks/useProducts';
import { Product, PartnerStore } from '../types';
import { STORE_COMBOS, StoreCombo } from '../data/storeCombos';
import { getImageUrl } from '../lib/supabase';
import ProductDetailView from './ProductDetailView';

// ── Variantes ──────────────────────────────────────────────────────────────
interface ProductVariant { label: string; multiplier: number; }
const PRODUCT_VARIANTS: Record<string, ProductVariant[]> = {
  'caraotas':  [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'chuleta':   [{ label: '500g', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'huevo':     [{ label: '6 unidades', multiplier: 0.5 }, { label: '12 unidades', multiplier: 1 }, { label: 'Maple x30', multiplier: 3 }],
  'plátano':   [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'platano':   [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'queso':     [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
};
function getVariants(name: string): ProductVariant[] | null {
  const lower = name.toLowerCase();
  for (const [key, variants] of Object.entries(PRODUCT_VARIANTS)) {
    if (lower.includes(key)) return variants;
  }
  return null;
}

// ── Spinner ────────────────────────────────────────────────────────────────
const Spinner: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#F4C542] border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── ProductCard ─────────────────────────────────────────────────────────────
const ProductCard: React.FC<{
  product: Product;
  storeId: string;
  onAddToCart: (p: Product, storeId?: string) => void;
}> = ({ product, storeId, onAddToCart }) => {
  const variants = getVariants(product.name);
  const [showVariant, setShowVariant] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variants && variants.length > 1) { setShowVariant(true); return; }
    onAddToCart(product, storeId);
  };

  const confirmVariant = () => {
    if (!selectedVariant) return;
    onAddToCart({ ...product, name: `${product.name} — ${selectedVariant.label}`, price: Math.round(product.price * selectedVariant.multiplier) }, storeId);
    setShowVariant(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
          <img src={product.img} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-xs font-black text-[#2E1A14] leading-tight line-clamp-2 flex-1">{product.name}</p>
          {product.oldPrice && (
            <p className="text-[10px] text-gray-400 line-through mt-1">${product.oldPrice.toLocaleString('es-AR')}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="font-black text-sm text-[#2E1A14]">${product.price.toLocaleString('es-AR')}</span>
            <button onClick={handleAdd} className="w-8 h-8 bg-[#6B1D1D] rounded-xl flex items-center justify-center active:scale-90 transition-all">
              <Plus size={16} strokeWidth={3} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {showVariant && variants && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 px-4 pb-6" onClick={() => setShowVariant(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-black text-[#2E1A14] text-base leading-tight">{product.name}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Seleccioná la cantidad</p>
              </div>
              <button onClick={() => setShowVariant(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {variants.map(v => (
                <button key={v.label} onClick={() => setSelectedVariant(v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${selectedVariant?.label === v.label ? 'border-[#6B1D1D] bg-[#6B1D1D]/5' : 'border-gray-100 bg-gray-50'}`}>
                  <span className="font-bold text-sm text-[#2E1A14]">{v.label}</span>
                  <span className="font-black text-sm text-[#2E1A14]">${Math.round(product.price * v.multiplier).toLocaleString('es-AR')}</span>
                </button>
              ))}
            </div>
            <button onClick={confirmVariant} className="w-full bg-[#6B1D1D] text-white font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-all">
              Agregar al carrito →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ── ComboVariantModal ─────────────────────────────────────────────────────
const ComboVariantModal: React.FC<{
  combo: StoreCombo;
  variants: Record<string, string>;
  onVariantChange: (name: string, val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ combo, variants, onVariantChange, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/50 px-4 pb-6" onClick={onClose}>
    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="relative h-36 overflow-hidden">
        <img src={getImageUrl(combo.imgPath)} alt={combo.name} className="w-full h-full object-contain bg-gray-50 p-4" />
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
          <X size={16} className="text-white" />
        </button>
      </div>
      <div className="px-5 pt-4 pb-2">
        <h3 className="font-black text-[#2E1A14] text-lg leading-tight">{combo.name}</h3>
        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{combo.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {combo.oldPrice && <span className="text-xs text-gray-400 line-through">${combo.oldPrice.toLocaleString('es-AR')}</span>}
          <span className="text-2xl font-black text-[#2E1A14]">${combo.price.toLocaleString('es-AR')}</span>
          {combo.oldPrice && (
            <span className="bg-[#6B1D1D]/10 text-[#6B1D1D] text-[10px] font-black px-2 py-0.5 rounded-full">
              -{Math.round((1 - combo.price / combo.oldPrice) * 100)}%
            </span>
          )}
        </div>
      </div>

      {combo.items.length > 0 && (
        <div className="px-5 pt-2 pb-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Incluye</p>
          <div className="flex flex-wrap gap-1.5">
            {combo.items.map(item => (
              <span key={item} className="bg-gray-100 text-[#6B7280] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {combo.variantItems && combo.variantItems.length > 0 && (
        <div className="px-5 pt-3 pb-2 space-y-3">
          {combo.variantItems.map(vi => (
            <div key={vi.name}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{vi.name}</p>
              <div className="flex gap-2 flex-wrap">
                {vi.options.map(opt => (
                  <button key={opt} onClick={() => onVariantChange(vi.name, opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${variants[vi.name] === opt ? 'border-[#6B1D1D] bg-[#6B1D1D] text-white' : 'border-gray-200 text-[#6B7280] bg-gray-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 pt-3 pb-6">
        {(() => {
          const allSelected = !combo.variantItems?.some(v => !variants[v.name]);
          return (
            <button
              onClick={onConfirm}
              disabled={!allSelected}
              className={`w-full font-black py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 ${allSelected ? 'bg-[#6B1D1D] text-white active:scale-[0.98] shadow-lg shadow-[#6B1D1D]/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <ShoppingBag size={16} /> {allSelected ? 'Agregar combo al carrito →' : 'Seleccioná todas las opciones'}
            </button>
          );
        })()}
      </div>
    </div>
  </div>
);

// ── CombosSection — cards compactas con marquee automático ────────────────
const CombosSection: React.FC<{
  combos: StoreCombo[];
  storeName: string;
  onOpen: (c: StoreCombo) => void;
  onAddDirectly: (c: StoreCombo) => void;
}> = ({ combos, storeName, onOpen, onAddDirectly }) => {
  const [paused, setPaused] = React.useState(false);
  const looped = [...combos, ...combos];

  return (
    <div className="py-5 bg-[#2D1618]">
      <div className="mb-3 px-4 flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 text-[#F4C542] font-bold bg-[#F4C542]/10 px-3 py-1 rounded-full border border-[#F4C542]/20">
          <Flame size={12} className="animate-pulse" />
          <span className="uppercase tracking-[0.2em] text-[9px]">Combos Especiales</span>
        </div>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className={`flex gap-3 w-max px-4 ${paused ? '' : 'animate-combo-marquee'}`}>
          {looped.map((combo, idx) => {
            const savingsPercent = combo.oldPrice ? Math.round((1 - combo.price / combo.oldPrice) * 100) : 0;
            return (
              <div
                key={`${combo.id}-${idx}`}
                onClick={() => onOpen(combo)}
                className="min-w-[210px] bg-white rounded-2xl border border-black/5 p-3 flex flex-col gap-2 cursor-pointer shadow-md active:scale-[0.97] transition-all"
              >
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <img
                    src={getImageUrl(combo.imgPath)}
                    alt={combo.name}
                    className="w-full h-full object-contain p-1.5"
                  />
                  {savingsPercent > 0 && (
                    <div className="absolute top-1.5 right-1.5 bg-[#6B1D1D] text-white px-1.5 py-0.5 rounded-lg text-[8px] font-black">
                      -{savingsPercent}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-[10px] font-black text-[#2E1A14] uppercase leading-tight line-clamp-2 mb-1">
                    {combo.name}
                  </p>
                  {combo.description && (
                    <p className="text-[9px] text-gray-600 leading-snug line-clamp-2 mb-1.5">{combo.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-[#2E1A14]">${combo.price.toLocaleString('es-AR')}</span>
                    <button
                      onClick={e => { e.stopPropagation(); onAddDirectly(combo); }}
                      className="bg-[#6B1D1D] text-white w-7 h-7 rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-md"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes combo-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-combo-marquee { animation: combo-marquee 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .animate-combo-marquee { animation: none; } }
      `}</style>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────
interface StoreDetailViewProps {
  onAddToCart: (product: Product, storeId?: string) => void;
  onSelectStore: (store: PartnerStore | null) => void;
}

const DEMO_MODE = false;

const StoreDetailView: React.FC<StoreDetailViewProps> = ({ onAddToCart, onSelectStore }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { stores } = useStores();
  const { allProducts, loading } = useProducts();
  const [comboModal, setComboModal] = useState<StoreCombo | null>(null);
  const [comboVariants, setComboVariants] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const store = stores.find(s => s.id === slug);

  useEffect(() => {
    if (store) onSelectStore(store);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.id]);

  const storeProducts = useMemo(() => {
    if (!slug) return [];
    const own = allProducts.filter(p => p.storeId === slug || p.availableInStoreIds?.includes(slug));
    if (own.length > 0) return own;
    // Fallback: catálogo general de minimarket para locales sin catálogo propio
    return allProducts.filter(p => p.storeId === 'minimarket-vibe');
  }, [allProducts, slug]);

  const storeCombos = useMemo(() => {
    if (!store) return [];
    return STORE_COMBOS.filter(c =>
      c.storeType === 'all' || (c.storeType === 'productos' && store.type === 'productos')
    );
  }, [store]);

  const productCategories = useMemo(() => {
    const cats = Array.from(new Set(storeProducts.map(p => p.category).filter(Boolean)));
    return ['Todos', ...cats];
  }, [storeProducts]);

  const filteredProducts = useMemo(() => {
    return storeProducts.filter(p => {
      const matchesCat = activeCategory === 'Todos' || p.category === activeCategory;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [storeProducts, activeCategory, searchQuery]);

  const openComboModal = (combo: StoreCombo) => {
    const defaults: Record<string, string> = {};
    combo.variantItems?.forEach(v => { defaults[v.name] = v.options[0] || ''; });
    setComboVariants(defaults);
    setComboModal(combo);
  };

  const addComboToCart = () => {
    if (!comboModal || !slug) return;
    const variantDesc = Object.entries(comboVariants).map(([k, v]) => `${k} ${v}`).join(' · ');
    onAddToCart({
      id: comboModal.id,
      name: variantDesc ? `${comboModal.name} (${variantDesc})` : comboModal.name,
      price: comboModal.price,
      category: 'Combos',
      img: getImageUrl(comboModal.imgPath),
      isCombo: true,
      storeId: slug,
    }, slug);
    setComboModal(null);
  };

  const addComboDirectly = (combo: StoreCombo) => {
    if (!combo.variantItems || combo.variantItems.length === 0) {
      onAddToCart({ id: combo.id, name: combo.name, price: combo.price, category: 'Combos', img: getImageUrl(combo.imgPath), isCombo: true, storeId: slug }, slug);
    } else {
      openComboModal(combo);
    }
  };

  if (loading && stores.length === 0) return <Spinner />;

  if (!loading && stores.length > 0 && !store) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center pb-24">
        <div className="text-6xl mb-4">🏪</div>
        <h2 className="text-xl font-black text-[#2E1A14] mb-2">Local no encontrado</h2>
        <p className="text-[#6B7280] text-sm mb-6 max-w-xs">Este local no está disponible o el link no es válido.</p>
        <button onClick={() => navigate('/')} className="bg-[#6B1D1D] text-white font-bold px-8 py-3 rounded-2xl">
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!store) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-28">

      {/* Hero */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-all">
          <ArrowLeft size={20} className="text-white" />
        </button>
        {store.plan === 'premium' && (
          <div className="absolute top-4 right-4 bg-[#F4C542] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            ⭐ Premium
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-black text-white leading-tight tracking-tight">{store.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-[#F4C542] text-[#F4C542]" />
              <span className="text-white text-xs font-bold">{store.rating.toFixed(1)}</span>
              <span className="text-white/60 text-xs">({store.review_count})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-white/80" />
              <span className="text-white/80 text-xs">{store.neighborhood}</span>
            </div>
            {store.deliveryTime && (
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-white/80" />
                <span className="text-white/80 text-xs">{store.deliveryTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {store.tags?.length > 0 && (
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {store.tags.map(tag => (
              <span key={tag} className="shrink-0 bg-[#F4C542]/15 text-[#2E1A14] text-[10px] font-bold px-3 py-1 rounded-full border border-[#F4C542]/25">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Combos — mismo estilo que Promotions.tsx */}
      {storeCombos.length > 0 && (
        <CombosSection
          combos={storeCombos}
          storeName={store.name}
          onOpen={openComboModal}
          onAddDirectly={addComboDirectly}
        />
      )}

      {/* Búsqueda + Categorías */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 sticky top-0 z-20 shadow-sm">
        {/* Buscador */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Buscar en ${store.name}...`}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#2E1A14] placeholder-gray-400 focus:outline-none focus:border-[#F4C542] focus:ring-2 focus:ring-[#F4C542]/20 transition-all"
          />
        </div>
        {/* Categorías */}
        {productCategories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {productCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#6B1D1D] border-[#6B1D1D] text-white shadow-sm'
                    : 'bg-gray-100 border-gray-100 text-gray-500 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Productos */}
      <div className="px-4 pt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={40} className="text-gray-200 mb-3" />
            <p className="text-[#6B7280] font-medium text-sm">
              {searchQuery ? 'Sin resultados para esa búsqueda' : 'No hay productos cargados aún'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#6B7280] font-medium mb-3">{filteredProducts.length} productos disponibles</p>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(product => (
                <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                  <ProductCard product={product} storeId={slug!} onAddToCart={onAddToCart} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {comboModal && (
        <ComboVariantModal
          combo={comboModal}
          variants={comboVariants}
          onVariantChange={(name, val) => setComboVariants(v => ({ ...v, [name]: val }))}
          onConfirm={addComboToCart}
          onClose={() => setComboModal(null)}
        />
      )}

      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct}
          allProducts={storeProducts}
          stores={stores}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, sId) => { onAddToCart(p, sId || slug); setSelectedProduct(null); }}
          onSelectStore={(s) => { onSelectStore(s); setSelectedProduct(null); }}
          storeId={slug}
        />
      )}

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
};

export default StoreDetailView;
