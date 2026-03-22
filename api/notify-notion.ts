/**
 * api/notify-notion.ts — Vercel Serverless Function
 * Registra cada pedido confirmado en dos bases de Notion:
 *   🧾 Pedidos  (NOTION_DB_PEDIDOS)
 *   💸 Finanzas (NOTION_DB_FINANZAS)
 *
 * Variables de entorno requeridas:
 *   NOTION_TOKEN, NOTION_DB_PEDIDOS, NOTION_DB_FINANZAS
 */

// Declaración mínima de process para evitar dependencia de @types/node
declare const process: { env: Record<string, string | undefined> };

import { Client } from '@notionhq/client';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface OrderData {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  store_id: string | null;
  total: number;
  payment_method: string;
  status: string;
  note: string | null;
  created_at: string;
}

interface OrderItem {
  product_name: string;
  qty: number;
  price: number;
}

interface NotifyPayload {
  order: OrderData;
  items: OrderItem[];
  storeName: string;
}

// ---------------------------------------------------------------------------
// Mapeo de métodos de pago
// ---------------------------------------------------------------------------

const PAYMENT_MAP: Record<string, string> = {
  'Efectivo': 'Efectivo',
  'Transferencia': 'Transferencia',
};

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Validar variables de entorno
  const token      = process.env.NOTION_TOKEN;
  const dbPedidos  = process.env.NOTION_DB_PEDIDOS;
  const dbFinanzas = process.env.NOTION_DB_FINANZAS;

  if (!token || !dbPedidos || !dbFinanzas) {
    const missing = [
      !token      && 'NOTION_TOKEN',
      !dbPedidos  && 'NOTION_DB_PEDIDOS',
      !dbFinanzas && 'NOTION_DB_FINANZAS',
    ].filter(Boolean).join(', ');
    return res.status(500).json({
      success: false,
      error: `Variables de entorno faltantes: ${missing}`,
    });
  }

  // Validar payload
  const body = req.body as NotifyPayload;
  const { order, items, storeName } = body ?? {};

  if (!order || !items || !storeName) {
    return res.status(400).json({
      success: false,
      error: 'Payload incompleto: se requieren order, items y storeName',
    });
  }

  try {
    const notion = new Client({ auth: token });

    const notionPayment = PAYMENT_MAP[order.payment_method] ?? 'Otro';
    const fechaISO      = order.created_at || new Date().toISOString();
    const orderRef      = order.id ? `#${order.id.substring(0, 8).toUpperCase()}` : '#SIN-ID';

    // "2x Pirulín ($5600) · 1x Malta +58 ($2300)"
    const productSummary = items
      .map(i => `${i.qty}x ${i.product_name} ($${(i.qty * i.price).toLocaleString('es-AR')})`)
      .join(' · ');

    const gmv = items.reduce((acc, i) => acc + i.qty * i.price, 0);

    const notesText = [
      productSummary,
      order.note ? `Nota: ${order.note}` : '',
    ].filter(Boolean).join('\n');

    // -----------------------------------------------------------------
    // 1. Crear entrada en 🧾 Pedidos
    // -----------------------------------------------------------------
    const pedidoPage = await notion.pages.create({
      parent: { database_id: dbPedidos },
      properties: {
        'Pedido': {
          title: [{ text: { content: `${orderRef} — ${order.customer_name}` } }],
        },
        'Cliente': {
          rich_text: [{ text: { content: `${order.customer_name} · ${order.customer_phone}` } }],
        },
        'Estado': {
          status: { name: 'Nuevo' },
        },
        'Fecha': {
          date: { start: fechaISO },
        },
        'Local': {
          rich_text: [{ text: { content: storeName } }],
        },
        'Método de pago': {
          select: { name: notionPayment },
        },
        'Notas': {
          rich_text: [{ text: { content: notesText } }],
        },
        'Subtotal': {
          number: gmv,
        },
        'Envío': {
          number: 0,
        },
        'GMV': {
          number: gmv,
        },
        'Total': {
          number: order.total,
        },
      },
    });

    const pedidoId = pedidoPage.id;

    // -----------------------------------------------------------------
    // 2. Crear entrada en 💸 Finanzas
    //    Fire-and-forget: si falla, Pedidos ya fue creado — no relanzamos
    // -----------------------------------------------------------------
    let finanzasId: string | undefined;
    try {
      const finanzasPage = await notion.pages.create({
        parent: { database_id: dbFinanzas },
        properties: {
          'Movimiento': {
            title: [{ text: { content: `Venta ${orderRef} — ${storeName}` } }],
          },
          'Fecha': {
            date: { start: fechaISO },
          },
          'Tipo': {
            select: { name: 'Ingreso' },
          },
          'Categoría': {
            select: { name: 'Ventas' },
          },
          'Monto': {
            number: order.total,
          },
          'Moneda': {
            select: { name: 'ARS' },
          },
          'Método': {
            select: { name: notionPayment },
          },
          'Local': {
            rich_text: [{ text: { content: storeName } }],
          },
          'Pedido': {
            rich_text: [{ text: { content: order.id ?? 'sin-id' } }],
          },
          'Notas': {
            rich_text: [{ text: { content: productSummary } }],
          },
        },
      });
      finanzasId = finanzasPage.id;
    } catch (finanzasErr) {
      // Pedidos ya creado — Finanzas es secundario, solo logueamos
      console.error('[Notion] Error creando entrada en Finanzas:', finanzasErr);
    }

    return res.status(200).json({ success: true, pedidoId, finanzasId });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[Notion] Error crítico en notify-notion:', err);
    return res.status(500).json({ success: false, error: message });
  }
}
