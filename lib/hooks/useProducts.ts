import { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../supabase';
import { Product } from '../../types';

// Caché de módulo: una sola query compartida entre todos los componentes
let _cache: Product[] | null = null;
let _promise: Promise<Product[]> | null = null;

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
    storeId: (row.store_id as string | null) ?? undefined,
    availableInStoreIds: (row.available_in_store_ids as string[] | null) ?? undefined,
  };
}

async function fetchProducts(): Promise<Product[]> {
  if (_cache) return _cache;
  if (!_promise) {
    _promise = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .then(({ data, error }) => {
        if (error) throw error;
        const result = (data || []).map(mapRowToProduct);
        _cache = result;
        return result;
      }) as Promise<Product[]>;
  }
  return _promise;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(_cache ?? []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) return;
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const allProducts = products.filter(p => !p.isCombo);
  const promoCombos = products.filter(p => p.isCombo) as (Product & { storeId: string })[];

  return { allProducts, promoCombos, loading };
}

// Categorías estáticas (igual que en catalogData.ts)
export const categories = [
  { name: "Quesos y Tequeños", subtitle: "El alma de la fiesta", image: getImageUrl("tequenos_y_quesos1.png") },
  { name: "Harinas", subtitle: "Para tus arepas y más", image: getImageUrl("harinas1.png") },
  { name: "Lácteos", subtitle: "Quesos y derivados frescos", image: getImageUrl("queso_lacteos.png") },
  { name: "Congelados", subtitle: "Listos para preparar", image: getImageUrl("chuletas_1.png") },
  { name: "Bebidas", subtitle: "Refrescos y maltas", image: getImageUrl("bebidas_cervezas.png") },
  { name: "Salsas", subtitle: "El toque especial", image: getImageUrl("salsas1.png") },
  { name: "Enlatados", subtitle: "Conservas de calidad", image: getImageUrl("enlatado_diablitos1.png") },
  { name: "Snacks", subtitle: "Para picar entre horas", image: getImageUrl("snacks1.png") },
  { name: "Almacén", subtitle: "Lo esencial de la despensa", image: getImageUrl("abarrotes_1.png") },
  { name: "Chucherías", subtitle: "Dulces recuerdos", image: getImageUrl("golosinas_1.png") },
];
