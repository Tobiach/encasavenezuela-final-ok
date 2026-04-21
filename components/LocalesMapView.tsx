import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Star, Navigation, ChevronRight, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import { PartnerStore } from '../types';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet default icon broken en Vite/Webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── CAMBIO 1: descuentos deterministas por índice ─────────────────────────────
const PREMIUM_DISCOUNTS = [20, 25, 30, 15, 20];
const BASIC_DISCOUNTS   = [10, 15, 12, 18, 10];

function getDiscount(plan: 'premium' | 'basic', index: number): number {
  return plan === 'premium'
    ? PREMIUM_DISCOUNTS[index % PREMIUM_DISCOUNTS.length]
    : BASIC_DISCOUNTS[index % BASIC_DISCOUNTS.length];
}

// ── Pins profesionales paleta bandera ────────────────────────────────────────
function createPinIcon(plan: 'premium' | 'basic', discount: number): L.DivIcon {
  const isP = plan === 'premium';
  return L.divIcon({
    html: `<div style="position:relative;width:40px;height:44px">
      <div style="
        background:${isP ? 'linear-gradient(135deg,#D4AF37,#C9A227)' : 'linear-gradient(135deg,#8B1A1A,#6F1414)'};
        width:36px;height:36px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid white;
        box-shadow:0 4px 12px rgba(${isP ? '212,175,55' : '139,26,26'},0.5)
      "></div>
      <span style="
        position:absolute;top:-8px;right:-4px;
        background:#8B1A1A;color:white;
        font-size:8px;font-weight:900;
        padding:2px 4px;border-radius:6px;
        box-shadow:0 1px 4px rgba(0,0,0,0.25);
        white-space:nowrap;
      ">-${discount}%</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
    className: '',
  });
}

// Pin gris "Próximamente"
const PIN_PROXIMO = L.divIcon({
  html: `<div style="
    background:#E5E7EB;
    width:28px;height:28px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:2px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.15)
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -32],
  className: '',
});


// Pins ficticios "Próximamente" en Boedo y Caballito
const PROXIMOS_COORDS: [number, number][] = [
  [-34.6289, -58.4234],
  [-34.6312, -58.4198],
  [-34.6267, -58.4312],
  [-34.6334, -58.4267],
  [-34.6401, -58.4189],
  [-34.6378, -58.4223],
  [-34.6423, -58.4156],
  [-34.6445, -58.4201],
];

// ── Componente para re-centrar mapa ──────────────────────────────────────────
const FlyToLocation: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15, { duration: 1.2 });
  }, [coords, map]);
  return null;
};

// ── Categorías para filtros ──────────────────────────────────────────────────
const CATEGORIAS = [
  { label: 'Arepas & Empanadas', emoji: '🫓', keywords: ['arepa', 'empanada'] },
  { label: 'Tequeños',            emoji: '🧀', keywords: ['tequeño', 'queso'] },
  { label: 'Almacén & Víveres',   emoji: '🛒', keywords: ['almacén', 'víveres', 'productos'] },
  { label: 'Bebidas Venezolanas', emoji: '🥤', keywords: ['bebida', 'malta', 'jugo'] },
  { label: 'Dulces & Golosinas',  emoji: '🍫', keywords: ['dulce', 'chocolate', 'postre'] },
  { label: 'Comida Casera',       emoji: '🍽️', keywords: ['casero', 'pabellón', 'criolla'] },
  { label: 'Combos & Ofertas',    emoji: '🔥', keywords: ['combo', 'oferta', 'promo'] },
];

const BARRIOS = [
  'Balvanera', 'Once', 'Palermo', 'San Cristóbal', 'Recoleta',
  'Abasto', 'Caballito', 'Boedo', 'Almagro', 'Villa Crespo', 'Belgrano',
];

// ── Props ────────────────────────────────────────────────────────────────────
interface LocalesMapViewProps {
  stores: PartnerStore[];
}

const CABA_CENTER: [number, number] = [-34.6037, -58.3816];

const LocalesMapView: React.FC<LocalesMapViewProps> = ({ stores }) => {
  const navigate = useNavigate();
  // Búsqueda
  const [searchQuery,    setSearchQuery]    = useState('');
  const [flyTo,          setFlyTo]          = useState<[number, number] | null>(null);
  const [searching,      setSearching]      = useState(false);
  const [searchError,    setSearchError]    = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // CAMBIO 3: drawer de detalle al tocar pin
  const [selectedStore, setSelectedStore] = useState<(PartnerStore & { discount: number }) | null>(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);

  // CAMBIO 4: panel de filtros
  const [filtersOpen,        setFiltersOpen]        = useState(false);
  const [sortBy,             setSortBy]             = useState<'rating' | 'discount' | 'distance'>('rating');
  const [selectedCategoria,  setSelectedCategoria]  = useState<string | null>(null);
  const [selectedBarrio,     setSelectedBarrio]     = useState<string | null>(null);
  const [selectedTipo,       setSelectedTipo]       = useState<'comida' | 'productos' | null>(null);
  // Estado pendiente mientras el sheet está abierto
  const [pendingSort,        setPendingSort]        = useState<'rating' | 'discount' | 'distance'>('rating');
  const [pendingCategoria,   setPendingCategoria]   = useState<string | null>(null);
  const [pendingBarrio,      setPendingBarrio]      = useState<string | null>(null);
  const [pendingTipo,        setPendingTipo]        = useState<'comida' | 'productos' | null>(null);

  const storesWithCoords = stores.filter(s => s.lat != null && s.lng != null);

  // CAMBIO 1: asignar discounts
  const storesWithDiscount = useMemo(() =>
    storesWithCoords.map((s, i) => ({ ...s, discount: getDiscount(s.plan, i) })),
    [storesWithCoords]
  );

  // CAMBIO 5: aplicar filtros
  const filteredStores = useMemo(() => {
    let result = [...storesWithDiscount];

    if (selectedCategoria) {
      const cat = CATEGORIAS.find(c => c.label === selectedCategoria);
      if (cat) {
        result = result.filter(s => {
          const haystack = [...(s.tags ?? []), s.type].join(' ').toLowerCase();
          return cat.keywords.some(k => haystack.includes(k));
        });
      }
    }
    if (selectedBarrio) {
      result = result.filter(s =>
        (s.neighborhood ?? s.location ?? '').toLowerCase().includes(selectedBarrio.toLowerCase())
      );
    }
    if (selectedTipo) {
      result = result.filter(s => s.type === selectedTipo);
    }
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discount - a.discount);
    }
    return result;
  }, [storesWithDiscount, selectedCategoria, selectedBarrio, selectedTipo, sortBy]);

  const activeFiltersCount = [selectedCategoria, selectedBarrio, selectedTipo].filter(Boolean).length;

  // ── Geocodificar con Nominatim ───────────────────────────────────────────
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setSearchError('');
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Buenos Aires, Argentina')}&format=json&limit=1&countrycodes=ar`;
      const res  = await fetch(url, { headers: { 'Accept-Language': 'es' } });
      const data = await res.json();
      if (data.length > 0) {
        setFlyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        setSearchError('No encontramos esa dirección. Probá con otro barrio.');
      }
    } catch {
      setSearchError('Error de conexión. Revisá tu internet.');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) { setSearchError('Tu navegador no soporta geolocalización.'); return; }
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setFlyTo([pos.coords.latitude, pos.coords.longitude]); setSearching(false); },
      ()    => { setSearchError('No pudimos obtener tu ubicación.'); setSearching(false); }
    );
  };

  const openDrawer = (store: typeof storesWithDiscount[0]) => {
    setSelectedStore(store);
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const openFilters = () => {
    setPendingSort(sortBy);
    setPendingCategoria(selectedCategoria);
    setPendingBarrio(selectedBarrio);
    setPendingTipo(selectedTipo);
    setFiltersOpen(true);
  };
  const applyFilters = () => {
    setSortBy(pendingSort);
    setSelectedCategoria(pendingCategoria);
    setSelectedBarrio(pendingBarrio);
    setSelectedTipo(pendingTipo);
    setFiltersOpen(false);
  };
  const clearFilters = () => {
    setPendingSort('rating');
    setPendingCategoria(null);
    setPendingBarrio(null);
    setPendingTipo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-4 pt-5 pb-5 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          {/* Top bar: atrás + título */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 hover:bg-ven-yellow hover:text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 shrink-0"
            >
              <ArrowLeft size={18} className="text-gray-700 group-hover:text-white" />
            </button>
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-9 h-9 bg-[#8B1A1A]/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#8B1A1A]" />
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
                  Locales en CABA 🇻🇪
                </h1>
                <p className="text-[11px] text-gray-400 font-semibold">
                  {filteredStores.length} locales activos · EnCasa Venezuela
                </p>
              </div>
            </div>
          </div>

          {/* Buscador + botón filtros */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="Buscá tu barrio o dirección..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-ven-yellow focus:ring-2 focus:ring-ven-yellow/20 transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-5 py-3 bg-ven-yellow text-black font-bold text-sm rounded-xl hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50 shrink-0"
            >
              {searching ? '…' : 'Ir'}
            </button>
            <button
              onClick={handleLocateMe}
              title="Usar mi ubicación"
              className="px-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-ven-yellow hover:border-ven-yellow/50 active:scale-95 transition-all shrink-0"
            >
              <Navigation size={16} />
            </button>
            {/* CAMBIO 4: botón filtros */}
            <button
              onClick={openFilters}
              className={`relative px-3 py-3 rounded-xl border active:scale-95 transition-all shrink-0 ${activeFiltersCount > 0 ? 'bg-ven-yellow border-yellow-400 text-black' : 'bg-white border-gray-200 text-gray-500 hover:border-ven-yellow/50 hover:text-ven-yellow'}`}
            >
              <SlidersHorizontal size={16} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {searchError && (
            <p className="text-red-500 text-xs font-medium mt-2 px-1">{searchError}</p>
          )}

          {/* Leyenda */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-0 bg-white border border-gray-100 rounded-xl shadow-sm w-fit px-3 py-2 flex-wrap">
              <div className="flex items-center gap-1.5 pr-3">
                <span className="w-3 h-3 rounded-full bg-ven-yellow inline-block shadow-sm shadow-yellow-400/40 shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Premium</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5 px-3">
                <span className="w-3 h-3 rounded-full bg-gray-400 inline-block shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Básico</span>
              </div>
              <div className="w-px h-4 bg-gray-200 mx-3" />
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-200 border-2 border-white inline-block shrink-0" />
                <span className="text-xs font-semibold text-gray-400">Próximamente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAMBIO 6: Mapa con CartoDB Positron */}
      <div className="px-4 pt-4 pb-2 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200" style={{ height: '55vh', minHeight: 320 }}>
          <MapContainer
            center={CABA_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <FlyToLocation coords={flyTo} />

            {/* Pins "Próximamente" */}
            {PROXIMOS_COORDS.map((coords, i) => (
              <Marker key={`proximo-${i}`} position={coords} icon={PIN_PROXIMO}>
                <Popup minWidth={200}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', padding: '4px 2px' }}>
                    <b style={{ fontSize: 13, color: '#111827' }}>Próximamente en EnCasa 🇻🇪</b>
                    <br />
                    <small style={{ color: '#6B7280', display: 'block', marginTop: 4 }}>
                      Este local aún no está en la plataforma
                    </small>
                    <a
                      href={`https://www.google.com/maps?q=${coords[0]},${coords[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block', marginTop: 8,
                        background: '#4285F4', color: 'white',
                        fontSize: 10, fontWeight: 700,
                        padding: '4px 10px', borderRadius: 8,
                        textDecoration: 'none',
                      }}
                    >
                      📍 Ver en Google Maps
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Pins activos con badge de descuento */}
            {filteredStores.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat!, store.lng!]}
                icon={createPinIcon(store.plan, store.discount)}
                eventHandlers={{ click: () => openDrawer(store) }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Lista de locales */}
      <div className="px-4 pt-4 pb-6 max-w-5xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 mb-3 px-1">
          Locales en EnCasa ({filteredStores.length})
        </h2>
        {filteredStores.length === 0 ? (
          <p className="text-sm text-gray-400 px-1">No hay locales con esos filtros.</p>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredStores.map(store => (
                <button
                  key={store.id}
                  onClick={() => navigate(`/tienda/${store.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                >
                  <div className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: store.plan === 'premium' ? '#FCD34D' : '#9CA3AF' }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 font-bold text-base truncate">{store.name}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                      <MapPin size={11} className="shrink-0" />
                      {store.neighborhood || store.location}
                      <span className="text-gray-300">·</span>
                      <Star size={11} className="text-ven-yellow shrink-0" fill="currentColor" />
                      {store.rating?.toFixed(1) ?? '—'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg shrink-0">
                    -{store.discount}%
                  </span>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* ── CAMBIO 3: Drawer de detalle ──────────────────────────────────────── */}
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[1000]"
          onClick={closeDrawer}
        />
      )}
      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        {selectedStore && (
          <>
            {/* Imagen o fallback */}
            <div className="relative h-40 bg-ven-yellow overflow-hidden rounded-t-3xl">
              {selectedStore.img ? (
                <img
                  src={selectedStore.img}
                  alt={selectedStore.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ven-yellow to-yellow-500">
                  <span className="text-2xl font-black text-yellow-900 text-center px-4">{selectedStore.name}</span>
                </div>
              )}
              {/* Botón cerrar */}
              <button
                onClick={closeDrawer}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
              {/* Badge descuento sobre imagen */}
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow">
                -{selectedStore.discount}% esta semana
              </span>
            </div>

            {/* Info */}
            <div className="px-5 pt-4 pb-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-xl font-black text-gray-900 leading-tight">{selectedStore.name}</h2>
                <span className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${selectedStore.plan === 'premium' ? 'bg-ven-yellow text-yellow-900' : 'bg-gray-100 text-gray-600'}`}>
                  {selectedStore.plan === 'premium' ? '⭐ Premium' : 'Básico'}
                </span>
              </div>

              <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                <MapPin size={13} className="shrink-0 text-gray-400" />
                {selectedStore.neighborhood || selectedStore.location}
                <span className="text-gray-300">·</span>
                <Star size={13} className="text-ven-yellow shrink-0" fill="currentColor" />
                <span className="font-semibold text-gray-700">{selectedStore.rating?.toFixed(1) ?? '—'}</span>
              </p>

              {selectedStore.tags && selectedStore.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedStore.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => { closeDrawer(); navigate(`/tienda/${selectedStore.id}`); }}
                className="w-full bg-[#8B1A1A] text-white font-black text-center py-4 rounded-2xl active:scale-[0.98] transition-all text-sm tracking-wide shadow-lg shadow-[#8B1A1A]/25"
              >
                Ver local y pedir →
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── CAMBIO 4: Filtros bottom sheet ───────────────────────────────────── */}
      {filtersOpen && (
        <div className="fixed inset-0 bg-black/30 z-[1000]" onClick={() => setFiltersOpen(false)} />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${filtersOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div className="px-5 pt-5 pb-8">
          {/* Handle + header */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-gray-900">Filtros</h3>
            <button onClick={() => setFiltersOpen(false)}>
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* ORDENAR */}
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Ordenar</p>
          <div className="flex gap-2 mb-5">
            {(['rating', 'discount', 'distance'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setPendingSort(opt)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${pendingSort === opt ? 'bg-ven-yellow border-yellow-400 text-black' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                {opt === 'rating' ? 'Mejor rating' : opt === 'discount' ? 'Mayor descuento' : 'Distancia'}
              </button>
            ))}
          </div>

          {/* CATEGORÍAS */}
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Categorías</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {CATEGORIAS.map(cat => {
              const active = pendingCategoria === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setPendingCategoria(active ? null : cat.label)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all ${active ? 'border-ven-yellow bg-ven-yellow/10' : 'border-gray-200 bg-gray-50'}`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-[10px] font-bold text-gray-700 leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* BARRIOS */}
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Barrio</p>
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {BARRIOS.map(b => {
              const active = pendingBarrio === b;
              return (
                <button
                  key={b}
                  onClick={() => setPendingBarrio(active ? null : b)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${active ? 'border-ven-yellow bg-ven-yellow/10 text-black' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
                >
                  {b}
                </button>
              );
            })}
          </div>

          {/* TIPO */}
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tipo</p>
          <div className="flex gap-2 mb-6">
            {(['comida', 'productos'] as const).map(t => {
              const active = pendingTipo === t;
              return (
                <button
                  key={t}
                  onClick={() => setPendingTipo(active ? null : t)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border capitalize transition-all ${active ? 'bg-ven-yellow border-yellow-400 text-black' : 'bg-white border-gray-200 text-gray-600'}`}
                >
                  {t === 'comida' ? 'Comida preparada' : 'Productos'}
                </button>
              );
            })}
          </div>

          {/* Footer acciones */}
          <div className="flex gap-3">
            <button
              onClick={clearFilters}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Limpiar filtros
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-3.5 rounded-2xl bg-ven-yellow text-black font-black text-sm hover:bg-yellow-400 active:scale-95 transition-all"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LocalesMapView;
