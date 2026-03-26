# Skills de Claude Code — EnCasa Venezuela

## Qué es una skill

Una skill es un archivo Markdown que contiene un prompt operativo listo para ejecutar una tarea repetitiva y bien delimitada dentro del proyecto. No es documentación genérica: es una instrucción de trabajo específica para Claude Code.

---

## Estructura de categorías

```
skills/
  ux/           → cambios de interfaz y experiencia táctil
  conversion/   → mejoras orientadas a cerrar más pedidos
  performance/  → optimización de carga y renders
  data/         → manejo seguro de datos, hooks y fallbacks
  debug/        → investigación y resolución de bugs
  whatsapp/     → armado y mejora del mensaje de checkout
  structure/    → creación y mantenimiento de la propia librería
```

---

## Cómo nombrar una skill

- Minúsculas, guiones medios, sin espacios
- Formato: `[accion]-[objeto].md`
- Ejemplos: `debug-products-zero.md`, `image-loading-safe.md`, `wa-message-builder.md`

---

## Cómo categorizar una skill

Preguntarte: ¿qué problema resuelve principalmente?
- Cambio visual o táctil → `ux/`
- Mejora de conversión o CTA → `conversion/`
- Lentitud o renders → `performance/`
- Datos que fallan o están vacíos → `data/`
- Bug específico → `debug/`
- Mensaje de WhatsApp → `whatsapp/`
- Documentación interna → `structure/`

---

## Cómo actualizar una skill

- Si cambió el archivo que toca → actualizar la sección "Archivos que probablemente toque"
- Si el prompt ya no aplica → reescribir "Instrucciones para Claude Code"
- Si se encontró un riesgo nuevo → agregar en "Riesgos"
- Si el test cambió → actualizar "Test"

---

## Cómo saber si una skill quedó obsoleta

Una skill está obsoleta si:
- El archivo que menciona ya no existe o fue renombrado
- El patrón que describe fue reemplazado por otro
- La tarea ya no se repite en el proyecto
- El comportamiento descrito es incorrecto o desactualizado

Cuando una skill queda obsoleta: actualizarla o moverla a `skills/deprecated/` con una nota de por qué.

---

## Template

Usar `structure/create-new-skill-template.md` para crear skills nuevas.
