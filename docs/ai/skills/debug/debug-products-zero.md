# Skill: debug-products-zero

## Objetivo
Investigar y resolver por qué `allProducts` aparece vacío (`length === 0`) con `loading = false`, sin mostrar pantalla en blanco al usuario.

## Cuándo usarla
- El home muestra secciones vacías pero Supabase sí tiene datos
- `allProducts.length === 0` y `loading = false` en el mismo estado
- Después de un deploy, los productos dejaron de aparecer
- El hook retorna datos de fallback pero no los de Supabase

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Hook de datos: `lib/hooks/useProducts.ts`
- Fallback: `data/fallbackProducts.ts` → al menos 16 productos regulares + 3 combos
- Bug conocido: `_promise` poisoning — una Promise rechazada queda cacheada y bloquea todos los fetches siguientes

## Instrucciones para Claude Code

```
Quiero investigar por qué allProducts está en 0 en EnCasa Venezuela.

Árbol de diagnóstico — verificar en orden:

1. ¿El fallback tiene datos?
   Leé data/fallbackProducts.ts → debe tener al menos 16 productos

2. ¿El hook hace getBestAvailable() correctamente?
   Leé lib/hooks/useProducts.ts → la función getBestAvailable() debe retornar
   datos aunque _cache sea null (localStorage → fallback)

3. ¿_promise quedó como Promise rechazada?
   En el catch del fetchProducts, verificar que hay `_promise = null`
   Si no está, agregarlo. Esto es el "promise poisoning bug".

4. ¿Supabase retorna 0 filas?
   Verificar que la tabla `products` tiene registros con `is_active = true`
   Si hay 0 filas activas, el hook lanza error y activa el fallback

5. ¿El componente renderiza antes de que el hook termine?
   Verificar que usa: {allProducts.length > 0 && allProducts.map(...)}

Describir qué encontraste en cada paso antes de proponer el fix.
```

## Riesgos
- Modificar `_promise` o el caché del hook puede afectar todos los componentes que lo usan
- No limpiar `_promise = null` en el catch permite que el bug se repita

## Test
1. Abrir DevTools → Console
2. Recargar la app → buscar errores de Supabase
3. Verificar que `promoCombos` y `allProducts` tienen datos después de 2-3 segundos
4. Simular offline → verificar que el fallback se activa y muestra datos

## Archivos que probablemente toque
- `lib/hooks/useProducts.ts` (causa más común: falta `_promise = null` en catch)
- `data/fallbackProducts.ts` (si el fallback está vacío o roto)
