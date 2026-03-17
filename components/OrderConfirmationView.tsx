import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Banknote, Wallet, MessageSquare, Send, Sparkles, ShoppingBag, Zap } from 'lucide-react';
import { Product, PartnerStore, User as UserType } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { supabase } from '../lib/supabase';

interface OrderConfirmationViewProps {
  cart: { product: Product; qty: number }[];
  user: UserType | null;
  onFinalizePurchase: (total: number) => void;
  onClearCart: () => void;
}

const WHATSAPP_NUMBER = '5491134552996';

const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  cart, user, onFinalizePurchase, onClearCart
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    paymentMethod: 'Efectivo' as 'Efectivo' | 'Transferencia',
    note: ''
  });

  const [tipAmount, setTipAmount] = useState<number>(797);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) navigate('/catalog');
  }, [cart, navigate]);

  const subtotal = useMemo(() => cart.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0), [cart]);
  const total = subtotal + tipAmount;

  const { isMultiStore, store, uniqueStoreIds, hasInvalidItems } = useMemo(() => {
    const storeIds = cart.map(i => i.product.storeId).filter(Boolean) as string[];
    const uniqueIds = Array.from(new Set(storeIds));
    const isMulti = uniqueIds.length > 1;
    const hasInvalid = cart.some(i => !i.product.storeId);

    let foundStore: PartnerStore | null = null;
    if (uniqueIds.length === 1) {
      foundStore = LOCALES_VENEZOLANOS.find(s => s.id === uniqueIds[0]) || null;
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

  const aiSuggestion = useMemo(() => {
    const hasMaltin = cart.some(i => i.product.name.toLowerCase().includes('maltín'));
    if (!hasMaltin) return "Muchos clientes agregan Maltín a este pedido. ¿Querés agregar algo más antes de confirmar?";
    return "¡Excelente elección! Este local tiene un combo relámpago activo si agregas Tequeños.";
  }, [cart]);

  const tips = [
    { label: 'Sin propina', value: 0 },
    { label: '$497', value: 497 },
    { label: '$797', value: 797, featured: true },
    { label: '$1497', value: 1497 }
  ];

  const buildWhatsAppMessage = (orderId?: string) => {
    const orderItemsText = cart
      .map((i) => `• ${i.qty}x ${i.product.name} ($${i.product.price * i.qty})`)
      .join("\n");

    const tipText = tipAmount > 0 ? `\n\n*Propina:* $${tipAmount}` : "";
    const noteText = formData.note ? `\n\n*Nota:* ${formData.note}` : "";
    const storeText = store ? `\n*Local:* ${store.name}` : "";
    const orderIdText = orderId ? `\n*Order ID:* ${orderId}` : "";

    const rawMessage =
      `*Pedido EnCasa Venezuela* 🇻🇪\n\n` +
      `*Nombre:* ${formData.name}\n` +
      `*Teléfono:* ${formData.phone}\n` +
      `*Dirección:* ${formData.address}` +
      storeText +
      orderIdText +
      `\n\n*Items:*\n${orderItemsText}\n\n` +
      `*Total Estimado:* $${total}` +
      tipText +
      noteText +
      `\n\n¿Me confirman stock?`;

    return rawMessage;
  };

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    if (isMultiStore || hasInvalidItems) {
      alert("Hay un problema con los locales en tu carrito. Asegurate de que todos los productos sean del mismo local.");
      return;
    }

    setIsSubmitting(true);

    let orderId: string | undefined;

    try {
      // Tracking (si existe)
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

      // 1) Guardar pedido en Supabase (guest permitido => user_id puede ser null)
      try {
        const storeId = uniqueStoreIds[0] ?? null;

        // Si estás logueado en Supabase Auth, tomamos user_id. Si no, null (guest)
        const { data: authData } = await supabase.auth.getUser();
        const supaUserId = authData?.user?.id ?? null;

        const { data: orderRow, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: supaUserId,                 // null = guest
            store_id: storeId,
            total,
            status: 'pending',
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address,
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
        // No rompemos conversión: igual mandamos WhatsApp.
        console.error("DB insert failed (orders/order_items):", dbErr);
      }

      // 2) Registrar compra internamente (local) sin bloquear
      try {
        onFinalizePurchase?.(total);
      } catch (e) {
        console.error("onFinalizePurchase error:", e);
      }

      // 3) Abrir WhatsApp con Order ID si existe
      const message = buildWhatsAppMessage(orderId);
      openWhatsApp(message);

      // Opcional: limpiar carrito local al confirmar
      try { onClearCart?.(); } catch (e) {
        console.error("onClearCart error:", e);
      }

    } catch (e) {
      console.error("handleConfirmOrder fatal:", e);
      // Si algo reventó, igual abrimos WhatsApp para no perder la venta
      const message = buildWhatsAppMessage(undefined);
      openWhatsApp(message);
    } finally {
      // Nunca queda “Procesando…”
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
            </div>

            <div className="pt-4 border-t border-black/5">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Detalles del Local</p>
              <div className={`rounded-2xl p-4 flex items-center gap-4 border transition-all ${(isMultiStore || hasInvalidItems) ? 'bg-red-500/10 border-red-500/50' : 'bg-black/5 border-black/5'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${(isMultiStore || hasInvalidItems) ? 'bg-red-500/20 text-red-500' : 'bg-ven-yellow/20 text-ven-yellow'}`}>
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
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'Efectivo'}))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'Efectivo' ? 'bg-ven-yellow/10 border-ven-yellow text-venezuela-brown' : 'bg-black/5 border-transparent text-gray-500'}`}
                >
                  <Banknote size={24} />
                  <span className="text-[10px] font-black uppercase">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'Transferencia'}))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${formData.paymentMethod === 'Transferencia' ? 'bg-ven-blue/10 border-ven-blue text-venezuela-brown' : 'bg-black/5 border-transparent text-gray-500'}`}
                >
                  <Wallet size={24} />
                  <span className="text-[10px] font-black uppercase">Transferencia</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5">
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
            </div>

            <div className="pt-4 border-t border-black/5">
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
            </div>
          </div>

          {/* Sugerencia IA */}
          <div className="bg-black/5 border border-ven-yellow/20 rounded-[32px] p-6 flex gap-4 items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={64} className="text-ven-yellow" />
            </div>
            <div className="w-10 h-10 rounded-full bg-ven-yellow flex items-center justify-center text-white shrink-0 shadow-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black text-ven-yellow uppercase tracking-[0.2em] mb-1">Pana Chef AI Sugiere</p>
              <p className="text-xs text-gray-600 font-medium leading-relaxed italic">"{aiSuggestion}"</p>
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="mt-3 text-[10px] font-black text-venezuela-brown uppercase tracking-widest hover:text-ven-yellow transition-colors flex items-center gap-1"
              >
                Explorar más <ArrowLeft size={12} className="rotate-180" />
              </button>
            </div>
          </div>

          {/* Resumen Final */}
          <div className="bg-black/5 rounded-[32px] border border-black/5 p-8 space-y-4">
            <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              <span>Subtotal</span><span>${subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[10px] tracking-widest">
              <span>Propina</span><span className="text-ven-yellow">${tipAmount}</span>
            </div>
            <div className="pt-4 border-t border-black/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total</p>
                <p className="text-4xl font-black text-venezuela-brown tracking-tighter">${total}</p>
              </div>
              <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting || isMultiStore || hasInvalidItems}
                className="bg-gradient-to-r from-[#FFCC00] to-[#F58220] text-white px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? 'Procesando...' : (isMultiStore || hasInvalidItems) ? 'Corregir Carrito' : 'Confirmar vía WhatsApp'}
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationView;

