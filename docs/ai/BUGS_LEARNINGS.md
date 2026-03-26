# BUGS_LEARNINGS.md — Registro de bugs y aprendizajes

## Formato de entrada

```
### [NOMBRE DEL BUG]
- **Bug**: descripción visible
- **Causa**: por qué ocurrió
- **Fix**: cómo se resolvió
- **Archivo tocado**: ruta del archivo
- **Cómo testear**: pasos para verificar que está resuelto
- **Cómo evitarlo**: regla para no repetirlo
```

---

## Bugs registrados

---

### PRODUCTS-ZERO — allProducts siempre en 0

- **Bug**: `allProducts` retornaba array vacío aunque Supabase tenía datos. `loading = false` pero no había productos.
- **Causa**: El primer fetch fallaba (error de red o Supabase lento). `_promise` quedaba almacenando la Promise rechazada. En los siguientes montes, el hook veía `if (_promise) return _promise` y devolvía la misma Promise rechazada sin reintentar.
- **Fix**: En el bloque `catch` del fetch, agregar `_promise = null` para permitir reintento.
- **Archivo tocado**: `lib/hooks/useProducts.ts`
- **Cómo testear**: Simular error de red (DevTools → Network → Offline), recargar. Verificar que aparecen los datos de fallback y no pantalla vacía.
- **Cómo evitarlo**: Todo fetch que usa `_promise` como guard debe resetear `_promise = null` en el catch.

---

### COMBOS-EMPTY — sección "Combos Relámpago" vacía

- **Bug**: La sección de combos no mostraba nada aunque el componente renderizaba.
- **Causa**: `fallbackProducts.ts` no tenía productos con `isCombo: true`. Al fallar Supabase, `promoCombos = []`.
- **Fix**: Agregar al menos 3 combos en `fallbackProducts.ts` con `isCombo: true` y `storeId` válido.
- **Archivo tocado**: `data/fallbackProducts.ts`
- **Cómo testear**: Desconectar Supabase (cambiar URL a inválida en `.env.local`), verificar que se ven 3 combos.
- **Cómo evitarlo**: `fallbackProducts.ts` debe tener representación de todos los tipos de datos que la UI necesita: productos regulares, productos con `oldPrice`, y combos.

---

### HOME-SECTIONS-LOST — cards de sección desaparecen

- **Bug**: Alguna de las 4 cards de sección (Lo más pedido / Nuevos ingresos / Ofertas del día / Todo a $5.999) desaparece.
- **Causa**: La lista se filtra con `.filter(s => s.items.length > 0)`. Si `allProducts` está vacío o no hay productos con la condición, `items` queda vacío y la card se descarta.
- **Fix**: Asegurar que `fallbackProducts.ts` tenga suficiente variedad. Para "Ofertas del día": si no hay productos con `oldPrice`, usar `allProducts.slice(0, 4)` como fallback.
- **Archivo tocado**: `components/Offers.tsx`
- **Cómo testear**: Con datos vacíos (offline), verificar que aparecen las 4 cards.
- **Cómo evitarlo**: Toda sección con items filtrados debe tener un fallback de items no-filtrado.

---

### TOUCH-SCROLL-BLOCKED — carrusel no responde al dedo en iOS

- **Bug**: El carrusel horizontal no permite arrastrar con el dedo en iOS Safari.
- **Causas documentadas**:
  1. `overflow: hidden` en un ancestro de la sección (el más común en iOS)
  2. `requestAnimationFrame` modificando `scrollLeft` durante el scroll nativo (cancela el momentum de inercia)
  3. `transform: translateX()` en un elemento dentro de un `overflow-x-auto` (el scroll layout no coincide con la posición visual)
  4. Wrapper `relative` con hijos `absolute` entre la section y el scroll container
- **Fix**: Arquitectura del scroll container igual a Promotions.tsx: `flex overflow-x-auto no-scrollbar touch-pan-x` en el MISMO div, sin wrappers intermedios con `position: relative` y hijos absolutos.
- **Archivo tocado**: `components/Offers.tsx`
- **Cómo testear**: Abrir en iOS Safari físico (no simulador). Intentar arrastrar la sección en ambas direcciones.
- **Cómo evitarlo**: Ver regla en UI_UX_RULES.md — sección "Scroll táctil fluido".

---

### IMAGE-GHOST-CLASS — overlay de imagen sin efecto visual

- **Bug**: El texto sobre una imagen de card era invisible (texto blanco sobre blanco o sobre imagen sin opacidad).
- **Causa**: La clase CSS `category-overlay` no estaba definida en ningún archivo. Era una clase fantasma.
- **Fix**: Reemplazar con gradiente inline: `style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}`
- **Archivo tocado**: `components/Categories.tsx`
- **Cómo testear**: Verificar que el texto de cada card de categoría es legible sobre la imagen.
- **Cómo evitarlo**: No usar clases CSS que no estén definidas en el proyecto. Preferir inline styles para overlays críticos.

---

### TAILWIND-ARBITRARY-PROD — clases arbitrarias no generan en producción

- **Bug**: `w-[160px]` funcionaba en dev pero en producción las cards no tenían el ancho correcto.
- **Causa**: Tailwind v4 no siempre purge-list las clases arbitrarias generadas dinámicamente o en strings interpolados.
- **Fix**: Para dimensiones críticas de layout (ancho de cards en carrusel), usar `style={{ width: '160px', flexShrink: 0 }}`.
- **Archivos tocados**: `components/Categories.tsx`, `components/Offers.tsx`
- **Cómo testear**: Hacer build de producción (`npm run build`) y verificar la sección visualmente.
- **Cómo evitarlo**: Usar `style={{}}` para cualquier dimensión de la que dependa el layout de un carrusel.

---

### JSX-UNICODE-ESCAPE — texto con `\u00E1` se muestra literal

- **Bug**: En producción, los textos mostraban `\u00E1` en vez de `á`.
- **Causa**: En JSX, el contenido de texto no procesa secuencias de escape `\uXXXX`. Solo funcionan en strings JS, no en JSX text nodes.
- **Fix**: Reemplazar todas las ocurrencias con caracteres UTF-8 directamente: `á`, `é`, `ó`, etc.
- **Archivos tocados**: `components/Offers.tsx` y cualquier componente con texto en español
- **Cómo testear**: Revisar visualmente todos los textos en español en la app.
- **Cómo evitarlo**: Escribir siempre los caracteres directamente en el código fuente. El editor y el repo soportan UTF-8.

---

### DEPLOY-OLD-VERSION — Vercel muestra versión vieja después de push

- **Bug**: Después de un push, la URL de producción sigue mostrando la versión anterior.
- **Causas posibles**:
  1. El build de Vercel falló silenciosamente
  2. Hay caché del browser (Ctrl+Shift+R para forzar recarga)
  3. El push no llegó al branch correcto
- **Fix**: Revisar el log del deploy en el dashboard de Vercel. Si hay error, leer el mensaje de build. Si no hay error, hacer hard refresh.
- **Cómo evitarlo**: Verificar siempre el estado del deploy en Vercel después de cada push importante.
