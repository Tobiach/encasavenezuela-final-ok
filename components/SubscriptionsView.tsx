import React, { useState, useRef } from 'react';
import { ShieldCheck, Zap, Store, X, Upload, Check, Copy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../lib/hooks/useStores';

const ALIAS = 'encasa.venezuela.mp';
const CBU   = '0000003100088888888888';
const WAPP  = '5491136026302';

const plans = [
  {
    id: 'box-nostalgia',
    name: 'Caja Nostalgia',
    emoji: '📦',
    price: 25000,
    frequency: 'Mensual',
    storeId: 'minimarket-vibe',
    description: 'La selección definitiva de chucherías, maltas y harinas para que nunca falte lo básico.',
    items: ['2× Harina P.A.N.', '4× Maltín Polar', '1× Pirulín', '1× Queso Llanero (500g)'],
    highlight: true,
  },
  {
    id: 'ruta-arepa',
    name: 'Ruta de la Arepa',
    emoji: '🫓',
    price: 15000,
    frequency: 'Quincenal',
    storeId: 'minimarket-vibe',
    description: 'Para los areperos de corazón. Recibí harina y rellenos frescos cada 15 días.',
    items: ['2× Harina P.A.N.', '1× Diablitos', '1× Margarina Mavesa'],
    highlight: false,
  },
  {
    id: 'merienda-pana',
    name: 'Merienda Pana',
    emoji: '🍫',
    price: 12000,
    frequency: 'Mensual',
    storeId: 'minimarket-vibe',
    description: 'Golosinas y chucherías para tus tardes de café o Toddy.',
    items: ['2× Cocosette', '2× Galak', '1× Toddy 400g', '1× Susy'],
    highlight: false,
  },
];

type Plan = typeof plans[0];

interface PayModalProps {
  plan: Plan;
  storeName: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

const PayModal: React.FC<PayModalProps> = ({ plan, storeName, userName, userEmail, onClose }) => {
  const [copied, setCopied] = useState<'alias' | 'cbu' | null>(null);
  const [file, setFile]     = useState<File | null>(null);
  const [sent, setSent]     = useState(false);
  const fileRef             = useRef<HTMLInputElement>(null);

  const copy = (text: string, type: 'alias' | 'cbu') => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSend = () => {
    const msg = [
      `¡Hola EnCasa! 🇻🇪`,
      ``,
      `Quiero suscribirme al plan *${plan.name}* (${plan.emoji}) por $${plan.price.toLocaleString('es-AR')} — ${plan.frequency}.`,
      `Local: *${storeName}*`,
      ``,
      `👤 Nombre: ${userName}`,
      `📧 Email: ${userEmail}`,
      ``,
      `Ya realicé el pago. Te adjunto el comprobante en este chat. 📎`,
    ].join('\n');
    window.open(`https://wa.me/${WAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-black text-[#6B1D1D] uppercase tracking-widest mb-0.5">Suscripción</p>
            <h3 className="font-black text-[#2E1A14] text-base">{plan.emoji} {plan.name}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Precio */}
          <div className="flex items-baseline gap-2 bg-[#F4C542]/10 border border-[#F4C542]/30 rounded-2xl px-4 py-3">
            <span className="text-2xl font-black text-[#2E1A14]">${plan.price.toLocaleString('es-AR')}</span>
            <span className="text-xs font-bold text-gray-500">/ {plan.frequency}</span>
          </div>

          {/* Datos de pago */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Realizá tu pago</p>

            {/* Alias */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">Alias</p>
                <p className="text-sm font-black text-[#2E1A14]">{ALIAS}</p>
              </div>
              <button
                onClick={() => copy(ALIAS, 'alias')}
                className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center active:scale-90 transition-all"
              >
                {copied === 'alias' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
              </button>
            </div>

            {/* CBU */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase">CBU</p>
                <p className="text-[11px] font-black text-[#2E1A14] tracking-wider">{CBU}</p>
              </div>
              <button
                onClick={() => copy(CBU, 'cbu')}
                className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center active:scale-90 transition-all"
              >
                {copied === 'cbu' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Subir comprobante */}
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Comprobante de pago</p>
            <button
              onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-2xl py-4 flex flex-col items-center gap-2 transition-all ${
                file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-[#F4C542]/60 hover:bg-[#F4C542]/5'
              }`}
            >
              {file ? (
                <>
                  <Check size={20} className="text-green-500" />
                  <p className="text-xs font-bold text-green-600 truncate max-w-[200px]">{file.name}</p>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-gray-400" />
                  <p className="text-xs font-bold text-gray-500">Tocá para adjuntar captura</p>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          {/* Botón enviar */}
          {sent ? (
            <div className="w-full bg-green-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm">
              <Check size={18} /> ¡Enviado por WhatsApp!
            </div>
          ) : (
            <button
              onClick={handleSend}
              className="w-full bg-[#6B1D1D] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-all shadow-lg shadow-[#6B1D1D]/25"
            >
              Confirmar vía WhatsApp <ChevronRight size={16} />
            </button>
          )}
          <p className="text-[9px] text-gray-400 text-center">Adjuntá el comprobante directamente en el chat de WhatsApp</p>
        </div>
      </div>
    </div>
  );
};

interface SubscriptionsViewProps {
  user?: { name?: string; email?: string; is_logged_in?: boolean } | null;
}

const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ user: userProp }) => {
  const navigate = useNavigate();
  const { stores } = useStores();
  const [payingPlan, setPayingPlan] = useState<Plan | null>(null);

  const user = userProp && userProp.is_logged_in
    ? { name: userProp.name || 'Cliente', email: userProp.email || '' }
    : null;

  const handleSubscribe = (plan: Plan) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setPayingPlan(plan);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-28">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 px-6 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F4C542]/15 border border-[#F4C542]/30 text-[#6B1D1D] font-black text-[9px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-4">
          <Zap size={10} fill="currentColor" /> Planes Mensuales
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#2E1A14] uppercase tracking-tight leading-tight mb-3">
          Suscripciones<br /><span className="text-[#F4C542]" style={{ WebkitTextStroke: '1px #F4C542' } as React.CSSProperties}>Premium</span>
        </h1>
        <p className="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed font-medium">
          Planes directos de nuestros locales aliados. Asegurá tu stock y ahorrá hasta un 15% mensual.
        </p>
      </div>

      {/* Cards */}
      <div className="px-4 pt-6 space-y-4 max-w-lg mx-auto">
        {plans.map(plan => {
          const store = stores.find(s => s.id === plan.storeId);
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border-2 p-5 shadow-sm transition-all ${
                plan.highlight ? 'border-[#F4C542]/60 shadow-[#F4C542]/15 shadow-md' : 'border-gray-100'
              }`}
            >
              {plan.highlight && (
                <div className="inline-flex items-center gap-1.5 bg-[#F4C542] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-sm">
                  <Zap size={9} fill="currentColor" /> Más popular
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-black text-[#2E1A14] leading-tight">{plan.emoji} {plan.name}</h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-[#2E1A14]">${plan.price.toLocaleString('es-AR')}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">/ {plan.frequency}</span>
                  </div>
                </div>
                {store && (
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-2 py-1">
                    <Store size={10} className="text-[#F4C542] shrink-0" />
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-wide">{store.name}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">{plan.description}</p>

              <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 mb-4 border border-gray-100">
                {plan.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                    <div className="w-4 h-4 bg-[#F4C542]/20 rounded-full flex items-center justify-center shrink-0">
                      <Zap size={8} className="text-[#6B1D1D]" fill="currentColor" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                className="w-full bg-[#6B1D1D] text-white font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-[#6B1D1D]/20 hover:brightness-110"
              >
                <ShieldCheck size={16} /> Suscribirme
              </button>
            </div>
          );
        })}
      </div>

      {payingPlan && user && (
        <PayModal
          plan={payingPlan}
          storeName={stores.find(s => s.id === payingPlan.storeId)?.name || 'Local Aliado'}
          userName={user.name}
          userEmail={user.email}
          onClose={() => setPayingPlan(null)}
        />
      )}
    </div>
  );
};

export default SubscriptionsView;
