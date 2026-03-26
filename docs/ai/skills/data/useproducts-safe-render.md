# Skill: useproducts-safe-render

## Objetivo
Usar el hook `useProducts()` en componentes nuevos o modificados sin romper el render, los filtros ni los estados de carga. Garantizar que siempre haya datos o un fallback visible.

## Cuándo usarla
- Se agrega un nuevo componente que necesita mostrar productos
- Se modifica un componente existente que usa `useProducts()`
- Aparecen errores de render relacionados con productos vacíos o undefined
- Se quiere filtrar productos por categoría, precio o tipo sin romper otros filtros

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- `useProducts()` retorna: `{ allProducts, promoCombos, loading, source }`
- `allProducts`: todos los productos sin combos
- `promoCombos`: solo los que tienen `isCombo: true`
- `loading`: true solo el primer render antes del fallback
- `source`: 'supabase' | 'cache' | 'fallback'
- Mobile-first obligatorio

## Instrucciones para Claude Code

```
Quiero agregar o modificar un componente en EnCasa Venezuela que use useProducts().

Reglas de uso seguro del hook:

1. Siempre desestructurar lo que se necesita:
   const { allProducts, promoCombos, loading } = useProducts();

2. Nunca renderizar listas sin verificar que tienen items:
   {allProducts.length > 0 && allProducts.map(...)}

3. Si el componente puede mostrar "vacío", agregar estado vacío explícito:
   {allProducts.length === 0 && <p>No hay productos disponibles</p>}

4. Para filtros, siempre aplicar sobre allProducts (ya excluye combos):
   const filtered = allProducts.filter(p => p.category === cat);

5. Para combos, usar promoCombos directamente:
   const { promoCombos } = useProducts();

6. No llamar al hook más de una vez en el mismo componente

Leé el componente antes de modificarlo. Aplicá cambios mínimos.
```

## Riesgos
- Si se llama `useProducts()` en múltiples componentes al mismo tiempo, el caché de módulo previene fetches duplicados — esto es correcto
- No crear un estado local copiando `allProducts` — usar directamente el valor del hook
- No modificar el array retornado por el hook (inmutabilidad)

## Test
1. `npm run dev` con Supabase conectado → verificar que se muestran productos reales
2. Simular offline → verificar que se muestran productos de fallback
3. Consola sin errores de "Cannot read properties of undefined"

## Archivos que probablemente toque
- Cualquier componente nuevo que muestre productos
- `components/CatalogView.tsx`
- `components/Offers.tsx`
- `components/Promotions.tsx`
