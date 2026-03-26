# DATA_FLOW.md — Flujo de datos en EnCasa Venezuela

## Diagrama general

```
Supabase DB (products / stores)
       ↓  (fetch al montar el primer componente que usa el hook)
useProducts() / useStores()
       ↓  (caché de módulo → localStorage → fallback estático)
Componentes de UI
       ↓  (usuario elige producto o combo)
WhatsApp link generator
       ↓
Apertura de WhatsApp con mensaje pre-armado
```

---

## Tres capas de fallback

Ambos hooks (`useProducts`, `useStores`) usan la misma estrategia:

```
Capa 1: Supabase (fuente de verdad)
  → Si falla → Capa 2: snapshot en localStorage
               → Si falla → Capa 3: datos estáticos locales
                            (fallbackProducts.ts / fallbackStores.ts)
```

### Importante: `getBestAvailable()`
Antes de esperar el fetch, el hook devuelve datos inmediatamente desde el mejor nivel disponible. Esto garantiza que la app nunca quede en pantalla vacía.

---

## Estados que deben manejarse

### `loading = true`
- Mostrar skeleton o contenido fallback — nunca pantalla en blanco
- Los hooks devuelven datos de fallback instantáneamente, por lo que este estado es muy breve

### `loading = false` + datos vacíos
- Esto indica que Supabase devolvió 0 registros (no un error)
- En hooks: si `result.length === 0` → lanzar error para activar el fallback
- En UI: mostrar fallback o mensaje claro, nunca sección vacía sin aviso

### Error de Supabase
- El hook lo captura, resetea `_promise = null` (permite reintento futuro)
- Activa fallback automáticamente

---

## Estructura de datos

### Product
```ts
{
  id: number
  name: string
  price: number
  oldPrice?: number        // si tiene descuento
  category: string
  img: string              // URL completa del bucket
  isCombo?: boolean        // true = es un combo, va a promoCombos
  storeId?: string         // id del local (= slug de la tabla stores)
}
```

### PartnerStore
```ts
{
  id: string              // = slug de la tabla (NO el UUID)
  name: string
  location: string
  address: string
  rating: number
  img: string             // URL completa del bucket
  type: 'comida' | 'productos'
  isPreparedFood: boolean
  plan: 'basic' | 'premium'
  tags: string[]
}
```

---

## Productos sin imagen

Cuando una imagen falla al cargar:
1. El `<img>` muestra vacío o broken icon
2. **Correcto**: agregar `bg-gray-50` al wrapper — cubre el fallo visualmente
3. Para imágenes críticas: agregar `onError` → reemplazar src por placeholder local

```tsx
// Patrón seguro para imágenes
<div className="rounded-xl overflow-hidden bg-gray-50">
  <img
    src={product.img}
    alt={product.name}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
</div>
```

---

## Cómo evitar combos vacíos

El hook `useProducts` separa productos de combos:
```ts
const allProducts = products.filter(p => !p.isCombo);
const promoCombos = products.filter(p => !!p.isCombo);
```

**Condición crítica**: si `fallbackProducts.ts` no tiene productos con `isCombo: true`, `promoCombos` queda vacío → sección Combos Relámpago y Combos Especiales no muestran nada.

**Fix**: `fallbackProducts.ts` debe contener al menos 3 combos:
```ts
{ id: 201, isCombo: true, storeId: 'encasa-venezuela', ... }
```

---

## Validación antes de tocar producción

Antes de hacer cambios en la tabla `products` o en los hooks, verificar:

1. `allProducts.length > 0` después del fetch
2. `promoCombos.length > 0` si hay combos en la tabla
3. Todos los `img_path` resuelven a URLs válidas del bucket
4. Los `storeId` en combos coinciden con un `slug` en la tabla `stores`
5. Las categorías en productos coinciden con las usadas en `categories` del hook

---

## Regla de render seguro

Nunca renderizar una sección que depende de datos sin verificar que haya datos:

```tsx
// ❌ Puede romper
{promoCombos.map(combo => ...)}

// ✅ Seguro
{promoCombos.length > 0 && promoCombos.map(combo => ...)}

// ✅ Con fallback visual
{promoCombos.length === 0
  ? <p className="text-gray-400">Sin combos disponibles</p>
  : promoCombos.map(combo => ...)
}
```
