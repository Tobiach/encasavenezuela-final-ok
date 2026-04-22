import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    label: 'Solo en EnCasa',
    title: 'Cada pedido te\nacerca a más 🎁',
    desc: 'Productos venezolanos con descuentos reales para la comunidad.',
    cta: 'Empezar a pedir →',
    emoji: '🥘',
    badge: '+40 productos',
    path: '/catalog',
  },
  {
    label: 'Delivery directo',
    title: 'Sin apps, sin vueltas,\npor WhatsApp 📲',
    desc: 'Elegí tu local favorito y pedí directo. Rápido y simple.',
    cta: 'Ver locales →',
    emoji: '🛵',
    badge: 'WhatsApp directo',
    path: '/partners',
  },
];

const BannerLoyalty: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="px-4 pb-4">
      <div className="relative rounded-[24px] overflow-hidden bg-ven-yellow/15 border border-ven-yellow/25">
        {/* Franja bandera */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[24px]"
          style={{ background: 'linear-gradient(to bottom, #6B1D1D 33%, #F4C542 33%, #F4C542 66%, #1F3C88 66%)' }}
        />

        <div
          key={current}
          className="flex justify-between items-center px-5 py-4 gap-3 animate-in fade-in duration-400"
        >
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#6B1D1D]/60 mb-1">
              {slide.label}
            </span>
            <h3 className="font-black text-[#1A1A1A] text-base leading-tight whitespace-pre-line">
              {slide.title}
            </h3>
            <p className="text-gray-500 text-[11px] mt-1 leading-snug font-medium">
              {slide.desc}
            </p>
            <button
              onClick={() => navigate(slide.path)}
              className="mt-3 bg-[#6B1D1D] text-white text-[11px] rounded-full px-4 py-1.5 font-black tracking-wide hover:brightness-110 active:scale-95 transition-all"
            >
              {slide.cta}
            </button>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[52px] leading-none drop-shadow-sm select-none">{slide.emoji}</span>
            <div className="bg-ven-yellow/20 rounded-full px-2 py-0.5">
              <span className="text-[9px] font-black text-[#1A1A1A]/60 uppercase tracking-widest">
                {slide.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 pb-3 -mt-1">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-4 h-1.5 bg-[#6B1D1D]' : 'w-1.5 h-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerLoyalty;
