export interface PartnerStore {
  id: string;
  name: string;
  location: string;
  address: string;
  neighborhood: string;
  rating: number;
  review_count: number;
  google_maps_url: string;
  img: string;
  tags: string[];
  type: 'comida' | 'productos';
  isPreparedFood?: boolean;
  plan: 'basic' | 'premium';
  reviews: string[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  img: string;
  usageInfo?: string;
  availableInStoreIds?: string[];
  storeId?: string;
  oldPrice?: number;
  isCombo?: boolean;
}

export type UserRole = 'Cliente' | 'Admin' | 'Local' | 'Abogado';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: UserRole;
  is_logged_in: boolean;
  points?: number;
}

export interface PurchaseHistoryItem {
  id: string | number;
  date: string;
  total: number;
  items: {
    id: number;
    name: string;
    qty: number;
    price: number;
  }[];
  store_id?: string;
}

export interface Reward {
  id: string;
  title: string;
  points?: number;
  description: string;
  icon?: string;
  pointsCost: number;
  type?: string;
  value?: string | number;
}
