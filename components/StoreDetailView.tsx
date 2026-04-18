import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Clock, Plus, Package,
  ShoppingBag, X, ChevronRight, CheckCircle,
} from 'lucide-react';
import { useStores } from '../lib/hooks/useStores';
import { useProducts } from '../lib/hooks/useProducts';
import { Product, PartnerStore } from '../types';
import { STORE_COMBOS, StoreCombo } from '../data/storeCombos';

// ── Variantes (misma lógica que CatalogView) ─────────────────────────────────
interface ProductVariant { label: string; multiplier: number; }
const PRODUCT_VARIANTS: Record<string, ProductVariant[]> = {
  'caraotas':        [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'chuleta':         [{ label: '500g', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'huevo':           [{ label: '6 unidades', multiplier: 0.5 }, { label: '12 unidades', multiplier: 1 }, { label: 'Maple x30', multiplier: 3 }],
  'plátano':         [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'platano':         [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
  'queso':           [{ label: 'Medio kilo', multiplier: 0.5 }, { label: '1 kilo', multiplier: 1 }],
};
function getVariants(name: string): ProductVariant[] | null {
  const lower = name.toLowerCase();
  for (const [key, variants] of Object.entries(PRODUCT_VARIANTS)) {
    if (lower.includes(key)) return variants;
  }
  return null;
}

// ── Spinner ──────────────────────────────────────────────────────────────────
const Spinner: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── ProductCard ───────────────────────────────────────────────────────────────
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
    const finalProduct: Product = {
      ...product,
      name: `${product.name} — ${selectedVariant.label}`,
      price: Math.round(product.price * selectedVariant.multiplier),
    };
    onAddToCart(finalProduct, storeId);
    setShowVariant(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
          <img src={product.img} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />
        </div>
        <div className="p-3 flex flex-col flex-1">
          <p className="text-xs font-black text-gray-900 leading-tight line-clamp-2 flex-1">{product.name}</p>
          {product.oldPrice && (
            <p className="text-[10px] text-gray-400 line-through mt-1">${product.oldPrice.toLocaleString('es-AR')}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="font-black text-sm text-gray-900">${product.price.toLocaleString('es-AR')}</span>
            <button
              onClick={handleAdd}
              className="w-8 h-8 bg-[#8B1A1A] rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-sm"
            >
              <Plus size={16} strokeWidth={3} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Variant modal */}
      {showVariant && variants && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 px-4 pb-6" onClick={() => setShowVariant(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-black text-gray-900 text-base leading-tight">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Seleccioná la cantidad</p>
              </div>
              <button onClick={() => setShowVariant(false)} className="text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {variants.map(v => (
                <button
                  key={v.label}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${selectedVariant?.label === v.label ? 'border-[#8B1A1A] bg-[#8B1A1A]/5' : 'border-gray-100 bg-gray-50'}`}
                >
                  <span className="font-bold text-sm text-gray-900">{v.label}</span>
                  <span className="font-black text-sm text-gray-900">
                    ${Math.round(product.price * v.multiplier).toLocaleString('es-AR')}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={confirmVariant}
              className="w-full bg-[#8B1A1A] text-white font-black py-4 rounded-2xl text-sm tracking-wide active:scale-[0.98] transition-all"
            >
              Agregar al carrito →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ── ComboVariantModal ────────────────────────────────────────────────────────
const ComboVariantModal: React.FC<{
  combo: StoreCombo;
  variants: Record<string, string>;
  onVariantChange: (name: string, val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ combo, variants, onVariantChange, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/50 px-4 pb-6" onClick={onClose}>
    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8B1A1A]/8 to-[#002FA7]/8 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-4xl">{combo.emoji}</span>
            <h3 className="font-black text-gray-900 text-lg mt-2 leading-tight">{combo.name}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{combo.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 mt-1"><X size={20} /></button>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-black text-gray-900">${combo.price.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Incluye */}
      {combo.items.length > 0 && (
        <div className="px-6 pt-4 pb-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Incluye</p>
          <div className="flex flex-wrap gap-1.5">
            {combo.items.map(item => (
              <span key={item} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Variantes */}
      {combo.variantItems && combo.variantItems.length > 0 && (
        <div className="px-6 pt-3 pb-2 space-y-4">
          {combo.variantItems.map(vi => (
            <div key={vi.name}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                {vi.name}
              </p>
              <div className="flex gap-2 flex-wrap">
                {vi.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => onVariantChange(vi.name, opt)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${variants[vi.name] === opt ? 'border-[#8B1A1A] bg-[#8B1A1A] text-white' : 'border-gray-200 text-gray-700 bg-gray-50'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-6 pt-3 pb-6">
        <button
          onClick={onConfirm}
          className="w-full bg-[#8B1A1A] text-white font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-all shadow-lg shadow-[#8B1A1A]/20 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} />
          Agregar combo al carrito →
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
interface StoreDetailViewProps {
  onAddToCart: (product: Product, storeId?: string) => void;
  onSelectStore: (store: PartnerStore | null) => void;
}

const DEMO_MODE = true;
const STRICT_STORES = new Set(['minimarket-vibe', 'crispric', 'real-3', 'real-13']);

const StoreDetailView: React.FC<StoreDetailViewProps> = ({ onAddToCart, onSelectStore }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { stores } = useStores();
  const { allProducts, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [comboModal, setComboModal] = useState<StoreCombo | null>(null);
  const [comboVariants, setComboVariants] = useState<Record<string, string>>({});

  const store = stores.find(s => s.id === slug);

  // Auto-select store for cart
  useEffect(() => {
    if (store) onSelectStore(store);
    return () => { /* no cleanup needed */ };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.id]);

  // Products filtered for this store
  const storeProducts = useMemo(() => {
    if (!slug) return [];
    const isStrict = STRICT_STORES.has(slug);
    if (!DEMO_MODE || isStrict) {
      return allProducts.filter(p =>
        p.storeId === slug || p.availableInStoreIds?.includes(slug)
      );
    }
    // Demo mode: show all products
    return allProducts;
  }, [allProducts, slug]);

  // Categories available for this store
  const categories = useMemo(() => {
    const cats = new Set(storeProducts.map(p => p.category));
    return Array.from(cats).sort();
  }, [storeProducts]);

  const displayedProducts = selectedCategory
    ? storeProducts.filter(p => p.category === selectedCategory)
    : storeProducts;

  // Combos for this store type
  const storeCombos = useMemo(() => {
    if (!store) return [];
    return STORE_COMBOS.filter(c =>
      c.storeType === 'all' || (c.storeType === 'productos' && store.type === 'productos')
    );
  }, [store]);

  const openComboModal = (combo: StoreCombo) => {
    const defaults: Record<string, string> = {};
    combo.variantItems?.forEach(v => { defaults[v.name] = v.options[0]; });
    setComboVariants(defaults);
    setComboModal(combo);
  };

  const addComboToCart = () => {
    if (!comboModal || !slug) return;
    const variantDesc = Object.entries(comboVariants)
      .map(([k, v]) => `${k} ${v}`)
      .join(' · ');
    const product: Product = {
      id: comboModal.id,
      name: variantDesc ? `${comboModal.name} (${variantDesc})` : comboModal.name,
      price: comboModal.price,
      category: 'Combos',
      img: '',
      isCombo: true,
      storeId: slug,
    };
    onAddToCart(product, slug);
    setComboModal(null);
  };

  // Loading state
  if (loading && stores.length === 0) return <Spinner />;

  // Not found
  if (!loading && stores.length > 0 && !store) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center pb-24">
        <div className="text-6xl mb-4">🏪</div>
        <h2 className="text-xl font-black text-[#1F2937] mb-2">Local no encontrado</h2>
        <p className="text-[#6B7280] text-sm mb-6 max-w-xs">Este local no está disponible o el link no es válido.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#8B1A1A] text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-all"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!store) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">

      {/* Hero imagen del local */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-all"
        >
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

      {/* Combos / Promociones */}
      {storeCombos.length > 0 && (
        <div className="pt-5 pb-3">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="font-black text-base text-[#1F2937]">🔥 Combos Especiales</h2>
            <span className="text-[10px] text-[#8B1A1A] font-black uppercase tracking-widest bg-[#8B1A1A]/8 px-2 py-0.5 rounded-full">
              {storeCombos.length} disponibles
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
            {storeCombos.map(combo => (
              <div
                key={combo.id}
                onClick={() => openComboModal(combo)}
                className="shrink-0 w-56 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="h-28 flex items-center justify-center bg-gradient-to-br from-[#8B1A1A]/6 via-[#FFD700]/6 to-[#002FA7]/6">
                  <span className="text-5xl">{combo.emoji}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-black text-xs text-[#1F2937] leading-tight">{combo.name}</h3>
                  <p className="text-[10px] text-[#6B7280] mt-0.5 leading-snug line-clamp-2">{combo.description}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-black text-base text-[#1F2937]">${combo.price.toLocaleString('es-AR')}</span>
                    <div className="bg-[#8B1A1A] rounded-xl px-2.5 py-1.5 flex items-center gap-1">
                      <Plus size={11} strokeWidth={3} className="text-white" />
                      <span className="text-white text-[10px] font-black">Pedir</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category filter — sticky */}
      {categories.length > 1 && (
        <div className="bg-white border-b border-gray-100 sticky top-[104px] z-10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${!selectedCategory ? 'bg-[#8B1A1A] text-white' : 'bg-gray-100 text-[#6B7280]'}`}
            >
              Todo
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-[#8B1A1A] text-white' : 'bg-gray-100 text-[#6B7280]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products grid */}
      <div className="px-4 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package size={40} className="text-gray-200 mb-3" />
            <p className="text-[#6B7280] font-medium text-sm">No hay productos en esta categoría</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 text-xs text-[#8B1A1A] font-bold underline"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#6B7280] font-medium mb-3">
              {displayedProducts.length} productos disponibles
            </p>
            <div className="grid grid-cols-2 gap-3">
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeId={slug!}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Ir al carrito CTA flotante */}
      <div className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none">
        <button
          onClick={() => navigate('/checkout')}
          className="pointer-events-auto w-full bg-[#8B1A1A] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-[#8B1A1A]/30 active:scale-[0.98] transition-all"
        >
          <ShoppingBag size={18} />
          Confirmar pedido por WhatsApp →
        </button>
      </div>

      {/* Combo variant modal */}
      {comboModal && (
        <ComboVariantModal
          combo={comboModal}
          variants={comboVariants}
          onVariantChange={(name, val) => setComboVariants(v => ({ ...v, [name]: val }))}
          onConfirm={addComboToCart}
          onClose={() => setComboModal(null)}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default StoreDetailView;
