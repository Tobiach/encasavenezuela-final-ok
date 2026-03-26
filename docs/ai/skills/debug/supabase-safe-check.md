# Skill: supabase-safe-check

## Objetivo
Verificar que la conexión a Supabase es correcta, que el shape de los datos retornados es compatible con el frontend y que los campos esperados existen en las tablas.

## Cuándo usarla
- Después de agregar o modificar columnas en las tablas `products` o `stores`
- Cuando los datos de Supabase llegan pero algo no se muestra correctamente
- Antes de un deploy con cambios en la estructura de la DB
- Cuando el hook retorna datos parciales o con undefined en campos importantes

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Tablas principales: `products`, `stores`
- `stores[].id` usa el campo `slug` (NO el UUID de Supabase)
- `products[].img` = URL completa del bucket (via `getImageUrl(img_path)`)
- El hook mapea las rows con funciones `mapRowToProduct` / `mapRowToStore`

## Instrucciones para Claude Code

```
Quiero hacer un chequeo seguro de la integración con Supabase en EnCasa Venezuela.

Verificar en orden:

1. Leé lib/supabase.ts → confirmar que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
   están siendo leídas de import.meta.env (no hardcodeadas)

2. Leé lib/hooks/useProducts.ts → revisar la función mapRowToProduct:
   - ¿Todos los campos del tipo Product están siendo mapeados?
   - ¿Hay campos que pueden ser null en DB pero el tipo los espera definidos?
   - ¿El campo img usa getImageUrl(row.img_path)?

3. Leé lib/hooks/useStores.ts → revisar mapRowToStore:
   - ¿id se asigna desde row.slug (no row.id)?
   - ¿Los campos opcionales tienen fallback?

4. Verificar que los campos en la query (.select('*')) coinciden con lo que
   espera la función de mapeo

5. Describir cualquier discrepancia antes de proponer cambios

No ejecutar queries directas. No modificar la DB. Solo revisión del código.
```

## Riesgos
- Cambiar el mapeo puede romper cómo los componentes consumen los datos
- Agregar campos opcionales al tipo requiere actualizar los fallbacks

## Test
1. `npm run dev` → abrir DevTools → Network
2. Buscar el fetch a Supabase → revisar la respuesta JSON
3. Comparar los campos de la respuesta con los del tipo `Product` / `PartnerStore`
4. Verificar que `img_path` en la respuesta resuelve a una URL válida en el bucket

## Archivos que probablemente toque
- `lib/supabase.ts`
- `lib/hooks/useProducts.ts`
- `lib/hooks/useStores.ts`
- `types/` (si hay cambios en los tipos)
