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
    <div className="w-10 h-10 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
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
          <p className="text-xs font-black text-[#1F2937] leading-tight line-clamp-2 flex-1">{product.name}</p>
          {product.oldPrice && (
            <p className="text-[10px] text-gray-400 line-through mt-1">${product.oldPrice.toLocaleString('es-AR')}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="font-black text-sm text-[#1F2937]">${product.price.toLocaleString('es-AR')}</span>
            <button onClick={handleAdd} className="w-8 h-8 bg-[#8B1A1A] rounded-xl flex items-center justify-center active:scale-90 transition-all">
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
                <h3 className="font-black text-[#1F2937] text-base leading-tight">{product.name}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Seleccioná la cantidad</p>
              </div>
              <button onClick={() => setShowVariant(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {variants.map(v => (
                <button key={v.label} onClick={() => setSelectedVariant(v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${selectedVariant?.label === v.label ? 'border-[#8B1A1A] bg-[#8B1A1A]/5' : 'border-gray-100 bg-gray-50'}`}>
                  <span className="font-bold text-sm text-[#1F2937]">{v.label}</span>
                  <span className="font-black text-sm text-[#1F2937]">${Math.round(product.price * v.multiplier).toLocaleString('es-AR')}</span>
                </button>
              ))}
            </div>
            <button onClick={confirmVariant} className="w-full bg-[#8B1A1A] text-white font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-all">
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
        <h3 className="font-black text-[#1F2937] text-lg leading-tight">{combo.name}</h3>
        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{combo.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {combo.oldPrice && <span className="text-xs text-gray-400 line-through">${combo.oldPrice.toLocaleString('es-AR')}</span>}
          <span className="text-2xl font-black text-[#1F2937]">${combo.price.toLocaleString('es-AR')}</span>
          {combo.oldPrice && (
            <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] text-[10px] font-black px-2 py-0.5 rounded-full">
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
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${variants[vi.name] === opt ? 'border-[#8B1A1A] bg-[#8B1A1A] text-white' : 'border-gray-200 text-[#6B7280] bg-gray-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 pt-3 pb-6">
        <button onClick={onConfirm} className="w-full bg-[#8B1A1A] text-white font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-all shadow-lg shadow-[#8B1A1A]/20 flex items-center justify-center gap-2">
          <ShoppingBag size={16} /> Agregar combo al carrito →
        </button>
      </div>
    </div>
  </div>
);

// ── CombosSection — mismo estilo que Promotions.tsx ────────────────────────
const CombosSection: React.FC<{
  combos: StoreCombo[];
  storeName: string;
  onOpen: (c: StoreCombo) => void;
  onAddDirectly: (c: StoreCombo) => void;
}> = ({ combos, storeName, onOpen, onAddDirectly }) => (
  <div className="py-8 bg-[#2D1618]">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-[#FFD700] font-bold mb-2 bg-[#FFD700]/10 px-4 py-1.5 rounded-full border border-[#FFD700]/20">
          <Flame size={16} className="animate-pulse" />
          <span className="uppercase tracking-[0.2em] text-[10px]">Promociones Especiales</span>
        </div>
        <h2 className="text-2xl font-black mt-1 uppercase tracking-tighter text-[#D4AF37]">
          Combos <span className="text-[#FFD700]">Especiales</span>
        </h2>
        <p className="text-gray-400 mt-2 text-xs font-medium">
          Los mejores paquetes para ahorrar y disfrutar como en casa.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {combos.map((combo) => {
          const savingsPercent = combo.oldPrice ? Math.round((1 - combo.price / combo.oldPrice) * 100) : 0;
          return (
            <div
              key={combo.id}
              onClick={() => onOpen(combo)}
              className="min-w-[300px] bg-white rounded-[32px] border-2 border-black/5 p-4 flex flex-row items-center gap-4 group hover:border-[#FFD700] transition-all duration-500 relative overflow-hidden cursor-pointer shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#8B1A1A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative w-28 h-28 shrink-0 rounded-[24px] overflow-hidden shadow-xl border-2 border-black/5 bg-white">
                <img
                  src={getImageUrl(combo.imgPath)}
                  alt={combo.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-2 left-2 bg-white/40 backdrop-blur-md text-[#1F2937] px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-sm border border-white/20">
                  <Zap size={8} fill="currentColor" className="text-[#FFD700]" /> COMBO
                </div>
                {savingsPercent > 0 && (
                  <div className="absolute bottom-2 right-2 bg-[#8B1A1A]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[9px] font-black shadow-xl border border-white/20">
                    -{savingsPercent}%
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                  <Store size={11} className="text-[#FFD700] shrink-0" />
                  <span className="text-[8px] font-black uppercase tracking-[0.15em] truncate">{storeName}</span>
                </div>
                <h3 className="text-sm font-black mb-1.5 group-hover:text-[#8B1A1A] transition-colors leading-tight uppercase tracking-tight text-[#1F2937]">
                  {combo.name}
                </h3>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <span className="bg-white/40 backdrop-blur-md text-[#8B1A1A] text-[8px] font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1 border border-white/20">
                    <Flame size={8} fill="currentColor" /> Relámpago
                  </span>
                  <span className="bg-white/40 backdrop-blur-md text-[#002FA7] text-[8px] font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1 border border-white/20">
                    <Clock size={8} /> Limitado
                  </span>
                </div>
                {combo.description && (
                  <p className="text-[9px] text-gray-700 font-medium leading-snug mb-2 line-clamp-2">{combo.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    {combo.oldPrice && (
                      <span className="text-[10px] text-gray-400 line-through font-bold mb-0.5">${combo.oldPrice.toLocaleString('es-AR')}</span>
                    )}
                    <span className="text-xl font-black text-[#1F2937] tracking-tighter">${combo.price.toLocaleString('es-AR')}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onAddDirectly(combo); }}
                    className="bg-[#8B1A1A] text-white p-3 rounded-2xl hover:scale-110 active:scale-90 transition-all shadow-xl shadow-[#8B1A1A]/30"
                  >
                    <Plus size={20} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────
interface StoreDetailViewProps {
  onAddToCart: (product: Product, storeId?: string) => void;
  onSelectStore: (store: PartnerStore | null) => void;
}

const STRICT_STORES = new Set(['minimarket-vibe', 'crispric', 'real-3', 'real-13']);
const DEMO_MODE = true;

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
    const isStrict = STRICT_STORES.has(slug);
    if (!DEMO_MODE || isStrict) {
      return allProducts.filter(p => p.storeId === slug || p.availableInStoreIds?.includes(slug));
    }
    return allProducts;
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
    combo.variantItems?.forEach(v => { defaults[v.name] = v.options[0]; });
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
        <h2 className="text-xl font-black text-[#1F2937] mb-2">Local no encontrado</h2>
        <p className="text-[#6B7280] text-sm mb-6 max-w-xs">Este local no está disponible o el link no es válido.</p>
        <button onClick={() => navigate('/')} className="bg-[#8B1A1A] text-white font-bold px-8 py-3 rounded-2xl">
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!store) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">

      {/* Hero */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-all">
          <ArrowLeft size={20} className="text-white" />
        </button>
        {store.plan === 'premium' && (
          <div className="absolute top-4 right-4 bg-[#D4AF37] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            ⭐ Premium
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-black text-white leading-tight tracking-tight">{store.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-[#FFD700] text-[#FFD700]" />
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
              <span key={tag} className="shrink-0 bg-[#FFD700]/15 text-[#1F2937] text-[10px] font-bold px-3 py-1 rounded-full border border-[#FFD700]/25">
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
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
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
                    ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white shadow-sm'
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

      {/* CTA checkout flotante */}
      <div className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none">
        <button
          onClick={() => navigate('/checkout')}
          className="pointer-events-auto w-full bg-[#8B1A1A] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-[#8B1A1A]/30 active:scale-[0.98] transition-all"
        >
          <ShoppingBag size={18} />
          Confirmar pedido por WhatsApp →
        </button>
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
