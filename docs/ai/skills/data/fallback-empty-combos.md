# Skill: fallback-empty-combos

## Objetivo
Corregir o prevenir que la sección de combos aparezca vacía cuando Supabase falla o no retorna combos. Garantiza que siempre haya al menos 3 combos visibles.

## Cuándo usarla
- La sección "Combos Relámpago" o "Combos Especiales" aparece vacía
- `promoCombos.length === 0` con `loading = false`
- Se modificó `fallbackProducts.ts` y se rompió la cobertura de combos
- Se agrega una nueva sección que depende de combos

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- `promoCombos` = productos con `isCombo: true` en la tabla o en el fallback
- `storeId` en combos debe coincidir con un `id` (slug) en `FALLBACK_STORES`
- El fallback de stores usa `id: 'encasa-venezuela'`
- Mobile-first obligatorio

## Instrucciones para Claude Code

```
Quiero verificar y corregir el manejo de combos vacíos en EnCasa Venezuela.

Pasos:
1. Leé data/fallbackProducts.ts y verificar que tiene al menos 3 items con isCombo: true
2. Verificar que cada combo tiene storeId que existe en data/fallbackStores.ts
3. Leé lib/hooks/useProducts.ts y verificar la separación allProducts / promoCombos
4. Si falta algún combo en el fallback, agregar siguiendo este patrón:

{
  id: 20X,
  name: 'Combo [nombre]',
  price: XXXX,
  oldPrice: XXXX,
  category: 'Combos',
  img: getImageUrl('[imagen].png'),
  isCombo: true,
  storeId: 'encasa-venezuela',
}

5. En components/Offers.tsx y components/Promotions.tsx, verificar que la sección
   de combos tiene un guard: no renderizar si promoCombos.length === 0

No tocar la lógica del hook. Solo agregar datos de fallback y guards de render.
```

## Riesgos
- Agregar combos con `storeId` que no existe en FALLBACK_STORES rompe la sección de "local" en la card
- Los `id` de combos en fallback no pueden repetirse (usualmente 201, 202, 203...)

## Test
1. Desconectar Supabase temporalmente (cambiar URL en .env.local)
2. Limpiar localStorage del browser
3. Cargar la app → la sección de combos debe mostrar los 3 combos de fallback
4. Restaurar Supabase y localStorage

## Archivos que probablemente toque
- `data/fallbackProducts.ts`
- `data/fallbackStores.ts`
- `lib/hooks/useProducts.ts`
- `components/Offers.tsx`
- `components/Promotions.tsx`
