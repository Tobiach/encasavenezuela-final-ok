import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Product, User } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';

declare function encasaTrack(name: string, payload?: Record<string, unknown>): void;

interface WhatsAppButtonProps {
  cart: { product: Product; qty: number }[];
  user?: User | null; // ✅ puede venir null sin romper preview
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ cart, user }) => {
  const handleWhatsAppRedirect = () => {
    let message = '';
    const cartTotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0);

    // ✅ Tracking: WhatsApp abierto (evento real) - no rompe si falla
    try {
      if (typeof encasaTrack === 'function') {
        encasaTrack('whatsapp_opened', {
          cartTotal,
          itemsCount: cart.reduce((sum, i) => sum + i.qty, 0),
          hasItems: cart.length > 0,
          source: 'whatsapp_button',
          ts: Date.now(),
          userEmail: user?.email ?? null,
        });
      }
    } catch (err) {
      // Ignorar errores de tracking
    }

    const userName = user?.name ?? 'Cliente';
    const userEmail = user?.email ?? 'No informado';

    // Obtener info del local del carrito
    const storeId = cart.length > 0 ? cart[0].product.storeId : null;
    const storeName = storeId ? LOCALES_VENEZOLANOS.find((s) => s.id === storeId)?.name : null;

    if (cart.length > 0) {
      if (!storeId) {
        alert("Pana, hay un problema con el local del carrito. Por favor, vaciá el carrito y elegí un local nuevamente.");
        return;
      }

      const orderText = cart
        .map((i) => `• ${i.qty}x ${i.product.name} ($${i.product.price * i.qty})`)
        .join('%0A');

      message =
        `¡Hola EnCasa Venezuela! 🇻🇪 Soy *${userName}*.` +
        `%0A*Email:* ${userEmail}` +
        (storeName ? `%0A*Local:* ${storeName}` : '') +
        `%0A%0AQuiero finalizar mi pedido:` +
        `%0A${orderText}` +
        `%0A%0A*Total Estimado:* $${cartTotal}` +
        `%0A%0A¿Me confirman stock y medios de pago?`;
    } else {
      message =
        `¡Hola EnCasa Venezuela! 🇻🇪 Soy *${userName}*.` +
        `%0A*Email:* ${userEmail}` +
        `%0A%0AQuería consultar sobre productos disponibles y zonas de envío. ¡Gracias!`;
    }

    window.open(`https://wa.me/5491134552996?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppRedirect}
      className="w-14 h-14 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-90 transition-all group relative"
      title="WhatsApp EnCasa"
      aria-label="WhatsApp EnCasa"
    >
      <MessageSquare size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-ven-red text-white text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-full border-4 border-venezuela-dark animate-bounce">
          !
        </span>
      )}
    </button>
  );
};

export default WhatsAppButton;