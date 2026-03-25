/**
 * Fallback estático de locales.
 * Se usa cuando Supabase falla Y no hay snapshot en localStorage.
 */
import { PartnerStore } from '../types';
import { getImageUrl } from '../lib/supabase';

export const FALLBACK_STORES: PartnerStore[] = [
  {
    id: 'encasa-venezuela',
    name: 'EnCasa Venezuela',
    location: 'Buenos Aires',
    address: 'Buenos Aires, CABA',
    neighborhood: 'Palermo',
    rating: 4.8,
    review_count: 0,
    google_maps_url: 'https://maps.google.com',
    img: getImageUrl('abarrotes_1.png'),
    tags: ['Abarrotes', 'Harinas', 'Lácteos', 'Snacks'],
    type: 'productos',
    isPreparedFood: false,
    plan: 'premium',
    reviews: [],
    deliveryTime: '30-45 min',
    coverageArea: 'CABA completa',
    deliveryRadius: 'Todo CABA',
  },
];
