
import React, { useState } from 'react';
import { Trophy, Gift, Zap, Star, ShieldCheck, UserPlus, Info } from 'lucide-react';
import { Reward } from '../types';

interface LoyaltyViewProps {
  points: number;
  onRedeem: (points: number) => boolean;
}

const rewards: Reward[] = [
  { id: '1', title: 'Bono Nostalgia $2000', description: 'Canjea tus puntos por un bono de compra para tus antojos favoritos.', pointsCost: 150, type: 'discount', value: 2000 },
  { id: '2', title: 'Pack Tequeños Regalo', description: 'Una bandeja de 12 tequeños gratis en tu próximo pedido.', pointsCost: 300, type: 'product' },
  { id: '3', title: 'Envío Priority Gratis', description: 'Entrega en menos de 12hs sin costo adicional en CABA.', pointsCost: 100, type: 'discount', value: 800 },
  { id: '4', title: 'Maltín Polar de Regalo', description: 'Suma una malta helada a tu pedido actual.', pointsCost: 100, type: 'product' },
];

const LoyaltyView: React.FC<LoyaltyViewProps> = ({ points, onRedeem }) => {
  const [redeemedId, setRedeemedId] = useState<string | null>(null);

  const handleRedeem = (reward: Reward) => {
    if (onRedeem(reward.pointsCost)) {
      setRedeemedId(reward.id);
      setTimeout(() => setRedeemedId(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {redeemedId && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-venezuela-dark p-10 rounded-[40px] border border-ven-yellow/30 text-center max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-ven-yellow rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift size={40} className="text-ven-blue" />
            </div>
            <h2 className="text-3xl font-bold mb-4">¡Recompensa Lista!</h2>
            <p className="text-gray-400 mb-8">El beneficio se ha aplicado a tu cuenta de EnCasa Venezuela. ¡Disfrútalo, pana!</p>
            <button onClick={() => setRedeemedId(null)} className="w-full bg-ven-yellow py-4 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-500/20 active:scale-95 transition-all text-ven-blue">Aceptar</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="gradient-card p-10 rounded-[40px] border border-ven-yellow/20 relative overflow-hidden group shadow-2xl shadow-yellow-500/5">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform"><Trophy size={100} /></div>
            <div className="relative z-10">
              <p className="text-ven-yellow font-bold text-sm uppercase tracking-widest mb-2">Mi Balance Actual</p>
              <h2 className="text-7xl font-black">{points} <span className="text-lg text-gray-500 font-bold">pts</span></h2>
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <Info size={14} className="text-ven-yellow" />
                <span>Canje disponible desde los 100 puntos</span>
              </div>
            </div>
          </div>

          <div className="gradient-card p-8 rounded-[40px] border border-white/5 space-y-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Zap size={20} className="text-ven-yellow" />
              Reglas del Club
            </h3>
            <div className="space-y-6">
              {[
                { icon: <ShieldCheck size={18} />, text: 'Suma 1 punto por cada $10.000 comprados.' },
                { icon: <UserPlus size={18} />, text: 'Suma 2 puntos si un amigo compra +$10.000.' },
                { icon: <Star size={18} />, text: 'Canjes disponibles a partir de 100 puntos.', highlight: true },
              ].map((item, i) => (
                <div key={i} className={`flex gap-4 items-start p-3 rounded-2xl transition-colors ${item.highlight ? 'bg-ven-yellow/5 border border-ven-yellow/10' : ''}`}>
                  <div className="bg-white/5 p-2 rounded-lg text-ven-yellow">{item.icon}</div>
                  <p className={`text-sm leading-snug ${item.highlight ? 'text-white font-bold' : 'text-gray-400'}`}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold">Recompensas</h2>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
               <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Mínimo Canje:</span>
               <span className="text-xs text-ven-yellow font-black">100 PTS</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {rewards.map((reward) => {
              const canAfford = points >= reward.pointsCost;
              return (
                <div key={reward.id} className={`gradient-card p-8 rounded-[40px] border transition-all duration-300 relative group ${canAfford ? 'border-white/10 hover:border-ven-yellow/50 shadow-xl' : 'opacity-60 grayscale border-transparent'}`}>
                  {!canAfford && (
                    <div className="absolute top-4 right-4 bg-white/5 p-2 rounded-full">
                      <ShieldCheck size={16} className="text-gray-600" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-2 rounded-full text-xs font-black shadow-lg ${canAfford ? 'bg-ven-yellow text-ven-blue' : 'bg-gray-800 text-gray-500'}`}>
                      {reward.pointsCost} PTS
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-ven-yellow transition-colors">{reward.title}</h4>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">{reward.description}</p>
                  <button 
                    disabled={!canAfford} 
                    onClick={() => handleRedeem(reward)} 
                    className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 ${canAfford ? 'bg-ven-yellow text-ven-blue shadow-xl shadow-yellow-500/20 hover:bg-yellow-400' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                  >
                    {canAfford ? 'CANJEAR AHORA' : `FALTAN ${reward.pointsCost - points} PTS`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyView;
