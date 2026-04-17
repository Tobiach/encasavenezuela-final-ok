import React, { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QRWelcomeModalProps {
  storeId: string;
  onDone: () => void;  // cierra y navega al catálogo
}

const QRWelcomeModal: React.FC<QRWelcomeModalProps> = ({ storeId, onDone }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fecha_cumpleanos: '',
  });

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (form.nombre.trim().length < 2 || form.apellido.trim().length < 2) {
      setError('Ingresá nombre y apellido completos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('El email no tiene un formato válido.');
      return;
    }
    if (!form.fecha_cumpleanos) {
      setError('Ingresá tu fecha de cumpleaños para recibir tu regalo.');
      return;
    }

    setLoading(true);
    try {
      await supabase.from('leads').upsert({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim().toLowerCase(),
        fecha_cumpleanos: form.fecha_cumpleanos,
        store_ref: storeId,
        ref: 'qr',
        acepta_marketing: true,
      }, { onConflict: 'email' });
    } catch {
      // Error no crítico — dejamos pasar igual
      setError('Hubo un error, intentá de nuevo.');
    } finally {
      setLoading(false);
    }

    localStorage.setItem('encasa_qr_registered', 'true');
    localStorage.setItem('encasa_lead_email', form.email.trim().toLowerCase());
    localStorage.setItem('encasa_lead_nombre', form.nombre.trim());
    onDone();
  };

  const handleSkip = () => {
    localStorage.setItem('encasa_qr_skipped', 'true');
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400">

        {/* Header */}
        <div className="bg-gradient-to-br from-venezuela-dark to-[#3a1010] px-8 pt-10 pb-8 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 60%, #FCD34D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FF6B35 0%, transparent 40%)',
            }}
          />
          <div className="relative">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-ven-yellow to-venezuela-orange rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 text-2xl">
                🇻🇪
              </div>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">
              ¡Bienvenido/a a<br />
              <span className="text-ven-yellow">EnCasa Venezuela!</span> 🇻🇪
            </h2>
            <p className="text-white/70 text-xs font-medium leading-relaxed">
              Registrate para acceder a ofertas exclusivas<br />
              y beneficios en tu cumpleaños 🎁
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5 block">
                Nombre <span className="text-venezuela-orange">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="María"
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-ven-yellow transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5 block">
                Apellido <span className="text-venezuela-orange">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="González"
                value={form.apellido}
                onChange={e => set('apellido', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-ven-yellow transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5 block">
              Email <span className="text-venezuela-orange">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="maria@ejemplo.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-ven-yellow transition-all"
            />
          </div>

          {/* Cumpleaños */}
          <div>
            <label className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest mb-1.5 block">
              🎂 Fecha de cumpleaños <span className="text-venezuela-orange">*</span>
            </label>
            <input
              type="date"
              required
              placeholder="Tu fecha de cumpleaños"
              value={form.fecha_cumpleanos}
              onChange={e => set('fecha_cumpleanos', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 px-4 text-sm text-gray-900 focus:outline-none focus:border-ven-yellow transition-all"
            />
            <p className="text-[9px] text-gray-400 font-medium mt-1.5 ml-1">
              Te enviamos un regalo especial el día de tu cumpleaños 🎁
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[11px] text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ven-yellow text-venezuela-dark py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-lg shadow-yellow-500/20 hover:bg-ven-yellow/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Acceder a ofertas
                <ChevronRight size={18} />
              </>
            )}
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors py-1"
          >
            Saltar por ahora →
          </button>
        </form>
      </div>
    </div>
  );
};

export default QRWelcomeModal;
