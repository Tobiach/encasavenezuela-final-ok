# 📊 PLAN: MIGRACIÓN A GOOGLE ANALYTICS 4

**Última actualización:** 27 marzo 2026 | **Owner:** Freedom
**Estado:** PLAN — NO implementar hasta semana 2 de abril 2026
**Prioridad:** Media (después de fix imágenes + PromotionDetailView)

---

## 1. POR QUÉ MIGRAR DE LOCALSTORAGE A GA4

### El problema con el sistema actual (encasaTrack + localStorage)

| Limitación | Impacto |
|-----------|---------|
| Datos atrapados en el browser del usuario | No podemos ver datos agregados en tiempo real |
| Se pierden al limpiar caché o cambiar dispositivo | Datos incompletos, sub-conteo de eventos |
| No hay dashboard — solo JSON en consola | No podemos ver tendencias sin código |
| Sin geolocalización | No sabemos desde qué barrios de CABA ordenan |
| Sin info de dispositivo | No sabemos si el problema es mobile o desktop |
| No sirve para inversores | Nadie toma GA en localStorage en serio |

### Por qué GA4 específicamente

- **Costo:** $0 (free tier cubre hasta 10M eventos/mes — sobrado para nosotros)
- **Dashboard listo:** Sin construir nada custom
- **Funnels de conversión:** Ver exactamente dónde se caen los usuarios
- **Audiencias:** Crear segmentos (usuarios que agregaron al carrito pero no compraron)
- **Inversores:** Los inversores piden GA como primer dato de traction
- **Integración futura:** Looker Studio, Firebase, Google Ads conectan directo

### Por qué no Mixpanel o Posthog ahora
- Mixpanel: $0 hasta 20K usuarios/mes, pero más complejo de setup y la UI es menos conocida
- Posthog: Excelente pero overkill para mes 1 con 15 locales
- **Decisión:** GA4 en mes 1 (gratis, conocido), Posthog en mes 3-4 si queremos product analytics avanzado

---

## 2. SETUP PASO A PASO

### Paso 1 — Crear cuenta GA4 (15 minutos)

1. Ir a [analytics.google.com](https://analytics.google.com)
2. Crear cuenta: `EnCasa Venezuela`
3. Crear propiedad: `EnCasa Venezuela - Producción`
4. Configuración de negocio:
   - Industria: `Alimentación`
   - Tamaño: `Pequeña (1-10 empleados)`
   - Objetivos: `Generar leads` + `Examinar comportamiento del usuario`
5. Configurar stream web:
   - URL: `encasavenezuela-final-ok.vercel.app`
   - Nombre del stream: `Web App`
6. **Copiar el Measurement ID** — formato: `G-XXXXXXXXXX`

### Paso 2 — Variables de entorno (5 minutos)

Agregar al `.env.local`:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Agregar al Vercel Dashboard → Settings → Environment Variables:
- Key: `VITE_GA_MEASUREMENT_ID`
- Value: `G-XXXXXXXXXX`
- Environments: Production + Preview + Development

### Paso 3 — Instalar gtag (30 minutos)

**Opción A — Via index.html (más simple, recomendada para ahora):**

En `index.html`, agregar en `<head>`:
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href,
  });
</script>
```

**Reemplazar `G-XXXXXXXXXX` con el Measurement ID real.**

**Opción B — Via módulo npm (más limpio, para después):**
```bash
npm install gtag
```

Pero la Opción A es suficiente para mes 1 y no requiere cambios en el código de React.

### Paso 4 — Wrapper helper (30 minutos)

Crear `src/lib/analytics.ts`:

```typescript
// src/lib/analytics.ts
// Wrapper sobre GA4 + encasaTrack (localStorage)
// Mantiene ambos activos durante el período de transición

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    encasaTrack: (event: string, data: Record<string, unknown>) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  // 1. Trackear en GA4
  if (typeof window.gtag !== 'undefined' && GA_ID) {
    window.gtag('event', eventName, params);
  }

  // 2. Mantener encasaTrack local como backup
  if (typeof window.encasaTrack !== 'undefined') {
    window.encasaTrack(eventName, params);
  }
};

// Page view manual (para HashRouter — GA4 no lo detecta automáticamente)
export const trackPageView = (path: string) => {
  if (typeof window.gtag !== 'undefined' && GA_ID) {
    window.gtag('config', GA_ID, {
      page_path: path,
      page_location: window.location.origin + '/' + path,
    });
  }
};
```

**IMPORTANTE — HashRouter y GA4:**
GA4 no detecta cambios de ruta en HashRouter (`/#/catalog`) automáticamente. Necesitamos el `trackPageView` manual. Agregarlo en `ScrollManager` en `App.tsx`:

```typescript
// Dentro de ScrollManager, después del useEffect de scroll existente
useEffect(() => {
  trackPageView(pathname);
}, [pathname]);
```

---

## 3. MIGRACIÓN DE LOS 5 EVENTOS ACTUALES

### Mapeo exacto: encasaTrack → GA4

#### Evento 1: `add_to_cart`

**Actual (encasaTrack):**
```typescript
encasaTrack('add_to_cart', {
  product_id: p.id,
  product_name: p.name,
  price: p.price,
  store_id: sId,
  qty: newQty,
})
```

**GA4 equivalente (evento de e-commerce estándar):**
```typescript
trackEvent('add_to_cart', {
  currency: 'ARS',
  value: p.price * newQty,
  items: [{
    item_id: String(p.id),
    item_name: p.name,
    item_category: p.category,
    price: p.price,
    quantity: newQty,
    item_brand: sId, // usamos el store como "brand"
  }]
})
```

**Por qué usar el esquema de e-commerce de GA4:**
GA4 tiene reportes de e-commerce pre-construidos (funnel de conversión, productos populares, revenue) que funcionan SOLO si usás sus nombres de parámetros estándar (`items`, `value`, `currency`).

---

#### Evento 2: `checkout_initiated`

**Actual (encasaTrack):**
```typescript
win.encasaTrack?.('checkout_initiated', {
  cart_total: ...,
  items_count: ...,
  store_id: ...,
})
```

**GA4 equivalente:**
```typescript
trackEvent('begin_checkout', {
  currency: 'ARS',
  value: cartTotal,
  items: cart.map(i => ({
    item_id: String(i.product.id),
    item_name: i.product.name,
    item_category: i.product.category,
    price: i.product.price,
    quantity: i.qty,
    item_brand: i.product.storeId,
  }))
})
```

**Nombre GA4:** `begin_checkout` es el nombre estándar de GA4 para este evento. Usarlo activa el funnel de e-commerce automáticamente.

---

#### Evento 3: `checkout_whatsapp_click`

**Actual (encasaTrack):**
```typescript
encasaTrack("checkout_whatsapp_click", {
  cartTotal: total,
  itemsCount: ...,
  source: "checkout",
})
```

**GA4 equivalente (evento custom):**
```typescript
trackEvent('whatsapp_checkout_click', {
  currency: 'ARS',
  value: total,
  store_id: storeId,
  fulfillment_method: formData.fulfillmentMethod,
  payment_method: formData.paymentMethod,
})
```

**Nota:** No es un evento estándar de GA4, pero el nombre `whatsapp_checkout_click` es descriptivo y aparece en "Eventos" en el dashboard.

---

#### Evento 4: `checkout_whatsapp_sent` (order_completed)

**Actual (encasaTrack):**
```typescript
encasaTrack("checkout_whatsapp_sent", {
  cartTotal: total,
  itemsCount: ...,
  source: "checkout",
})
```

**GA4 equivalente (evento de e-commerce estándar):**
```typescript
trackEvent('purchase', {
  transaction_id: orderId || `order_${Date.now()}`,
  currency: 'ARS',
  value: total,
  items: cart.map(i => ({
    item_id: String(i.product.id),
    item_name: i.product.name,
    price: i.product.price,
    quantity: i.qty,
    item_brand: i.product.storeId,
  }))
})
```

**Por qué `purchase`:** GA4 calcula revenue automáticamente, muestra en el dashboard de e-commerce, y permite ver conversión add_to_cart → purchase en un solo reporte.

---

#### Evento 5: `store_view`

**Actual (encasaTrack):**
```typescript
win.encasaTrack?.('store_view', {
  store_id: selectedStore.id,
  store_name: selectedStore.name,
})
```

**GA4 equivalente:**
```typescript
trackEvent('view_item_list', {
  item_list_id: selectedStore.id,
  item_list_name: selectedStore.name,
})
```

`view_item_list` es el evento estándar de GA4 para "ver un catálogo o lista". Aparece en reportes de e-commerce.

---

## 4. EVENTOS ADICIONALES A AGREGAR

Basado en `@docs/business/metrics.md` — eventos que faltan para completar el funnel:

### Eventos de alta prioridad

```typescript
// Cuando usuario ve un producto en detalle
trackEvent('view_item', {
  currency: 'ARS',
  value: product.price,
  items: [{ item_id: String(product.id), item_name: product.name, ... }]
})

// Cuando usuario busca algo
trackEvent('search', {
  search_term: searchQuery,
})

// Cuando usuario quita un producto del carrito
trackEvent('remove_from_cart', {
  currency: 'ARS',
  value: product.price * qty,
  items: [{ item_id: String(product.id), ... }]
})

// Cuando el pedido es para retiro (vs delivery)
trackEvent('select_fulfillment_method', {
  fulfillment_method: 'pickup' | 'delivery',
  store_id: storeId,
})
```

### Eventos de media prioridad (mes 2)

```typescript
// Cuando usuario visita página de un local pero NO agrega nada
// (requiere lógica adicional — timer o evento de salida)
trackEvent('store_view_no_action', {
  store_id: storeId,
  time_spent_seconds: timeOnPage,
})

// Cuando usuario abandona el checkout
// (requiere beforeunload listener)
trackEvent('checkout_abandoned', {
  cart_total: total,
  step: 'filling_form' | 'reviewing',
})
```

---

## 5. DASHBOARD RECOMENDADO EN GA4

### Reports a configurar en GA4

**Report 1 — Funnel de conversión (más importante)**
```
store_view → add_to_cart → begin_checkout → whatsapp_checkout_click → purchase

Preguntas que responde:
- ¿En qué paso se caen más usuarios?
- ¿Cuál es la tasa de conversión end-to-end?
- ¿Qué locales tienen mejor conversión?
```

**Report 2 — Revenue dashboard**
```
Métricas: total revenue (value en purchase), pedidos (count de purchase), AOV
Dimensiones: por local (item_brand), por semana, por dispositivo
```

**Report 3 — Productos populares**
```
Usar "Items" en reportes de e-commerce
Ordenar por: add_to_cart count, purchase count
```

**Report 4 — Adquisición**
```
Source/Medium: ver de dónde vienen los usuarios
- direct → acceden directo (link compartido, QR)
- organic → Google
- social → Instagram, Facebook
```

### Explorations a crear (GA4 → Explore)

**Funnel Exploration:**
- Paso 1: `session_start`
- Paso 2: `store_view`
- Paso 3: `add_to_cart`
- Paso 4: `begin_checkout`
- Paso 5: `purchase`

---

## 6. CONFIGURACIÓN DE CONVERSIONES EN GA4

En GA4 → Admin → Conversions, marcar como conversiones:
1. `purchase` → conversión principal (pedido completado)
2. `begin_checkout` → conversión secundaria (intención alta)
3. `whatsapp_checkout_click` → micro-conversión

Esto permite ver "Conversion Rate" en todos los reportes.

---

## 7. CÓDIGO COMPLETO LISTO PARA COPIAR

### `index.html` — agregar en `<head>`:
```html
<!-- Google Analytics 4 — agregar con Measurement ID real -->
<script async src="https://www.googletagmanager.com/gtag/js?id=VITE_GA_PLACEHOLDER"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  // El config real se hace desde analytics.ts con el ID de env
</script>
```

**Nota:** No hardcodear el ID en index.html. Inicializar desde `analytics.ts` leyendo `import.meta.env.VITE_GA_MEASUREMENT_ID`.

### Inicialización en `main.tsx`:
```typescript
// En main.tsx, agregar antes de ReactDOM.createRoot:
import { initAnalytics } from './lib/analytics';
initAnalytics(); // configura gtag con el ID del env
```

### Función `initAnalytics` en `src/lib/analytics.ts`:
```typescript
export const initAnalytics = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!gaId) {
    console.warn('[Analytics] VITE_GA_MEASUREMENT_ID no configurado');
    return;
  }

  // Cargar script de GA4 dinámicamente
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Inicializar dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    send_page_view: false, // lo manejamos manualmente por HashRouter
  });
};
```

---

## 8. TIMELINE DE IMPLEMENTACIÓN

```
Total estimado: 3-4 horas de trabajo continuo

Hora 1 (setup):
  - Crear cuenta GA4 + obtener Measurement ID
  - Agregar VITE_GA_MEASUREMENT_ID a .env.local y Vercel
  - Implementar initAnalytics() en main.tsx

Hora 2 (tracking base):
  - Crear src/lib/analytics.ts completo
  - Implementar trackPageView en ScrollManager (App.tsx)
  - Verificar pageviews en GA4 Real-time

Hora 3 (migración de eventos):
  - Migrar los 5 eventos existentes usando trackEvent()
  - Mapear add_to_cart → add_to_cart GA4
  - Mapear checkout_initiated → begin_checkout
  - Mapear order_completed → purchase

Hora 4 (validación + dashboard):
  - Testear cada evento en GA4 Real-time → Events
  - Crear Funnel Exploration en GA4
  - Marcar conversiones (purchase, begin_checkout)
  - Deploy a producción
```

---

## 9. CRITERIOS PARA IMPLEMENTAR (cuándo hace sentido)

Implementar GA4 cuando se cumpla UNO de estos criterios:
- [ ] Tenemos 5+ locales activos (hay suficiente tráfico para que los datos sean útiles)
- [ ] Un inversor o acelerador pide ver métricas de tráfico/conversión
- [ ] El encasaTrack muestra datos anómalos que no podemos explicar (problema de calidad de datos)

**No implementar antes** porque: tenemos cero tiempo disponible y los datos de localStorage son suficientes para las decisiones de mes 1.

---

## 10. ALTERNATIVA RÁPIDA — GA4 sin código (Google Tag Manager)

Si querés activar GA4 esta semana sin tocar código:

1. Crear cuenta en Google Tag Manager
2. Agregar `<script>` de GTM en `index.html`
3. Configurar GA4 tag desde la UI de GTM (sin código)
4. Publicar desde GTM

**Pros:** Cero cambios en React, activable en 1 hora
**Contras:** Los eventos custom (add_to_cart, etc.) igual requieren código o DataLayer
**Recomendación:** GTM para pageviews básicos esta semana, código completo en semana 2-3

---

*Documento v1.0 — Este es un PLAN, no una implementación. Implementar en semana 2 de abril según prioridades.*
