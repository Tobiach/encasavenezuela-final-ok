/// <reference types="vite/client" />
import React, { useState, useMemo } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, ChefHat, MapPin, Sparkles } from 'lucide-react';
import { Product, PartnerStore } from '../types';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  stores: PartnerStore[];
  onClose: () => void;
  onAddToCart: (p: Product, storeId?: string) => void;
  onSelectStore: (store: PartnerStore) => void;
  storeId?: string;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  stores,
  onClose,
  onAddToCart,
  onSelectStore,
  storeId
}) => {
  const [addedStatus, setAddedStatus] = useState(false);
  const [qty, setQty] = useState(1);

  const currentStore = useMemo(
    () => stores.find((s) => s.id === storeId),
    [stores, storeId]
  );

  const availableStores = useMemo(
    () => stores.filter((s) => product.availableInStoreIds?.includes(s.id)),
    [stores, product]
  );

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center overflow-hidden animate-in fade-in duration-300 p-0 md:p-6">
      <div className="w-full h-full md:h-[90vh] md:max-w-4xl md:rounded-[48px] bg-[#0F0A08] border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-90 transition-all"
        >
          <X size={20} />
        </button>

        {/* Panel izquierdo — producto */}
        <div className="w-full md:w-[40%] flex flex-col overflow-y-auto no-scrollbar scroll-smooth bg-gradient-to-b from-venezuela-dark to-black border-r border-white/5 shrink-0 h-[40vh] md:h-full">
          <div className="relative h-[25vh] md:h-auto md:aspect-square shrink-0 overflow-hidden bg-black/40 flex items-center justify-center">
            <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain md:object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
          </div>

          <div className="p-5 md:p-8 space-y-4 md:space-y-6 bg-gradient-to-b from-black/60 to-venezuela-dark">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex justify-center md:justify-start">
                <span className="text-[10px] md:text-[11px] font-black text-ven-yellow bg-ven-yellow/10 px-3 py-1 rounded-full uppercase tracking-[0.25em] border border-ven-yellow/20">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl md:text-5xl font-black bg-gradient-to-r from-ven-yellow via-venezuela-orange to-ven-yellow bg-clip-text text-transparent tracking-tighter">
                ${product.price}
              </p>
              {product.usageInfo && (
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed mt-3 font-medium bg-white/5 p-3 rounded-xl border border-white/10">
                  {product.usageInfo}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-3 md:gap-4">
              <div className="flex items-center justify-between bg-white/10 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ven-yellow/20 rounded-lg transition-all text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="text-base font-black text-white">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ven-yellow/20 rounded-lg transition-all text-white"
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
                    : 'bg-gradient-to-r from-ven-yellow to-venezuela-orange text-white shadow-yellow-500/40 active:scale-95 hover:shadow-yellow-500/60'
                }`}
              >
                {addedStatus ? <Check size={16} strokeWidth={4} /> : <ShoppingCart size={16} />}
                {addedStatus ? '¡Agregado!' : 'Añadir al pedido'}
              </button>
            </div>

            {!storeId && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <p className="text-[10px] font-black text-ven-yellow uppercase tracking-[0.3em] flex items-center gap-2">
                  <MapPin size={14} className="text-ven-yellow" /> Dónde conseguirlo
                </p>
                <div className="space-y-3">
                  {availableStores.length > 0 ? (
                    availableStores.map((store) => (
                      <div
                        key={store.id}
                        className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:border-ven-yellow/40 transition-all group"
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
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{store.neighborhood}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onSelectStore(store)}
                          className="text-[10px] font-black text-ven-yellow uppercase tracking-widest hover:underline active:scale-95 transition-all"
                        >
                          Ver local
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">
                      No hay locales registrados para este producto aún.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho — mantenimiento */}
        <div className="w-full md:w-[60%] flex-grow h-full flex flex-col bg-venezuela-dark relative overflow-hidden border-t md:border-t-0 border-white/5">

          {/* Header — igual al original */}
          <div className="p-3 md:p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-ven-yellow to-venezuela-orange rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-xl">
                <ChefHat size={16} className="md:hidden" />
                <ChefHat size={20} className="hidden md:block" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-white uppercase tracking-tight text-xs md:text-base">
                  Pana <span className="text-ven-yellow">Chef AI</span>
                </h3>
                <p className="text-[6px] md:text-[8px] text-gray-400 font-bold uppercase tracking-widest">
                  {storeId ? `Asesorando para ${currentStore?.name}` : 'Asesoría Cultural'}
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de mantenimiento */}
          <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#2D1618] to-[#1A0D0E]">
            <div className="flex flex-col items-center gap-6 max-w-xs text-center animate-in fade-in zoom-in-95 duration-500">

              {/* Ícono con glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-ven-yellow/20 rounded-full blur-2xl scale-150" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-ven-yellow/20 to-venezuela-orange/20 border border-ven-yellow/30 rounded-3xl flex items-center justify-center shadow-2xl">
                  <ChefHat size={44} className="text-ven-yellow" />
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center gap-2 bg-ven-yellow/10 border border-ven-yellow/30 px-4 py-2 rounded-full">
                <Sparkles size={12} className="text-ven-yellow" />
                <span className="text-[10px] font-black text-ven-yellow uppercase tracking-[0.2em]">
                  Disponible próximamente
                </span>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                  Estamos mejorando
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  Tu <span className="text-ven-yellow font-black">Pana Chef</span> está recibiendo un upgrade. Vuelve pronto para recibir recomendaciones personalizadas.
                </p>
              </div>

              {/* Línea decorativa */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-ven-yellow/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-ven-yellow/60 animate-pulse" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-ven-yellow/30" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;