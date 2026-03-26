# ARCHITECTURE.md — Estructura técnica de EnCasa Venezuela

## Frontend

```
src/
  App.tsx          — router principal, feature flags, estado del carrito
  main.tsx         — punto de entrada
  index.css        — estilos globales (Tailwind v4)
  assets/

components/        — todos los componentes de UI
  Hero.tsx
  Categories.tsx / CategoriesNew.tsx
  Offers.tsx       — cards de sección + Combos Relámpago
  Promotions.tsx   — Combos Especiales
  PartnerStores.tsx
  CatalogView.tsx
  ProductDetailView.tsx
  PromotionDetailView.tsx
  Navbar.tsx / Footer.tsx
  ...

lib/
  supabase.ts      — cliente Supabase + getImageUrl()
  hooks/
    useProducts.ts — productos + combos con 3-layer fallback
    useStores.ts   — locales con 3-layer fallback

data/
  fallbackProducts.ts  — datos estáticos de último recurso
  fallbackStores.ts

types/             — tipos TypeScript compartidos
scripts/           — scripts de setup de tablas en Supabase (tsx)
```

---

## Patrón de componentes

Todos los componentes son funcionales con React hooks. No hay context global ni Redux.

**Patrón de datos en componentes:**
```tsx
const { allProducts, promoCombos } = useProducts();
const { stores } = useStores();
// render inmediato con fallback — nunca pantalla vacía
```

**No existe** un componente padre que inyecte props de datos. Cada componente llama al hook directamente. El hook tiene caché de módulo: el fetch ocurre una sola vez por sesión.

---

## Flujo de datos: UI → Hook → Supabase → WhatsApp

```
Usuario abre la app
       ↓
Hook lee getBestAvailable()
  → si _cache existe → datos inmediatos
  → si no → localStorage → si no → FALLBACK_PRODUCTS
       ↓
fetchProducts() dispara (async, no bloquea render)
  → Supabase responde → actualiza _cache → setState → re-render
       ↓
Usuario navega a producto / combo
       ↓
onClick → navigate('/catalog') o navigate('/promotion/:id')
       ↓
Usuario arma pedido
       ↓
Link de WhatsApp generado → abre app de WhatsApp
```

---

## Caché de módulo en hooks

```ts
let _cache: Product[] | null = null;
let _cacheSource: 'supabase' | 'cache' | 'fallback' = 'fallback';
let _promise: Promise<void> | null = null;
```

- `_cache`: datos en memoria mientras la app está abierta
- `_promise`: previene fetches duplicados si varios componentes montan al mismo tiempo
- **Bug conocido**: si `_promise` queda como Promise rechazada, bloquea todos los fetches futuros. Fix: `_promise = null` en el bloque `catch`.

---

## Imágenes

```ts
import { getImageUrl } from '../lib/supabase';
// Uso:
getImageUrl('harinas1.png')
// → https://<project>.supabase.co/storage/v1/object/public/imagenes/harinas1.png
```

El bucket `imagenes` suele estar disponible incluso cuando la DB falla. Las imágenes del fallback usan `getImageUrl()` también.

---

## Criterio para hacer cambios seguros

1. **Leer el archivo antes de editar** — nunca proponer cambios a ciegas
2. **Ediciones puntuales > reescrituras** — cambiar lo mínimo necesario
3. **No tocar hooks de datos sin entender el fallback** — un error en useProducts rompe toda la app
4. **Probar en mobile** — los problemas de touch no aparecen en desktop
5. **Tailwind arbitrario puede no generar** — usar `style={{ ... }}` inline para valores críticos
6. **Verificar tipos antes de commit** — `npx tsc --noEmit`

---

## Cómo evitar refactors innecesarios

- Si el componente funciona, no reorganizarlo
- Si la lógica es repetitiva pero funciona, no abstraerla a menos que se use 3+ veces
- Los hooks no necesitan ser "perfectos" — necesitan ser predecibles
- No agregar librerías de terceros sin necesidad clara (el stack ya está definido)
- No cambiar el router ni el entry point de la app
