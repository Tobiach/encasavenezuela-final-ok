# Skill: mobile-scroll-feedback

## Objetivo
Mejorar la sensación táctil de carruseles y listas en mobile: scroll fluido, feedback de toque, spacing correcto, sin elementos que bloqueen la interacción.

## Cuándo usarla
- El scroll horizontal se siente "trabado" o no responde al dedo
- Las cards no dan feedback visual al tocarlas
- El espaciado entre cards es incómodo
- El carrusel no permite avanzar y retroceder libremente

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code

```
Quiero mejorar la sensación táctil de la sección [NOMBRE] en mobile.

Verificar y corregir:
1. El scroll container tiene `flex overflow-x-auto` en el MISMO elemento
2. `touchAction: 'pan-x'` está en el scroll container
3. Ningún ancestro tiene `overflow: hidden` (rompe iOS Safari)
4. Las cards tienen `style={{ flexShrink: 0, width: 'Xpx' }}` (no Tailwind arbitrario)
5. Las cards tienen `active:scale-95` para feedback táctil
6. El padding interno (-mx-6 px-6 si el scroll va de borde a borde)
7. No hay `transform: translateX()` en elementos dentro del scroll container

Referencia de arquitectura correcta: ver Promotions.tsx línea 34-45.
Leé el archivo antes de proponer cambios.
```

## Riesgos
- Cambiar la estructura del scroll container puede romper el layout en desktop
- Verificar con media queries que el cambio es solo para mobile si es necesario

## Test
1. Abrir en iOS Safari físico (no simulador)
2. Arrastrar con el dedo en ambas direcciones → debe seguir el movimiento
3. Tap en una card → debe escalar (`active:scale-95`) y navegar
4. Soltar el scroll → inercia natural del scroll nativo

## Archivos que probablemente toque
- `components/Offers.tsx`
- `components/Categories.tsx`
- `components/Promotions.tsx`
- `components/PartnerStores.tsx`
