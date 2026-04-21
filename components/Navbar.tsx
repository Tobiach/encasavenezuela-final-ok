import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Trash2, Plus, Minus, ExternalLink, UserCircle, Zap, Gift, CalendarCheck, BarChart3, Repeat, Wallet, Banknote, ChevronRight, ArrowLeft, Share2, Check, AlertCircle, MapPin, Search } from 'lucide-react';
import { Product, User } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOGO_ENCASA_IMAGE } from '../src/assets/imagenes';
import { MINIMUM_ORDER } from '../lib/constants';

interface NavbarProps {
  onNavHome: () => void;
  onNavLoyalty: () => void;
  points: number;
  cart: { product: Product, qty: number }[];
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
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0);
  const cartTotal = subtotal;
  const remainingForMinimum = Math.max(0, MINIMUM_ORDER - cartTotal);
  const meetsMinimum = cartTotal >= MINIMUM_ORDER;

  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 1000);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const finalizeOrder = () => {
    if (!meetsMinimum) {
      return;
    }
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

  // Logo y botón Inicio: scroll al top si ya está en "/", navega si no
  const handleNavHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavHome();
    }
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
      <nav className={`fixed top-0 left-0 right-0 z-50 lg:bg-white/95 lg:backdrop-blur-xl bg-ven-yellow border-b border-black/5 lg:py-5 py-3 px-4 lg:px-6 transition-shadow duration-300 ${isScrolled ? 'shadow-xl shadow-black/10' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">

          {/* LOGO + BRAND — Desktop only */}
          <div
            onClick={handleNavHome}
            className="hidden lg:flex items-center gap-4 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-ven-yellow blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={LOGO_ENCASA_IMAGE}
                alt="EnCasa Venezuela"
                className="h-24 w-auto max-w-[300px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-venezuela-brown uppercase">
              EnCasa <span className="text-ven-yellow">Venezuela</span>
            </span>
          </div>

          {/* LOGO centrado — Mobile only */}
          <div
            onClick={handleNavHome}
            className="lg:hidden absolute left-1/2 -translate-x-1/2 cursor-pointer z-10 active:scale-95 transition-transform duration-150"
          >
            <img
              src={LOGO_ENCASA_IMAGE}
              alt="EnCasa Venezuela"
              className="h-18 w-auto object-contain"
            />
          </div>

          {/* CARRITO — Mobile only, izquierda */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`lg:hidden relative p-2.5 rounded-xl transition-all duration-700 border-2 ${bump ? 'scale-125 bg-[#8B1A1A] text-white border-[#8B1A1A] shadow-lg' : 'bg-[#8B1A1A] border-[#8B1A1A] text-white'}`}
          >
            <ShoppingCart size={20} className={bump ? 'animate-bounce' : ''} />
            {cartCount > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black transition-colors ${bump ? 'bg-ven-yellow text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'}`}>
                {cartCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-10">
            <button onClick={onNavHome} className="text-[11px] font-black uppercase tracking-[0.2em] text-venezuela-brown hover:text-ven-yellow transition-colors border-b-2 border-transparent hover:border-ven-yellow pb-1">Inicio</button>
            <button onClick={() => navigate('/partners')} className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-venezuela-brown transition-colors border-b-2 border-transparent hover:border-venezuela-brown pb-1">Locales</button>
            <button onClick={() => navigate('/locales-map')} className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-venezuela-brown transition-colors border-b-2 border-transparent hover:border-venezuela-brown pb-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-ven-yellow" /> Locales cercanos
            </button>
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
              className={`relative p-4 rounded-2xl transition-all duration-700 border-2 ${bump ? 'scale-110 bg-[#8B1A1A] text-white border-white/40 shadow-2xl' : 'bg-venezuela-dark border-black/5 text-venezuela-brown hover:bg-black/5'}`}
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

          {/* HAMBURGUESA — Mobile only, derecha */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 bg-[#8B1A1A] border border-[#8B1A1A] rounded-xl text-white transition-all active:scale-95"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA — Mobile only */}
        <div className="lg:hidden mt-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscá locales y productos"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate('/partners');
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ven-yellow/60 transition-all"
            />
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-venezuela-dark/98 backdrop-blur-3xl flex flex-col pt-24 px-8 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4 drop-shadow-sm">Menú Principal</p>
            <button onClick={handleNavHome} className="w-full text-left py-5 border-b border-black/10 flex items-center justify-between group active:scale-[0.98] transition-all">
              <span className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Inicio</span>
              <span className="text-2xl">🏠</span>
            </button>
            <button onClick={() => navTo('/partners')} className="w-full text-left py-5 border-b border-black/10 flex items-center justify-between group active:scale-[0.98] transition-all">
              <span className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Locales</span>
              <span className="text-2xl">🏪</span>
            </button>
            <button onClick={() => navTo('/locales-map')} className="w-full text-left py-5 border-b border-black/10 flex items-center justify-between group active:scale-[0.98] transition-all">
              <span className="text-3xl font-black uppercase tracking-tighter text-venezuela-brown">Mapa</span>
              <span className="text-2xl">🗺️</span>
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
              <p className="text-[13px] font-black text-ven-yellow uppercase tracking-[0.3em] flex items-center gap-3 drop-shadow-md">
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
                  <Repeat className="text-ven-yellow mb-3" size={32} />
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
              <button onClick={() => navTo('/auth')} className="w-full flex items-center justify-between bg-ven-yellow/10 border-2 border-ven-yellow/20 p-6 rounded-[36px] shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-ven-yellow flex items-center justify-center text-white shadow-lg">
                    <UserCircle size={32} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black uppercase tracking-tighter text-venezuela-brown leading-tight">{user ? user.name : 'Mi Perfil'}</p>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1 opacity-80">{user ? `Rol: ${user.role}` : 'Ingresa para sumar'}</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-ven-yellow" />
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
            {/* Header */}
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

            {/* Mensaje de Monto Mínimo */}
            {cart.length > 0 && !meetsMinimum && (
              <div className="mx-6 mt-6 p-4 bg-ven-yellow/10 border-2 border-ven-yellow/30 rounded-2xl flex items-start gap-3">
                <AlertCircle size={20} className="text-ven-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-ven-yellow uppercase tracking-tight">Monto mínimo: ${MINIMUM_ORDER}</p>
                  <p className="text-[10px] text-gray-600 font-medium mt-1">Te faltan <span className="font-black text-ven-yellow">${remainingForMinimum}</span> para completar tu pedido</p>
                </div>
              </div>
            )}

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
                    {!meetsMinimum && (
                      <p className="text-[10px] text-ven-yellow font-black uppercase tracking-tight mt-1">
                        Faltan ${remainingForMinimum}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-gray-600 font-medium italic mb-4 text-center">
                  La disponibilidad se confirma al momento del pedido con el local.
                </p>

                <button
                  onClick={finalizeOrder}
                  disabled={!meetsMinimum}
                  className={`w-full py-4.5 rounded-[28px] font-black text-sm tracking-[0.05em] flex items-center justify-center gap-3 transition-all text-white relative overflow-hidden group ${meetsMinimum
                      ? 'bg-gradient-to-r from-[#FFCC00] to-[#F58220] hover:scale-[1.01] shadow-[0_10px_30px_rgba(255,204,0,0.25)] active:scale-[0.98]'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                    }`}
                >
                  <span className="uppercase z-10">
                    {meetsMinimum ? 'Finalizar Pedido' : `Mínimo $${MINIMUM_ORDER}`}
                  </span>
                  {meetsMinimum && <ExternalLink size={18} className="z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  {meetsMinimum && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
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