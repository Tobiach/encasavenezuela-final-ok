import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

type OrderCounts = Record<string, number>;

const LS_KEY = 'encasa_order_counts_v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

function lsLoad(): OrderCounts | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { timestamp, counts } = JSON.parse(raw);
    if (Date.now() - timestamp > TTL_MS) return null; // expirado
    return counts as OrderCounts;
  } catch { return null; }
}

function lsSave(counts: OrderCounts): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ timestamp: Date.now(), counts }));
  } catch { /* localStorage lleno */ }
}

async function fetchCounts(): Promise<OrderCounts> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('orders')
    .select('store_id')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) throw error;

  const counts: OrderCounts = {};
  data?.forEach(row => {
    if (row.store_id) counts[row.store_id] = (counts[row.store_id] || 0) + 1;
  });
  return counts;
}

export function useOrderCounts() {
  const [counts, setCounts] = useState<OrderCounts>({});

  useEffect(() => {
    const cached = lsLoad();
    if (cached) { setCounts(cached); return; }

    fetchCounts()
      .then(result => { lsSave(result); setCounts(result); })
      .catch(() => { /* falla silenciosa — no mostrar contador */ });
  }, []);

  return counts;
}
