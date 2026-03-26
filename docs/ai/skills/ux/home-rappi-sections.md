# Skill: home-rappi-sections

## Objetivo
Reorganizar las secciones del home con jerarquía tipo app (Rappi/PedidosYa): lo más pedido primero, luego combos, categorías y promos. Cada sección con scroll horizontal fluido y cards claras.

## Cuándo usarla
- El home se ve desorganizado o sin prioridad visual clara
- El usuario tiene que scrollear demasiado para encontrar lo que busca
- Se quiere agregar una nueva sección sin romper el orden existente

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Router: HashRouter (React Router v7)
- Backend: Supabase + fallback estático
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code

```
Quiero reorganizar las secciones del home de EnCasa Venezuela para que sigan
este orden de conversión:

1. Hero (no tocar)
2. Lo más pedido / Combos Relámpago (primer impacto)
3. Categorías (orientación rápida)
4. Combos Especiales (Promotions.tsx)
5. Locales aliados (PartnerStores)
6. Features / How it works (al fondo)

Leé src/App.tsx primero para ver el orden actual de los componentes.
Reorganizá solo el orden de los componentes en el JSX — no toques la lógica interna
de ningún componente.
Verificá que cada componente importado sigue siendo usado.
No agregues ni elimines componentes.
```

## Riesgos
- Si un componente depende de props del padre (ej: `onAddToCart`), moverlo puede romper el flujo
- Revisar que todas las props requeridas se pasen en el nuevo orden

## Test
1. `npm run dev` → verificar el orden visual en mobile
2. Todos los componentes visibles sin error en consola
3. La barra de checkout (si existe) sigue funcionando

## Archivos que probablemente toque
- `src/App.tsx` (reordenamiento de JSX)
