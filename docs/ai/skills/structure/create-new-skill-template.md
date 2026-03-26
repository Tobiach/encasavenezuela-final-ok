# Skill: create-new-skill-template

## Objetivo
Crear una nueva skill bien estructurada, coherente con la librería existente y lista para ser ejecutada por Claude Code en EnCasa Venezuela.

## Cuándo usarla
- Una tarea se repitió 2 o más veces de forma similar
- Hay un patrón de trabajo que vale la pena estandarizar
- Se resolvió un bug y se quiere documentar el fix como skill reutilizable
- Se identifica una mejora recurrente que merece su propio workflow

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code

```
Quiero crear una nueva skill para la librería de EnCasa Venezuela.

Tarea que quiero documentar como skill:
[DESCRIBIR LA TAREA]

Categoría: [ux / conversion / performance / data / debug / whatsapp / structure]

Creá el archivo en: docs/ai/skills/[categoria]/[nombre-skill].md

Usá este template exacto:

---
# Skill: [nombre-legible]

## Objetivo
[1-2 oraciones: qué cambia, qué mejora]

## Cuándo usarla
[Situaciones concretas donde esta skill aplica]

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Mobile-first obligatorio
- No romper lógica existente
- No hacer refactors innecesarios

## Instrucciones para Claude Code
[Prompt operativo listo para ejecutar. Específico, con criterio quirúrgico.
Debe incluir: qué leer primero, qué cambiar, qué no tocar]

## Riesgos
[Qué puede romperse si se aplica mal]

## Test
[Pasos concretos para verificar que funcionó]

## Archivos que probablemente toque
[Lista orientativa de archivos]
---

Después de crear el archivo, agregá una entrada en docs/ai/SKILL_INDEX.md
con nombre, objetivo, cuándo usarla, archivos y nivel de riesgo.
```

## Riesgos
- Ninguno — este archivo solo crea documentación, no toca código

## Test
1. Verificar que el archivo nuevo existe en la carpeta de categoría correcta
2. Verificar que la entrada en SKILL_INDEX.md fue agregada
3. El prompt de la nueva skill debe ser ejecutable sin contexto adicional

## Archivos que probablemente toque
- `docs/ai/skills/[categoria]/[nombre-skill].md` (nuevo)
- `docs/ai/SKILL_INDEX.md` (actualización del índice)
