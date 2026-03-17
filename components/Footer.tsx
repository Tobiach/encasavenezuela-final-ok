
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Phone, Mail, MapPin, Send, CheckCircle2, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulación de envío
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  const footerLinks = [
    { name: 'Catálogo Completo', path: '/catalog' },
    { name: 'Cómo Comprar', action: () => {
      if (window.location.hash === '#/') {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }},
    { name: 'Locales Amigos', path: '/partners' }
  ];

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-black/5 relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ven-yellow/10 blur-[120px] -z-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-ven-blue/5 blur-[120px] -z-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-ven-yellow to-venezuela-orange rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                <span className="text-white text-2xl font-bold">🏠</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-venezuela-brown">
                EnCasa <span className="text-ven-yellow drop-shadow-sm">Venezuela</span>
              </span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed font-bold">
              Conectamos a la comunidad venezolana con los sabores que definen nuestra identidad. Calidad Premium, atención de panas.
            </p>
            <div className="flex gap-5">
              {[Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-venezuela-dark flex items-center justify-center hover:bg-gradient-to-br hover:from-ven-yellow hover:to-venezuela-orange hover:text-white transition-all hover:scale-110 border-2 border-black/5 text-venezuela-brown shadow-lg">
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[11px] text-venezuela-orange border-b-2 border-venezuela-orange/20 pb-2 inline-block">Explorar</h4>
            <ul className="space-y-6 text-sm font-black text-gray-600">
              {footerLinks.map(link => (
                <li key={link.name}>
                  <button 
                    onClick={() => link.path ? navigate(link.path) : link.action?.()}
                    className="hover:text-venezuela-orange transition-colors uppercase tracking-widest flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-ven-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[11px] text-venezuela-orange border-b-2 border-venezuela-orange/20 pb-2 inline-block">Contacto Directo</h4>
            <ul className="space-y-8 text-sm font-black text-gray-600">
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-ven-yellow/10 flex items-center justify-center text-ven-yellow group-hover:bg-ven-yellow group-hover:text-white transition-all shadow-md border border-ven-yellow/20"><Phone size={20} /></div>
                <span className="group-hover:text-venezuela-brown transition-colors">+54 9 11 3455 2996</span>
              </li>
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-ven-blue/10 flex items-center justify-center text-ven-blue group-hover:bg-ven-blue group-hover:text-white transition-all shadow-md border border-ven-blue/20"><Mail size={20} /></div>
                <span className="group-hover:text-venezuela-brown transition-colors truncate">info.encasaven@gmail.com</span>
              </li>
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-ven-red/10 flex items-center justify-center text-ven-red group-hover:bg-ven-red group-hover:text-white transition-all shadow-md border border-ven-red/20"><MapPin size={20} /></div>
                <span className="group-hover:text-venezuela-brown transition-colors">Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[11px] text-venezuela-orange border-b-2 border-venezuela-orange/20 pb-2 inline-block">Únete al Boletín</h4>
            <p className="text-sm text-gray-700 mb-8 leading-relaxed font-bold">Recibe ofertas exclusivas y lanzamientos de combos relámpago.</p>
            
            {isSubscribed ? (
              <div className="bg-ven-yellow/10 border-2 border-ven-yellow/30 p-8 rounded-[40px] animate-in zoom-in-95 duration-500 flex flex-col items-center text-center gap-4 shadow-2xl">
                <div className="bg-ven-yellow p-4 rounded-full text-white shadow-2xl border-2 border-white/20">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <p className="text-sm font-black text-venezuela-brown uppercase tracking-widest">¡Bienvenido, Pana!</p>
                  <p className="text-xs text-gray-600 font-black mt-2 uppercase tracking-tight">Ya estás en la lista VIP de EnCasa.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email de pana" 
                    required
                    className="w-full bg-venezuela-dark border-2 border-black/5 rounded-2xl py-6 px-8 text-sm focus:outline-none focus:border-ven-yellow transition-all placeholder:text-gray-400 text-venezuela-brown font-bold shadow-inner"
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-gradient-to-br from-ven-yellow to-venezuela-orange hover:brightness-110 py-6 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 disabled:opacity-50 text-white shadow-2xl shadow-venezuela-orange/30 border-2 border-white/20"
                >
                  {loading ? 'PROCESANDO...' : 'SUSCRIBIRME'}
                  {!loading && <Send size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-gray-700 font-black uppercase tracking-[0.4em]">© 2024 EnCasa Venezuela | El Sabor que nos Une</p>
          <div className="flex items-center gap-3 text-[11px] text-gray-700 font-black uppercase tracking-[0.2em] bg-venezuela-dark px-4 py-2 rounded-full border border-black/5">
            <Sparkles size={14} className="text-ven-yellow" /> HECHO PARA LA COMUNIDAD
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
