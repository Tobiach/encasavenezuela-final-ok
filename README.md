<div align="center">

# 🇻🇪 EnCasa Venezuela

**El marketplace digital especializado en productos venezolanos en Argentina**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/encasa-final-ok)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://encasavenezuela-final-ok.vercel.app)

</div>

---

## El Problema

Más de **200,000 venezolanos viven en Argentina**. Buscan sus productos culturales — hallacas, chicha de maíz, mondongo, empanadas criollas — y no los encuentran en supermercados ni en plataformas generales como Rappi o PedidosYa.

Los locales venezolanos existen, pero:
- No tienen presencia digital centralizada
- Pagan comisiones del 25–30% en plataformas generalistas (Rappi/PedidosYa)
- No pueden competir con restaurantes grandes en esas plataformas
- No tienen herramientas de marketing ni analytics

**Resultado:** Una comunidad de 200K personas sin plataforma propia, y 30–50 locales venezolanos en CABA sin acceso digital real.

---

## La Solución

EnCasa Venezuela conecta locales físicos venezolanos con su comunidad a través de una plataforma especializada con:

- **Marketplace centralizado** — todos los locales y productos venezolanos en un solo lugar
- **Checkout vía WhatsApp** — sin fricción, sin apps, sin registro obligatorio
- **Comisión 50% más baja** — 12% vs 25–30% de la competencia
- **Marketing incluido** — posicionamiento, analytics, redes sociales, QR físico para el local
- **Identidad cultural** — diseñado para venezolanos, con lenguaje, productos y colores propios

---

## Actores del Sistema

### Usuarios Finales (Clientes)
- Venezolanos en Argentina buscando productos de su cultura
- Argentinos curiosos por comida venezolana
- **Flujo:** Navegan el catálogo → agregan al carrito → confirman por WhatsApp → reciben pedido

### Comerciantes (Locales)
- Dueños de restaurantes, areperas, bodegas venezolanas en CABA
- **Flujo:** Se registran → cargan productos → reciben pedidos por WhatsApp → gestionan desde dashboard

### Stakeholders
| Actor | Interés |
|-------|---------|
| Fundadores (Freedom + Muñeca) | Revenue, validación de mercado, equity |
| Locales venezolanos | Más ventas, menor comisión, visibilidad digital |
| Comunidad venezolana | Acceso a productos culturales |
| Inversores futuros | Escalabilidad a LATAM, primer mover en nicho |

---

## Modelo de Financiamiento

La plataforma se financia con un **modelo freemium por suscripción + comisión por transacción**:

| Plan | Fee Mensual | Comisión | Para quién |
|------|-------------|----------|------------|
| **Básico** | $0 | 12% por pedido | Locales pequeños |
| **Pro** | ~$50 USD/mes | 6% por pedido | Locales medianos |
| **Premium** | ~$85 USD/mes | 4% por pedido | Locales grandes |

**Sin inversión externa en etapa actual** — modelo autosustentable desde el primer mes.  
**Proyección:** Breakeven en mes 2 con 20–25 locales activos.

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS v4, Vite |
| Router | React Router v7 (HashRouter) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Hosting | Vercel (CI/CD automático) |
| Integraciones | Notion API, Make (WhatsApp), Twilio |
| Analytics | Sistema propio con `encasaTrack()` + localStorage |
| Mapas | Leaflet + React-Leaflet |
| Animaciones | Framer Motion |

---

## Instalación y Uso Local

### Prerrequisitos
- Node.js 18+
- Cuenta en Supabase (gratuita)
- Variables de entorno configuradas

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/encasa-final-ok.git
cd encasa-final-ok
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_GEMINI_API_KEY=tu-gemini-key  # Opcional - para PanaChef AI
```

### 4. Levantar la aplicación

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

### 5. (Opcional) Configurar base de datos

```bash
# Setup tabla de locales
npx tsx scripts/setup-stores-table.ts

# Migrar productos
npx tsx scripts/migrate-products.ts
```

---

## Demo en Vivo

**URL:** [encasavenezuela-final-ok.vercel.app](https://encasavenezuela-final-ok.vercel.app)

### Flujo principal a demostrar:
1. Abrir la plataforma → ver marketplace de locales venezolanos
2. Seleccionar un local → ver catálogo de productos
3. Agregar productos al carrito → ver monto mínimo y resumen
4. Ir al checkout → confirmar pedido vía WhatsApp
5. Ver mapa de locales con filtros y zonas de cobertura

---

## Estructura del Proyecto

```
encasa-final-ok/
├── src/
│   ├── App.tsx              # Router principal, feature flags
│   └── main.tsx             # Entry point
├── components/
│   ├── CatalogView.tsx      # Marketplace principal
│   ├── StoreMapView.tsx     # Detalle de local
│   ├── OrderConfirmationView.tsx  # Checkout
│   ├── LocalesMapView.tsx   # Mapa interactivo de locales
│   └── ...                  # 30+ componentes
├── data/
│   └── lib/supabase.ts      # Cliente Supabase
├── lib/
│   ├── hooks.ts             # useStores(), useProducts()
│   └── utils.ts             # Helpers
├── api/
│   └── notify-notion.ts     # Webhook Notion (pedidos)
└── scripts/                 # Scripts de base de datos
```

---

## Features Principales

- **Marketplace** con catálogo de productos venezolanos por local
- **Carrito** persistente (localStorage) con monto mínimo configurable
- **Checkout WhatsApp** — mensaje automático formateado con el pedido
- **Mapa interactivo** de locales con zonas de cobertura y filtros
- **QR Físico** para locales — escanear desde el local abre la tienda directa
- **Modal de bienvenida** al escanear QR con captura de lead
- **Variant picker** para productos con peso/cantidad
- **Analytics propio** con eventos trackeados (`add_to_cart`, `checkout_initiated`, etc.)
- **Hero carousel** con promociones destacadas

---

## Roadmap

- [x] MVP funcional con checkout WhatsApp
- [x] Integración Supabase (stores + products)
- [x] Mapa de locales con filtros
- [x] Sistema de analytics básico
- [ ] Dashboard de métricas para locales
- [ ] Migración completa de datos hardcodeados a Supabase
- [ ] Sistema de pagos online (Mercado Pago)
- [ ] Autenticación de usuarios
- [ ] Expansión a Córdoba y Rosario

---

## Equipo

| Rol | Responsabilidad |
|-----|----------------|
| **Freedom** (Founder) | Tech, producto, estrategia |
| **Muñeca** (Co-founder) | Ventas, community, contenido |

---

## Licencia

Proyecto privado — todos los derechos reservados © 2026 EnCasa Venezuela.
