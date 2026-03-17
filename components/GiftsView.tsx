
import React, { useState } from 'react';
import { Gift, Heart, User, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface GiftsViewProps {
  onAddToCart: (p: Product, storeId?: string) => void;
}

const GiftsView: React.FC<GiftsViewProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ budget: 15000, profile: 'goloso' });

  const recommendations = {
    goloso: [
      { id: 5, name: "Caja de Pirulín", price: 2800, img: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=400", storeId: 'real-5' },
      { id: 11, name: "Pack Cocosette", price: 900, img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400", storeId: 'real-2' },
      { id: 13, name: "Barra Galak", price: 1500, img: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=400", storeId: 'real-7' }
    ],
    arepero: [
      { id: 1, name: "Harina P.A.N.", price: 1800, img: "https://images.unsplash.com/photo-1621501103258-0e282496a45c?auto=format&fit=crop&q=80&w=400", storeId: 'real-1' },
      { id: 4, name: "Queso Llanero", price: 3200, img: "https://images.unsplash.com/photo-1486297678162-ad2a19b85f5d?auto=format&fit=crop&q=80&w=400", storeId: 'real-4' },
      { id: 7, name: "Diablitos", price: 1900, img: "https://images.unsplash.com/photo-1563220436-398328c0397f?auto=format&fit=crop&q=80&w=400", storeId: 'real-1' }
    ],
    classic: [
      { id: 2, name: "Maltín Polar", price: 1200, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400", storeId: 'real-1' },
      { id: 3, name: "Pack Tequeños", price: 4500, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=400", storeId: 'real-1' },
      { id: 8, name: "Toddy (400g)", price: 3500, img: "https://images.unsplash.com/photo-1541944743827-e04aa6427c33?auto=format&fit=crop&q=80&w=400", storeId: 'real-1' }
    ]
  };

  const currentRecs = recommendations[config.profile as keyof typeof recommendations];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
              <Gift size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Regala un <span className="text-ven-yellow">Pedacito de Venezuela</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base ml-1.5 italic">
            Dinos para quién es y nosotros nos encargamos de que el sabor llegue directo al corazón.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Lado izquierdo: El Configurador */}
        <div className="lg:col-span-7">
          <div className="gradient-card p-8 md:p-10 rounded-[40px] border border-white/5 relative overflow-hidden h-full shadow-2xl">
            {step === 1 ? (
              <div className="animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <User className="text-ven-yellow" size={24} />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-gray-200">¿A quién va dirigido?</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { id: 'goloso', label: 'El Goloso', icon: '🍫', desc: 'Amante de dulces y chucherías.' },
                    { id: 'arepero', label: 'El Arepero', icon: '🫓', desc: 'No puede vivir sin su harina y rellenos.' },
                    { id: 'classic', label: 'Tradicional', icon: '🥤', desc: 'Maltas, Toddy y lo clásico.' }
                  ].map(p => (
                    <button 
                      key={p.id}
                      onClick={() => { setConfig({...config, profile: p.id}); setStep(2); }}
                      className={`group p-6 rounded-3xl border text-left transition-all relative overflow-hidden ${config.profile === p.id ? 'bg-ven-yellow/10 border-ven-yellow shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform duration-300">{p.icon}</span>
                      <p className="font-bold text-sm mb-1 group-hover:text-ven-yellow transition-colors">{p.label}</p>
                      <p className="text-[10px] text-gray-500 leading-tight h-8 line-clamp-2">{p.desc}</p>
                    </button>
                  ))}
                </div>
                
                <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-3xl flex items-start gap-4">
                  <Sparkles className="text-yellow-500 shrink-0 mt-1" size={20} />
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    "Al elegir un perfil, nuestro sistema de inteligencia cultural selecciona los productos más icónicos que evocan esos recuerdos específicos."
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <button 
                    onClick={() => setStep(1)} 
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    <ArrowLeft size={16} /> Volver a perfiles
                  </button>
                   <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                     <Sparkles className="text-yellow-500" size={14} />
                     <span className="text-[10px] font-black text-yellow-500 uppercase">Pack Sugerido</span>
                   </div>
                </div>

                <div className="bg-black/40 rounded-[32px] border border-white/5 p-6 mb-8 flex-grow">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">Contenido de la Gift Box</p>
                  <div className="space-y-4">
                    {currentRecs.map(r => (
                      <div key={r.id} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                          {r.img ? <img src={r.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-gray-200">{r.name}</p>
                        </div>
                        <span className="text-sm font-black text-ven-yellow">${r.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inversión Total</p>
                      <p className="text-3xl font-black text-white">${currentRecs.reduce((a,b) => a+b.price, 0)}</p>
                    </div>
                    <p className="text-[9px] text-gray-600 font-bold italic mb-1">IVA incluido</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      currentRecs.forEach(r => onAddToCart(r as Product, (r as { storeId?: string }).storeId));
                      alert("¡Pack de regalo añadido al carrito!");
                    }}
                    className="flex-grow bg-ven-yellow text-ven-blue hover:bg-yellow-500 py-5 rounded-3xl font-black tracking-widest shadow-xl shadow-yellow-500/20 active:scale-95 transition-all text-sm"
                  >
                    AÑADIR PACK COMPLETO
                  </button>
                  <button 
                    onClick={() => navigate('/catalog')}
                    className="bg-white/5 border border-white/10 px-8 py-5 rounded-3xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all group"
                  >
                    PERSONALIZAR <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lado derecho: Detalles e Info Extra */}
        <div className="lg:col-span-5 space-y-6">
          <div className="gradient-card p-8 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Heart className="text-red-500" size={20} />
              ¿Qué hace especial este regalo?
            </h4>
            <div className="space-y-6">
              {[
                { title: "Packaging Premium", desc: "Enviamos todo en una caja decorada con motivos venezolanos y papel seda." },
                { title: "Nota Personalizada", desc: "Podrás dictarnos tu mensaje por WhatsApp y lo escribiremos a mano en una tarjeta." },
                { title: "Entrega Garantizada", desc: "Hacemos el seguimiento en tiempo real para que sepas cuándo el cumpleañero recibe su sorpresa." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-ven-yellow mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-200 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-venezuela-dark border border-white/5 p-8 rounded-[40px] text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ven-yellow via-ven-blue to-ven-red" />
            <p className="text-sm font-medium text-gray-400 mb-6 italic">
              "Enviamos un pedacito de nuestra tierra para acortar distancias."
            </p>
            <div className="flex justify-center -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-venezuela-dark overflow-hidden bg-gray-800">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-venezuela-dark bg-ven-yellow flex items-center justify-center text-[10px] font-black text-ven-blue">+1k</div>
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Regalos enviados con éxito</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftsView;
