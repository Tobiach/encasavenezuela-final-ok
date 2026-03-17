import React, { useState, useEffect } from 'react';
import { Lock, Mail, ChevronRight, ShieldCheck, Gift, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  onLoginSuccess: (userData: User) => void;
  user: User | null;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '' 
  });

  useEffect(() => {
    if (user && user.is_logged_in) {
      const state = location.state as { from?: { pathname: string } } | null;
      const origin = state?.from?.pathname || '/';
      navigate(origin, { replace: true });
    }
  }, [user, navigate, location.state]);

  // PERSISTENCIA DE EMAIL: Recuperar al montar
  useEffect(() => {
    const savedEmail = localStorage.getItem('encasa_last_email');
    if (savedEmail && isLogin) {
      console.log('📧 Email recuperado de localStorage:', savedEmail);
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, [isLogin]);

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  console.log('🚀 Iniciando proceso de auth:', isLogin ? 'LOGIN' : 'SIGNUP');
  
  const cleanEmail = formData.email.trim().toLowerCase();
  
  try {
    if (isLogin) {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password,
      });
      
      if (error) {
        console.error('❌ Error en login:', error.message);
        throw new Error('Email o contraseña incorrectos');
      }
      
      if (data.user) {
        console.log('✅ Login exitoso para:', data.user.email);
        const userData: User = {
          id: data.user.id,
          first_name: data.user.user_metadata?.first_name || 'Usuario',
          last_name: data.user.user_metadata?.last_name || 'EnCasa',
          name: data.user.user_metadata?.first_name 
            ? `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name}`
            : 'Cliente EnCasa',
          email: data.user.email || '',
          role: 'Cliente',
          is_logged_in: true
        };
        onLoginSuccess(userData);
      }
    } else {
      // REGISTRO
      console.log('📝 Intentando registro para:', cleanEmail);
      if (formData.password.length < 7) {
        throw new Error('La contraseña debe tener al menos 7 caracteres');
      }
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim()
          }
        }
      });
      
      if (error) {
        console.error('❌ Error en registro:', error.message);
        throw error;
      }
      
      if (data.user && data.session) {
        console.log('✅ Registro y login automático exitoso');
        const userData: User = {
          id: data.user.id,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          name: `${formData.first_name} ${formData.last_name}`,
          email: data.user.email || '',
          role: 'Cliente',
          is_logged_in: true
        };
        onLoginSuccess(userData);
      } else {
        console.log('📩 Registro exitoso, esperando confirmación de email');
        alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión. (Revisa tu email si es necesario confirmar)');
        setIsLogin(true);
      }
    }
  } catch (error: unknown) {
    console.error('❌ Auth Error:', error);
    const err = error as Error;
    let message = err.message || 'Error al procesar';
    
    if (message.includes('Invalid API key')) {
      message = '❌ Error de Configuración: La clave de Supabase es inválida. Por favor verifica las variables de entorno en AI Studio.';
    } else if (message.includes('Failed to fetch')) {
      message = '❌ Error de Conexión: No se pudo contactar con Supabase. Revisa tu internet o la URL de Supabase.';
    }
    
    alert(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-venezuela-dark px-6 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F58220] to-[#E86D00] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/20">
            <span className="text-3xl">🇻🇪</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase text-venezuela-brown">
            {isLogin ? 'Iniciar sesión' : 'Crear mi cuenta'}
          </h1>
          <p className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px] italic">EnCasa Venezuela • El Sabor que nos Une</p>
        </div>

        <div className="bg-black/5 border border-black/10 rounded-[48px] p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          
          {!isLogin && (
            <div className="mb-8 flex justify-center">
              <div className="bg-venezuela-orange/10 border border-venezuela-orange/30 px-4 py-2 rounded-2xl flex items-center gap-2 animate-pulse">
                <Gift size={14} className="text-venezuela-orange" />
                <span className="text-[10px] font-black text-venezuela-brown uppercase tracking-widest">
                  🎁 Beneficio exclusivo nuevo cliente
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Nombre</label>
                  <input 
                    type="text"
                    required
                    placeholder="Miguel"
                    className="w-full bg-white border border-black/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-venezuela-orange transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Apellido</label>
                  <input 
                    type="text"
                    required
                    placeholder="Pérez"
                    className="w-full bg-white border border-black/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-venezuela-orange transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email"
                  required
                  placeholder="pana@ejemplo.com"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-venezuela-orange transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-14 pr-14 focus:outline-none focus:border-venezuela-orange transition-all text-sm text-venezuela-brown placeholder:text-gray-400"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-venezuela-brown transition-colors"
                >
                  {showPassword ? <span className="text-[10px] font-bold">OCULTAR</span> : <span className="text-[10px] font-bold">VER</span>}
                </button>
              </div>
              {!isLogin && (
                <p className="text-[10px] font-bold text-venezuela-orange/80 ml-1 animate-pulse">
                  ⚠️ La contraseña debe tener mínimo 7 caracteres
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F58220] to-[#E86D00] text-white py-6 rounded-[32px] font-black text-sm tracking-widest transition-all shadow-xl shadow-orange-500/30 active:scale-[0.98] flex items-center justify-center gap-3 uppercase group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Ingresar como Cliente' : 'Crear mi perfil de Cliente'}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>


          <div className="mt-10 pt-8 border-t border-black/5 text-center space-y-4">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-white border-2 border-ven-yellow/20 py-5 rounded-[28px] text-[11px] font-black text-venezuela-brown uppercase tracking-widest transition-all active:scale-95 hover:border-ven-yellow shadow-sm"
              >
                Continuar como invitado
              </button>
              
              {isLogin ? (
                <div className="animate-in fade-in duration-500">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">¿Todavía no sos cliente?</p>
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="w-full bg-black/5 hover:bg-black/10 border border-black/10 py-5 rounded-[28px] text-[10px] font-black text-venezuela-brown uppercase tracking-widest transition-all active:scale-95"
                  >
                    Crear cuenta y obtené <span className="text-ven-yellow">10% OFF</span> en tus primeras 2 compras
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-[11px] font-black text-gray-500 hover:text-venezuela-brown transition-colors uppercase tracking-widest"
                >
                  ¿Ya tenés cuenta? Ingresa aquí
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4 text-gray-600">
          <ShieldCheck size={18} />
          <p className="text-[9px] font-black uppercase tracking-widest leading-tight">Acceso seguro y encriptado • Comunidad EnCasa 🇻🇪</p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;