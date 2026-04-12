import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Star, Navigation } from 'lucide-react';
import { PartnerStore } from '../types';

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
    <div className="min-h-screen bg-venezuela-dark">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 max-w-5xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            🗺️ Locales Venezolanos
            <span className="block text-ven-yellow text-lg font-bold mt-0.5">en CABA</span>
          </h1>
          <p className="text-gray-500 text-xs font-medium mt-1">
            {storesWithCoords.length} locales activos · EnCasa Venezuela
          </p>
        </div>

        {/* Buscador */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar barrio o dirección…"
              className="w-full pl-9 pr-4 py-3 bg-white/8 border border-white/10 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-ven-yellow/50 focus:bg-white/10 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-3 bg-ven-yellow text-venezuela-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-50 shrink-0"
          >
            {searching ? '…' : 'Ir'}
          </button>
          <button
            onClick={handleLocateMe}
            title="Usar mi ubicación"
            className="px-3 py-3 bg-white/8 border border-white/10 rounded-2xl text-gray-400 hover:text-ven-yellow hover:border-ven-yellow/40 active:scale-95 transition-all shrink-0"
          >
            <Navigation size={16} />
          </button>
        </div>

        {searchError && (
          <p className="text-red-400 text-xs font-medium mt-2 px-1">{searchError}</p>
        )}

        {/* Leyenda */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-ven-yellow inline-block shadow-sm shadow-yellow-500/40" />
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-500 inline-block" />
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Básico</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="px-4 pb-8 max-w-5xl mx-auto">
        <div className="rounded-[28px] overflow-hidden border border-white/8 shadow-2xl" style={{ height: '62vh', minHeight: 380 }}>
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
                      href="/#/partners"
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

        {/* Lista de locales debajo del mapa — mobile friendly */}
        <div className="mt-6">
          <h2 className="text-white font-black text-sm uppercase tracking-widest mb-3 px-1">
            Todos los locales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {storesWithCoords.map(store => (
              <a
                key={store.id}
                href="/#/partners"
                className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3 hover:border-ven-yellow/30 hover:bg-white/8 transition-all active:scale-[0.98]"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: store.plan === 'premium' ? '#FCD34D' : '#9CA3AF' }}
                />
                <div className="min-w-0">
                  <p className="text-white font-black text-sm truncate">{store.name}</p>
                  <p className="text-gray-500 text-[10px] font-medium flex items-center gap-1">
                    <MapPin size={9} /> {store.neighborhood || store.location}
                    <span className="mx-1 text-white/20">·</span>
                    <Star size={9} className="text-ven-yellow" /> {store.rating?.toFixed(1) ?? '—'}
                  </p>
                </div>
                <span className="ml-auto text-gray-600 text-[10px] font-black uppercase tracking-wider shrink-0">
                  {store.plan === 'premium' ? '⭐' : ''}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalesMapView;
