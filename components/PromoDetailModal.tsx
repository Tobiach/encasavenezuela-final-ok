import React from 'react';
import { X, Clock, CheckCircle, AlertCircle, ArrowRight, Zap, Tag, Gift, Package } from 'lucide-react';
import { PartnerStore } from '../types';

export type PromoComboItem = { name: string; qty?: string; emoji?: string; img?: string };
export type PromoCombo = { name: string; items: PromoComboItem[] };

export type PromoEntry = {
  label: string;
  sublabel?: string;
  validUntil: string;
  type?: 'happy_hour' | 'combo' | 'discount';
  title?: string;
  description?: string;
  howItWorks?: string[];
  conditions?: string;
  heroEmojis?: string[];
  gradient?: string;
  combos?: PromoCombo[];
};

interface PromoDetailModalProps {
  store: PartnerStore;
  promo: PromoEntry;
  onClose: () => void;
  onGoToStore: () => void;
}

const TYPE_CONFIG = {
  happy_hour: {
    badge: '⏰ Happy Hour',
    badgeColor: 'bg-amber-500/30 text-amber-100',
    icon: <Clock size={16} />,
    accentColor: 'text-amber-400',
    stepsBg: 'bg-amber-50 border-amber-100',
    stepsIcon: 'text-amber-500',
  },
  combo: {
    badge: '🍽️ Combo Especial',
    badgeColor: 'bg-emerald-500/30 text-emerald-100',
    icon: <Gift size={16} />,
    accentColor: 'text-emerald-500',
    stepsBg: 'bg-emerald-50 border-emerald-100',
    stepsIcon: 'text-emerald-500',
  },
  discount: {
    badge: '💸 Descuento',
    badgeColor: 'bg-rose-500/30 text-rose-100',
    icon: <Tag size={16} />,
    accentColor: 'text-rose-500',
    stepsBg: 'bg-rose-50 border-rose-100',
    stepsIcon: 'text-rose-500',
  },
};

const PromoDetailModal: React.FC<PromoDetailModalProps> = ({ store, promo, onClose, onGoToStore }) => {
  const type = promo.type || 'discount';
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.discount;
  const gradient = promo.gradient || 'from-orange-500 to-amber-400';
  const emojis = promo.heroEmojis || ['🎉', '⚡', '🔥'];

  const validDate = new Date(promo.validUntil);
  const validLabel = validDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative w-full md:max-w-2xl bg-white rounded-t-[40px] md:rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Hero ilustrado */}
        <div className={`relative bg-gradient-to-br ${gradient} aspect-[16/9] shrink-0 flex items-center justify-center overflow-hidden`}>
          {/* Círculos decorativos */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-14 -left-14 w-56 h-56 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full" />

          {/* Emojis hero */}
          <div className="relative z-10 flex items-center gap-6 md:gap-10">
            {emojis.map((emoji, i) => (
              <span
                key={i}
                className="select-none"
                style={{
                  fontSize: i === 1 ? '5rem' : '3.5rem',
                  filter: i !== 1 ? 'opacity(0.75)' : undefined,
                  lineHeight: 1,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* Badge tipo de promo — abajo izquierda */}
          <div className={`absolute bottom-4 left-4 ${cfg.badgeColor} backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5`}>
            {cfg.badge}
          </div>

          {/* Válido hasta — arriba derecha */}
          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wide">
            📅 Hasta {validLabel}
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">

          {/* Nombre del local */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-1.5">
            <Zap size={10} className="text-ven-yellow" /> {store.name}
          </p>

          {/* Título y descripción */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-venezuela-brown uppercase tracking-tight leading-tight mb-3">
              {promo.title || promo.label}
            </h2>
            {promo.description && (
              <p className="text-gray-500 text-sm leading-relaxed italic">
                "{promo.description}"
              </p>
            )}
          </div>

          {/* Sublabel destacado */}
          {promo.sublabel && (
            <div className={`${cfg.stepsBg} border rounded-2xl px-4 py-3 flex items-center gap-3`}>
              <Clock size={16} className={cfg.stepsIcon} />
              <p className={`text-sm font-black ${cfg.stepsIcon} uppercase tracking-wide`}>{promo.sublabel}</p>
            </div>
          )}

          {/* Cómo funciona */}
          {promo.howItWorks && promo.howItWorks.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <CheckCircle size={12} className="text-ven-yellow" /> Cómo funciona
              </h3>
              <div className="space-y-2.5">
                {promo.howItWorks.map((step, i) => (
                  <div key={i} className={`${cfg.stepsBg} border rounded-2xl px-4 py-3 flex items-start gap-3`}>
                    <span className={`text-[10px] font-black ${cfg.stepsIcon} bg-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 border`}>
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 font-medium leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Combos Relámpago */}
          {promo.combos && promo.combos.length > 0 && (
            <div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Zap size={12} className="text-ven-yellow" fill="currentColor" /> Combos Relámpago
              </h3>
              <div className="space-y-3">
                {promo.combos.map((combo, ci) => (
                  <div key={ci} className="bg-venezuela-dark rounded-2xl overflow-hidden">
                    {/* Nombre del combo */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <Zap size={11} className="text-ven-yellow shrink-0" fill="currentColor" />
                      <p className="text-white font-black text-sm uppercase tracking-tight">{combo.name}</p>
                    </div>
                    {/* Items */}
                    <div className="px-4 py-3 flex flex-col gap-2">
                      {combo.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                          {item.img ? (
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-7 h-7 rounded-lg object-cover shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-lg shrink-0 w-7 text-center leading-none">{item.emoji || '📦'}</span>
                          )}
                          <div className="min-w-0">
                            <p className="text-white text-[13px] font-black leading-snug truncate">{item.name}</p>
                            {item.qty && (
                              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{item.qty}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Condiciones */}
          {promo.conditions && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex items-start gap-3">
              <AlertCircle size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">{promo.conditions}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onGoToStore}
            className="w-full bg-gradient-to-r from-ven-yellow to-[#F4C542] text-white py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all active:scale-95 shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3"
          >
            Ir al local y aprovechar
            <ArrowRight size={18} />
          </button>

          {/* Espaciado seguro en mobile */}
          <div className="h-2 md:h-0" />
        </div>
      </div>
    </div>
  );
};

export default PromoDetailModal;
