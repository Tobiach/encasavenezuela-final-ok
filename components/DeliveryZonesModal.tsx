import React from 'react';
import { X, Truck, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { PartnerStore } from '../types';
import storesDelivery from '../data/stores-delivery.json' assert { type: 'json' };

type DeliveryEntry = { freeDelivery: boolean; zones?: string[] };
const deliveryData = storesDelivery as unknown as Record<string, DeliveryEntry>;

interface DeliveryZonesModalProps {
  store: PartnerStore;
  onClose: () => void;
  onGoToStore: () => void;
}

const DeliveryZonesModal: React.FC<DeliveryZonesModalProps> = ({ store, onClose, onGoToStore }) => {
  const entry = deliveryData[store.id];
  const zones = entry?.zones ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full md:max-w-md bg-white rounded-t-[40px] md:rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Hero */}
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-400 aspect-[16/7] flex items-center justify-center overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="relative z-10 flex items-center gap-8">
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🚚</span>
            <span style={{ fontSize: '5rem', lineHeight: 1 }}>🏡</span>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>✅</span>
          </div>
          <div className="absolute bottom-3 left-4 bg-emerald-700/40 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wide">
            🚚 Delivery Gratis
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
              <Truck size={10} className="text-emerald-500" /> {store.name}
            </p>
            <h2 className="text-2xl font-black text-venezuela-brown uppercase tracking-tight leading-tight">
              Delivery gratis en tu zona
            </h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed italic">
              "Este local cubre estas zonas sin cargo de envío adicional. Solo llegás al monto mínimo y listo."
            </p>
          </div>

          {zones.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <MapPin size={11} className="text-emerald-500" /> Barrios con cobertura gratuita
              </p>
              <div className="grid grid-cols-2 gap-2">
                {zones.map((zone, i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
                    <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-black text-emerald-700">{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-[11px] text-gray-400 font-medium leading-relaxed italic">
            Monto mínimo de pedido: $5.999 ARS. Fuera de estas zonas, consultá disponibilidad por WhatsApp con el local.
          </div>

          <button
            onClick={onGoToStore}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
          >
            Pedir con delivery gratis
            <ArrowRight size={18} />
          </button>

          <div className="h-1 md:h-0" />
        </div>
      </div>
    </div>
  );
};

export default DeliveryZonesModal;
