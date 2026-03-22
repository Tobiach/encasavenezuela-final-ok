
import React from 'react';
import { Truck, CheckCircle, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: <Truck className="text-white" size={28} />,
    title: "En Casa en Minutos",
    description: "Envíos a domicilio ultra veloces. Cada uno de nuestros locales asociados cuenta con su propio personal de entregas para garantizar rapidez.",
    bgGradient: "from-ven-yellow to-venezuela-orange",
    shadowColor: "shadow-venezuela-orange/20"
  },
  {
    icon: <CheckCircle className="text-white" size={28} />,
    title: "Calidad de Origen",
    description: "Solo marcas originales y producción artesanal con normas de higiene rigurosas.",
    bgGradient: "from-ven-blue to-ven-blue-light",
    shadowColor: "shadow-ven-blue/20"
  },
  {
    icon: <MessageSquare className="text-white" size={28} />,
    title: "Atención de Panas",
    description: "Asesoramiento por WhatsApp. Te ayudamos a armar tu pedido como si estuviéramos allá.",
    bgGradient: "from-ven-red to-red-600",
    shadowColor: "shadow-ven-red/20"
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-8 md:py-24 bg-venezuela-dark">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`${idx === 2 ? 'col-span-2 md:col-span-1 max-w-[240px] md:max-w-none mx-auto w-full' : ''} bg-white p-5 md:p-10 rounded-[24px] md:rounded-[40px] border-2 border-black/5 hover:border-ven-yellow transition-all group flex flex-col items-center text-center md:items-start md:text-left shadow-xl hover:-translate-y-2`}
          >
            <div className={`bg-gradient-to-br ${feature.bgGradient} w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 md:mb-8 shadow-2xl ${feature.shadowColor} group-hover:scale-110 transition-transform`}>
              {React.cloneElement(feature.icon as React.ReactElement, { size: 20, className: 'text-white md:hidden' })}
              {React.cloneElement(feature.icon as React.ReactElement, { size: 32, className: 'text-white hidden md:block' })}
            </div>
            <h3 className="text-sm md:text-2xl font-black uppercase tracking-tighter mb-1.5 md:mb-4 text-venezuela-brown group-hover:text-venezuela-orange transition-colors">{feature.title}</h3>
            <p className="text-[10px] md:text-sm text-gray-600 leading-relaxed font-bold">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
