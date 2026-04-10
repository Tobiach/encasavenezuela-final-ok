import React, { useState } from 'react';
import { PartnerStore } from '../types';
import { MapPin, Clock, ExternalLink, Smartphone, AlertCircle, ChevronDown, Truck, ChevronRight, Package, MessageCircle, Zap } from 'lucide-react';
import storesFaq from '../data/stores-faq.json' assert { type: 'json' };
import storesDelivery from '../data/stores-delivery.json' assert { type: 'json' };
import PromoDetailModal, { PromoEntry } from './PromoDetailModal';
import DeliveryZonesModal from './DeliveryZonesModal';
import storesPromotions from '../data/stores-promotions.json' assert { type: 'json' };
import storesCombos from '../data/stores-combos.json' assert { type: 'json' };

interface ComboItem { name: string; qty?: string; emoji?: string; img?: string; }
interface StoreCombo { id: string; name: string; description?: string; img?: string | null; items: ComboItem[]; }
interface StoreCombosEntry { sectionTitle: string; combos: StoreCombo[]; }
const combosData = storesCombos as unknown as Record<string, StoreCombosEntry>;

type DeliveryEntry = { freeDelivery: boolean; zones?: string[] };
const deliveryData = storesDelivery as unknown as Record<string, DeliveryEntry>;
function hasFreeDelivery(storeId: string): boolean {
  return deliveryData[storeId]?.freeDelivery === true;
}

const promoData = storesPromotions as unknown as Record<string, PromoEntry>;
function getActivePromo(storeId: string): PromoEntry | null {
  const promo = promoData[storeId];
  if (!promo || !promo.validUntil) return null;
  return new Date(promo.validUntil) > new Date() ? promo : null;
}

interface StoreMapViewProps {
  store: PartnerStore;
}

const StoreMapView: React.FC<StoreMapViewProps> = ({ store }) => {
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(store.name + ' ' + store.location + ' Buenos Aires')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [promoModal, setPromoModal] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState(false);
  const hasMayor = store.tags?.includes('Venta por Mayor');
  const faqs = (storesFaq as Record<string, { q: string; a: string }[]>)[store.id] ?? storesFaq['_default'];
  const activePromo = getActivePromo(store.id);
  const storeCombosEntry = combosData[store.id] ?? null;

  // Promo primer pedido (viene de escaneo QR ?ref=qr)
  const firstOrderPromo = (() => {
    try {
      const raw = localStorage.getItem(`encasa_first_order_promo_${store.id}`);
      return raw ? JSON.parse(raw) as { discount: number; freeDelivery: boolean; storeName: string } : null;
    } catch { return null; }
  })();

  const handleOrderRedirect = () => {
    const message = `¡Hola EnCasa Venezuela! 🇻🇪 Vi el local *${store.name}* en el mapa y quiero hacer un pedido para retirar ahí o que me envíen de esa zona.`;
    window.open(`https://wa.me/5491136026302?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
    {firstOrderPromo && (
      <div className="sticky top-28 z-[45] bg-gradient-to-r from-ven-yellow to-venezuela-orange px-4 py-3 flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/20 animate-in slide-in-from-top duration-500">
        <span className="text-xl">🎁</span>
        <p className="text-venezuela-dark font-black text-[11px] uppercase tracking-widest text-center">
          Oferta especial · <span className="text-white">10% OFF + Delivery gratis</span> en tu primer pedido en {store.name}
        </p>
      </div>
    )}
    <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-100 mb-10">
        <div className="bg-white p-8 md:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-gray-50">
          <div className="flex items-center gap-6">
            <div className="bg-ven-yellow p-5 rounded-[24px] text-ven-blue shadow-xl shadow-yellow-500/20 transform hover:scale-105 transition-transform">
              <MapPin size={36} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{store.name}</h2>
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Activo</span>
              </div>
              <p className="text-gray-500 font-bold flex items-center gap-2">
                <MapPin size={16} className="text-ven-yellow" /> {store.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest leading-none mb-1">Delivery</p>
                <p className="text-sm font-black text-gray-900">{store.deliveryTime || '30-45 min'}</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-[32px] border border-yellow-100 flex items-center gap-4">
              <div className="bg-ven-yellow/20 p-2.5 rounded-xl">
                <MapPin size={20} className="text-ven-yellow" />
              </div>
              <div>
                <p className="text-[10px] text-ven-yellow font-black uppercase tracking-widest leading-none mb-1">Cobertura</p>
                <p className="text-sm font-black text-gray-900">{store.coverageArea || 'CABA'}</p>
              </div>
            </div>

            <button
              onClick={handleOrderRedirect}
              className="bg-green-50 p-6 rounded-[32px] border border-green-100 flex items-center gap-4 hover:bg-green-100 transition-all text-left group"
            >
              <div className="bg-green-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                <Smartphone size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest leading-none mb-1">Contacto</p>
                <p className="text-xs font-black text-gray-900">Pedirlo en EnCasa</p>
              </div>
            </button>
          </div>
        </div>

        {/* Banner de promo activa — clickeable */}
        {activePromo && (
          <button
            onClick={() => setPromoModal(true)}
            className="w-full bg-venezuela-dark px-5 py-4 flex items-center justify-between gap-4 hover:brightness-110 transition-all active:scale-[0.99] border-y border-ven-yellow/20"
          >
            <div className="flex items-center gap-3">
              {/* Icono con fondo amarillo */}
              <div className="bg-ven-yellow rounded-xl p-2 shrink-0 shadow-lg shadow-yellow-500/20">
                <Zap size={16} className="text-venezuela-dark" fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-ven-yellow uppercase tracking-[0.2em] leading-none mb-1">Promoción activa</p>
                <p className="text-white font-black text-sm leading-tight">{activePromo.label}</p>
                {activePromo.sublabel && (
                  <p className="text-gray-400 text-[10px] font-bold mt-0.5">{activePromo.sublabel}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-ven-yellow/10 border border-ven-yellow/30 rounded-xl px-3 py-1.5 shrink-0">
              <span className="text-[9px] font-black text-ven-yellow uppercase tracking-widest">Ver</span>
              <ChevronRight size={12} className="text-ven-yellow" />
            </div>
          </button>
        )}

        {/* Banner venta por mayor — scroll a la sección */}
        {hasMayor && (
          <button
            onClick={() => document.getElementById('seccion-mayorista')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full bg-blue-600 px-6 py-3 flex items-center justify-between gap-4 hover:bg-blue-700 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Package size={15} className="text-white shrink-0" />
              <p className="text-white font-black text-[11px] uppercase tracking-wide">📦 Venta por Mayor disponible — ver precios y productos</p>
            </div>
            <ChevronRight size={13} className="text-white/70 shrink-0" />
          </button>
        )}

        {/* Badge de delivery gratis — clickeable */}
        {hasFreeDelivery(store.id) && (
          <button
            onClick={() => setDeliveryModal(true)}
            className="w-full bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between gap-4 hover:bg-emerald-100 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <Truck size={15} className="text-emerald-600 shrink-0" />
              <p className="text-emerald-700 font-black text-[11px] uppercase tracking-wide">🚚 Delivery gratis disponible en zonas cercanas</p>
            </div>
            <ChevronRight size={13} className="text-emerald-400 shrink-0" />
          </button>
        )}

        {/* Combos Relámpago — antes del mapa */}
        {storeCombosEntry && (
          <div className="bg-venezuela-dark px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-ven-yellow/15 p-2.5 rounded-xl">
                <Zap size={20} className="text-ven-yellow" fill="currentColor" />
              </div>
              <div>
                <p className="text-ven-yellow text-[10px] font-black uppercase tracking-widest">Promociones</p>
                <h3 className="text-white font-black text-xl leading-tight">{storeCombosEntry.sectionTitle}</h3>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {storeCombosEntry.combos.map((combo) => (
                <div
                  key={combo.id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-4 hover:border-ven-yellow/40 transition-colors"
                >
                  {/* Nombre y descripción */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={12} className="text-ven-yellow" fill="currentColor" />
                      <h4 className="text-white font-black text-base uppercase tracking-tight">{combo.name}</h4>
                    </div>
                    {combo.description && (
                      <p className="text-gray-400 text-[11px] font-medium leading-snug italic">{combo.description}</p>
                    )}
                  </div>

                  {/* Items del combo */}
                  <div className="flex flex-col gap-2">
                    {combo.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-2xl px-3 py-2.5">
                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-8 h-8 rounded-xl object-cover shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-xl shrink-0 w-8 text-center leading-none">{item.emoji || '📦'}</span>
                        )}
                        <div className="min-w-0">
                          <p className="text-white text-sm font-black leading-snug truncate">{item.name}</p>
                          {item.qty && (
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{item.qty}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      const itemsList = combo.items.map(i => `• ${i.qty ? i.qty + ' ' : ''}${i.name}`).join('\n');
                      const msg = `Hola *${store.name}* 👋 Quiero pedir el *${combo.name}*:\n${itemsList}\n\n¿Cuánto sale y cómo coordino el pedido?`;
                      window.open(`https://wa.me/5491136026302?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full bg-ven-yellow/15 hover:bg-ven-yellow/25 border border-ven-yellow/30 hover:border-ven-yellow/60 text-ven-yellow py-3 rounded-2xl font-black text-[11px] tracking-widest uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} />
                    Pedir este combo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-[550px] w-full bg-gray-100 relative">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1)' }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            title="Ubicación del Local"
          ></iframe>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white text-center">
              <h4 className="font-black text-gray-900 text-lg mb-2">¿Listo para tu pedido?</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 italic font-medium">
                Este local es un punto de retiro oficial. Gestionamos tu pedido vía WhatsApp para asegurar el stock de tus productos.
              </p>
              <button
                onClick={handleOrderRedirect}
                className="w-full bg-ven-yellow hover:bg-yellow-500 text-ven-blue py-5 rounded-[24px] font-black text-sm tracking-widest shadow-2xl shadow-yellow-500/40 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase"
              >
                <ExternalLink size={18} />
                Quiero hacer un pedido de este local
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 mb-10">
        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-ven-yellow/10 rounded-xl flex items-center justify-center text-ven-yellow font-black text-lg">?</span>
          Preguntas Frecuentes
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-black text-gray-800">{faq.q}</span>
                <ChevronDown size={16} className={`text-ven-yellow shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sección Mayorista — solo locales con el tag */}
      {hasMayor && (
        <div id="seccion-mayorista" className="bg-white rounded-[40px] border border-blue-100 shadow-xl overflow-hidden mb-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/15 p-3.5 rounded-2xl">
                <Package size={26} className="text-white" />
              </div>
              <div>
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-0.5">Programa Mayorista</p>
                <h3 className="text-white font-black text-2xl leading-tight">Venta por Mayor</h3>
                <p className="text-blue-100 text-xs font-medium mt-0.5">Precios especiales para revendedores y distribuidores</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
              <span className="text-white text-xs font-black uppercase tracking-wide">Exclusivo mayoristas</span>
            </div>
          </div>

          <div className="p-8">
            {/* Productos por mayor */}
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Productos disponibles por mayor</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { emoji: '🧀', label: 'Queso de Mano', sub: 'Desde 6 unidades' },
                { emoji: '🧀', label: 'Queso Duro', sub: 'Desde 6 unidades' },
                { emoji: '🥛', label: 'Nata Criolla', sub: 'Por paquete' },
                { emoji: '🍺', label: 'Maltas y Bebidas', sub: 'Por caja' },
                { emoji: '🫓', label: 'Cachapas', sub: 'Pack x10 o x20' },
                { emoji: '🍬', label: 'Chucherías', sub: 'Por caja cerrada' },
              ].map(({ emoji, label, sub }) => (
                <div key={label} className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="text-xs font-black text-blue-900 leading-tight">{label}</p>
                    <p className="text-[10px] text-blue-400 font-bold">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ventajas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: '💰', title: 'Precio mayorista', desc: 'Hasta 30% menos que precio minorista' },
                { icon: '📦', title: 'Sin límite', desc: 'Pedís la cantidad que necesitás' },
                { icon: '🚚', title: 'Entrega acordada', desc: 'Coordinamos envío o retiro en local' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-2xl px-4 py-4 flex items-start gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="text-xs font-black text-gray-800">{title}</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Nota condiciones */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-start gap-3 mb-6">
              <span className="text-lg mt-0.5">⚠️</span>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Los precios mayoristas, mínimos de compra y disponibilidad de stock se confirman directamente con el local por WhatsApp. Los precios pueden variar según cantidad y producto.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                const msg = `Hola *${store.name}* 👋 Vi la sección de *Venta por Mayor* en EnCasa Venezuela y quiero consultar precios mayoristas y cantidades mínimas.`;
                window.open(`https://wa.me/5491136026302?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-[24px] font-black text-sm tracking-wide shadow-lg shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <MessageCircle size={20} />
              Consultar precios mayoristas por WhatsApp
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 text-gray-500">
        <AlertCircle size={14} />
        <p className="text-[10px] font-bold uppercase tracking-widest">Punto de retiro verificado por EnCasa Venezuela</p>
      </div>
    </div>

    {activePromo && promoModal && (
      <PromoDetailModal
        store={store}
        promo={activePromo}
        onClose={() => setPromoModal(false)}
        onGoToStore={() => setPromoModal(false)}
      />
    )}

    {deliveryModal && (
      <DeliveryZonesModal
        store={store}
        onClose={() => setDeliveryModal(false)}
        onGoToStore={() => setDeliveryModal(false)}
      />
    )}


    <style>{`
      @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
      .animate-shimmer { animation: shimmer 3s linear infinite; }
    `}</style>
    </>
  );
};

export default StoreMapView;