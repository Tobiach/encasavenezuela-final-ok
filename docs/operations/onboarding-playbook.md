# 📋 ONBOARDING PLAYBOOK — LOCALES VENEZOLANOS

**Última actualización:** 27 marzo 2026 | **Owner:** Freedom + Muñeca
**Objetivo:** Onboardear un local en <4 horas de trabajo total, en 4 días

---

## 🎯 OBJETIVO DEL PLAYBOOK

Convertir un local venezolano en un local activo en EnCasa Venezuela en **4 días**, con:
- Perfil publicado en el marketplace
- Productos cargados con fotos
- Primer pedido vía WhatsApp
- Local capacitado para operar de forma autónoma

**Meta mes 1:** 15 locales (5 Premium, 10 Básico)
**Tiempo máximo por local:** 4 horas de trabajo nuestro

---

## 📅 TIMELINE — 4 DÍAS

```
Día 1 (30 min) → Reunión de cierre + firma
Día 2 (60 min) → Recolección de info + fotos
Día 3 (90 min) → Setup técnico + carga en Supabase
Día 4 (60 min) → Review + go-live + capacitación
─────────────────────────────────────────────
Total: ~4 horas de trabajo nuestro
```

---

## ✅ CHECKLIST MAESTRO

### FASE 1 — PRE-ONBOARDING (Día 1)

**Reunión de cierre (30 min en el local)**

- [ ] Presentar planes y elegir el correcto (Básico/Pro/Premium)
- [ ] Confirmar mes 1 gratis → "Validamos juntos, sin riesgo"
- [ ] Firmar Acuerdo de Participación (ver [templates/contracts/](../../templates/contracts/))
- [ ] Foto del encargado/dueño para el perfil
- [ ] Tomar foto de la fachada del local (portada)
- [ ] Obtener número de WhatsApp oficial del local
- [ ] Confirmar horarios de atención
- [ ] Confirmar barrios/zonas de entrega
- [ ] Confirmar monto mínimo de pedido (recomendado: $5,999 ARS o más)
- [ ] Acordar fecha de go-live (Día 4)
- [ ] Agregar local a Notion → base de datos "Locales"

**Datos a recolectar en Día 1:**

```
Nombre del local: _______________
Nombre del dueño: _______________
WhatsApp (con código país): +54___________
Instagram: @_______________
Dirección: _______________
Barrios que cubre: _______________
Horario lunes-viernes: _______________
Horario fin de semana: _______________
Monto mínimo de pedido: $_______________
Plan elegido: [ ] Básico  [ ] Pro  [ ] Premium
Fecha go-live acordada: _______________
```

---

### FASE 2 — RECOLECCIÓN DE CONTENIDO (Día 2)

**Setup fotográfico (60 min en el local o remoto)**

- [ ] Fotos de portada (3 opciones, elegir mejor)
- [ ] Fotos de productos (mínimo 20 para Básico, 50+ para Premium)
  - Fondo blanco o neutro
  - Buena iluminación (luz natural si es posible)
  - Producto centrado, sin sombras duras
- [ ] Lista completa de productos con:
  - Nombre exacto del producto
  - Precio (en ARS)
  - Categoría (Arepas / Tequeños / Bebidas / Combos / etc.)
  - Descripción corta (1 línea)
  - Si tiene variantes (tamaño, relleno, etc.)

**Template de carga de productos:**

```csv
nombre,precio,categoria,descripcion,imagen
"Arepa de Pabellón","2500","Arepas","Carne mechada, caraotas, tajadas y queso","arepa_pabellon.jpg"
"Tequeño x6","3200","Tequeños","6 tequeños de queso mozzarella","tequeno_x6.jpg"
```

- [ ] Subir fotos a Supabase Storage bucket `imagenes`
- [ ] Nombrar archivos: `[nombre_producto_sin_espacios].jpg`

---

### FASE 3 — SETUP TÉCNICO (Día 3)

**Carga en Supabase (90 min)**

- [ ] Crear registro en tabla `stores`:
  ```sql
  INSERT INTO stores (id, name, description, whatsapp, address,
                      barrios, horario, img_path, min_order, plan)
  VALUES ('slug-del-local', 'Nombre del Local', 'Descripción...',
          '+5491112345678', 'Dirección',
          ARRAY['Palermo', 'Recoleta'],
          'Lun-Vie 10-22hs / Sab-Dom 11-21hs',
          'portada_local.jpg', 5999, 'basico');
  ```
- [ ] Cargar todos los productos en tabla `products`
- [ ] Verificar que todas las imágenes cargan correctamente
- [ ] Verificar link de WhatsApp (formato: `wa.me/549XXXXXXXXXX`)
- [ ] Testear flujo completo: agregar producto → checkout → mensaje WhatsApp
- [ ] Corregir errores encontrados

**QR Code para el local:**

- [ ] Generar QR hacia `encasavenezuela-final-ok.vercel.app/#/store/[slug]`
- [ ] Herramienta: qr-code-generator.com (gratis)
- [ ] Tamaño mínimo: 5x5cm para impresión
- [ ] Imprimir y preparar para entrega en Día 4

---

### FASE 4 — GO-LIVE Y CAPACITACIÓN (Día 4)

**Review final (30 min remoto o presencial)**

- [ ] Compartir link del perfil del local con el dueño
- [ ] Revisar juntos:
  - Fotos y precios correctos
  - Descripción del local
  - Horarios y barrios
- [ ] Hacer ajustes finales si hay correcciones
- [ ] Confirmar que el WhatsApp recibe mensajes correctamente

**Capacitación del local (30 min)**

- [ ] Mostrar cómo llegan los pedidos por WhatsApp
- [ ] Explicar el mensaje automático que recibirán (formato con productos + total)
- [ ] Definir protocolo de respuesta: responder en <15 min
- [ ] Entregar QR físico para el local
- [ ] Explicar qué hacer si hay un problema (contacto directo con Freedom/Muñeca)
- [ ] Pedir que hagan un pedido de prueba ellos mismos

**Go-live checklist:**

- [ ] Publicar post en @encasavenezuela anunciando el local (Pro/Premium)
- [ ] Enviar mensaje de bienvenida al dueño
- [ ] Agregar local como "Activo" en Notion
- [ ] Agendar check-in a los 7 días

---

### FASE 5 — POST GO-LIVE (Día 7 y Día 30)

**Check-in semana 1 (15 min por WhatsApp)**

- [ ] ¿Recibieron pedidos? ¿Cuántos?
- [ ] ¿Tuvieron algún problema técnico?
- [ ] ¿El flujo de WhatsApp funciona bien?
- [ ] ¿Necesitan ajustar algo del perfil?
- [ ] Compartir primeras métricas: visitas al perfil, pedidos

**Check-in mes 1 (30 min reunión)**

- [ ] Revisar métricas del mes
- [ ] Recoger testimonial (foto + texto para RRSS)
- [ ] Proponer upgrade de plan si el volumen lo justifica:
  - +$833K ARS/mes → Pro vale la pena
  - +$2M ARS/mes → Premium vale la pena
- [ ] Renovar o formalizar contrato de pago

---

## 📱 SCRIPTS DE COMUNICACIÓN

### WhatsApp — Mensaje post-reunión de cierre

```
Hola [NOMBRE]! 🇻🇪

Gracias por la reunión de hoy. Estamos armando el perfil de [LOCAL]
en EnCasa Venezuela.

Necesito estos datos para avanzar:
1. Lista de productos con precios
2. Fotos de los productos (o las tomamos nosotros)
3. Horarios exactos
4. Barrios/zonas que cubren

Arrancamos el [FECHA] y hacemos go-live el [FECHA+3 días].

Cualquier duda me escribís directamente acá. 💪
```

### WhatsApp — Mensaje de go-live

```
🎉 [LOCAL] ya está EN VIVO en EnCasa Venezuela!

Tu perfil: encasavenezuela-final-ok.vercel.app/#/store/[slug]

Los pedidos te van a llegar directo por este WhatsApp con el
detalle completo. Solo tenés que confirmar y coordinar la entrega.

El QR para el local te lo mando/llevo hoy.

¿Alguna duda antes de arrancar? 🚀
```

### WhatsApp — Check-in semana 1

```
Hola [NOMBRE]! ¿Cómo va la primera semana?

Quería saber:
✅ ¿Recibiste pedidos?
✅ ¿El sistema funciona bien?
✅ ¿Algo para ajustar?

Si querés ver tus métricas o cambiar algo del perfil, avisame! 💪
```

---

## 🎯 CRITERIOS DE ÉXITO POR FASE

| Fase | Criterio | Tiempo máximo |
|------|----------|---------------|
| Cierre | Acuerdo firmado + datos básicos | Día 1 |
| Contenido | 20+ fotos + lista de productos | Día 2 |
| Setup | Perfil live + testeo OK | Día 3 |
| Go-live | Local operando autónomamente | Día 4 |
| Retención | Local activo al día 30 | Día 30 |

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

| Problema | Causa | Solución |
|----------|-------|----------|
| Local no envía fotos | No tienen tiempo o no saben | Ir al local a tomar fotos (30 min) |
| WhatsApp no recibe mensajes | Número incorrecto | Verificar formato +549XXXXXXXXXX |
| Imágenes no cargan | Nombre de archivo con espacios | Renombrar sin espacios ni acentos |
| Local no responde pedidos | No entienden el sistema | Re-capacitar, simplificar |
| Piden más tiempo para decidir | Frío/miedo | Recordar: mes 1 gratis, sin riesgo |

---

## 📊 TRACKING EN NOTION

Cada local onboardeado va a la base de datos **"Locales"** en Notion con:

```
- Nombre del local
- Plan (Básico/Pro/Premium)
- Fecha de inicio
- Fecha go-live
- Estado (Prospecto/Onboarding/Activo/Churned)
- Pedidos totales
- GMV total
- Comisiones generadas
- NPS del local (0-10)
- Notas
```

---

*Playbook v1.0 — Actualizar cuando el tiempo promedio de onboarding cambie*
