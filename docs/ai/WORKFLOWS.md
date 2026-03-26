# WORKFLOWS.md — Cómo trabajar con Claude Code en EnCasa Venezuela

## Principio de trabajo

> Antes de ejecutar: leer. Antes de reescribir: editar. Antes de mergear: probar en celular.

---

## Workflow 1: Pedir un cambio UX

```
1. Describir qué sección se quiere cambiar y por qué
2. Adjuntar screenshot si el problema es visual
3. Mencionar la referencia de comportamiento deseado
   (ej: "igual que Combos Especiales", "como en Rappi")
4. Especificar qué NO debe cambiar
5. Pedir que Claude lea el archivo antes de proponer cambios
```

**Prompt tipo:**
```
Quiero mejorar la sección [X] del home.
El problema actual es [descripción visual/táctil].
Quiero que se comporte como [referencia].
No tocar [Y]. No rediseñar otras secciones.
Leé el archivo antes de proponer nada.
```

---

## Workflow 2: Pedir un fix

```
1. Describir el síntoma exacto (no el diagnóstico)
2. En qué dispositivo/browser ocurre
3. Qué se intentó antes
4. Pedir comparación estructural si el bug es de touch/scroll
```

**Prompt tipo:**
```
Bug: [sección] no hace [X] en mobile iOS.
Síntoma: [descripción detallada].
Ya se intentó: [lo que se hizo antes].
Referencia que sí funciona: [componente similar].
Comparar estructura DOM y encontrar la diferencia exacta.
```

---

## Workflow 3: Pedir optimización de performance

```
1. Describir qué se percibe (lentitud, parpadeo, recargas)
2. Pedir que se revisen renders antes de tocar nada
3. No hacer cambios si el problema no está confirmado
```

**Prompt tipo:**
```
El home parece re-renderizar más de lo necesario cuando [X].
Revisá renders en [componente] sin tocar nada todavía.
Si encontrás el problema, proponé el fix mínimo.
```

---

## Workflow 4: Pedir ajuste de data flow

```
1. Describir qué dato falta o llega mal
2. Indicar desde qué fuente debería venir
3. Pedir revisión del hook antes de tocar componentes
```

**Prompt tipo:**
```
Los [combos/productos/locales] no aparecen cuando [condición].
El hook retorna [X] pero debería retornar [Y].
Revisá useProducts() y el fallback antes de tocar la UI.
```

---

## Workflow 5: Pedir una nueva skill

```
1. Describir la tarea repetitiva que se quiere documentar
2. Indicar qué archivos suele tocar
3. Usar el template en structure/create-new-skill-template.md
```

**Prompt tipo:**
```
Quiero crear una nueva skill para la tarea: [descripción].
Usá el template en docs/ai/skills/structure/create-new-skill-template.md.
Categoría sugerida: [ux/data/debug/conversion/performance/whatsapp].
```

---

## Workflow 6: Documentar un bug resuelto

```
1. Agregar una entrada en BUGS_LEARNINGS.md con el formato estándar
2. Incluir: bug, causa, fix, archivo, test, cómo evitarlo
3. Si el bug estaba relacionado con un patrón de UX, agregar también en UI_UX_RULES.md
```

---

## Workflow 7: Actualizar contexto después de un cambio importante

Después de un cambio que afecte arquitectura, datos o UX:
```
1. Actualizar ARCHITECTURE.md si cambia la estructura de archivos o hooks
2. Actualizar DATA_FLOW.md si cambia cómo circula la data
3. Actualizar BUGS_LEARNINGS.md si se resolvió un bug
4. Actualizar GROWTH_BACKLOG.md si se completó un ítem o surgió una idea nueva
```

---

## Cómo usar estas skills en EnCasa Venezuela

### Reutilizar una skill

1. Ir a `docs/ai/SKILL_INDEX.md` y encontrar la skill por categoría
2. Abrir el archivo de la skill
3. Copiar el prompt de "Instrucciones para Claude Code"
4. Adaptarlo con el contexto específico del cambio
5. Ejecutar con Claude Code

### Encadenar skills en tareas grandes

Ejemplo: mejorar conversión del home completo
```
1. Ejecutar conversion/home-order-priority → reordenar secciones
2. Ejecutar ux/home-rappi-sections → ajustar visual de cada sección
3. Ejecutar conversion/sticky-whatsapp-checkout → optimizar CTA
4. Ejecutar ux/mobile-scroll-feedback → verificar táctil en todo
5. Documentar en BUGS_LEARNINGS.md si apareció algo nuevo
```

### Documentar lo aprendido después de cada cambio

Cada cambio importante debe dejar rastro. El mínimo:
- Si resolvió un bug → nueva entrada en `BUGS_LEARNINGS.md`
- Si cambió un patrón de UX → actualizar `UI_UX_RULES.md`
- Si cambió la arquitectura → actualizar `ARCHITECTURE.md`

### Convertir tareas repetitivas en skills nuevas

Si una tarea se repite más de 2 veces, vale la pena convertirla en skill:
1. Usar `structure/create-new-skill-template.md`
2. Completar todos los campos con contexto real
3. Guardar en la carpeta de categoría correspondiente
4. Agregar al índice en `SKILL_INDEX.md`

### Trabajar con Claude Code con menos fricción y menos riesgo

- **Dar contexto antes del prompt**: mencionar el stack, el archivo, la referencia
- **Una tarea a la vez**: no pedir múltiples cambios en el mismo mensaje si son independientes
- **Siempre pedir que lea antes de editar**: "leé el archivo antes de proponer"
- **Dar la referencia de lo que funciona**: "igual que [componente X]"
- **Separar UX de lógica**: los cambios visuales y los de data son tareas distintas
- **Confirmar antes de refactors grandes**: cualquier cambio que toque más de 3 archivos merece una revisión previa
