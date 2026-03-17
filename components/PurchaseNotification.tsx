
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Trophy, MapPin } from 'lucide-react';

interface NotificationData {
  title: string;
  name: string;
  location: string;
  item: string;
  timeAgo: string;
  isReal?: boolean;
  points?: number;
  type: 'sale' | 'points' | 'verified';
}

const mockPurchases: NotificationData[] = [
  { title: "¡NUEVA COMPRA!", name: "Elena", location: "Villa Crespo, CABA", item: "Mavesa y Diablitos", timeAgo: "hace 1 min", type: 'sale' },
  { title: "¡PEDIDO CONFIRMADO!", name: "Andrés", location: "Palermo, CABA", item: "un Combo Arepero Full", timeAgo: "hace 2 min", type: 'sale' },
  { title: "¡VENTA RECIENTE!", name: "Valentina", location: "Belgrano, CABA", item: "Tequeños y Maltín Polar", timeAgo: "hace 4 min", type: 'verified' },
  { title: "¡DIRECTO A CASA!", name: "Ricardo", location: "Lanús, GBA", item: "Mega Tequeñazo (50u)", timeAgo: "hace 1 min", type: 'sale' },
];

interface PurchaseNotificationProps {
  realEarned?: number;
}

const PurchaseNotification: React.FC<PurchaseNotificationProps> = ({ realEarned }) => {
  const [current, setCurrent] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);
  const showRef = useRef(show);
  const currentRef = useRef(current);

  useEffect(() => {
    showRef.current = show;
    currentRef.current = current;
  }, [show, current]);

  useEffect(() => {
    // Solo mostramos notificación real si hay puntos ganados
    if (realEarned && realEarned > 0) {
      setCurrent({
        title: "¡PEDIDO EXITOSO!",
        name: "Tú",
        location: "EnCasa Venezuela",
        item: "tu último pedido",
        timeAgo: "ahora",
        isReal: true,
        points: realEarned,
        type: 'points'
      });
      setShow(true);
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [realEarned]);

  useEffect(() => {
    let index = Math.floor(Math.random() * mockPurchases.length);
    let timer: NodeJS.Timeout;
    
    const triggerNotification = () => {
      // Si hay una notificación real mostrándose, esperamos al siguiente ciclo
      if (showRef.current && currentRef.current?.isReal) return;
      
      const nextIndex = (index + 1) % mockPurchases.length;
      index = nextIndex;
      setCurrent(mockPurchases[nextIndex]);
      setShow(true);
      
      // El popup debe durar 4 segundos en vista
      timer = setTimeout(() => setShow(false), 4000);
    };

    // Aparece cada 9 segundos
    const interval = setInterval(triggerNotification, 9000);
    
    // Primer disparo después de un pequeño delay inicial
    const initialDelay = setTimeout(triggerNotification, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      clearTimeout(initialDelay);
    };
  }, []);

  if (!current) return null;

  return (
    <div 
      className={`fixed bottom-24 left-6 z-[60] max-w-[280px] w-full transition-all duration-700 transform ${show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'}`}
    >
      <div className={`rounded-[20px] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.4)] border flex items-center gap-3 relative overflow-hidden ${current.isReal ? 'bg-gradient-to-br from-ven-yellow/20 via-ven-blue/20 to-ven-red/20 backdrop-blur-xl text-white border-white/20' : 'bg-venezuela-dark/80 backdrop-blur-md text-white border-white/5'}`}>
        <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${current.isReal ? 'bg-ven-yellow/20' : 'bg-white/5 border border-white/10'}`}>
          {current.isReal ? (
            <Trophy size={16} className="text-ven-yellow" />
          ) : (
            <ShoppingBag className="text-ven-yellow" size={16} />
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-center mb-0.5">
             <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${current.isReal ? 'text-ven-yellow' : 'text-gray-500'}`}>
               {current.title}
             </span>
             <span className="text-[7px] font-bold text-gray-600 uppercase">
               {current.timeAgo}
             </span>
          </div>
          
          <div className="space-y-0.5">
            <p className="text-[11px] leading-tight truncate">
              {current.isReal ? (
                <>¡Gracias por tu <span className="font-black text-ven-yellow">preferencia</span>!</>
              ) : (
                <><span className="font-black text-gray-200">{current.name}</span> compró <span className="text-ven-yellow font-bold">{current.item}</span></>
              )}
            </p>
            {!current.isReal && (
              <p className="text-[9px] text-gray-600 flex items-center gap-1 font-bold truncate">
                <MapPin size={8} className="text-ven-yellow/50" /> {current.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotification;
