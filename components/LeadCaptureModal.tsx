import React, { useState } from 'react';
import { X, Gift, Star, Bell, Cake, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeadCaptureModalProps {
  storeName: string;
  storeId: string;
  onClose: () => void;
}

const BARRIOS_CABA = [
  'Palermo', 'Villa Crespo', 'Belgrano', 'Colegiales', 'Caballito',
  'Almagro', 'Balvanera', 'Recoleta', 'Microcentro', 'San Telmo',
  'Constitución', 'Flores', 'Villa Urquiza', 'Núñez', 'Saavedra', 'Otro',
];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ storeName, storeId, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    zona: '',
    cumple_mes: '',
    cumple_dia: '',
    acepta_marketing: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    if (form.apellido.trim().length < 2) e.apellido = 'Mínimo 2 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Email inválido';
    if (form.telefono && !/^[\d\s\+\-\(\)]{7,20}$/.test(form.telefono)) e.telefono = 'Formato inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const fechaCumple = (form.cumple_mes && form.cumple_dia)
      ? `2000-${String(MONTHS.indexOf(form.cumple_mes) + 1).padStart(2, '0')}-${form.cumple_dia.padStart(2, '0')}`
      : null;

    try {
      const { error } = await supabase
        .from('leads')
        .upsert({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          email: form.email.trim().toLowerCase(),
          telefono: form.telefono.trim() || null,
          zona: form.zona || null,
          fecha_cumpleanos: fechaCumple,
          acepta_marketing: form.acepta_marketing,
          store_ref: storeId,
          ref: 'qr',
        }, { onConflict: 'email' });

      if (error) console.warn('Supabase leads error:', error.message);
    } catch (err) {
      console.warn('Error guardando lead:', err);
    }

    // Guardar en localStorage para no volver a pedir datos
    localStorage.setItem('encasa_lead_email', form.email.trim().toLowerCase());
    localStorage.setItem('encasa_lead_nombre', form.nombre.trim());

    setStep('success');
    setLoading(false);
  };

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-400">
          <div className="w-24 h-24 bg-gradient-to-br from-ven-yellow to-venezuela-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/30">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-venezuela-dark tracking-tight mb-3 uppercase">
            ¡Ya sos parte, {form.nombre}! 🇻🇪
          </h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Tu descuento del <span className="font-black text-venezuela-orange">10% OFF + delivery gratis</span> está aplicado en tu primer pedido de <span className="font-black">{storeName}</span>.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-ven-yellow to-venezuela-orange text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-lg shadow-yellow-500/30 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Ver el catálogo y pedir
            <ChevronRight size={18} className="inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-lg rounded-t-[40px] sm:rounded-[40px] max-h-[95dvh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-400">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-venezuela-dark to-[#3a1010] rounded-t-[40px] sm:rounded-t-[40px] px-8 pt-10 pb-8 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #FCD34D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FF6B35 0%, transparent 40%)' }} />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <X size={18} />
          </button>

          <div className="relative">
            <div className="text-4xl mb-3">🇻🇪</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">
              ¡Bienvenido/a a<br />
              <span className="text-ven-yellow">{storeName}</span>
            </h2>
            <p className="text-white/70 text-xs font-medium leading-relaxed">
              Registrate gratis y accedé a beneficios exclusivos<br />de la comunidad venezolana en Buenos Aires
            </p>
          </div>

          {/* Beneficios */}
          <div className="relative mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Gift, text: '10% OFF\npimer pedido' },
              { icon: Cake, text: 'Regalo\nen tu cumple' },
              { icon: Bell, text: 'Ofertas\nexclusivas' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5">
                <Icon size={20} className="text-ven-yellow" />
                <p className="text-[9px] font-black text-white uppercase tracking-wide text-center leading-tight whitespace-pre-line">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            {['nombre', 'apellido'].map(field => (
              <div key={field}>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                  {field === 'nombre' ? 'Nombre' : 'Apellido'} <span className="text-venezuela-orange">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={field === 'nombre' ? 'María' : 'González'}
                  value={form[field as 'nombre' | 'apellido']}
                  onChange={e => set(field, e.target.value)}
                  className={`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-sm text-venezuela-dark placeholder:text-gray-300 focus:outline-none focus:border-ven-yellow transition-all ${errors[field] ? 'border-red-400' : 'border-gray-100'}`}
                />
                {errors[field] && <p className="text-[9px] text-red-400 font-bold mt-1 ml-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          {/* Email */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
              Email <span className="text-venezuela-orange">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="maria@ejemplo.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className={`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-sm text-venezuela-dark placeholder:text-gray-300 focus:outline-none focus:border-ven-yellow transition-all ${errors.email ? 'border-red-400' : 'border-gray-100'}`}
            />
            {errors.email && <p className="text-[9px] text-red-400 font-bold mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
              WhatsApp <span className="text-gray-300">(opcional)</span>
            </label>
            <input
              type="tel"
              placeholder="+54 9 11 XXXX-XXXX"
              value={form.telefono}
              onChange={e => set('telefono', e.target.value)}
              className={`w-full bg-gray-50 border rounded-2xl py-3.5 px-4 text-sm text-venezuela-dark placeholder:text-gray-300 focus:outline-none focus:border-ven-yellow transition-all ${errors.telefono ? 'border-red-400' : 'border-gray-100'}`}
            />
            {errors.telefono && <p className="text-[9px] text-red-400 font-bold mt-1 ml-1">{errors.telefono}</p>}
          </div>

          {/* Zona */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
              ¿En qué barrio vivís? <span className="text-gray-300">(opcional)</span>
            </label>
            <select
              value={form.zona}
              onChange={e => set('zona', e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm text-venezuela-dark focus:outline-none focus:border-ven-yellow transition-all appearance-none"
            >
              <option value="">— Elegí tu barrio —</option>
              {BARRIOS_CABA.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Cumpleaños */}
          <div className="bg-gradient-to-r from-ven-yellow/10 to-venezuela-orange/10 border border-ven-yellow/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cake size={16} className="text-venezuela-orange shrink-0" />
              <p className="text-[10px] font-black text-venezuela-dark uppercase tracking-wide">
                🎂 Agregá tu cumpleaños y recibí un regalo especial ese día
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.cumple_mes}
                onChange={e => set('cumple_mes', e.target.value)}
                className="w-full bg-white border border-ven-yellow/20 rounded-xl py-3 px-3 text-xs text-venezuela-dark focus:outline-none focus:border-ven-yellow transition-all appearance-none"
              >
                <option value="">Mes</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={form.cumple_dia}
                onChange={e => set('cumple_dia', e.target.value)}
                className="w-full bg-white border border-ven-yellow/20 rounded-xl py-3 px-3 text-xs text-venezuela-dark focus:outline-none focus:border-ven-yellow transition-all appearance-none"
              >
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <option key={d} value={String(d)}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkbox marketing */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => set('acepta_marketing', !form.acepta_marketing)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${form.acepta_marketing ? 'bg-ven-yellow border-ven-yellow' : 'border-gray-300 bg-white'}`}
            >
              {form.acepta_marketing && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className="text-[10px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">
              Acepto recibir ofertas, novedades y mi regalo de cumpleaños de EnCasa Venezuela y {storeName}
            </span>
          </label>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-ven-yellow to-venezuela-orange text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
          >
            {loading
              ? <Loader2 size={20} className="animate-spin" />
              : <>
                  <Star size={16} />
                  Quiero mis beneficios
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
            }
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-gray-600 transition-colors py-1"
          >
            Ahora no, continuar sin registrarme
          </button>

          {/* Legal */}
          <p className="text-[9px] text-gray-300 text-center leading-relaxed pt-1">
            Tus datos se usan solo para procesar pedidos y enviarte ofertas (si aceptás).<br />
            Podés solicitar eliminación escribiendo a hola@encasavenezuela.com
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
