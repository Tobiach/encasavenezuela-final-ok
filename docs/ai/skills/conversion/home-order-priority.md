# Skill: home-order-priority

## Objetivo
Redefinir el orden de las secciones del home según impacto en conversión: primero lo que lleva al pedido más rápido, al fondo lo informativo.

## Cuándo usarla
- El home se siente "informativo" en vez de "transaccional"
- Los combos o los productos más pedidos no son lo primero que ve el usuario
- Hay secciones de contenido (features, how it works) antes que secciones de producto

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code

```
Quiero revisar y ajustar el orden de las secciones del home para maximizar conversión.

Leé src/App.tsx primero y listá el orden actual de los componentes.

Orden objetivo por prioridad de conversión:
1. Hero con CTA principal
2. Sección de combos/promos (Offers o Promotions — lo que tenga más impacto visual)
3. Categorías (para que el usuario pueda ir directo a lo que busca)
4. Locales aliados (PartnerStores)
5. Features / HowItWorks (valor explicativo, no transaccional)
6. Footer

Solo reordenar el JSX en App.tsx.
No tocar la lógica interna de ningún componente.
No agregar ni eliminar componentes.
Verificar que todas las props se sigan pasando correctamente.
```

## Riesgos
- Si algún componente necesita estado que viene de un componente previo, el reordenamiento puede romperlo
- Revisar que el carrito y sus props se mantengan coherentes

## Test
1. `npm run dev` → verificar en mobile que el primer scroll muestra combos o productos
2. El Hero sigue siendo lo primero visible
3. No hay errores en consola

## Archivos que probablemente toque
- `src/App.tsx`
