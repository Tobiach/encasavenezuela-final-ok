/// <reference types="vite/client" />
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, ChefHat, Send, Loader2, MapPin } from 'lucide-react';
import { Product, PartnerStore } from '../types';
import { LOCALES_VENEZOLANOS } from '../data/localesAmigos';
import { askGeminiWorker, WorkerChatMessage } from '../data/lib/geminiWorker';

interface Message {
  role: 'user' | 'model';
  text: string;
  suggestedProducts?: Product[];
}

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (p: Product, storeId?: string) => void;
  onSelectStore: (store: PartnerStore) => void;
  storeId?: string; // ID del local actual para contexto AI
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onClose,
  onAddToCart,
  onSelectStore,
  storeId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStore = useMemo(
    () => LOCALES_VENEZOLANOS.find((s) => s.id === storeId),
    [storeId]
  );

  const availableStores = useMemo(() => {
    return LOCALES_VENEZOLANOS.filter((s) => product.availableInStoreIds?.includes(s.id));
  }, [product]);

  // Filtrado de productos por local para la IA
  const contextualProducts = useMemo(() => {
    if (!storeId) return allProducts;
    return allProducts.filter((p) => p.availableInStoreIds?.includes(storeId));
  }, [storeId, allProducts]);

  const systemInstruction = `Eres "Tu Pana Chef AI" de EnCasa VEN.
Tu misión: Asesorar sobre ${product.name} y CERRAR VENTAS.
${storeId ? `IMPORTANTE: Estás atendiendo en el local "${currentStore?.name}". SOLO recomienda productos disponibles en este local: ${contextualProducts.map(p => p.name).join(', ')}.` : `Estás en el marketplace general.`}

HABILIDAD ESPECIAL: COMPRA DIRECTA
- Si el usuario muestra interés o pregunta por combinaciones, responde amablemente y AL FINAL incluye siempre: [LLEVAR: NombreProducto1, NombreProducto2] (máximo 3).
- Ejemplo: "Esa malta va perfecta con un Pirulín. [LLEVAR: Pirulín]"

REGLAS DE ORO:
1. Sé BREVE y CONVERSACIONAL (máximo 2 líneas). Tono venezolano ("pana", "chévere").
2. Sé PROACTIVO: Sugiere combos que aumenten el carrito.
3. NO USES negritas ni asteriscos.`;

  const parseSuggestedProducts = (text: string): { cleanText: string; products: Product[] } => {
    const match = text.match(/\[LLEVAR:\s*(.*?)\]/);
    if (!match) return { cleanText: text, products: [] };

    const productNames = match[1].split(',').map((n) => n.trim().toLowerCase());

    const foundProducts = contextualProducts
      .filter((p) => productNames.some((name) => p.name.toLowerCase().includes(name)))
      .slice(0, 3);

    return {
      cleanText: text.replace(/\[LLEVAR:.*?\]/g, '').trim(),
      products: foundProducts
    };
  };

  useEffect(() => {
    const initialGreeting = async () => {
      if (messages.length > 0) return;

      setLoading(true);
      setError(null);

      try {
        const prompt = `Dime una razón rápida de por qué el ${product.name} es espectacular y sugiere llevarlo.`;
        const { text } = await askGeminiWorker({ system: systemInstruction, prompt });

        const { cleanText, products } = parseSuggestedProducts(text || '');
        setMessages([
          {
            role: 'model',
            text: cleanText || `¡¡Épale pana! El ${product.name} es clave en cualquier mesa.`,
            suggestedProducts: products
          }
        ]);
      } catch (e) {
        console.error('Worker Greeting Error:', e);
        setMessages([{ role: 'model', text: '¡Epa pana! Ya prendí el fogón. ¿Qué quieres saber?' }]);
        setError('No pude prender el fogón.');
      } finally {
        setLoading(false);
      }
    };

    initialGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, storeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setError(null);

    try {
      const history: WorkerChatMessage[] = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const { text: answer } = await askGeminiWorker({
        system: systemInstruction,
        prompt: userMsg,
        history,
        timeoutMs: 12000,
      });

      const { cleanText, products } = parseSuggestedProducts(answer || '');
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: cleanText || '¡Epa pana! Se me quemaron los cables.',
          suggestedProducts: products
        }
      ]);
    } catch (e) {
      console.error('Worker Message Error:', e);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Hubo un problema, intentemos de nuevo, pana.' }
      ]);
      setError('Hubo un problema con el Worker.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggested = (p: Product) => {
    onAddToCart(p, storeId);
    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    setLastNotification(`✅ ${p.name} al carrito`);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [p.id]: false }));
      setLastNotification(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center overflow-hidden animate-in fade-in duration-300 p-0 md:p-6">
      <div className="w-full h-full md:h-[90vh] md:max-w-4xl md:rounded-[48px] bg-[#0F0A08] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl relative">

        {lastNotification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-2">
            <Check size={14} strokeWidth={4} /> {lastNotification}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-[40%] flex flex-col overflow-y-auto no-scrollbar scroll-smooth bg-venezuela-dark border-r border-white/5 shrink-0 h-[40vh] md:h-full">
          <div className="relative h-[25vh] md:h-auto md:aspect-square shrink-0 overflow-hidden bg-black/40 flex items-center justify-center">
            <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain md:object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-venezuela-dark via-transparent to-transparent opacity-30" />
          </div>

          <div className="p-5 md:p-8 space-y-4 md:space-y-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex justify-center md:justify-start">
                <span className="text-[8px] md:text-[10px] font-black text-venezuela-orange uppercase tracking-[0.3em] mb-1">
                  {product.category}
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight line-clamp-2">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-black text-venezuela-orange tracking-tighter">
                ${product.price}
              </p>
              {product.usageInfo && (
                <p className="text-[10px] md:text-[12px] text-gray-500 italic leading-relaxed mt-2 font-medium">
                  {product.usageInfo}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-xl border border-white/5">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all text-gray-400"
                >
                  <Minus size={14} />
                </button>
                <span className="text-base font-black text-white">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all text-gray-400"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, storeId);
                  setAddedStatus(true);
                  setTimeout(() => setAddedStatus(false), 2000);
                }}
                className={`w-full py-4 rounded-2xl font-black text-[10px] md:text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-2xl ${
                  addedStatus
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-[#F58220] to-[#E86D00] text-white shadow-orange-500/20 active:scale-95'
                }`}
              >
                {addedStatus ? <Check size={16} strokeWidth={4} /> : <ShoppingCart size={16} />}
                {addedStatus ? '¡Agregado!' : 'Añadir al pedido'}
              </button>
            </div>

            {/* SECCIÓN DISPONIBLE EN LOCALES */}
            {!storeId && (
              <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <MapPin size={14} className="text-venezuela-orange" /> Dónde conseguirlo
                </p>
                <div className="space-y-3">
                  {availableStores.length > 0 ? (
                    availableStores.map((store) => (
                      <div
                        key={store.id}
                        className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-venezuela-orange/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/20">
                            <img
                              src={store.img}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                              alt={store.name}
                            />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">{store.name}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">{store.neighborhood}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onSelectStore(store)}
                          className="text-[10px] font-black text-venezuela-orange uppercase tracking-widest hover:underline active:scale-95 transition-all"
                        >
                          Ver local
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-500 italic">
                      No hay locales registrados para este producto aún.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[60%] flex-grow h-full flex flex-col bg-venezuela-dark relative overflow-hidden border-t md:border-t-0 border-white/5">
          <div className="p-3 md:p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-[#F58220] to-[#E86D00] rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-xl">
                <ChefHat size={16} className="md:hidden" />
                <ChefHat size={20} className="hidden md:block" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-white uppercase tracking-tight text-xs md:text-base">
                  Pana <span className="text-venezuela-orange">Chef AI</span>
                </h3>
                <p className="text-[6px] md:text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                  {storeId ? `Asesorando para ${currentStore?.name}` : 'Asesoría Cultural'}
                </p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 md:p-8 space-y-6 scrollbar-hide pb-28 md:pb-10">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3 duration-500`}
              >
                <div
                  className={`max-w-[88%] md:max-w-[85%] p-5 md:p-7 rounded-[32px] text-[14px] md:text-[16px] leading-relaxed shadow-xl font-medium ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#F58220] to-[#E86D00] text-white rounded-tr-none'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none backdrop-blur-2xl'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>

                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="mt-4 w-full max-w-[300px] space-y-3 animate-in slide-in-from-left-3 duration-600">
                    <p className="text-[10px] font-black text-venezuela-orange uppercase tracking-widest mb-1 ml-2">
                      Sugerencias del Chef:
                    </p>
                    {m.suggestedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                          <img src={p.img} className="w-full h-full object-cover opacity-80" alt={p.name} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-venezuela-orange font-bold uppercase tracking-tighter">${p.price}</p>
                        </div>
                        <button
                          onClick={() => handleAddSuggested(p)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            addedItems[p.id]
                              ? 'bg-green-500 text-white'
                              : 'bg-gradient-to-r from-[#F58220] to-[#E86D00] text-white hover:scale-110 active:scale-90 shadow-lg shadow-orange-500/20'
                          }`}
                        >
                          {addedItems[p.id] ? <Check size={16} strokeWidth={4} /> : <Plus size={20} strokeWidth={3} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 rounded-tl-none flex items-center gap-4 backdrop-blur-md">
                  <Loader2 size={16} className="animate-spin text-venezuela-orange" />
                  <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest italic">
                    El Pana está cocinando...
                  </span>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="flex justify-start">
                <div className="bg-red-500/10 p-4 rounded-[24px] border border-red-500/20 text-red-300 text-[11px] font-bold">
                  {error}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 md:p-10 bg-black/60 backdrop-blur-xl border-t border-white/10 space-y-4 shrink-0 pb-8 md:pb-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="relative flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntame tips de cocina, pana..."
                className="flex-grow bg-white/5 border border-white/10 rounded-[24px] py-4.5 px-6 focus:outline-none focus:border-venezuela-orange transition-all text-sm md:text-base text-white placeholder:text-gray-700 shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#F58220] to-[#E86D00] rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 disabled:opacity-10 transition-all shrink-0 active:scale-95 hover:scale-105"
              >
                <Send size={22} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;

