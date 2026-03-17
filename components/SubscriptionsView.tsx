
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';

const plans = [
  {
    id: 'box-nostalgia',
    name: "Caja Nostalgia",
    price: 25000,
    frequency: "Mensual",
    storeId: 'real-11',
    description: "La selección definitiva de chucherías, maltas y harina para que nunca falte lo básico.",
    items: ["2x Harina P.A.N.", "4x Maltín Polar", "1x Pirulín", "1x Queso Llanero (500g)"]
  },
  {
    id: 'ruta-arepa',
    name: "Ruta de la Arepa",
    price: 15000,
    frequency: "Quincenal",
    storeId: 'real-5',
    description: "Para los areperos de corazón. Recibe harina y rellenos frescos cada 15 días.",
    items: ["2x Harina P.A.N.", "1x Diablitos", "1x Margarina Mavesa"]
  },
  {
    id: 'merienda-pana',
    name: "Merienda Pana",
    price: 12000,
    frequency: "Mensual",
    storeId: 'real-7',
    description: "Especial de golosinas y snacks para tus tardes de café o Toddy.",
    items: ["2x Cocosette", "2x Galak", "1x Toddy (400g)", "1x Susy"]
  }
];

const SubscriptionsView: React.FC = () => {
  const navigate = useNavigate();
  const [activeSub, setActiveSub] = useState<string | null>(localStorage.getItem('encasa_active_sub'));
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('encasa_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const subscribe = (plan: typeof plans[0]) => {
    if (!user) {
      alert("¡Epa Pana! Para suscribirte a nuestros planes culturales, necesitas crear tu perfil oficial.");
      navigate('/auth');
      return;
    }

    const store = LOCALES_VENEZOLANOS.find(s => s.id === plan.storeId);
    localStorage.setItem('encasa_active_sub', plan.id);
    setActiveSub(plan.id);

    const message = `¡Hola EnCasa! 🇻🇪 Quiero suscribirme al plan *${plan.name}* ofrecido por el local *${store?.name || 'Aliado'}*.%0A%0AMi correo: ${user.email}%0A%0A¿Me confirman los pasos para activar mi suscripción mensual?`;
    window.open(`https://wa.me/5491134552996?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Suscripciones <span className="text-ven-yellow">Premium</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto italic text-sm md:text-base">
          Planes mensuales directos de nuestros locales aliados. Asegura tu stock y ahorra un 15% mensual.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map(plan => {
          const store = LOCALES_VENEZOLANOS.find(s => s.id === plan.storeId);
          return (
            <div key={plan.id} className={`gradient-card p-10 rounded-[48px] border transition-all relative overflow-hidden flex flex-col ${activeSub === plan.id ? 'border-ven-yellow shadow-2xl' : 'border-white/5 hover:border-white/10'}`}>
              <div className="mb-6 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-gray-500">
                    <Store size={14} className="text-ven-yellow" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{store?.name}</span>
                 </div>
                 {activeSub === plan.id && <ShieldCheck size={18} className="text-green-500 animate-pulse" />}
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-ven-yellow">${plan.price}</span>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">/ {plan.frequency}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">"{plan.description}"</p>

              <div className="bg-black/30 p-6 rounded-3xl space-y-3 mb-10 flex-grow border border-white/5">
                {plan.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-medium text-gray-300">
                    <Zap size={10} className="text-ven-yellow shrink-0" /> {item}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => subscribe(plan)}
                className={`w-full py-5 rounded-2xl font-black tracking-widest transition-all active:scale-95 shadow-xl ${activeSub === plan.id ? 'bg-white/10 text-white' : 'bg-ven-yellow hover:bg-yellow-500 text-ven-blue shadow-yellow-500/10'}`}
              >
                {activeSub === plan.id ? 'PLAN SOLICITADO' : 'SUSCRIBIRME'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionsView;
