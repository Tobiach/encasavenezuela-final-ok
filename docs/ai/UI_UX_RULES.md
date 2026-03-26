# UI_UX_RULES.md — Reglas de interfaz y experiencia

## Principio rector

> El usuario venezolano en Argentina busca lo que extraña. La app tiene que sacarlo de la búsqueda y llevarlo al pedido en el menor tiempo posible.

---

## Reglas de pantalla

### 1. Comprensión en menos de 3 segundos
El usuario debe entender qué puede hacer en la pantalla actual sin leer nada. Si necesita scrollear para entender el propósito de la sección, hay algo mal en el diseño.

### 2. CTAs visibles sin scroll
Las acciones principales (ver catálogo, contactar local, agregar al carrito) deben ser visibles sin necesitar scroll. En mobile: preferiblemente sticky o en el primer viewport.

### 3. Tap targets cómodos
- Mínimo 44×44px para cualquier elemento interactivo
- Espaciado entre botones: mínimo 8px
- Nunca superponer áreas táctiles

### 4. Scroll táctil fluido (CRÍTICO)
- `overflow-x-auto` + `touchAction: 'pan-x'` en todo scroll horizontal
- `-webkit-overflow-scrolling: touch` para iOS Safari
- Nunca usar `transform: translateX()` en un elemento dentro de un contenedor scrollable
- El padre de un scroll container NUNCA debe tener `overflow: hidden` (rompe iOS touch)
- `flex` y `overflow-x-auto` deben estar en el MISMO elemento

### 5. Jerarquía visual simple
- Un solo foco por pantalla
- Máximo 2 niveles de jerarquía tipográfica en una sección
- No mezclar más de 3 colores de énfasis en la misma vista
- Fondo: `venezuela-dark` (el oscuro del proyecto)

### 6. Sin overload visual
- Máximo 2 badges por card
- No más de 4 secciones visibles en el home sin scroll
- Las animaciones no deben distraer de la acción principal

### 7. Estilo app

| Referencia | Principio tomado |
|---|---|
| Rappi / PedidosYa | Cards grandes, CTA inmediato, secciones horizontales |
| App nativa | Tap feedback (`active:scale-95`), inercia en scroll |
| Cultura venezolana | Calidez, comunidad, nostalgia positiva |

---

## Reglas de componentes

### Cards de producto
- Siempre mostrar: nombre, precio, imagen
- Si hay `oldPrice`: mostrar tachado + descuento
- Imagen: siempre con fallback visual (bg-gray-50 si falla)
- `shrink-0` + ancho fijo inline (`style={{ width: '...' }}`) para carruseles

### Cards de local
- Mostrar: nombre, rating, tipo (comida / productos), distancia o zona
- Badge de plan: premium primero en el listado

### Sección de combos
- Carrusel horizontal obligatorio en mobile
- Touch handlers en React (no `addEventListener`)
- Mismo elemento para `flex` y `overflow-x-auto`

### Formularios / checkout
- El mensaje de WhatsApp debe ser legible por un humano
- Incluir: nombre del producto, cantidad, local de destino
- Nunca requerir login para ver catálogo

---

## Reglas de color (Tailwind custom)

| Token | Uso |
|---|---|
| `ven-yellow` | Acento principal, CTAs, highlights |
| `ven-red` | Alertas, descuentos, badges urgentes |
| `ven-blue` | Acento secundario |
| `venezuela-brown` | Texto principal (no blanco puro) |
| `venezuela-dark` | Fondo principal |
| `venezuela-orange` | Precios, énfasis cálido |

---

## Antipatrones a evitar

- ❌ Texto sobre imagen sin overlay de contraste suficiente
- ❌ Botón sin feedback visual al tap
- ❌ Scroll container dentro de `overflow: hidden`
- ❌ Clases Tailwind arbitrarias para dimensiones críticas (usar `style={{}}`)
- ❌ `\uXXXX` en JSX — usar caracteres UTF-8 directamente
- ❌ Animar con `translateX` un elemento dentro de un scroll nativo
- ❌ Pantalla completamente vacía mientras carga — siempre mostrar fallback
- ❌ Más de 2 niveles de wrappers `relative` + `absolute` en la misma jerarquía interactiva
