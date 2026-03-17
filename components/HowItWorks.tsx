
import React from 'react';
import { MousePointerClick, Smartphone, PackageCheck } from 'lucide-react';

const steps = [
  {
    icon: <MousePointerClick className="text-white" size={24} />,
    title: "1. Selecciona",
    description: "Elige tus productos favoritos del catálogo.",
    bgGradient: "from-ven-yellow to-venezuela-orange",
    shadowColor: "shadow-venezuela-orange/20"
  },
  {
    icon: <Smartphone className="text-white" size={24} />,
    title: "2. Confirma",
    description: "Finaliza tu pedido vía WhatsApp directo.",
    bgGradient: "from-ven-blue to-ven-blue-light",
    shadowColor: "shadow-ven-blue/20"
  },
  {
    icon: <PackageCheck className="text-white" size={24} />,
    title: "3. Recibe",
    description: "Te lo llevamos a casa en tiempo récord.",
    bgGradient: "from-ven-red to-red-600",
    shadowColor: "shadow-ven-red/20"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-12 text-venezuela-brown uppercase tracking-tighter">¿Cómo funciona <span className="text-ven-yellow">EnCasa</span>?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-venezuela-dark p-8 md:p-10 rounded-[40px] border-2 border-black/5 flex flex-col items-center text-center group hover:border-ven-yellow transition-all shadow-xl hover:-translate-y-2">
              <div className={`bg-gradient-to-br ${step.bgGradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-2xl ${step.shadowColor} group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-black mb-3 text-venezuela-brown uppercase tracking-tight group-hover:text-venezuela-orange transition-colors">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-bold">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
