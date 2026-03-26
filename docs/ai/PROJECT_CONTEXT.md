# PROJECT_CONTEXT.md — EnCasa Venezuela

## Qué es

EnCasa Venezuela es una plataforma de e-commerce mobile-first que conecta a la comunidad venezolana en Argentina con tiendas y productos venezolanos. Funciona como directorio de locales + catálogo de productos + checkout directo por WhatsApp.

No es una app de delivery propia: el cierre de la venta ocurre vía WhatsApp con cada local aliado.

---

## Objetivo del negocio

1. Que el usuario encuentre productos venezolanos rápido
2. Que el usuario contacte al local con el menor rozamiento posible
3. Que los locales aliados reciban pedidos claros y bien armados
4. Construir comunidad y recompra habitual

---

## Experiencia esperada

El usuario debe sentir que está en una app tipo Rappi o PedidosYa, pero especializada. La primera pantalla debe resolver en menos de 3 segundos:
- "¿Qué tenés?"
- "¿Dónde puedo comprarlo?"
- "¿Cómo lo pido?"

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS v4 |
| Router | React Router v7 (HashRouter) |
| Backend/DB | Supabase (PostgreSQL) |
| Storage | Supabase Storage (bucket: `imagenes`) |
| Deploy | Vercel |
| Checkout | WhatsApp (link armado desde frontend) |

---

## Componentes clave del home

- `Hero` — portada con CTA principal
- `Categories` — scroll horizontal de categorías
- `Offers` — cards de sección + Combos Relámpago
- `Promotions` — Combos Especiales
- `PartnerStores` — locales aliados
- `Features` — propuesta de valor

---

## Hooks de datos

- `useProducts()` — todos los productos, combos, con 3-layer fallback
- `useStores()` — locales aliados, con 3-layer fallback

**Fallback de datos:** Supabase → snapshot localStorage → archivos estáticos (`fallbackProducts.ts`, `fallbackStores.ts`)

---

## Convenciones críticas

- `stores[].id` = campo `slug` de la tabla (NO el UUID de Supabase)
- `img_path` en DB = nombre de archivo en el bucket (ej: `harinas1.png`)
- Imágenes se acceden via `getImageUrl(img_path)` → URL del bucket
- Feature flags en `src/App.tsx`: `FEATURE_LOYALTY = false`, `FEATURE_RADAR = false`
- PanaChef AI está desactivada (`geminiWorker.ts` retorna stub)
- `.env.local` contiene las keys de Supabase — nunca commitear

---

## Principios del producto

1. **Mobile first, siempre** — si no funciona en celular, no existe
2. **Conversión antes que decoración** — cada elemento debe servir para acercar al usuario al pedido
3. **Claridad sobre completitud** — mejor una sección simple que funciona que una compleja que confunde
4. **Sin fricción táctil** — scroll, tap, CTA: todo debe sentirse nativo
5. **Datos con fallback** — la app no puede mostrar vacío porque Supabase tardó

---

## Restricciones clave

- No hay carrito propio: el checkout es un link de WhatsApp
- No hay autenticación activa en producción (Auth de Supabase preparado pero no habilitado)
- No modificar `lib/supabase.ts` sin revisión
- No modificar `.env.local`
- No hacer `git push --force`
- No ejecutar `DROP TABLE` ni `DELETE FROM` sin cláusula WHERE

---

## Regla de oro

> **Mobile-first + conversión + claridad + no romper flujos existentes.**
>
> Si un cambio no mejora al menos uno de estos cuatro pilares, probablemente no vale la pena hacerlo.
