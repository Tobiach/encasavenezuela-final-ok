import React from 'react';

const steps = [
  {
    number: '1',
    emoji: '🛍️',
    title: 'Elegí tu local',
    description: 'Explorá los locales venezolanos verificados y elegí tus productos favoritos.',
    accent: '#D4AF37',
  },
  {
    number: '2',
    emoji: '📱',
    title: 'Confirmá por WhatsApp',
    description: 'Finalizá tu pedido directo por WhatsApp. Sin apps, sin registros, sin vueltas.',
    accent: '#002FA7',
  },
  {
    number: '3',
    emoji: '🏠',
    title: 'Recibí en casa',
    description: 'El local te coordina la entrega. Rápido, simple y con sabor venezolano.',
    accent: '#8B1A1A',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-10 bg-[#FAFAF8] border-y border-black/5">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B1A1A] mb-2">Así funciona</p>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            ¿Cómo funciona <span className="text-ven-yellow">EnCasa</span>?
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Tres pasos, sabor garantizado</p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0 p-4 md:p-6 md:text-center"
            >
              {/* Accent bar top (desktop) / left (mobile) */}
              <div
                className="hidden md:block w-full h-1 rounded-full mb-5 -mt-6 mx-auto"
                style={{ background: step.accent, width: '40%' }}
              />

              {/* Number + emoji stack */}
              <div className="flex flex-col items-center gap-2 shrink-0 md:mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg shadow-md text-white"
                  style={{ background: step.accent }}
                >
                  {step.number}
                </div>
                <span className="text-3xl leading-none">{step.emoji}</span>
              </div>

              {/* Text */}
              <div className="flex-1 md:flex-none">
                <h3 className="font-black text-gray-900 text-base leading-tight mb-1 md:mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
