# Skill: wa-message-builder

## Objetivo
Mejorar el mensaje de WhatsApp generado al hacer checkout para que sea claro, corto, legible por el local y útil para el usuario. El mensaje debe comunicar exactamente qué se está pidiendo, a quién y cómo.

## Cuándo usarla
- El mensaje de WhatsApp es confuso o incompleto
- El local recibe pedidos sin entender qué se quiere
- El mensaje es demasiado largo o demasiado corto
- Se quiere agregar información de entrega o aclaración de items

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- El checkout es 100% por WhatsApp — no hay pasarela de pago
- El link de WhatsApp usa `wa.me/{numero}?text={mensaje_urlencodificado}`
- El número de WhatsApp viene del local (campo `whatsapp` en tabla `stores`)
- Mobile-first obligatorio

## Instrucciones para Claude Code

```
Quiero mejorar el mensaje de WhatsApp del checkout en EnCasa Venezuela.

Primero leé src/App.tsx y encontrá dónde se genera el link o el mensaje de WhatsApp.

Estructura ideal del mensaje:
---
Hola! Quiero hacer un pedido desde EnCasa Venezuela 🛒

[x1] Nombre del producto — $precio
[x2] Nombre del producto — $precio

Total estimado: $total

[Dirección / zona de entrega si se pide]
---

Reglas del mensaje:
1. Máximo 5 líneas de detalle de productos
2. Usar saltos de línea reales (encodeURIComponent('\n') = '%0A')
3. No incluir URLs de imágenes en el mensaje
4. El total debe ser la suma de (precio × cantidad)
5. El saludo debe ser cordial y breve

No cambiar la lógica del carrito ni cómo se calcula el total.
Solo modificar la función que construye el string del mensaje.
```

## Riesgos
- Si el mensaje supera los 4096 caracteres, WhatsApp lo puede truncar
- Verificar que `encodeURIComponent` se aplica al string final completo

## Test
1. Agregar 2-3 productos al carrito
2. Tocar el botón de checkout
3. Verificar que WhatsApp se abre con el mensaje correcto
4. El mensaje debe ser legible sin decodificación manual

## Archivos que probablemente toque
- `src/App.tsx` (función generadora del link de WhatsApp)
- Componente de carrito si tiene lógica de mensaje propia
