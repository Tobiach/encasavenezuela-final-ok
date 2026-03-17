
import React, { useMemo } from 'react';
import { TrendingUp, Users, ShoppingCart, ArrowUpRight, Clock, ClipboardCheck, Briefcase, MessageSquare } from 'lucide-react';
import { PurchaseHistoryItem, User } from '../types';

interface RadarDashboardViewProps {
  user: User;
}

const RadarDashboardView: React.FC<RadarDashboardViewProps> = ({ user }) => {
  const history: PurchaseHistoryItem[] = useMemo(() => 
    JSON.parse(localStorage.getItem('encasa_history') || '[]'), []);

  const stats = useMemo(() => {
    const totalSales = history.reduce((acc, p) => acc + p.total, 0);
    const totalItems = history.reduce((acc, p) => acc + p.items.reduce((sum, i) => sum + i.qty, 0), 0);
    const avgTicket = history.length ? totalSales / history.length : 0;
    return { totalSales, totalItems, avgTicket };
  }, [history]);

  if (user.role === 'Abogado') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Briefcase className="text-blue-500" />
              Gestión <span className="text-blue-500">Comercial</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Perfil: Abogado / Socio de Negocios</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            Tomar Nueva Consulta
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Consultas Entrantes', value: '12', icon: <MessageSquare className="text-blue-500" /> },
            { label: 'Casos Asignados', value: '08', icon: <ClipboardCheck className="text-green-500" /> },
            { label: 'Ventas Totales', value: `$${stats.totalSales}`, icon: <TrendingUp className="text-yellow-500" /> },
            { label: 'Clientes Activos', value: '142', icon: <Users className="text-red-500" /> }
          ].map((s, i) => (
            <div key={i} className="gradient-card p-8 rounded-[32px] border border-white/5 flex flex-col hover:border-blue-500/30 transition-all">
              <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">{s.icon}</div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-black">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="gradient-card p-10 rounded-[40px] border border-white/5">
          <h3 className="text-xl font-bold mb-8">Casos Pendientes de Aprobación</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between pb-6 border-b border-white/5 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">#0{i}</div>
                  <div>
                    <p className="font-bold text-base">Pedido de Importación Particular</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase">Cliente: Mariana G. • Hace 2hs</p>
                  </div>
                </div>
                <button className="text-[10px] font-black text-blue-500 uppercase hover:underline">Gestionar Caso →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <TrendingUp className="text-ven-yellow" />
            Mi Radar <span className="text-ven-yellow">EnCasa</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Bienvenido de nuevo, {user.first_name}</p>
        </div>
        <button className="bg-ven-yellow hover:bg-yellow-600 text-ven-blue px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
          Nueva Consulta de Sabor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Pedidos Realizados', value: history.length, icon: <ShoppingCart className="text-ven-yellow" /> },
          { label: 'Consultas Activas', value: '01', icon: <Clock className="text-ven-blue" /> },
          { label: 'Inversión Total', value: `$${stats.totalSales}`, icon: <TrendingUp className="text-green-500" /> },
          { label: 'Club Puntos', value: '140', icon: <ArrowUpRight className="text-ven-yellow" /> }
        ].map((s, i) => (
          <div key={i} className="gradient-card p-8 rounded-[32px] border border-white/5 flex flex-col">
            <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">{s.icon}</div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="gradient-card p-10 rounded-[40px] border border-white/5">
          <h3 className="text-xl font-bold mb-8">Mis Últimas Compras</h3>
          <div className="space-y-6">
            {history.slice(-3).reverse().map(p => (
              <div key={p.id} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-bold text-sm">Pedido #{p.id.toString().slice(-4)}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">{new Date(p.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-ven-yellow font-black">${p.total}</p>
                  <p className="text-[10px] text-gray-500 font-bold">Entregado</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ven-yellow/5 border border-ven-yellow/20 p-10 rounded-[40px] flex flex-col items-center justify-center text-center">
          <div className="bg-ven-yellow w-16 h-16 rounded-3xl flex items-center justify-center text-ven-blue mb-6 shadow-xl shadow-yellow-500/20">
            <ShoppingCart size={32} />
          </div>
          <h3 className="text-2xl font-black mb-4">¿Te falta algo, Pana?</h3>
          <p className="text-sm text-gray-400 italic mb-8">Repite tu combo favorito o explora lo nuevo que llegó esta semana al marketplace.</p>
          <button className="text-[10px] font-black text-ven-yellow uppercase tracking-widest hover:underline">Ir al Catálogo →</button>
        </div>
      </div>
    </div>
  );
};

export default RadarDashboardView;
