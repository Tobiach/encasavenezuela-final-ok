# SKILL_INDEX.md — Índice maestro de skills

## Qué es una skill

Una skill es un prompt operativo listo para ejecutar una tarea repetitiva en EnCasa Venezuela. Está diseñada para que Claude Code la use con criterio quirúrgico: cambios mínimos, resultado predecible, sin romper lo existente.

---

## Índice

### Categoría: UX

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `ux/home-rappi-sections` | Reorganizar secciones del home con jerarquía tipo app | Cuando el home se ve desordenado o sin priorización clara | `src/App.tsx`, componentes del home | medio |
| `ux/mobile-scroll-feedback` | Mejorar sensación táctil en carruseles y listas | Cuando el scroll se siente rígido o falta feedback visual | `components/Offers.tsx`, `Categories.tsx` | bajo |

---

### Categoría: Conversión

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `conversion/sticky-whatsapp-checkout` | Optimizar barra inferior de checkout | Cuando el CTA de WhatsApp no está visible o genera fricción | `src/App.tsx` o componente de carrito | bajo |
| `conversion/home-order-priority` | Redefinir orden del home por impacto en conversión | Cuando se quiere reordenar qué ve primero el usuario | `src/App.tsx` | bajo |

---

### Categoría: Performance

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `performance/reduce-home-rerenders` | Eliminar re-renders innecesarios | Cuando el home se siente lento o hay parpadeos visuales | Cualquier componente del home | medio |
| `performance/image-loading-safe` | Tratar imágenes rotas y optimizar carga visual | Cuando hay imágenes que no cargan o el layout se rompe | Cualquier componente con `<img>` | bajo |

---

### Categoría: Data

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `data/useproducts-safe-render` | Usar useProducts() sin romper render | Cuando se agrega o modifica un componente que consume productos | Cualquier componente que use `useProducts` | bajo |
| `data/fallback-empty-combos` | Manejar combos vacíos con fallback | Cuando los combos no muestran nada o Supabase falla | `data/fallbackProducts.ts`, `lib/hooks/useProducts.ts` | bajo |

---

### Categoría: Debug

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `debug/debug-products-zero` | Investigar por qué productos aparecen en 0 | Cuando `allProducts.length === 0` con `loading = false` | `lib/hooks/useProducts.ts` | bajo |
| `debug/supabase-safe-check` | Revisar conexión y shape de data de Supabase | Antes de cambios en la DB o cuando los datos no coinciden | `lib/supabase.ts`, hooks, scripts/ | bajo |

---

### Categoría: WhatsApp

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `whatsapp/wa-message-builder` | Mejorar el mensaje de checkout de WhatsApp | Cuando el mensaje es confuso, largo o incompleto | Componente de carrito o generador de link | bajo |

---

### Categoría: Estructura

| Skill | Objetivo | Cuándo usarla | Archivos que toca | Riesgo |
|---|---|---|---|---|
| `structure/create-new-skill-template` | Crear una nueva skill bien estructurada | Cuando se identifica una tarea repetitiva nueva | `docs/ai/skills/` | ninguno |

---

## Reglas de uso del índice

1. Antes de ejecutar una skill, verificar que los archivos que menciona existen y no cambiaron de nombre
2. Si una skill tiene riesgo **medio** o **alto**, leer el archivo de la skill antes de ejecutar
3. Si la tarea no encaja en ninguna skill existente, crear una nueva con `structure/create-new-skill-template`
4. Después de ejecutar una skill exitosamente, actualizar `BUGS_LEARNINGS.md` si se encontró un problema
