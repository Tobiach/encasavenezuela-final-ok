import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Star, Navigation, ChevronRight, Phone } from 'lucide-react';
import { PartnerStore } from '../types';
import { LOCALES_INVESTIGADOS } from '../data/localesInvestigados';

// Fix Leaflet default icon broken en Vite/Webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Iconos personalizados por plan ──────────────────────────────────────────
function createPinIcon(plan: 'premium' | 'basic') {
  const color = plan === 'premium' ? '#FCD34D' : '#9CA3AF';
  const border = plan === 'premium' ? '#F59E0B' : '#6B7280';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
        fill="${color}" stroke="${border}" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

// Pin azul para locales investigados (aún no en EnCasa)
const PIN_INVESTIGADO = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
        fill="#DBEAFE" stroke="#3B82F6" stroke-width="2.5"/>
      <circle cx="16" cy="16" r="5" fill="#3B82F6" opacity="0.85"/>
    </svg>`,
  className: '',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -38],
});

// ── Componente para re-centrar mapa desde búsqueda ───────────────────────────
const FlyToLocation: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 15, { duration: 1.2 });
  }, [coords, map]);
  return null;
};

// ── Props ────────────────────────────────────────────────────────────────────
interface LocalesMapViewProps {
  stores: PartnerStore[];
}

const CABA_CENTER: [number, number] = [-34.6037, -58.3816];

const LocalesMapView: React.FC<LocalesMapViewProps> = ({ stores }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showInvestigados, setShowInvestigados] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const storesWithCoords = stores.filter(s => s.lat != null && s.lng != null);

  // ── Geocodificar con Nominatim (OpenStreetMap, gratis) ───────────────────
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    setSearchError('');
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Buenos Aires, Argentina')}&format=json&limit=1&countrycodes=ar`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
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
    if (!navigator.geolocation) {
      setSearchError('Tu navegador no soporta geolocalización.');
      return;
    }
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFlyTo([pos.coords.latitude, pos.coords.longitude]);
        setSearching(false);
      },
      () => {
        setSearchError('No pudimos obtener tu ubicación.');
        setSearching(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-4 pt-6 pb-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-3 mb-5">
            <div className="bg-ven-yellow/10 p-2.5 rounded-xl shrink-0 mt-0.5">
              <MapPin size={22} className="text-ven-yellow" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                Locales Venezolanos en CABA
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {storesWithCoords.length} locales activos · EnCasa Venezuela
              </p>
            </div>
          </div>

          {/* Buscador */}
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
          </div>

          {searchError && (
            <p className="text-red-500 text-xs font-medium mt-2 px-1">{searchError}</p>
          )}

          {/* Leyenda + toggle investigados */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-0 bg-white border border-gray-100 rounded-xl shadow-sm w-fit px-3 py-2">
              <div className="flex items-center gap-1.5 pr-3">
                <span className="w-3 h-3 rounded-full bg-ven-yellow inline-block shadow-sm shadow-yellow-400/40 shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Premium</span>
              </div>
              <div className="w-px h-4 bg-gray-200 mx-0" />
              <div className="flex items-center gap-1.5 px-3">
                <span className="w-3 h-3 rounded-full bg-gray-400 inline-block shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Básico</span>
              </div>
              <div className="w-px h-4 bg-gray-200 mx-0" />
              <div className="flex items-center gap-1.5 pl-3">
                <span className="w-3 h-3 rounded-full bg-blue-200 border-2 border-blue-500 inline-block shrink-0" />
                <span className="text-xs font-semibold text-gray-700">Ecosistema</span>
              </div>
            </div>
            <button
              onClick={() => setShowInvestigados(v => !v)}
              className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all ${showInvestigados ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-400'}`}
            >
              {showInvestigados ? '👁 Ocultar ecosistema' : '👁 Mostrar ecosistema'}
            </button>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="px-4 pt-4 pb-2 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200" style={{ height: '55vh', minHeight: 320 }}>
          <MapContainer
            center={CABA_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToLocation coords={flyTo} />

            {showInvestigados && LOCALES_INVESTIGADOS.map((local) => (
              <Marker
                key={local.id}
                position={[local.lat, local.lng]}
                icon={PIN_INVESTIGADO}
              >
                <Popup minWidth={210} className="encasa-popup">
                  <div style={{ fontFamily: 'system-ui, sans-serif', padding: '4px 2px' }}>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{
                        background: '#DBEAFE',
                        color: '#1D4ED8',
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: '0.15em',
                        padding: '2px 8px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                      }}>
                        🔵 Ecosistema venezolano
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>
                      {local.nombre}
                    </h3>
                    <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                      📍 {local.direccion} · {local.barrio}
                    </p>
                    {local.telefono && (
                      <p style={{ margin: '0 0 8px', fontSize: 11, color: '#374151' }}>
                        📞 {local.telefono}
                      </p>
                    )}
                    {local.notas && (
                      <p style={{ margin: '0 0 8px', fontSize: 10, color: '#9CA3AF', fontStyle: 'italic' }}>
                        {local.notas}
                      </p>
                    )}
                    <div style={{
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      textAlign: 'center',
                      padding: '6px 0',
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 10,
                      letterSpacing: '0.06em',
                    }}>
                      AÚN NO EN ENCASA · POTENCIAL LEAD
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {storesWithCoords.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat!, store.lng!]}
                icon={createPinIcon(store.plan)}
              >
                <Popup
                  minWidth={220}
                  className="encasa-popup"
                >
                  <div style={{ fontFamily: 'system-ui, sans-serif', padding: '4px 2px' }}>
                    {/* Badge plan */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{
                        background: store.plan === 'premium' ? '#FCD34D' : '#E5E7EB',
                        color: store.plan === 'premium' ? '#78350F' : '#6B7280',
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: '0.15em',
                        padding: '2px 8px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                      }}>
                        {store.plan === 'premium' ? '⭐ Premium' : 'Básico'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ color: '#F59E0B', fontSize: 12 }}>★</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{store.rating?.toFixed(1) ?? '—'}</span>
                      </div>
                    </div>

                    {/* Nombre */}
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>
                      {store.name}
                    </h3>

                    {/* Barrio */}
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>📍</span> {store.neighborhood || store.location}
                    </p>

                    {/* Tags */}
                    {store.tags && store.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                        {store.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ background: '#F3F4F6', color: '#374151', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 12 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <a
                      href={`/#/catalog?store=${store.id}`}
                      style={{
                        display: 'block',
                        background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
                        color: '#78350F',
                        textAlign: 'center',
                        padding: '8px 0',
                        borderRadius: 12,
                        fontWeight: 900,
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                      }}
                    >
                      Ver local →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Lista de locales debajo del mapa */}
      <div className="px-4 pt-4 pb-6 max-w-5xl mx-auto">
        <h2 className="text-base font-bold text-gray-700 mb-3 px-1">
          Locales en EnCasa ({storesWithCoords.length})
        </h2>
        {storesWithCoords.length === 0 ? (
          <p className="text-sm text-gray-400 px-1">No hay locales registrados todavía.</p>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {storesWithCoords.map(store => (
                <a
                  key={store.id}
                  href={`/#/catalog?store=${store.id}`}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: store.plan === 'premium' ? '#FCD34D' : '#9CA3AF' }}
                  />
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
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista ecosistema venezolano investigado */}
      <div className="px-4 pt-2 pb-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-gray-700">
            Ecosistema venezolano en CABA ({LOCALES_INVESTIGADOS.length})
          </h2>
          <span className="text-xs text-blue-500 font-semibold bg-blue-50 px-2 py-1 rounded-lg">Leads potenciales</span>
        </div>
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {LOCALES_INVESTIGADOS.map(local => (
              <div
                key={local.id}
                className="flex items-center gap-3 px-4 py-4"
              >
                <div className="w-3 h-3 rounded-full shrink-0 bg-blue-200 border-2 border-blue-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 font-bold text-sm truncate">{local.nombre}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} className="shrink-0" />
                    {local.direccion} · {local.barrio}
                    {local.telefono && (
                      <>
                        <span className="text-gray-300">·</span>
                        <Phone size={10} className="shrink-0" />
                        {local.telefono}
                      </>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0 capitalize">{local.tipo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default LocalesMapView;
