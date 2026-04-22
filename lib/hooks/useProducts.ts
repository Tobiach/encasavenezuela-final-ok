import { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../supabase';
import { Product } from '../../types';
import { FALLBACK_PRODUCTS } from '../../data/fallbackProducts';

export type DataSource = 'supabase' | 'cache' | 'fallback';

// ── Caché de módulo ──────────────────────────────────────────────────────────
let _cache: Product[] | null = null;
let _cacheSource: DataSource = 'fallback';
let _promise: Promise<void> | null = null;

const LS_KEY = 'encasa_products_v2';

// ── localStorage helpers ─────────────────────────────────────────────────────
function lsLoad(): Product[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : null;
  } catch {
    return null;
  }
}

function lsSave(products: Product[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(products));
  } catch {
    // localStorage lleno o no disponible (modo privado, etc.)
  }
}

// ── Mejor dato disponible sin hacer fetch ───────────────────────────────────
function getBestAvailable(): { data: Product[]; source: DataSource } {
  if (_cache) return { data: _cache, source: _cacheSource };
  const stored = lsLoad();
  if (stored && stored.length > 0) return { data: stored, source: 'cache' };
  return { data: FALLBACK_PRODUCTS, source: 'fallback' };
}

// ── Mapping Supabase row → Product ───────────────────────────────────────────
function mapRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as number,
    name: row.name as string,
    price: row.price as number,
    oldPrice: (row.old_price as number | null) ?? undefined,
    category: row.category as string,
    img: getImageUrl((row.img_path as string | null) ?? ''),
    usageInfo: (row.usage_info as string | null) ?? undefined,
    isCombo: row.is_combo as boolean,
    storeId: (row.store_id as string | null) ?? 'minimarket-vibe',
    availableInStoreIds: (row.available_in_store_ids as string[] | null) ?? undefined,
  };
}

// ── Fetch con fallback en cascada ────────────────────────────────────────────
async function fetchProducts(): Promise<void> {
  if (_cache && _cacheSource === 'supabase') return;
  if (_promise) return _promise;

  _promise = (async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      const result = (data ?? []).map(mapRowToProduct);
      if (result.length === 0) throw new Error('Supabase devolvió 0 productos');
      // ✅ Supabase OK — guardar snapshot y actualizar caché
      lsSave(result);
      _cache = result;
      _cacheSource = 'supabase';
    } catch (err: unknown) {
      console.warn('[useProducts] Supabase falló, usando fallback:', (err as Error)?.message ?? err);
      _promise = null; // permite reintentar en el próximo mount
      if (_cache && _cacheSource === 'supabase') return;
      // Capa 2: snapshot en localStorage
      const stored = lsLoad();
      if (stored && stored.length > 0) {
        _cache = stored;
        _cacheSource = 'cache';
        return;
      }
      // Capa 3: datos estáticos locales
      _cache = FALLBACK_PRODUCTS;
      _cacheSource = 'fallback';
    }
  })();

  return _promise;
}

// ── Hook público ─────────────────────────────────────────────────────────────
export function useProducts() {
  const init = getBestAvailable();
  const [products, setProducts] = useState<Product[]>(init.data);
  const [source, setSource] = useState<DataSource>(init.source);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(() => {
      if (_cache) {
        setProducts(_cache);
        setSource(_cacheSource);
      }
      setLoading(false);
    });
  }, []);

  const allProducts = products.filter(p => !p.isCombo);
  const promoCombos = products.filter(p => p.isCombo) as (Product & { storeId: string })[];

  return { allProducts, promoCombos, loading, source };
}

// ── Categorías ───────────────────────────────────────────────────────────────
export const categories = [
  { name: 'Harinas',       subtitle: 'PAN, Maseca, Cachapas y más',    image: getImageUrl('harinas1.png') },
  { name: 'Lácteos',       subtitle: 'Quesos, nata y derivados',        image: getImageUrl('queso_lacteos.png') },
  { name: 'Bebidas',       subtitle: 'Maltas, refrescos y café',        image: getImageUrl('bebidas_cervezas.png') },
  { name: 'Chucherías',    subtitle: 'Dulces recuerdos',                image: getImageUrl('golosinas_1.png') },
  { name: 'Snacks',        subtitle: 'Para picar entre horas',          image: getImageUrl('snacks1.png') },
  { name: 'Salsas',        subtitle: 'Guasacaca, picante y más',        image: getImageUrl('salsas1.png') },
  { name: 'Untables',      subtitle: 'Mantequilla, mayo y cremas',      image: getImageUrl('enlatado_diablitos1.png') },
  { name: 'Congelados',    subtitle: 'Tequeños, cachapas y más',        image: getImageUrl('chuletas_1.png') },
  { name: 'Carnes',        subtitle: 'Ahumados y chicharrón',           image: getImageUrl('chuletas_1.png') },
  { name: 'Granos',        subtitle: 'Caraotas y legumbres',            image: getImageUrl('abarrotes_1.png') },
  { name: 'Cereales',      subtitle: 'Fororo, Cerelac y desayunos',     image: getImageUrl('cerelac.png') },
  { name: 'Condimentos',   subtitle: 'Adobo, ají y especias',           image: getImageUrl('abarrotes_1.png') },
  { name: 'Secos',         subtitle: 'Papelón y productos secos',       image: getImageUrl('abarrotes_1.png') },
  { name: 'Preparados',    subtitle: 'Arepas y comida lista',           image: getImageUrl('harinas1.png') },
  { name: 'Hogar',         subtitle: 'Budares y utensilios criollos',   image: getImageUrl('abarrotes_1.png') },
];
