import { useState, useEffect } from 'react';
import { supabase, getImageUrl } from '../supabase';
import { PartnerStore } from '../../types';

// Caché de módulo: una sola query compartida entre todos los componentes
let _cache: PartnerStore[] | null = null;
let _promise: Promise<PartnerStore[]> | null = null;

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

async function fetchStores(): Promise<PartnerStore[]> {
  if (_cache) return _cache;
  if (!_promise) {
    _promise = supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('plan', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        const result = (data || []).map(mapRowToStore);
        _cache = result;
        return result;
      }) as Promise<PartnerStore[]>;
  }
  return _promise;
}

export function useStores() {
  const [stores, setStores] = useState<PartnerStore[]>(_cache ?? []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) return;
    fetchStores()
      .then(setStores)
      .finally(() => setLoading(false));
  }, []);

  return { stores, loading };
}
