import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Trash2, Plus, Minus, ExternalLink, UserCircle, Zap, Gift, CalendarCheck, BarChart3, Repeat, Wallet, Banknote, MessageSquareQuote, ChevronRight, ArrowLeft, Share2, Check } from 'lucide-react';
import { Product, User } from '../types';
import { useNavigate } from 'react-router-dom';
import { LOGO_ENCASA_IMAGE } from '../src/assets/imagenes';

interface NavbarProps {
  onNavHome: () => void;
  onNavLoyalty: () => void;
  points: number;
  cart: {product: Product, qty: number}[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onFinalizePurchase: (total: number) => void;
  onClearCart: () => void;
  showLoyalty?: boolean;
  showRadar?: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onNavHome, cart,
  onUpdateQty, onRemoveItem,
  showRadar = true,
  isCartOpen, setIsCartOpen,
  user, onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
  const [orderNote, setOrderNote] = useState('');
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0);
  const cartTotal = subtotal;

  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 1000);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const finalizeOrder = () => {
    // ELIMINADO: Bloqueo de login obligatorio
    // if (!user) {
    //   alert("¡Hola Pana! Por favor, crea tu perfil para finalizar tu pedido.");
    //   navigate('/auth');
    //   setIsCartOpen(false);
    //   return;
    // }
   
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  };

  const navTo = (path: string) => {
    navigate(path);
    closeMenus();
  };

  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + window.location.hash;
    navigator.clipboard.writeText(url).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/5 py-5 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO + BRAND (FIXED) */}
          <div
            onClick={() => { onNavHome(); closeMenus(); }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-ven-yellow blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={LOGO_ENCASA_IMAGE}
                alt="EnCasa Venezuela"
                className="h-10 w-auto max-w-160px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-venezuela-brown uppercase">
              EnCasa <span className="text-ven-yellow">Venezuela</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <button onClick={onNavHome} className="text-[11px] font-black uppercase tracking-[0.2em] text-venezuela-brown hover:text-ven-yellow transition-colors border-b-2 border-transparent hover:border-ven-yellow pb-1">Inicio</button>
            <button onClick={() => navigate('/partners')} className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-venezuela-brown transition-colors border-b-2 border-transparent hover:border-venezuela-brown pb-1">Locales</button>
            <button 
              onClick={() => {
                if (window.location.hash === '#/') {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-venezuela-brown transition-colors border-b-2 border-transparent hover:border-venezuela-brown pb-1"
            >
              Cómo Comprar
            </button>
            <div className="h-6 w-px bg-black/10 mx-2"></div>
            <button onClick={() => navTo('/gifts')} className="text-[11px] font-black uppercase tracking-[0.2em] text-venezuela-brown hover:text-ven-red flex items-center gap-2 group">
              <Gift size={16} className="text-ven-red group-hover:scale-110 transition-transform" /> Gift Boxes
            </button>
            <button onClick={() => navTo('/subscriptions')} className="text-[11px] font-black uppercase tracking-[0.2em] text-venezuela-brown hover:text-ven-blue flex items-center gap-2 group">
              <CalendarCheck size={16} className="text-ven-blue group-hover:scale-110 transition-transform" /> Planes
            </button>

            <div className="relative">
              <button 
                onClick={handleShare}
                className="p-3 bg-venezuela-dark border-2 border-black/5 rounded-2xl text-venezuela-brown hover:border-ven-yellow transition-all flex items-center gap-2 group"
                title="Compartir link"
              >
                {showShareTooltip ? <Check size={18} className="text-green-500" /> : <Share2 size={18} className="group-hover:scale-110 transition-transform" />}
                <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">Compartir</span>
              </button>
              {showShareTooltip && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-venezuela-brown text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl animate-in fade-in zoom-in-95 duration-200 whitespace-nowrap z-[60]">
                  ¡Link copiado, pana!
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-4 rounded-2xl transition-all duration-700 border-2 ${bump ? 'scale-110 bg-gradient-to-br from-ven-yellow via-venezuela-orange to-ven-red text-white border-white/40 shadow-2xl' : 'bg-venezuela-dark border-black/5 text-venezuela-brown hover:bg-black/5'}`}
            >
              <ShoppingCart size={22} className={bump ? 'animate-bounce' : ''} />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-2xl border-2 border-white transition-colors ${bump ? 'bg-ven-red' : 'bg-ven-yellow'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => user ? onLogout() : navigate('/auth')} 
                className="flex items-center gap-3 bg-venezuela-dark px-5 py-3 rounded-2xl border-2 border-black/5 hover:border-ven-yellow transition-all shadow-sm group"
              >
                <UserCircle size={22} className={user ? "text-ven-yellow" : "text-gray-600 group-hover:text-ven-yellow transition-colors"} />
                <span className="text-[11px] font-black uppercase tracking-[0.1em] text-venezuela-brown">
                  {user ? 'Cerrar Sesión' : 'Ingresar'}
                </span>
              </button>
              {user && (
                <div className="hidden xl:block">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Hola,</p>
                  <p className="text-[12px] font-black text-venezuela-brown uppercase tracking-tight">{user.first_name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-3 rounded-xl transition-all duration-700 border-2 ${bump ? 'scale-125 bg-gradient-to-br from-[#FFCC00] via-[#F58220] to-[#E86D00] text-white border-yellow-200 shadow-[0_0_35px_rgba(255,204,0,0.7)]' : 'bg-black/5 border-black/10 text-venezuela-brown'}`}
            >
              <ShoppingCart size={20} className={bump ? 'animate-bounce' : ''} />
              {cartCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black transition-colors ${bump ? 'bg-ven-red text-white' : 'bg-ven-yellow text-venezuela-dark'}`}>
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-black/5 border border-black/10 rounded-xl text-venezuela-brown">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button 
              onClick={handleShare}
              className="p-3 bg-ven-yellow/10 border border-ven-yellow/20 rounded-xl text-ven-yellow active:scale-90 transition-all"
            >
              {showShareTooltip ? <Check size={20} /> : <Share2 size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-venezuela-dark/98 backdrop-blur-3xl flex flex-col pt-24 px-8 animate-in fade-in duration-300 lg:hidden overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 drop-shadow-sm">Menú Principal</p>
            <button onClick={() => navTo('/')} className="w-full text-left py-5 border-b border-black/10 flex items-center justify-between group active:scale-[0.98] transition-all">
              <span className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Inicio</span>
              <span className="text-2xl">🏠</span>
            </button>
            <button onClick={() => navTo('/catalog')} className="w-full text-left py-5 border-b border-black/10 flex items-center justify-between group active:scale-[0.98] transition-all">
              <span className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Locales</span>
              <span className="text-2xl">📦</span>
            </button>
            <button 
              onClick={() => {
                closeMenus();
                if (window.location.hash === '#/') {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }} 
              className="w-full text-left py-5 border-b border-black/10 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <span className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Cómo Comprar</span>
              <span className="text-2xl">❓</span>
            </button>
            <div className="pt-10 space-y-6">
              <p className="text-[13px] font-black text-[#F58220] uppercase tracking-[0.3em] flex items-center gap-3 drop-shadow-md">
                <Zap size={18} fill="currentColor" /> Experiencia Premium
              </p>
              <div className="grid grid-cols-2 gap-5">
                <button onClick={() => navTo('/subscriptions')} className="bg-white border-2 border-black/5 p-6 rounded-[32px] text-left active:scale-95 transition-all shadow-xl">
                  <CalendarCheck className="text-blue-600 mb-3" size={32} />
                  <p className="text-lg font-black uppercase tracking-tighter text-venezuela-brown drop-shadow-sm">Planes</p>
                  <p className="text-[11px] text-gray-600 font-bold uppercase mt-1 tracking-tight">Suscripción</p>
                </button>
                <button onClick={() => navTo('/gifts')} className="bg-white border-2 border-black/5 p-6 rounded-[32px] text-left active:scale-95 transition-all shadow-xl">
                  <Gift className="text-red-500 mb-3" size={32} />
                  <p className="text-lg font-black uppercase tracking-tighter text-venezuela-brown drop-shadow-sm">Gift Boxes</p>
                  <p className="text-[11px] text-gray-600 font-bold uppercase mt-1 tracking-tight">Regalos</p>
                </button>
                <button onClick={() => navTo('/repeat')} className="bg-white border-2 border-black/5 p-6 rounded-[32px] text-left active:scale-95 transition-all shadow-xl">
                  <Repeat className="text-[#F58220] mb-3" size={32} />
                  <p className="text-lg font-black uppercase tracking-tighter text-venezuela-brown drop-shadow-sm">Historial</p>
                  <p className="text-[11px] text-gray-600 font-bold uppercase mt-1 tracking-tight">Repetir</p>
                </button>
                {showRadar && (
                  <button onClick={() => navTo('/radar')} className="bg-white border-2 border-black/5 p-6 rounded-[32px] text-left active:scale-95 transition-all shadow-xl">
                    <BarChart3 className="text-green-600 mb-3" size={32} />
                    <p className="text-lg font-black uppercase tracking-tighter text-venezuela-brown drop-shadow-sm">Radar</p>
                    <p className="text-[11px] text-gray-600 font-bold uppercase mt-1 tracking-tight">Dashboard</p>
                  </button>
                )}
              </div>
            </div>
            <div className="py-12 space-y-4">
              <button onClick={() => navTo('/auth')} className="w-full flex items-center justify-between bg-[#F58220]/10 border-2 border-[#F58220]/20 p-6 rounded-[36px] shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F58220] flex items-center justify-center text-white shadow-lg">
                    <UserCircle size={32} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black uppercase tracking-tighter text-venezuela-brown leading-tight">{user ? user.name : 'Mi Perfil'}</p>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1 opacity-80">{user ? `Rol: ${user.role}` : 'Ingresa para sumar'}</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-[#F58220]" />
              </button>

              {user && (
                <button 
                  onClick={() => { onLogout(); closeMenus(); }}
                  className="w-full py-5 rounded-[28px] border border-red-500/30 text-red-500 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500/10 transition-all"
                >
                  Cerrar Sesión Real
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CARRITO SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-venezuela-dark border-l border-black/5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            {/* Header Rediseñado */}
            <div className="p-8 border-b border-black/5 flex items-center gap-4 bg-black/5">
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-3 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-venezuela-brown active:scale-90 flex items-center justify-center"
                title="Volver"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex-grow">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-venezuela-brown">Mi Pedido <span className="text-ven-yellow">EnCasa</span></h2>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-1">Revisá tu antojo, pana</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-3 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-venezuela-brown active:scale-90"><X size={20} /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-thin">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
                  <ShoppingCart size={100} className="mb-6 text-venezuela-brown" />
                  <p className="font-black text-xl text-venezuela-brown uppercase tracking-widest">Carrito Vacío</p>
                </div>
              ) : (
                <>
                  {/* Lista de Productos */}
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="bg-white p-4 rounded-[32px] border border-black/5 flex gap-4 items-center group">
                        <div className="w-20 h-20 rounded-[24px] overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                          <img src={item.product.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[13px] font-black text-venezuela-brown leading-tight mb-3 truncate">{item.product.name}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-black/5 p-1.5 rounded-xl border border-black/5">
                              <button onClick={() => onUpdateQty(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-ven-yellow hover:text-ven-blue rounded-lg text-venezuela-brown transition-all"><Minus size={12} /></button>
                              <span className="text-xs font-black text-venezuela-brown w-5 text-center">{item.qty}</span>
                              <button onClick={() => onUpdateQty(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-ven-yellow hover:text-ven-blue rounded-lg text-venezuela-brown transition-all"><Plus size={12} /></button>
                            </div>
                            <div className="flex items-center gap-3">
                               <span className="text-sm font-black text-ven-yellow">${item.product.price * item.qty}</span>
                               <button onClick={() => onRemoveItem(item.product.id)} className="p-2 text-gray-400 hover:text-ven-red transition-all"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sección Medio de Pago */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] border-b border-black/5 pb-2 ml-2">Seleccioná tu pago</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'Efectivo', icon: <Banknote size={24} />, desc: 'Contra entrega' },
                        { id: 'Transferencia', icon: <Wallet size={24} />, desc: 'Vía CBU/Alias' }
                      ].map(method => (
                        <button 
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as 'Efectivo' | 'Transferencia')}
                          className={`flex flex-col items-center gap-2.5 p-5 rounded-[32px] border-2 transition-all relative overflow-hidden active:scale-95 ${paymentMethod === method.id ? 'bg-ven-yellow/10 border-ven-yellow text-venezuela-brown shadow-[0_0_20px_rgba(255,204,0,0.1)]' : 'bg-black/5 border-transparent text-gray-400 opacity-60'}`}
                        >
                          <div className={paymentMethod === method.id ? 'text-ven-yellow' : ''}>{method.icon}</div>
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">{method.id}</p>
                            <p className="text-[8px] font-medium opacity-50 uppercase tracking-widest">{method.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nota */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                      <MessageSquareQuote size={14} /> Nota para el local
                    </p>
                    <textarea 
                      placeholder="Ej: El timbre no anda, llamame..."
                      className="w-full bg-white border border-black/10 rounded-[28px] p-5 text-sm text-venezuela-brown focus:outline-none focus:border-ven-yellow h-24 transition-all placeholder:text-gray-400 resize-none"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            {/* Footer de Checkout */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-black/5 bg-black/5 backdrop-blur-xl relative">
                <div className="flex justify-between items-end mb-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                       <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Total a Pagar</p>
                    </div>
                    <p className="text-3xl font-black text-venezuela-brown tracking-tighter leading-none">${cartTotal}</p>
                  </div>
                  <div className="text-right">
                    {/* Loyalty points hidden as per request */}
                  </div>
                </div>

                <p className="text-[10px] text-gray-600 font-medium italic mb-4 text-center">
                  La disponibilidad se confirma al momento del pedido con el local.
                </p>

                <button 
                  onClick={finalizeOrder}
                  className="w-full bg-gradient-to-r from-[#FFCC00] to-[#F58220] hover:scale-[1.01] py-4.5 rounded-[28px] font-black text-sm tracking-[0.05em] shadow-[0_10px_30px_rgba(255,204,0,0.25)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-white relative overflow-hidden group"
                >
                  <span className="uppercase z-10">Finalizar Pedido</span>
                  <ExternalLink size={18} className="z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                
                <p className="text-center mt-4 text-[8px] text-gray-600 font-black uppercase tracking-[0.3em] opacity-40">Seguro vía WhatsApp 🇻🇪</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default Navbar;
