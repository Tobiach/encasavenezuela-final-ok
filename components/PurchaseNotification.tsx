
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, MapPin } from 'lucide-react';

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
  { title: "sale", name: "Elena", location: "Villa Crespo", item: "Mavesa y Diablitos", timeAgo: "ahora", type: 'sale' },
  { title: "sale", name: "Andrés", location: "Palermo", item: "Combo Arepero Full", timeAgo: "hace 1 min", type: 'sale' },
  { title: "sale", name: "Valentina", location: "Belgrano", item: "Tequeños y Maltín Polar", timeAgo: "hace 2 min", type: 'verified' },
  { title: "sale", name: "Ricardo", location: "Lanús", item: "Mega Tequeñazo (50u)", timeAgo: "hace 1 min", type: 'sale' },
];

interface PurchaseNotificationProps {
  realEarned?: number;
}

const PurchaseNotification: React.FC<PurchaseNotificationProps> = ({ realEarned }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<NotificationData | null>(null);
  const [show, setShow] = useState(false);
  const showRef = useRef(show);
  const currentRef = useRef(current);

  useEffect(() => {
    showRef.current = show;
    currentRef.current = current;
  }, [show, current]);

  useEffect(() => {
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
      if (showRef.current && currentRef.current?.isReal) return;
      const nextIndex = (index + 1) % mockPurchases.length;
      index = nextIndex;
      setCurrent(mockPurchases[nextIndex]);
      setShow(true);
      timer = setTimeout(() => setShow(false), 4000);
    };

    const interval = setInterval(triggerNotification, 9000);
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
      className={`fixed bottom-24 left-4 z-[60] max-w-[272px] w-full transition-all duration-300 ease-out ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
      }`}
    >
      {current.isReal ? (
        <div className="rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/10 bg-gradient-to-br from-ven-yellow/20 via-ven-blue/20 to-ven-red/20 backdrop-blur-xl text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-ven-yellow/20 shrink-0">
            <Trophy size={16} className="text-ven-yellow" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-ven-yellow mb-0.5">¡Pedido exitoso!</p>
            <p className="text-[12px] font-bold truncate">¡Gracias por tu <span className="text-ven-yellow">preferencia</span>!</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-black/5 overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-3 pb-2.5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">Pedido en vivo</span>
              </div>
              <span className="text-[9px] text-gray-400 font-medium">{current.timeAgo}</span>
            </div>

            {/* Content */}
            <div className="space-y-0.5">
              <p className="text-[12px] font-bold text-gray-800 leading-snug">
                <span className="text-gray-900">{current.name}</span>
                <span className="text-gray-400 font-medium"> — {current.location}</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium">acaba de pedir</p>
              <p className="text-[13px] font-black text-gray-900 truncate">{current.item}</p>
            </div>
          </div>

          {/* CTA footer */}
          <button
            onClick={() => navigate('/catalog')}
            className="w-full border-t border-black/5 px-4 py-2 flex items-center justify-between bg-gray-50/60 hover:bg-ven-yellow/5 active:bg-ven-yellow/10 transition-colors"
          >
            <span className="text-[10px] text-gray-300 font-medium flex items-center gap-1">
              <MapPin size={9} /> CABA, ARG
            </span>
            <span className="text-[10px] font-black text-ven-yellow uppercase tracking-wide">Ver combo →</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseNotification;
