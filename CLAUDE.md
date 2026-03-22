# CLAUDE.md — Instrucciones permanentes para Claude Code

Al iniciar cada sesión, leer este archivo y confirmar con:
**"📋 CLAUDE.md cargado — protecciones activas"**

---

## 1. Advertencia antes de acciones irreversibles o de alto impacto

Antes de ejecutar cualquier acción listada en la sección 2, mostrar obligatoriamente:

```
⚠️ ACCIÓN IRREVERSIBLE O DE ALTO IMPACTO
Esto va a: [descripción de lo que va a hacer]
¿Confirmás que querés continuar?
```

Esperar confirmación explícita del usuario antes de proceder.

---

## 2. Acciones consideradas irreversibles o de alto impacto

### Base de datos
- `DROP TABLE`, `DROP TYPE`, `DROP SCHEMA`
- `DELETE FROM` sin cláusula `WHERE`
- `TRUNCATE`
- Cualquier script en `scripts/` que conecte a la base de datos de producción (usa `DATABASE_URL` o `DATABASE_DIRECT_URL`)

### Sistema de archivos
- `rm`, `rmdir`, eliminación de archivos o carpetas
- Sobrescribir archivos que no hayan sido leídos previamente en la sesión

### Git
- `git push --force`
- `git reset --hard`
- `git rebase` sobre commits ya pusheados

### Archivos críticos del proyecto
- Modificar `.env.local`
- Modificar `lib/supabase.ts`
- Modificar `src/App.tsx` en secciones que afecten autenticación o lógica del carrito

---

## 3. Comportamiento general

- Operar en **español** en todas las respuestas
- Ser directo y eficiente — no repetir lo que el usuario ya dijo, no agregar relleno
- Leer los archivos antes de proponer cambios
- Preferir ediciones puntuales sobre reescrituras completas
- No crear archivos nuevos salvo que sean estrictamente necesarios

---

## 4. Stack del proyecto

- **Frontend:** React + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Router:** HashRouter (React Router v7)
- **Hooks de datos:** `useStores()` y `useProducts()` con caché de módulo
- **Imágenes:** Supabase Storage bucket `imagenes`, accedidas via `getImageUrl()`
- **Scripts DB:** `scripts/` — ejecutar con `npx tsx scripts/<nombre>.ts`

---

## 5. Convenciones importantes

- `stores[].id` = campo `slug` de la tabla `stores` (no el UUID)
- `img_path` en DB = nombre de archivo en el bucket (ej: `chocolate_savoy_carre1.png`)
- Feature flags en `src/App.tsx`: `FEATURE_LOYALTY = false`, `FEATURE_RADAR = false`
- PanaChef AI está desactivada temporalmente (`geminiWorker.ts` retorna stub)
- `.env.local` está en `.gitignore` — nunca commitear
