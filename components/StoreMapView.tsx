
import React from 'react';
import { PartnerStore } from '../types';
import { MapPin, Clock, ExternalLink, Smartphone, AlertCircle } from 'lucide-react';

interface StoreMapViewProps {
  store: PartnerStore;
}

const StoreMapView: React.FC<StoreMapViewProps> = ({ store }) => {
  // Usamos un embed estándar de Google Maps sin necesidad de API Key compleja para visualización
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(store.name + ' ' + store.location + ' Buenos Aires')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleOrderRedirect = () => {
    const message = `¡Hola EnCasa Venezuela! 🇻🇪 Vi el local *${store.name}* en el mapa y quiero hacer un pedido para retirar ahí o que me envíen de esa zona.`;
    window.open(`https://wa.me/5491134552996?text=${message}`, '_blank');
  };
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in zoom-in-95 duration-700">
      {/* CARD DE INFORMACIÓN - ESTILO PREMIUM */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest leading-none mb-1">Horario</p>
                <p className="text-sm font-black text-gray-900">09:00 - 21:00</p>
              </div>
            </div>
            <button 
              onClick={handleOrderRedirect}
              className="bg-yellow-50 p-6 rounded-[32px] border border-yellow-100 flex items-center gap-4 hover:bg-yellow-100 transition-all text-left group"
            >
              <div className="bg-ven-yellow/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                <Smartphone size={20} className="text-ven-yellow" />
              </div>
              <div>
                <p className="text-[10px] text-ven-yellow font-black uppercase tracking-widest leading-none mb-1">Contacto</p>
                <p className="text-xs font-black text-gray-900">Haz click para pedirlo en EnCasa Ven</p>
              </div>
            </button>
          </div>
        </div>

        {/* MAPA SIN ERROR */}
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
      
      <div className="flex items-center justify-center gap-3 text-gray-500">
        <AlertCircle size={14} />
        <p className="text-[10px] font-bold uppercase tracking-widest">Punto de retiro verificado por EnCasa Venezuela</p>
      </div>
    </div>
  );
};

export default StoreMapView;
