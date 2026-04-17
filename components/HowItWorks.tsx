
import React from 'react';

const steps = [
  {
    number: '1',
    emoji: '🛍️',
    title: 'Elegí tu local',
    description: 'Explorá los locales venezolanos verificados y elegí tus productos favoritos.',
  },
  {
    number: '2',
    emoji: '📱',
    title: 'Confirmá por WhatsApp',
    description: 'Finalizá tu pedido directo por WhatsApp. Sin apps, sin registros, sin vueltas.',
  },
  {
    number: '3',
    emoji: '🏠',
    title: 'Recibí en casa',
    description: 'El local te coordina la entrega. Rápido, simple y con sabor venezolano.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-10 bg-white border-y border-black/5">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">¿Cómo funciona EnCasa?</h2>
          <p className="text-gray-400 text-sm mt-1">Tres pasos, sabor garantizado</p>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-full bg-ven-yellow text-black font-black text-lg flex items-center justify-center mb-3 shadow-sm">
                {step.number}
              </div>
              <span className="text-3xl mb-3 leading-none">{step.emoji}</span>
              <h3 className="font-bold text-gray-900 text-base mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
