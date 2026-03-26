# Skill: sticky-whatsapp-checkout

## Objetivo
Optimizar la barra sticky inferior de checkout por WhatsApp para que sea visible, clara, sin tapar contenido importante y con el menor rozamiento posible para completar el pedido.

## Cuándo usarla
- El botón de WhatsApp no es visible sin scrollear
- La barra tapa contenido que el usuario necesita ver
- El CTA no comunica claramente qué va a pasar al tocarlo
- El mensaje generado es confuso o incompleto

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- El checkout es 100% por WhatsApp — no hay carrito propio con pago
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code

```
Quiero optimizar la barra de checkout sticky de EnCasa Venezuela.

Primero leé src/App.tsx para entender cómo está implementada la barra actual.
Luego revisá cómo se genera el link de WhatsApp.

Objetivos:
1. La barra debe ser visible sin scrollear en la vista de carrito/producto
2. No debe tapar el contenido con padding-bottom en el body cuando corresponda
3. El botón debe decir algo como: "Pedir por WhatsApp (X items)" o "Enviar pedido"
4. El área de toque debe ser mínimo 48px de altura
5. La barra debe tener fondo sólido (no semitransparente) para legibilidad

No cambiar la lógica del carrito ni el cálculo del total.
Solo ajustar layout, texto del CTA y visibilidad.
```

## Riesgos
- Si la barra es muy alta, puede tapar los últimos items del carrito
- Agregar `padding-bottom` al contenedor principal para que la barra no tape el scroll

## Test
1. Agregar un producto al carrito
2. Scrollear hasta el final de la página → la barra sigue visible
3. El texto del CTA es claro
4. Tap en el botón → abre WhatsApp con el mensaje correcto

## Archivos que probablemente toque
- `src/App.tsx`
- Componente de carrito (si está separado)
