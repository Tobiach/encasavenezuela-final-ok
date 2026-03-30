import React, { useState } from 'react';
import { PartnerStore } from '../types';
import { MapPin, Clock, ExternalLink, Smartphone, AlertCircle, ChevronDown, Truck, ChevronRight } from 'lucide-react';
import storesFaq from '../data/stores-faq.json' assert { type: 'json' };
import storesDelivery from '../data/stores-delivery.json' assert { type: 'json' };
import PromoDetailModal, { PromoEntry } from './PromoDetailModal';
import DeliveryZonesModal from './DeliveryZonesModal';
import storesPromotions from '../data/stores-promotions.json' assert { type: 'json' };

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
  const faqs = (storesFaq as Record<string, { q: string; a: string }[]>)[store.id] ?? storesFaq['_default'];
  const activePromo = getActivePromo(store.id);

  const handleOrderRedirect = () => {
    const message = `¡Hola EnCasa Venezuela! 🇻🇪 Vi el local *${store.name}* en el mapa y quiero hacer un pedido para retirar ahí o que me envíen de esa zona.`;
    window.open(`https://wa.me/5491136026302?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
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
            className="w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-[length:200%_auto] animate-shimmer px-6 py-3 flex items-center justify-between gap-4 hover:brightness-105 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <div className="text-left">
                <p className="text-white font-black text-sm uppercase tracking-wide">{activePromo.label}</p>
                {activePromo.sublabel && (
                  <p className="text-white/80 text-[10px] font-bold">{activePromo.sublabel}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 shrink-0">
              <span className="text-[9px] font-black uppercase tracking-widest">Ver detalles</span>
              <ChevronRight size={14} className="text-white" />
            </div>
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