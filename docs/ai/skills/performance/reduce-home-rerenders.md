# Skill: reduce-home-rerenders

## Objetivo
Identificar y eliminar re-renders innecesarios en el home que causan parpadeos visuales o lentitud perceptible, sin romper la lógica de datos ni la UX.

## Cuándo usarla
- El home parpadea o "flashea" al cargar
- Hay secciones que se re-renderizan cuando el usuario interactúa con otra sección
- El rendimiento en dispositivos móviles gama media es notablemente lento

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Los hooks `useProducts` y `useStores` tienen caché de módulo — no hacen fetch en cada render
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code

```
Quiero revisar si hay re-renders innecesarios en el home de EnCasa Venezuela.

Pasos:
1. Leé src/App.tsx y los componentes del home
2. Identificá si hay estados en App.tsx que cambian frecuentemente y que
   están siendo pasados como props a componentes que no los necesitan
3. Revisá si hay funciones inline en JSX que se recrean en cada render
   (ej: onClick={() => setX(y)} pasada como prop)
4. No usar React.memo ni useCallback a menos que el problema esté confirmado
5. No refactorizar la arquitectura — solo cambios mínimos y puntuales

Antes de proponer cualquier cambio, describir qué encontraste y por qué
causa un re-render innecesario.
```

## Riesgos
- `React.memo` mal aplicado puede hacer que componentes no se actualicen cuando deben
- No optimizar prematuramente — solo si el problema es real y visible

## Test
1. Instalar React DevTools en Chrome
2. Activar "Highlight updates" en el profiler
3. Navegar por el home e identificar qué se re-renderiza al interactuar
4. Después del fix: mismo test, verificar que las secciones que no cambian no se marcan

## Archivos que probablemente toque
- `src/App.tsx` (callbacks, estado compartido)
- Componentes del home que reciban muchas props
