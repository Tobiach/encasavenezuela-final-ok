import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Promotions from '../components/Promotions';
import PromotionDetailView from '../components/PromotionDetailView';
import CategoryCarousel from '../components/CategoryCarousel';
import Testimonials from '../components/Testimonials';
import PartnerStores from '../components/PartnerStores';
import Footer from '../components/Footer';
import CatalogView from '../components/CatalogView';
import { allProducts } from '../data/catalogData';
import LoyaltyView from '../components/LoyaltyView';
import HowItWorks from '../components/HowItWorks';
import Faq from '../components/Faq';
import StoreMapView from '../components/StoreMapView';
import PurchaseNotification from '../components/PurchaseNotification';
import ContextRecommendations from '../components/ContextRecommendations';
import RepeatOrderPanel from '../components/RepeatOrderPanel';
import SubscriptionsView from '../components/SubscriptionsView';
import GiftsView from '../components/GiftsView';
import RadarDashboardView from '../components/RadarDashboardView';
import Offers from '../components/Offers';
import AuthView from '../components/AuthView';
import WhatsAppButton from '../components/WhatsAppButton';
import AIAssistantButton from '../components/AIAssistantButton';
import ProductAIChat from '../components/ProductAIChat'; // El componente de chat
import OrderConfirmationView from '../components/OrderConfirmationView';
import { PartnerStore, Product, PurchaseHistoryItem, User, UserRole } from '../types';
import { 
  LOCALES_VENEZOLANOS 
} from '../data/localesAmigos';
import { supabase } from '../lib/supabase';

// FEATURE FLAGS ESTRATÉGICAS
const FEATURE_LOYALTY = false;
const FEATURE_RADAR = false;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: User | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
  const location = useLocation();
  if (!user || !user.is_logged_in) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const CartStoreBadge: React.FC<{ 
  cart: { product: Product; qty: number }[]; 
  onSelectStore: (store: PartnerStore | null) => void;
}> = ({ cart, onSelectStore }) => {
  const location = useLocation();
  if (cart.length === 0) return null;

  const storeId = cart[0].product.storeId;
  const store = LOCALES_VENEZOLANOS.find(s => s.id === storeId);
  const storeName = store ? store.name : (storeId ? "local no encontrado" : "sin local");

  // Solo mostramos el mensaje completo en secciones de compra directa
  const isShoppingSection = ['/catalog', '/partners', '/checkout'].includes(location.pathname);

  return (
    <div className="sticky top-[72px] z-[40] bg-venezuela-dark/95 backdrop-blur-md border-b border-black/5 py-2.5 px-4 flex items-center justify-center gap-4 animate-in slide-in-from-top duration-500 shadow-lg">
      {isShoppingSection && (
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 bg-ven-yellow rounded-full animate-pulse shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
            Estás comprando en: <span className="text-venezuela-brown">{storeName}</span>
          </p>
        </div>
      )}
      <button 
        onClick={() => onSelectStore(null)}
        className={`px-3 py-1.5 rounded-full border border-ven-yellow/30 text-[8px] font-black uppercase tracking-widest text-ven-yellow hover:bg-ven-yellow hover:text-venezuela-dark transition-all active:scale-95 shadow-sm ${!isShoppingSection ? 'mx-auto' : ''}`}
      >
        Cambiar local
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string) => {
    console.log('🔍 Buscando perfil en DB para:', userId);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); 

      if (error) {
        console.warn('⚠️ Error al consultar perfil:', error.message);
      }

      const userData: User = {
        id: userId,
        first_name: profile?.first_name || 'Usuario',
        last_name: profile?.last_name || 'EnCasa',
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Cliente EnCasa',
        email: email,
        role: (profile?.role as UserRole) || 'Cliente',
        is_logged_in: true
      };

      console.log('👤 Perfil cargado:', userData.name);
      setUser(userData);
    } catch (err) {
      console.error('❌ Error fatal en fetchProfile:', err);
      // Fallback
      setUser({
        id: userId,
        first_name: 'Usuario',
        last_name: 'EnCasa',
        name: 'Cliente EnCasa',
        email: email,
        role: 'Cliente' as UserRole,
        is_logged_in: true
      });
    }
  };

  const syncAuthProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!profile) {
        console.log('👻 Creando perfil faltante...');
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        await supabase.from('profiles').upsert({
          id: userId,
          first_name: authUser?.user_metadata?.first_name || 'Usuario',
          last_name: authUser?.user_metadata?.last_name || 'EnCasa',
          role: 'Cliente',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      }
    } catch (err) {
      console.error('❌ Error en syncAuthProfile:', err);
    }
  };

  useEffect(() => {
  console.log('🔐 Iniciando auth listener');
  
  let mounted = true;
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!mounted) return;
      
      console.log('🔔 AUTH_EVENT:', event);
      
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || '');
          await syncAuthProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    }
  );
  
  // Timeout de seguridad
  setTimeout(() => {
    if (mounted) {
      console.log('⏱️ Timeout - finalizando carga');
      setLoading(false);
    }
  }, 3000);
  
  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  const handleLogout = async () => {
    console.log('🚪 Logout iniciado');
    
    try {
      setLoading(true);
      
      // 1. Cerrar en Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // 2. Limpiar TODO
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Limpiar estado
      setUser(null);
      
      // 4. Redirigir
      navigate('/auth');
      
      console.log('✅ Logout completo');
      
      // 5. Esperar un momento antes de redirigir
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 6. Redirigir sin reload (deja que React Router maneje)
      window.location.hash = '#/auth';
      
    } catch (err) {
      console.error('❌ Error crítico en handleLogout:', err);
      // Fallback: limpiar todo y forzar reload
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('encasa_points');
    return saved ? parseInt(saved, 10) : 10;
  });
  
  const [cart, setCart] = useState<{product: Product, qty: number}[]>(() => {
    const saved = localStorage.getItem('encasa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastEarned, setLastEarned] = useState<number>(0);
  const [showRealNotification, setShowRealNotification] = useState(false);
  const [selectedStore, setSelectedStore] = useState<PartnerStore | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [storeChangeConfirm, setStoreChangeConfirm] = useState<{ 
    newStore: PartnerStore, 
    currentStoreName: string,
    onConfirm: () => void 
  } | null>(null);

  // ✅ Migración de carrito viejo (sin storeId)
  useEffect(() => {
    if (cart.length > 0) {
      const hasMissingStoreId = cart.some(i => !i.product.storeId);
      if (hasMissingStoreId) {
        if (selectedStore) {
          // Asignar automáticamente al seleccionado si existe
          setCart(prev => prev.map(i => ({
            ...i,
            product: { ...i.product, storeId: i.product.storeId || selectedStore.id }
          })));
        }
      }
    }
  }, [selectedStore, cart]);
  
  // ✅ Tracking simple local (queda en localStorage)
const encasaTrack = (event: string, data: Record<string, unknown> = {}) => {
  try {
    const key = "encasa_events";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push({
      event,
      data,
      ts: Date.now(),
      path: window.location.hash || window.location.pathname,
    });
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (e) {
    console.warn("encasaTrack error:", e);
  }
};

// ✅ Exponer tracking global para que cualquier componente lo pueda usar
(window as unknown as { encasaTrack: typeof encasaTrack }).encasaTrack = encasaTrack;

  useEffect(() => {
    localStorage.setItem('encasa_points', userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('encasa_cart', JSON.stringify(cart));
  }, [cart]);

const handlePurchase = (total: number) => {
  try {
    encasaTrack("checkout_whatsapp_sent", {
      cartTotal: total,
      itemsCount: cart.reduce((sum, i) => sum + i.qty, 0),
      source: "checkout",
      ts: Date.now(),
    });
  } catch (err) {
    // Ignorar errores de tracking
  }

  if (!user) {
    // Para invitados, solo registramos la compra localmente si queremos
    // Pero los puntos solo son para usuarios logueados
  }

  const earned = Math.floor(total / 10000);

  const history: PurchaseHistoryItem[] = JSON.parse(
    localStorage.getItem("encasa_history") || "[]"
  );

  const newPurchase: PurchaseHistoryItem = {
    id: Date.now(),
    date: new Date().toISOString(),
    total,
    items: cart.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      qty: i.qty,
      price: i.product.price,
    })),
  };

  localStorage.setItem(
    "encasa_history",
    JSON.stringify([newPurchase, ...history])
  );

  if (user) {
    setUserPoints((p) => {
      const next = p + earned;
      localStorage.setItem("encasa_points", next.toString());
      return next;
    });
    setLastEarned(earned);
    setShowRealNotification(true);
    setTimeout(() => setShowRealNotification(false), 3500);
  }

  setCart([]);
  return earned;
};

  const handleAddToCart = (product: Product, storeId?: string) => {
    // ELIMINADO: Redirección obligatoria a Auth. Ahora es opcional.
    
    const finalStoreId = storeId || selectedStore?.id;

    if (!finalStoreId) {
      alert("Pana, por favor elegí un local antes de agregar productos al carrito.");
      navigate('/partners');
      return;
    }

    const performAdd = (sId: string, p: Product) => {
      setCart(prev => {
        const exists = prev.find(i => i.product.id === p.id && i.product.storeId === sId);
        if (exists) return prev.map(i => (i.product.id === p.id && i.product.storeId === sId) ? {...i, qty: i.qty + 1} : i);
        
        const productWithStore = { ...p, storeId: sId };
        return [...prev, {product: productWithStore, qty: 1}];
      });
    };

    const currentStoreId = cart.length > 0 ? cart[0].product.storeId : null;
    
    if (currentStoreId && currentStoreId !== finalStoreId) {
      const newStore = LOCALES_VENEZOLANOS.find(s => s.id === finalStoreId);
      const currentStore = LOCALES_VENEZOLANOS.find(s => s.id === currentStoreId);
      
      setStoreChangeConfirm({
        newStore: newStore || ({ name: 'este local' } as unknown as PartnerStore),
        currentStoreName: currentStore?.name || 'otro local',
        onConfirm: () => {
          setCart([]);
          performAdd(finalStoreId, product);
          setStoreChangeConfirm(null);
        }
      });
      return;
    }

    performAdd(finalStoreId, product);
  };

  const handleSelectStore = (store: PartnerStore | null) => {
    if (!store) {
      setSelectedStore(null);
      return;
    }

    const currentStoreId = cart.length > 0 ? cart[0].product.storeId : null;
    if (currentStoreId && currentStoreId !== store.id) {
      const currentStore = LOCALES_VENEZOLANOS.find(s => s.id === currentStoreId);
      setStoreChangeConfirm({
        newStore: store,
        currentStoreName: currentStore?.name || 'otro local',
        onConfirm: () => {
          setCart([]);
          setSelectedStore(store);
          setStoreChangeConfirm(null);
        }
      });
    } else {
      setSelectedStore(store);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    const origin = location.state?.from?.pathname || '/';
    navigate(origin, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-venezuela-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ven-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-venezuela-dark selection:bg-ven-yellow/30">
      <ScrollToTop />
      <Navbar 
        onNavHome={() => navigate('/')} 
        onNavLoyalty={() => navigate('/loyalty')}
        points={userPoints}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onFinalizePurchase={handlePurchase}
        onClearCart={() => setCart([])}
        showLoyalty={FEATURE_LOYALTY}
        showRadar={FEATURE_RADAR}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        user={user}
        onLogout={handleLogout}
      />

      <CartStoreBadge cart={cart} onSelectStore={handleSelectStore} />
      
      <PurchaseNotification realEarned={showRealNotification ? lastEarned : undefined} />
      
      <Routes>
        <Route path="/auth" element={<AuthView onLoginSuccess={handleLoginSuccess} user={user} />} />
        
        <Route path="/" element={
          <main className="animate-in fade-in duration-700">
            <Hero onCatalogClick={() => navigate('/catalog')} onLearnMoreClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})} />
            <div id="categories"><CategoryCarousel /></div>
            <Offers />
            <ContextRecommendations onAddToCart={handleAddToCart} />
            <div id="partner-stores">
              <PartnerStores 
                onViewAll={() => navigate('/partners')} 
                onOpenMap={handleSelectStore} 
                limit={2} 
              />
            </div>
            <Features />
            <Promotions onAddToCart={handleAddToCart} />
            <div id="how-it-works"><HowItWorks /></div>
            <Testimonials />
            <Faq />
          </main>
        } />
        
        <Route path="/catalog" element={
          <CatalogView 
            onAddToCart={handleAddToCart} 
            selectedStore={selectedStore}
            onSelectStore={handleSelectStore}
          />
        } />
        
        <Route path="/loyalty" element={FEATURE_LOYALTY ? <ProtectedRoute user={user}><LoyaltyView points={userPoints} onRedeem={(pts) => { if(userPoints >= pts) { setUserPoints(p => p - pts); return true; } return false; }} /></ProtectedRoute> : <Navigate to="/" />} />
        <Route path="/repeat" element={<ProtectedRoute user={user}><RepeatOrderPanel onAddToCart={handleAddToCart} /></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute user={user}><SubscriptionsView /></ProtectedRoute>} />
        <Route path="/gifts" element={<GiftsView onAddToCart={handleAddToCart} />} />
        
        {/* MODIFICADO: Checkout accesible sin login */}
        <Route path="/checkout" element={<OrderConfirmationView cart={cart} user={user} onFinalizePurchase={handlePurchase} onClearCart={() => setCart([])} />} />
        
        <Route path="/radar" element={FEATURE_RADAR ? <ProtectedRoute user={user}><RadarDashboardView user={user!} /></ProtectedRoute> : <Navigate to="/" />} />
        <Route path="/promotion/:id" element={<PromotionDetailView userPoints={userPoints} onAddToCart={handleAddToCart} onSelectStore={handleSelectStore} showLoyalty={FEATURE_LOYALTY} />} />
        <Route path="/partners" element={<PartnerStores onOpenMap={(s) => {handleSelectStore(s); navigate('/catalog');}} isFullView={true} />} />
        <Route path="/map" element={selectedStore ? <StoreMapView store={selectedStore} /> : null} />
      </Routes>
      
      <Footer />

      {/* Modal de Confirmación de Cambio de Local */}
      {storeChangeConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-venezuela-dark border border-black/10 rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-ven-yellow/20 rounded-2xl flex items-center justify-center text-ven-yellow mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-black text-venezuela-brown text-center uppercase tracking-tighter mb-4">
              ¿Cambiar de Local?
            </h3>
            <p className="text-sm text-gray-600 text-center leading-relaxed mb-8">
              Tu carrito tiene productos de <span className="text-venezuela-brown font-bold">{storeChangeConfirm.currentStoreName}</span>. 
              Para comprar en <span className="text-ven-yellow font-bold">{storeChangeConfirm.newStore.name}</span>, primero debemos vaciar tu carrito actual.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={storeChangeConfirm.onConfirm}
                className="w-full bg-gradient-to-r from-[#FFCC00] to-[#F58220] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Vaciar y cambiar
              </button>
              <button 
                onClick={() => setStoreChangeConfirm(null)}
                className="w-full bg-black/5 text-gray-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/10 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lógica de Chat Global */}
      {isAIChatOpen && (
        <ProductAIChat 
          allProducts={allProducts} 
          cart={cart}
          onClose={() => setIsAIChatOpen(false)} 
          onAddToCart={handleAddToCart}
          storeId={selectedStore?.id}
          onOpenMap={(s) => { 
            setSelectedStore(s); 
            navigate('/catalog'); 
            setIsAIChatOpen(false); 
          }}
        />
      )}

      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4 items-end">
        {!isCartOpen && !['/checkout', '/repeat'].includes(location.pathname) && (
          <WhatsAppButton cart={cart} user={user} />
        )}
        <AIAssistantButton onClick={() => setIsAIChatOpen(true)} />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
