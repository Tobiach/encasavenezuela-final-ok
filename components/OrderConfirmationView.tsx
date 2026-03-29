import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Banknote, Wallet, Send, ShoppingBag, Zap, MessageSquare, AlertCircle, Clock, Plus } from 'lucide-react'; import { Product, PartnerStore, User as UserType } from '../types';
import { supabase } from '../lib/supabase';

interface OrderConfirmationViewProps {
  stores: PartnerStore[];
  cart: { product: Product; qty: number }[];
  user: UserType | null;
  onFinalizePurchase: (total: number) => void;
  onClearCart: () => void;
  allProducts: Product[];
  onAddToCart: (product: Product, storeId?: string) => void;
}

const WHATSAPP_NUMBER = '5491136026302';
const MINIMUM_ORDER = 5999;

const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  stores, cart, user, onFinalizePurchase, onClearCart, allProducts, onAddToCart
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    paymentMethod: 'Efectivo' as 'Efectivo' | 'Transferencia',
    note: '',
    fulfillmentMethod: 'delivery' as 'delivery' | 'pickup',
  });

  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) { navigate('/catalog'); return; }
    const win = window as unknown as { encasaTrack?: (event: string, data: Record<string, unknown>) => void };
    win.encasaTrack?.('checkout_initiated', {
      cart_total: cart.reduce((acc, i) => acc + i.product.price * i.qty, 0),
      items_count: cart.reduce((sum, i) => sum + i.qty, 0),
      store_id: cart[0]?.product?.storeId ?? null,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = useMemo(() => cart.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0), [cart]);
  const total = subtotal + tipAmount;
  const meetsMinimum = subtotal >= MINIMUM_ORDER;
  const remainingForMinimum = Math.max(0, MINIMUM_ORDER - subtotal);

  const { isMultiStore, store, uniqueStoreIds, hasInvalidItems } = useMemo(() => {
    const storeIds = cart.map(i => i.product.storeId).filter(Boolean) as string[];
    const uniqueIds = Array.from(new Set(storeIds));
    const isMulti = uniqueIds.length > 1;
    const hasInvalid = cart.some(i => !i.product.storeId);

    let foundStore: PartnerStore | null = null;
    if (uniqueIds.length === 1) {
      foundStore = stores.find(s => s.id === uniqueIds[0]) || null;
    }

    return {
      isMultiStore: isMulti,
      store: foundStore,
      uniqueStoreIds: uniqueIds,
      hasInvalidItems: hasInvalid
    };
  }, [cart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const upsellProducts = useMemo(() => {
    if (!store) return [];
    const inCart = new Set(cart.map(i => i.product.id));
    return allProducts
      .filter(p => p.availableInStoreIds?.includes(store.id) && !inCart.has(p.id))
      .slice(0, 3);
  }, [allProducts, cart, store]);

  const tips = [
    { label: 'Sin propina', value: 0 },
    { label: '$497', value: 497 },
    { label: '$797', value: 797, featured: true },
    { label: '$1497', value: 1497 }
  ];

  const buildWhatsAppMessage = (orderId?: string) => {
    const isPickup = formData.fulfillmentMethod === 'pickup';

    const orderItemsText = cart
      .map((i) => `• ${i.qty}x ${i.product.name} ($${i.product.price * i.qty})`)
      .join('\n');

    const lines: string[] = [
      '*Pedido EnCasa Venezuela*',
      '',
      `*Nombre:* ${formData.name}`,
      `*Teléfono:* ${formData.phone}`,
      `*Tipo de entrega:* ${isPickup ? 'Retiro en el local' : 'Delivery'}`,
    ];

    if (!isPickup) {
      lines.push(`*Dirección:* ${formData.address}`);
    }

    if (store) {
      lines.push(`*Local:* ${store.name}`);
    }

    if (orderId) {
      lines.push(`ID Pedido: ${orderId}`);
    }

    lines.push('', '*Items:*', orderItemsText, '');

    lines.push(`*Total estimado:* $${total}`);

    if (!isPickup && tipAmount > 0) {
      lines.push(`*Propina:* $${tipAmount}`);
    }

    if (!isPickup && formData.note) {
      lines.push(`*Nota:* ${formData.note}`);
    }

    lines.push('', '*¿Me confirman stock?*');

    return lines.join('\n');
  };

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    if (!formData.name || !formData.phone || (formData.fulfillmentMethod === 'delivery' && !formData.address)) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    if (!meetsMinimum) {
      alert(`El monto mínimo de compra es $${MINIMUM_ORDER}. Te faltan $${remainingForMinimum}.`);
      return;
    }

    if (isMultiStore || hasInvalidItems) {
      alert("Hay un problema con los locales en tu carrito. Asegurate de que todos los productos sean del mismo local.");
      return;
    }

    setIsSubmitting(true);

    let orderId: string | undefined;

    try {
      try {
        const win = window as unknown as { encasaTrack?: (event: string, data: Record<string, unknown>) => void };
        const encasaTrack = win.encasaTrack;
        if (encasaTrack) {
          encasaTrack("checkout_whatsapp_click", {
            cartTotal: total,
            itemsCount: cart?.reduce?.((sum: number, i: { qty: number }) => sum + (i?.qty ?? 0), 0) ?? 0,
            source: "checkout",
            ts: Date.now(),
          });
        }
      } catch (e) {
        console.error("Tracking error:", e);
      }

      try {
        const storeId = uniqueStoreIds[0] ?? null;
        const { data: authData } = await supabase.auth.getUser();
        const supaUserId = authData?.user?.id ?? null;

        const { data: orderRow, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: supaUserId,
            store_id: storeId,
            total,
            status: 'pending',
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.fulfillmentMethod === 'pickup' ? 'RETIRO EN LOCAL' : formData.address,
            payment_method: formData.paymentMethod,
            note: formData.note || null,
          })
          .select('id')
          .single();

        if (orderErr) throw orderErr;

        orderId = orderRow?.id;

        const itemsPayload = cart.map(i => ({
          order_id: orderId,
          product_id: i.product.id ?? null,
          product_name: i.product.name,
          qty: i.qty,
          price: i.product.price,
          store_id: i.product.storeId ?? storeId ?? null,
        }));

        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(itemsPayload);

        if (itemsErr) throw itemsErr;

      } catch (dbErr) {
        console.error("DB insert failed (orders/order_items):", dbErr);
      }

      // Notificación Notion — fire and forget, jamás bloquea el flujo del pedido
      try {
        const notionStoreName = stores.find(s => s.id === uniqueStoreIds[0])?.name
          ?? uniqueStoreIds[0]
          ?? 'Desconocido';
        void fetch('/api/notify-notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              id: orderId ?? 'sin-id',
              customer_name: formData.name,
              customer_phone: formData.phone,
              customer_address: formData.fulfillmentMethod === 'pickup' ? 'RETIRO EN LOCAL' : formData.address,
              store_id: uniqueStoreIds[0] ?? null,
              total,
              payment_method: formData.paymentMethod,
              status: 'pending',
              note: formData.note || null,
              created_at: new Date().toISOString(),
            },
            items: cart.map(i => ({
              product_name: i.product.name,
              qty: i.qty,
              price: i.product.price,
            })),
            storeName: notionStoreName,
          }),
        }).catch(err => console.error('[Notion] fetch error:', err));
      } catch (notionErr) {
        console.error('[Notion] setup error:', notionErr);
      }

      try {
        onFinalizePurchase?.(total);
      } catch (e) {
        console.error("onFinalizePurchase error:", e);
      }

      const message = buildWhatsAppMessage(orderId);
      openWhatsApp(message);

      // Guardar en historial local para feature de Reorder
      try {
        const historyItem = {
          id: orderId ?? Date.now().toString(),
          date: new Date().toISOString(),
          total,
          store_id: uniqueStoreIds[0] ?? undefined,
          items: cart.map(i => ({
            id: i.product.id,
            name: i.product.name,
            qty: i.qty,
            price: i.product.price,
            img: i.product.img,
            storeId: i.product.storeId,
          })),
        };
        const prev = JSON.parse(localStorage.getItem('encasa_history') || '[]');
        prev.push(historyItem);
        localStorage.setItem('encasa_history', JSON.stringify(prev.slice(-20)));
      } catch { /* silencioso — no bloquea el flujo */ }

      try { onClearCart?.(); } catch (e) {
        console.error("onClearCart error:", e);
      }

    } catch (e) {
      console.error("handleConfirmOrder fatal:", e);
      const message = buildWhatsAppMessage(undefined);
      openWhatsApp(message);
    } finally {
      setTimeout(() => setIsSubmitting(false), 300);
    }
  };

  return (
    <div className="min-h-screen bg-venezuela-dark pb-24 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 p-3 bg-black/5 rounded-2xl text-gray-500 hover:bg-ven-yellow hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">
            Confirmación de <span className="text-ven-yellow">Pedido</span>
          </h1>
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-2">
            Formulario de Envío EnCasa 🇻🇪
          </p>
        </div>

        {/* Alerta de Monto Mínimo */}
        {!meetsMinimum && (
          <div className="mb-6 p-5 bg-ven-yellow/10 border-2 border-ven-yellow/30 rounded-[24px] flex items-start gap-4">
            <AlertCircle size={24} className="text-ven-yellow shrink-0 mt-1" />
            <div>
              <p className="text-sm font-black text-ven-yellow uppercase tracking-tight mb-2">
                ⚠️ Monto mínimo de compra: ${MINIMUM_ORDER}
              </p>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Tu pedido actual es de <span className="font-black text-venezuela-brown">${subtotal}</span>.
                Te faltan <span className="font-black text-ven-yellow">${remainingForMinimum}</span> para alcanzar el monto mínimo.
              </p>
              <button
                onClick={() => navigate('/catalog')}
                className="mt-3 text-[10px] font-black text-ven-yellow uppercase tracking-widest hover:underline"
              >
                ← Agregar más productos
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Formulario */}
          <div className="bg-black/5 rounded-[32px] border border-black/5 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre y Apellido"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-ven-yellow transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Teléfono de contacto"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-ven-yellow transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                />
              </div>

              {/* Selector de tipo de entrega */}
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Tipo de entrega</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, fulfillmentMethod: 'delivery' }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.fulfillmentMethod === 'delivery' ? 'bg-ven-yellow/10 border-ven-yellow text-venezuela-brown' : 'bg-black/5 border-transparent text-gray-500'}`}
                  >
                    <MapPin size={22} />
                    <span className="text-[10px] font-black uppercase">🚚 Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormData(p => ({ ...p, fulfillmentMethod: 'pickup', address: '', note: '' })); setTipAmount(0); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.fulfillmentMethod === 'pickup' ? 'bg-ven-yellow/10 border-ven-yellow text-venezuela-brown' : 'bg-black/5 border-transparent text-gray-500'}`}
                  >
                    <ShoppingBag size={22} />
                    <span className="text-[10px] font-black uppercase">🛍️ Retiro</span>
                  </button>
                </div>
              </div>

              {/* Dirección — solo para delivery */}
              {formData.fulfillmentMethod === 'delivery' ? (
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Dirección de entrega"
                    className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-ven-yellow transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-ven-yellow/10 border border-ven-yellow/30 rounded-2xl px-4 py-3">
                  <ShoppingBag size={16} className="text-ven-yellow shrink-0" />
                  <p className="text-[11px] font-black text-ven-yellow uppercase tracking-wide">
                    Retirás el pedido directamente en el local
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-black/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Detalles del Local</p>
              <div className={`rounded-2xl p-4 flex flex-col gap-4 border transition-all ${(isMultiStore || hasInvalidItems) ? 'bg-red-500/10 border-red-500/50' : 'bg-black/5 border-black/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${(isMultiStore || hasInvalidItems) ? 'bg-red-500/20 text-red-500' : 'bg-ven-yellow/20 text-ven-yellow'}`}>
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-tight ${(isMultiStore || hasInvalidItems) ? 'text-red-500' : 'text-venezuela-brown'}`}>
                      {isMultiStore ? 'Pedido Multi-Local Detectado' : hasInvalidItems ? 'Productos sin Local' : (store?.name || 'Marketplace EnCasa')}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {isMultiStore ? 'Elegí productos de un solo local' : hasInvalidItems ? 'Elegí un local para estos productos' : (store?.neighborhood || 'CABA')}
                    </p>
                  </div>
                </div>

                {/* INFO CONDICIONAL: Delivery muestra tiempo+cobertura, Retiro muestra dirección */}
                {!isMultiStore && !hasInvalidItems && store && (
                  formData.fulfillmentMethod === 'delivery' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/50 p-3 rounded-xl flex items-center gap-2">
                        <Clock size={14} className="text-ven-yellow shrink-0" />
                        <div>
                          <p className="text-[8px] text-gray-500 font-black uppercase tracking-wide">Tiempo estimado</p>
                          <p className="text-[10px] text-venezuela-brown font-black">{store.deliveryTime || '30-45 min'}</p>
                        </div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-xl flex items-center gap-2">
                        <MapPin size={14} className="text-ven-red shrink-0" />
                        <div>
                          <p className="text-[8px] text-gray-500 font-black uppercase tracking-wide">Cobertura</p>
                          <p className="text-[10px] text-venezuela-brown font-black">{store.coverageArea || 'CABA'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/50 p-3 rounded-xl flex items-center gap-3">
                      <MapPin size={14} className="text-ven-yellow shrink-0" />
                      <div>
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-wide">Dirección del local</p>
                        <p className="text-[10px] text-venezuela-brown font-black">{store.address || store.location}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {(isMultiStore || hasInvalidItems) && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-[10px] text-red-400 font-medium leading-relaxed">
                    {isMultiStore
                      ? `⚠️ Tu carrito tiene productos de ${uniqueStoreIds.length} locales distintos. Hacé pedidos separados por cada local.`
                      : `⚠️ Algunos productos no tienen un local asignado. Vacía el carrito y volvé a agregarlos desde un local.`
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-black/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Medio de Pago</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Efectivo' }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'Efectivo' ? 'bg-ven-yellow/10 border-ven-yellow text-venezuela-brown' : 'bg-black/5 border-transparent text-gray-500'}`}
                >
                  <Banknote size={24} />
                  <span className="text-[10px] font-black uppercase">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Transferencia' }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'Transferencia' ? 'bg-ven-yellow/10 border-ven-yellow text-venezuela-brown' : 'bg-black/5 border-transparent text-gray-500'}`}
                >
                  <Wallet size={24} />
                  <span className="text-[10px] font-black uppercase">Transferencia</span>
                </button>
              </div>
            </div>

            {formData.fulfillmentMethod === 'delivery' && <div className="pt-4 border-t border-black/5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Propina</p>
                {tipAmount > 0 && <span className="text-ven-yellow font-black text-xs">+${tipAmount}</span>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tips.map(tip => (
                  <button
                    key={tip.label}
                    type="button"
                    onClick={() => setTipAmount(tip.value)}
                    className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${tipAmount === tip.value ? 'bg-ven-yellow border-ven-yellow text-white shadow-lg shadow-yellow-500/20' : 'bg-black/5 border-transparent text-gray-500 hover:border-black/10'} ${tip.featured && tipAmount !== tip.value ? 'border-ven-yellow/60 animate-pulse' : ''}`}
                  >
                    {tip.label}
                    {tip.featured && tipAmount !== tip.value && <span className="block text-[6px] mt-1 text-ven-yellow">Recomendado</span>}
                  </button>
                ))}
              </div>
            </div>}

            {formData.fulfillmentMethod === 'delivery' && <div className="pt-4 border-t border-black/5">
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Nota adicional (Ej: El timbre no funciona)"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-ven-yellow transition-all text-sm h-24 resize-none text-venezuela-brown placeholder:text-gray-400"
                />
              </div>
            </div>}
          </div>

          {/* Upselling — productos del mismo local */}
          {upsellProducts.length > 0 && (
            <div className="bg-black/5 border border-ven-yellow/20 rounded-[32px] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-ven-yellow flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-ven-yellow uppercase tracking-[0.2em]">¿Le sumamos algo?</p>
                  <p className="text-[9px] text-gray-500 font-bold">Productos del mismo local</p>
                </div>
              </div>
              <div className="space-y-3">
                {upsellProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-3 bg-white/50 rounded-2xl p-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black/5">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-black text-venezuela-brown truncate uppercase tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-bold text-ven-yellow">${product.price.toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, product.storeId ?? store?.id)}
                      className="shrink-0 bg-gradient-to-br from-ven-yellow to-venezuela-orange text-white p-2 rounded-xl shadow-md active:scale-90 transition-all hover:brightness-110"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen Final */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-[32px] border-2 border-ven-yellow/20 p-8 space-y-6 shadow-2xl shadow-yellow-500/10">
            <div className="flex justify-between items-center pb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Subtotal</span>
              <span className="text-2xl font-black text-venezuela-brown">${subtotal}</span>
            </div>

            {formData.fulfillmentMethod === 'delivery' && (
              <div className="flex justify-between items-center pb-4 border-t border-black/5 pt-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Propina</span>
                <span className="text-2xl font-black text-ven-yellow">${tipAmount}</span>
              </div>
            )}

            <div className="pt-6 border-t-2 border-ven-yellow/30">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs text-gray-500 font-black uppercase tracking-[0.3em] mb-2">Total a Pagar</p>
                  <p className="text-5xl md:text-6xl font-black text-venezuela-brown tracking-tighter leading-none">${total}</p>
                  {!meetsMinimum && (
                    <p className="text-sm font-black text-ven-yellow uppercase tracking-tight mt-3">
                      Faltan ${remainingForMinimum} para el mínimo
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting || isMultiStore || hasInvalidItems || !meetsMinimum}
                className={`w-full px-8 py-6 rounded-[24px] font-black uppercase text-base md:text-lg tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${(isSubmitting || isMultiStore || hasInvalidItems || !meetsMinimum)
                    ? 'bg-gray-400 cursor-not-allowed opacity-50 text-white'
                    : 'bg-gradient-to-r from-ven-yellow via-venezuela-orange to-ven-yellow bg-[length:200%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%] text-white shadow-yellow-500/40 hover:shadow-yellow-500/60'
                  }`}
              >
                {!(isSubmitting || isMultiStore || hasInvalidItems || !meetsMinimum) && (
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                )}
                <Send size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">
                  {isSubmitting
                    ? 'Procesando...'
                    : (isMultiStore || hasInvalidItems)
                      ? 'Corregir Carrito'
                      : !meetsMinimum
                        ? `Mínimo $${MINIMUM_ORDER}`
                        : 'Confirmar vía WhatsApp'
                  }
                </span>
              </button>

              <p className="text-center text-[10px] text-gray-400 font-medium mt-4 tracking-wide">
                🔒 Pago seguro directo con el local
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationView;