import { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../supabase';
import { PartnerStore } from '../../types';
import { FALLBACK_STORES } from '../../data/fallbackStores';

export type DataSource = 'supabase' | 'cache' | 'fallback';

// ── Caché de módulo ──────────────────────────────────────────────────────────
let _cache: PartnerStore[] | null = null;
let _cacheSource: DataSource = 'fallback';
let _promise: Promise<void> | null = null;

const LS_KEY = 'encasa_stores_v2';

// ── localStorage helpers ─────────────────────────────────────────────────────
function lsLoad(): PartnerStore[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as PartnerStore[]) : null;
  } catch {
    return null;
  }
}

function lsSave(stores: PartnerStore[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(stores));
  } catch {
    // localStorage lleno o no disponible
  }
}

// ── Mejor dato disponible sin hacer fetch ───────────────────────────────────
function getBestAvailable(): { data: PartnerStore[]; source: DataSource } {
  if (_cache) return { data: _cache, source: _cacheSource };
  const stored = lsLoad();
  if (stored && stored.length > 0) return { data: stored, source: 'cache' };
  return { data: FALLBACK_STORES, source: 'fallback' };
}

// ── Mapping Supabase row → PartnerStore ──────────────────────────────────────
function mapRowToStore(row: Record<string, unknown>): PartnerStore {
  return {
    id: row.slug as string,
    name: row.name as string,
    location: row.city as string,
    address: row.address as string,
    neighborhood: row.neighborhood as string,
    rating: row.rating as number,
    review_count: row.review_count as number,
    google_maps_url: row.google_maps_url as string,
    img: getImageUrl(row.img_path as string),
    tags: (row.tags as string[]) || [],
    type: row.type as 'comida' | 'productos',
    isPreparedFood: row.is_prepared_food as boolean,
    plan: row.plan as 'basic' | 'premium',
    reviews: [],
    deliveryTime: '30-45 min',
    coverageArea: 'CABA completa',
    deliveryRadius: 'Todo CABA',
  };
}

// ── Fetch con fallback en cascada ────────────────────────────────────────────
async function fetchStores(): Promise<void> {
  if (_cache && _cacheSource === 'supabase') return;
  if (_promise) return _promise;

  _promise = (async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('plan', { ascending: false });
      if (error) throw error;
      const result = (data ?? []).map(mapRowToStore);
      if (result.length === 0) throw new Error('Supabase devolvió 0 locales');
      // ✅ Supabase OK — guardar snapshot y actualizar caché
      lsSave(result);
      _cache = result;
      _cacheSource = 'supabase';
    } catch (err: unknown) {
      console.warn('[useStores] Supabase falló, usando fallback:', (err as Error)?.message ?? err);
      _promise = null;
      if (_cache && _cacheSource === 'supabase') return;
      // Capa 2: snapshot en localStorage
      const stored = lsLoad();
      if (stored && stored.length > 0) {
        _cache = stored;
        _cacheSource = 'cache';
        return;
      }
      // Capa 3: datos estáticos locales
      _cache = FALLBACK_STORES;
      _cacheSource = 'fallback';
    }
  })();

  return _promise;
}

// ── Hook público ─────────────────────────────────────────────────────────────
export function useStores() {
  const init = getBestAvailable();
  const [stores, setStores] = useState<PartnerStore[]>(init.data);
  const [source, setSource] = useState<DataSource>(init.source);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores().then(() => {
      if (_cache) {
        setStores(_cache);
        setSource(_cacheSource);
      }
      setLoading(false);
    });
  }, []);

  return { stores, loading, source };
}
