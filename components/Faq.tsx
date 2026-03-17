
import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "¿Los productos son realmente originales de Venezuela?",
    answer: "¡Absolutamente! Trabajamos directamente con importadores autorizados de marcas como Empresas Polar, Savoy y Nestlé. Nuestros productos artesanales (quesos, tequeños) son elaborados por expertos venezolanos en Argentina siguiendo las recetas tradicionales."
  },
  {
    question: "¿Cuánto tarda el envío exactamente?",
    answer: "Nuestro sistema 'En Casa en Minutos' asigna tu pedido al local asociado más cercano a tu ubicación. Dependiendo de la zona en CABA o GBA, los tiempos suelen oscilar entre 30 y 90 minutos."
  },
  {
    question: "¿Cómo confirmo mi compra si no hay pasarela de pago directa?",
    answer: "Priorizamos la atención humana. Una vez que armas tu carrito, el botón te llevará a WhatsApp con tu lista cargada. Allí, un asesor confirma stock, acuerda el método de pago y te asigna el envío de forma personalizada."
  },
  {
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: "Aceptamos efectivo al recibir (para mayor seguridad), transferencia bancaria, Mercado Pago y tarjetas de crédito/débito a través de links de pago en WhatsApp."
  },
  {
    question: "¿Tienen tienda física donde pueda ir a comprar?",
    answer: "Sí, contamos con una red de locales amigos distribuidos por Buenos Aires. Puedes verlos en la sección 'Locales Amigos' de la web para pasar a retirar tu pedido si prefieres."
  },
  {
    question: "¿Qué pasa si un producto llega en mal estado?",
    answer: "Tu satisfacción es nuestra prioridad. Si algún producto llega dañado o no es lo que esperabas, comunícate inmediatamente por el mismo chat de WhatsApp y procederemos al cambio sin costo adicional o devolución del dinero."
  },
  {
    question: "¿Es seguro comprar a través de WhatsApp?",
    answer: "Es el método más seguro hoy en día para evitar fraudes con tarjetas. Tienes un registro directo de tu conversación, el nombre del asesor y puedes pagar contra entrega una vez que tengas el producto en tus manos."
  },
  {
    question: "¿Cómo funciona el Club EnCasa VEN y los puntos?",
    answer: "Por cada $10.000 de compra sumas 1 punto. Estos puntos son acumulables y puedes canjearlos por descuentos directos o productos de regalo en futuras compras. ¡Es nuestra forma de premiar tu fidelidad!"
  }
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-venezuela-dark">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <HelpCircle className="text-ven-yellow mx-auto mb-4" size={40} />
          <h2 className="text-4xl font-black mb-4 text-venezuela-brown uppercase tracking-tighter">Preguntas <span className="text-ven-yellow">Frecuentes</span></h2>
          <p className="text-gray-600 font-medium">Despejamos tus dudas antes de que pidas tu primera arepa.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-black/5 rounded-[24px] border ${openIndex === idx ? 'border-ven-yellow/30' : 'border-black/5'} overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-black/5 transition-colors"
              >
                <span className={`font-black uppercase tracking-tight transition-colors ${openIndex === idx ? 'text-ven-yellow' : 'text-venezuela-brown'}`}>
                  {faq.question}
                </span>
                {openIndex === idx ? <Minus className="text-ven-yellow shrink-0" size={20} /> : <Plus className="text-gray-500 shrink-0" size={20} />}
              </button>
              
              <div 
                className={`px-6 transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <p className="text-gray-600 text-sm leading-relaxed border-t border-black/5 pt-4 font-medium">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
