
import React, { useState } from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

interface AIAssistantButtonProps {
  onClick?: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-20 h-20 group active:scale-95 transition-all duration-500 relative animate-float"
      title="Pana Chef AI Assistant"
    >
      {/* Efecto de Glow Dual (VZ/AR) */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-ven-yellow via-ven-blue to-ven-red opacity-40 blur-2xl group-hover:opacity-70 group-hover:blur-3xl transition-all duration-700 animate-pulse"></div>
      
      {/* Cuerpo del Botón */}
      <div className="relative w-full h-full bg-venezuela-dark border-2 border-white/10 rounded-[32px] flex items-center justify-center shadow-2xl overflow-hidden group-hover:border-ven-yellow/50 transition-colors">
        
        {/* Fondo con Rayas Argentinas/Venezolanas Sutiles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-1/3 bg-ven-yellow"></div>
          <div className="h-1/3 bg-ven-blue"></div>
          <div className="h-1/3 bg-ven-red"></div>
        </div>

        {/* Icono Mascota (Robot Chef) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`transition-transform duration-500 ${hovered ? 'scale-110 -translate-y-1' : ''}`}>
             <ChefHat size={32} className="text-ven-yellow group-hover:text-white transition-colors" />
          </div>
          <div className="flex gap-1 mt-1">
             <div className="w-1.5 h-1.5 bg-ven-blue rounded-full animate-bounce"></div>
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
             <div className="w-1.5 h-1.5 bg-ven-red rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Badge de "AI" */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-ven-yellow to-yellow-600 text-ven-blue text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white/10">
          AI
        </div>

        {/* Chispas flotantes */}
        <Sparkles 
          size={12} 
          className="absolute bottom-3 left-3 text-yellow-500 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity" 
        />
      </div>

      {/* Tooltip de Asistente */}
      <div className={`absolute -top-12 right-0 bg-white text-black px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl pointer-events-none transition-all duration-500 whitespace-nowrap border-2 border-ven-yellow ${hovered ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-2'}`}>
        ¿Enqué puedo ayudarte? 🤖🇻🇪
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};

export default AIAssistantButton;
