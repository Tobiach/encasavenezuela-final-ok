# 🗺️ ROADMAP DE PRODUCTO — ENCASA VENEZUELA

**Última actualización:** 27 marzo 2026 | **Owner:** Freedom
**Horizonte:** Abril 2026 → Diciembre 2026 (9 meses)
**Filosofía:** Revenue antes que features. Cada decisión debe responder: ¿esto ayuda a facturar en los próximos 30 días?

---

## CÓMO LEER ESTE ROADMAP

- **NOW:** Implementar este mes. Sin esto no cumplimos el objetivo.
- **NEXT:** Candidato para el mes siguiente. No tocar hasta cerrar el NOW.
- **NEVER (por ahora):** Evaluado y rechazado explícitamente. No reabrir sin datos que justifiquen.
- **Esfuerzo:** S = <4hs / M = 4-16hs / L = 16-40hs / XL = +40hs

---

## MES 1 — ABRIL 2026
### "Sobrevivir y validar"

**Objetivo principal:** 15 locales activos + primer revenue real
**Revenue target:** $850-$2,000 USD
**Runway al inicio:** 30 días

---

### NOW (implementar en abril)

| Feature | Prioridad | Esfuerzo | Impacto |
|---------|-----------|----------|---------|
| Migrar PromotionDetailView a Supabase | CRÍTICA | L | Imágenes rotas corregidas, locales editan combos sin deploy |
| Pipeline de ventas en Notion (kanban) | CRÍTICA | S | Muñeca trackea 15 locales sin perder ninguno |
| Onboarding checklist físico (PDF/papel) | ALTA | S | Reduce tiempo onboarding a <4 horas |
| QR codes por local (generación batch) | ALTA | S | Activa canal físico de pedidos desde día 1 |
| Fix imágenes rotas en producción | ALTA | M | UX básica funcional para primeros clientes |
| Google Analytics básico (pageviews) | MEDIA | S | Datos mínimos para demostrar traction a inversores |

**Ya implementado en abril:**
- ✅ Analytics tracking (encasaTrack) — 5 eventos activos (27 marzo 2026)
- ✅ Playbook de onboarding documentado
- ✅ Scripts de ventas documentados

### NEXT (candidato mayo)
- Dashboard de métricas para locales
- Optimización de imágenes (lazy loading)
- Testimoniales automatizados post-pedido

### NEVER (abril)
- ❌ Sistema de reviews — no tenemos volumen suficiente para que sea útil
- ❌ App mobile — focus en web, conversión primero
- ❌ Pagos online — WhatsApp→transferencia funciona, no agregar complejidad

### Métricas de éxito
- [ ] 15 locales con perfil live
- [ ] 150-200 pedidos completados
- [ ] $850+ USD revenue (mínimo supervivencia)
- [ ] NPS locales >8/10
- [ ] Tiempo onboarding <4 horas (promedio)
- [ ] 0 imágenes rotas en producción

---

## MES 2 — MAYO 2026
### "Optimizar el funnel"

**Objetivo principal:** Retener los 15 locales + cerrar 10 nuevos = 25 locales
**Revenue target:** $1,500-$2,600 USD (breakeven)
**Runway al inicio:** Depende de mayo — si no hay revenue, crisis

---

### NOW (implementar en mayo)

| Feature | Prioridad | Esfuerzo | Impacto |
|---------|-----------|----------|---------|
| Dashboard básico para locales (pedidos, GMV, top products) | CRÍTICA | L | Locales ven valor real → reducen churn |
| Google Analytics completo + eventos | ALTA | M | Datos de conversión para optimizar |
| Migración completa a Supabase (si no se hizo en abril) | ALTA | L | Elimina tech debt bloqueante |
| Optimización de imágenes (lazy loading + compresión) | ALTA | M | Performance en mobile (+40% usuarios) |
| WhatsApp automation end-to-end test | ALTA | M | Validar que Make funciona correctamente |
| Upsell automático: sugerir upgrade de plan a Básico→Pro | MEDIA | S | Revenue incremental sin nuevos locales |

### NEXT (candidato junio)
- Landing page personalizada por local (`/[slug]`)
- Sistema de reviews básico (estrellitas + texto)
- Notificaciones push (requiere auth)

### NEVER (mayo)
- ❌ Chat en vivo — costo $50/mes, no tenemos volumen para justificarlo
- ❌ Integración POS — solo si 3+ locales Premium lo piden explícitamente
- ❌ Programa de fidelización complejo — Premium only, mes 4+

### Métricas de éxito
- [ ] 20-25 locales activos
- [ ] 400-500 pedidos totales en el mes
- [ ] $1,500+ USD revenue
- [ ] Repeat customer rate >30%
- [ ] AOV >$10,000 ARS
- [ ] Churn de locales <10%
- [ ] Al menos 3 locales en plan Pro o Premium (pagando)

---

## MES 3 — JUNIO 2026
### "Escalar con datos"

**Objetivo principal:** 30 locales + $3K+ USD/mes = independencia financiera
**Revenue target:** $3,000-$4,300 USD ✅ objetivo cumplido
**Hito clave:** Si llegamos a $3K, empezamos a preparar fundraising

---

### NOW (implementar en junio)

| Feature | Prioridad | Esfuerzo | Impacto |
|---------|-----------|----------|---------|
| Landing pages por local (`encasavenezuela.com/[slug]`) | CRÍTICA | L | SEO orgánico, link compartible, diferenciador Premium |
| Sistema de reviews v1 (estrellitas + texto libre) | ALTA | L | Trust para nuevos usuarios, justify Premium |
| Reportes ejecutivos semanales para locales Pro/Premium | ALTA | M | Retención de locales pagos |
| Pitch deck para micro-fundraising (seed) | ALTA | M | Si llegamos a $3K/mes, somos fundables |
| Automatizar onboarding (formulario self-service) | MEDIA | L | Escalar sin aumentar tiempo de Muñeca |

### NEXT (candidato julio)
- Programa de referidos (local refiere a otro local)
- Mercado Pago integración básica
- Expansión a Córdoba (research + primer local)

### NEVER (junio)
- ❌ Notificaciones push — requiere auth robusta, no es prioridad vs revenue
- ❌ Video profesional mensual para locales — demasiado operativo para el equipo de 2
- ❌ Fotografía profesional — igual que video, escalar primero

### Métricas de éxito
- [ ] 30 locales activos (10 Premium, 20 Básico/Pro)
- [ ] 800-1,000 pedidos en el mes
- [ ] $3,000+ USD revenue ✅
- [ ] Repeat rate >50%
- [ ] Pitch deck listo y validado
- [ ] Al menos 1 local con landing page dedicada live

---

## MES 4 — JULIO 2026
### "Primer crecimiento real"

**Objetivo principal:** Rentabilidad + explorar expansión geográfica
**Revenue target:** $5,000-$7,000 USD
**Hito clave:** ¿Arrancamos Córdoba?

---

### NOW

| Feature | Prioridad | Esfuerzo | Impacto |
|---------|-----------|----------|---------|
| Programa de referidos locales | ALTA | M | K > 1 = crecimiento sin costo de adquisición |
| Mercado Pago integración básica | ALTA | XL | Cierra el gap de pagos online, aumenta conversión |
| Onboarding completamente automatizado | ALTA | L | Escalar sin tiempo lineal de Muñeca |
| Análisis de expansión Córdoba (research) | MEDIA | S | Decidir con datos si vale la pena |
| A/B test: precio monto mínimo ($5,999 vs $8,000 ARS) | MEDIA | S | Encontrar precio óptimo para AOV |

### NEXT (candidato agosto)
- Primer local en Córdoba (si research lo valida)
- Notificaciones push v1
- Dashboard analytics avanzado

### Decisiones de mes 4
- **¿Expandir a Córdoba?** Solo si: >25 locales activos en CABA y revenue >$5K/mes
- **¿Contratar?** Solo si revenue >$5K/mes Y hay tarea operativa que toma >20hs/semana

### Métricas de éxito
- [ ] 35-40 locales activos (15 Pro/Premium)
- [ ] $5,000+ USD revenue
- [ ] Al menos 3 locales referidos por otros locales
- [ ] Decision go/no-go Córdoba tomada con datos

---

## MES 5 — AGOSTO 2026
### "Dos ciudades o profundizar CABA"

**Objetivo principal:** Consolidar modelo en CABA o empezar Córdoba
**Revenue target:** $6,000-$8,000 USD

---

### NOW (uno de dos paths)

**Path A — Córdoba:**
| Feature | Esfuerzo |
|---------|----------|
| Adaptar marketplace para multi-ciudad | L |
| Onboarding primer local Córdoba | M |
| Marketing local en Córdoba (RRSS) | S |

**Path B — Profundizar CABA:**
| Feature | Esfuerzo |
|---------|----------|
| Notificaciones push v1 | L |
| Loyalty básico (puntos simples) | L |
| Programa de reseñas incentivado | M |

### Decisión de mes 5
El path lo decide el dato: si hay locales venezolanos en Córdoba que nos contactaron, vamos. Si no, profundizamos CABA.

### Métricas de éxito
- [ ] 40-50 locales activos
- [ ] $6,000+ USD revenue
- [ ] Si Córdoba: 3+ locales activos allá
- [ ] NPS de usuarios finales >7/10 (primeras encuestas)

---

## MES 6 — SEPTIEMBRE 2026
### "Preparar para escalar"

**Objetivo principal:** $10K/mes en el horizonte + fundraising activo
**Revenue target:** $8,000-$10,000 USD

---

### NOW

| Feature | Prioridad | Esfuerzo |
|---------|-----------|----------|
| Pitch deck definitivo para investors | CRÍTICA | M |
| Automatizar cobro de comisiones (hoy manual cada viernes) | ALTA | L |
| App mobile v1 (solo iOS/Android wrapper del web) | ALTA | XL |
| Sistema de partnerships formales (Harina PAN, Maltin Polar) | MEDIA | M |

### NEVER (hasta tener funding)
- ❌ Tecnología de IA propia — usar APIs existentes (Gemini, OpenAI)
- ❌ Contratar equipo de más de 2 personas antes de $10K/mes
- ❌ Oficina física — remote-first siempre

### Métricas de éxito
- [ ] $8,000+ USD revenue
- [ ] Pitch deck con datos reales (no proyecciones)
- [ ] Primera reunión con al menos 1 inversor
- [ ] Cobro de comisiones automatizado (ahorra 4hs/semana)

---

## MES 7-9 — OCT-DIC 2026
### "Fundraising + expansión LATAM"

**Objetivo principal:** Cerrar ronda seed ($150K-$300K) + expansión a Chile
**Revenue target:** $10,000+ USD/mes

---

### Q4 high-level

| Hito | Mes |
|------|-----|
| Primera reunión con inversores formales | Octubre |
| Decision go/no-go Chile | Octubre |
| App mobile en stores (si hay budget) | Noviembre |
| Cerrar ronda seed (si hay interés) | Noviembre-Diciembre |
| Primer local en Chile | Diciembre (si aplica) |

### Features Q4 (si hay funding)
- Sistema de autenticación robusto con perfiles de usuario
- POS integration con los 3+ locales que lo pidan
- Marketing automation (emails, push, SMS)
- Analytics dashboard para inversores (métricas en tiempo real)
- Onboarding completamente self-service (sin intervención humana)

### Features Q4 (sin funding — bootstrapped)
- Optimizar conversión con A/B tests sistemáticos
- Upsell Premium agresivo en locales que alcanzan break-even
- Programa de afiliados para creadores de contenido venezolano
- Partnerships con comunidades venezolanas (grupos de Fb, WhatsApp comunitarios)

---

## BACKLOG PERMANENTE (nunca entra al roadmap sin validación)

| Feature | Por qué no está en el roadmap |
|---------|-------------------------------|
| Chat en vivo con locales | Zendesk/Intercom $50+/mes, no crítico |
| Sistema de puntos de fidelización complejo | Mes 4+ solo, distrae mes 1-3 |
| Integración con POS | Solo si 3+ Premium lo piden activamente |
| Reviews con foto/video | Lujo, después de reviews básicas funcionando |
| Mapa de locales cercanos (FEATURE_RADAR) | Nice to have, no mueve la aguja |
| Delivery propio | Capital intensivo, Rappi ya lo hace |
| App nativa (no wrapper) | Caro ($30K+), no hay datos que lo justifiquen |

---

## PRINCIPIOS DEL ROADMAP

1. **No agregar features que no tienen champion** — si ningún local lo pidió, no entra
2. **Revenue blocker = prioridad absoluta** — si algo frena ventas, se hace antes que todo
3. **Deuda técnica solo si bloquea growth** — imágenes rotas bloquean, código feo no
4. **Cada feature tiene métricas de éxito** — si no sabemos cómo medir el éxito, no la hacemos
5. **"Fast with bugs" hasta $10K/mes** — después, calidad sobre velocidad

---

*Roadmap v1.0 — Revisar y actualizar primer viernes de cada mes. Si cambia el runway o el revenue, actualizar inmediatamente.*
