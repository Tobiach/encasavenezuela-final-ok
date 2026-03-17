/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Loader2,
  ChefHat,
  Check,
  Plus,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Product, PartnerStore } from "../types";
import { LOCALES_VENEZOLANOS } from "../data/localesAmigos";
import { askGeminiWorker, WorkerChatMessage } from "../data/lib/geminiWorker";

interface Message {
  role: "user" | "model";
  text: string;
  suggestedProducts?: Product[];
  suggestedStores?: PartnerStore[];
}

interface ProductAIChatProps {
  product?: Product; // Opcional para modo chat global
  allProducts: Product[];
  cart: { product: Product; qty: number }[];
  onClose: () => void;
  onAddToCart: (p: Product, storeId?: string) => void;
  onOpenMap?: (store: PartnerStore) => void;
  storeId?: string;
}

const ProductAIChat: React.FC<ProductAIChatProps> = ({
  product,
  allProducts,
  cart,
  onClose,
  onAddToCart,
  onOpenMap,
  storeId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentStore = LOCALES_VENEZOLANOS.find((s) => s.id === storeId);

  // Filtrar productos por local para el contexto de la IA
  const localProducts = storeId
    ? allProducts.filter((p) => p.availableInStoreIds?.includes(storeId))
    : allProducts;

  const systemInstruction = `Eres "Chef AI", especialista culinario de EnCasa VEN.
${storeId ? `CONTEXTO: Estás en el local "${currentStore?.name}".` : `CONTEXTO: Marketplace General.`}

REGLAS DE CONVERSACIÓN (CRÍTICAS):
1. LENGUAJE NEUTRO: Evitá el género. No uses "pana" como masculino. Usá "podés", "querés", "buscás". Tono cercano e inclusivo.
2. PRIMER MENSAJE: Debe ser 100% conversacional. NO ofrezcas productos ni locales. Hacé una pregunta para entender la necesidad (ej: ¿Para qué ocasión buscás?, ¿Cuántas personas son?, ¿Es para hoy?).
3. SEGUNDO MENSAJE EN ADELANTE: Solo si se detecta intención clara, recomendá opciones. Explicá POR QUÉ de forma desarrollada y conversacional.
4. NO REPETIR: Si el usuario ya tiene un producto en el carrito o es el producto del chat actual, NO lo recomendés. Sugerí complementos coherentes.
5. DISPONIBILIDAD: Si el usuario pide un producto que NO está en el local actual (${currentStore?.name}), analizá la data global y sugerí OTRO local que sí lo tenga usando [LOCAL: NombreLocal]. Explicá: "Ese producto lo tiene [NombreLocal]".
6. RECOMENDACIÓN DE PRODUCTOS: Usá [LLEVAR: NombreProducto1, NombreProducto2] (máximo 3). Solo recomendá productos del local actual si estás en uno.
7. COMPRA WEB: Incentivá la compra online. Di que abajo aparecen las opciones para agregar directo al carrito.

DATOS DISPONIBLES:
- Locales: ${LOCALES_VENEZOLANOS.map((s) => `${s.name} en ${s.neighborhood}`).join(", ")}
- Productos del local actual: ${localProducts.map((p) => p.name).join(", ")}
- Todos los productos del sistema: ${allProducts.map((p) => p.name).join(", ")}`;

  // Smart Scroll
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      const lastMessage = scrollRef.current.lastElementChild as HTMLElement;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [messages, loading]);

  const parseSuggestions = (
    text: string
  ): { cleanText: string; products: Product[]; stores: PartnerStore[] } => {
    let cleanText = text;
    const products: Product[] = [];
    const stores: PartnerStore[] = [];

    // Parse Products
    const productMatch = text.match(/\[LLEVAR:\s*(.*?)\]/);
    if (productMatch) {
      const productNames = productMatch[1]
        .split(",")
        .map((n) => n.trim().toLowerCase());
      const cartIds = cart.map((item) => item.product.id);

      const foundProducts = localProducts
        .filter((p) => {
          const isMatch = productNames.some((name) =>
            p.name.toLowerCase().includes(name)
          );
          const isNotCurrent = product ? p.id !== product.id : true;
          const isNotInCart = !cartIds.includes(p.id);
          return isMatch && isNotCurrent && isNotInCart;
        })
        .slice(0, 3);

      products.push(...foundProducts);
      cleanText = cleanText.replace(/\[LLEVAR:.*?\]/g, "").trim();
    }

    // Parse Stores
    const storeMatch = text.match(/\[LOCAL:\s*(.*?)\]/);
    if (storeMatch) {
      const storeNames = storeMatch[1]
        .split(",")
        .map((n) => n.trim().toLowerCase());
      const foundStores = LOCALES_VENEZOLANOS.filter((s) =>
        storeNames.some((name) => s.name.toLowerCase().includes(name))
      ).slice(0, 2);

      stores.push(...foundStores);
      cleanText = cleanText.replace(/\[LOCAL:.*?\]/g, "").trim();
    }

    return { cleanText, products, stores };
  };

  // Saludo inicial (sin SDK, todo por Worker)
  useEffect(() => {
    const initialGreeting = async () => {
      if (messages.length > 0) return;

      setLoading(true);
      setError(null);
      setIsTimeout(false);

      const timeout = setTimeout(() => {
        setIsTimeout(true);
        setLoading(false);
      }, 12000);

      try {
        const prompt = product
          ? `Saludá y preguntá para qué ocasión se busca el ${product.name}. No lo ofrezcas para comprar todavía, solo conversá y hacé preguntas estratégicas (para cuántas personas, si es para hoy, etc).`
          : `Saludá como especialista culinario y hacé una pregunta para entender qué se busca hoy (ej: si es para una cena, fiesta, etc). No ofrezcas productos aún.`;

        const res = await askGeminiWorker({
          system: systemInstruction,
          prompt,
          history: [],
          timeoutMs: 12000,
        });

        clearTimeout(timeout);
        setIsTimeout(false);

        const text = res.text?.trim();
        setMessages([
          {
            role: "model",
            text:
              text ||
              "¡Hola! Aquí tu Chef listo para ayudar con el menú ideal. ¿Qué tenés en mente para hoy?",
          },
        ]);
      } catch (e) {
        clearTimeout(timeout);
        setError("No pude prender el fogón.");
        setMessages([
          {
            role: "model",
            text:
              "¡Hola! Aquí tu Chef listo para ayudar con el menú ideal. ¿Qué tenés en mente para hoy?",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    initialGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, storeId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = text;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    setError(null);
    setIsTimeout(false);

    const timeout = setTimeout(() => {
      setIsTimeout(true);
      setLoading(false);
    }, 12000);

    try {
      const history: WorkerChatMessage[] = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await askGeminiWorker({
        system: systemInstruction,
        prompt: userMsg,
        history,
        timeoutMs: 12000,
      });

      clearTimeout(timeout);
      setIsTimeout(false);

      const { cleanText, products, stores } = parseSuggestions(res.text || "");

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: cleanText || "Se me cruzaron los cables. Probá de nuevo 🙏",
          suggestedProducts: products,
          suggestedStores: stores,
        },
      ]);
    } catch (e) {
      clearTimeout(timeout);
      setError("Hubo un problema, intentemos de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      sendMessage(lastUserMessage.text);
    } else {
      window.location.reload();
    }
  };

  const handleAddProduct = (p: Product) => {
    try {
      const win = window as unknown as { encasaTrack?: (event: string, data: Record<string, unknown>) => void };
      win.encasaTrack?.("add_to_cart", {
        productId: p.id,
        productName: p.name,
        price: p.price,
        category: p.category,
        storeId: storeId ?? null,
        source: "IA",
        ts: Date.now(),
      });
    } catch (err) {
      // Ignorar errores de tracking
    }

    onAddToCart(p, storeId);
    setAddedItems((prev) => ({ ...prev, [p.id]: true }));
    setLastAdded(p.name);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [p.id]: false }));
      setLastAdded(null);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-[#0F0A08] w-full h-full md:h-[85vh] md:max-w-lg md:rounded-[48px] border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-ven-yellow to-yellow-600 rounded-xl flex items-center justify-center text-ven-blue shadow-xl">
              <ChefHat size={20} />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tight text-sm md:text-base">
                Chef <span className="text-ven-yellow">AI</span>
              </h3>
              <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                {storeId ? `Local: ${currentStore?.name}` : "Asistente EnCasa"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 transition-all active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        {/* Notificación agregado */}
        {lastAdded && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[340px] animate-in slide-in-from-top-4 duration-500">
            <div className="bg-venezuela-dark border border-ven-yellow/50 rounded-3xl p-4 shadow-[0_20px_50px_rgba(255,204,0,0.2)] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                  <Check size={20} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    ¡Agregado con éxito!
                  </p>
                  <p className="text-[11px] text-gray-400 font-bold truncate">
                    {lastAdded}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLastAdded(null)}
                  className="flex-grow bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Seguir comprando
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-grow bg-ven-yellow text-ven-blue py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 transition-all hover:scale-105"
                >
                  Ir al carrito
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mensajes */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-5 md:p-8 space-y-6 scrollbar-hide pb-28 md:pb-10"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              } animate-in slide-in-from-bottom-3 duration-500`}
            >
              <div
                className={`max-w-[88%] md:max-w-[85%] p-5 md:p-7 rounded-[32px] text-[14px] md:text-[16px] leading-relaxed shadow-xl ${
                  m.role === "user"
                    ? "bg-ven-yellow text-ven-blue rounded-tr-none"
                    : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none backdrop-blur-2xl"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>

              {/* Productos sugeridos */}
              {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                <div className="mt-4 w-full max-w-[300px] space-y-3 animate-in slide-in-from-left-3 duration-600">
                  <p className="text-[10px] font-black text-ven-yellow uppercase tracking-widest mb-1 ml-2">
                    Sugerencias del Chef:
                  </p>
                  {m.suggestedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                        <img
                          src={p.img}
                          className="w-full h-full object-cover opacity-80"
                          alt={p.name}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-ven-yellow font-bold">
                          ${p.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddProduct(p)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          addedItems[p.id]
                            ? "bg-green-500 text-white"
                            : "bg-ven-yellow text-ven-blue hover:scale-110 active:scale-90 shadow-lg shadow-yellow-500/20"
                        }`}
                      >
                        {addedItems[p.id] ? (
                          <Check size={16} strokeWidth={4} />
                        ) : (
                          <Plus size={20} strokeWidth={3} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Locales sugeridos */}
              {m.suggestedStores && m.suggestedStores.length > 0 && (
                <div className="mt-4 w-full max-w-[300px] space-y-3 animate-in slide-in-from-left-3 duration-600">
                  <p className="text-[10px] font-black text-ven-yellow uppercase tracking-widest mb-1 ml-2">
                    Locales recomendados:
                  </p>
                  {m.suggestedStores.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onOpenMap?.(s)}
                      className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                        <img
                          src={s.img}
                          className="w-full h-full object-cover opacity-80"
                          alt={s.name}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">
                          {s.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} className="text-ven-yellow" />
                          <p className="text-[9px] text-gray-500 font-bold truncate uppercase tracking-tight">
                            {s.neighborhood}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-gray-600 group-hover:text-ven-yellow transition-all group-hover:translate-x-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTimeout && (
            <div className="flex flex-col items-center justify-center py-10 space-y-5 animate-in fade-in zoom-in duration-500">
              <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 text-center max-w-[85%] backdrop-blur-md">
                <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-6 leading-relaxed">
                  Estoy teniendo demoras 🙏
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-ven-yellow text-ven-blue px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-500/30"
                >
                  Reintentar ahora
                </button>
              </div>
            </div>
          )}

          {error && !isTimeout && (
            <div className="flex justify-start">
              <div className="bg-red-500/10 p-6 rounded-[32px] border border-red-500/20 rounded-tl-none flex flex-col gap-4 backdrop-blur-md">
                <p className="text-[12px] text-red-400 font-black uppercase tracking-tight">
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="text-[10px] text-white bg-red-500 px-5 py-2.5 rounded-xl font-black uppercase self-start shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 rounded-tl-none flex items-center gap-4 backdrop-blur-md">
                <Loader2 size={16} className="animate-spin text-ven-yellow" />
                <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest italic">
                  Cocinando...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-5 md:p-10 bg-black/60 backdrop-blur-xl border-t border-white/10 shrink-0 pb-8 md:pb-10">
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
              placeholder="Pregúntale al Chef..."
              className="flex-grow bg-white/5 border border-white/10 rounded-[24px] py-4.5 px-6 focus:outline-none focus:border-ven-yellow transition-all text-sm md:text-base text-white placeholder:text-gray-700 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-14 h-14 md:w-16 md:h-16 bg-ven-yellow rounded-[22px] flex items-center justify-center text-ven-blue shadow-2xl shadow-yellow-500/40 disabled:opacity-10 transition-all active:scale-95 shrink-0 hover:scale-105"
            >
              <Send size={22} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductAIChat;

