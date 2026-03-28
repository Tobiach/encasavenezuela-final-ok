# 📊 MÉTRICAS — ENCASA VENEZUELA

**Última actualización:** 27 marzo 2026 | **Owner:** Freedom
**Framework:** AARRR (Pirate Metrics) + North Star Metric

---

## 🌟 NORTH STAR METRIC

```
GMV MENSUAL (Gross Merchandise Value)
= Total de ARS procesados por pedidos en la plataforma
```

**Por qué GMV y no revenue:**
- Revenue es lagging indicator (llega después)
- GMV refleja valor real para los locales
- Multiplica por tasa de comisión → revenue predecible
- Inversores lo miden → valuation = múltiplo del GMV

**Targets GMV:**

| Mes | GMV Target | Locales | Pedidos | AOV |
|-----|-----------|---------|---------|-----|
| Abril 2026 | $45-90M ARS | 15 | 150-200 | $300K ARS |
| Mayo 2026 | $80-120M ARS | 25 | 400-500 | $240K ARS |
| Junio 2026 | $160-200M ARS | 30 | 800-1K | $200K ARS |

*AOV = Average Order Value (ticket promedio)*

---

## 💰 MÉTRICAS DE REVENUE

### Fórmulas base

```
Revenue mensual = Σ (GMV_local × tasa_comisión) + Σ fees_mensuales

Tasa comisión por plan:
  Básico:  12% del GMV
  Pro:     6% del GMV + $50K ARS fee
  Premium: 4% del GMV + $85K ARS fee

Break-even por plan (mes donde Pro > Básico para el local):
  Pro vale la pena cuando: GMV > $833K ARS/mes
  Premium vale la pena cuando: GMV > $2M ARS/mes
```

### Revenue proyectado mes 1

```
Escenario conservador:
  5 locales básicos × $3M ARS GMV × 12% = $1.8M ARS = ~$1,800 USD ❌
  (poco realista para mes 1)

Escenario realista:
  10 locales básicos × $1M ARS GMV × 12% = $1.2M ARS comisiones
  + servicios IA: $500K ARS
  Total: ~$1.7M ARS = ~$1,700 USD ✅

Escenario optimista:
  5 locales pro × $1.5M ARS GMV × 6% + fees = $700K ARS
  10 locales básicos × $800K ARS GMV × 12% = $960K ARS
  Total: ~$1.66M ARS = ~$1,660 USD + servicios IA ✅
```

### KPIs de Revenue

| KPI | Fórmula | Target Mes 1 | Target Mes 3 |
|-----|---------|-------------|-------------|
| MRR (en USD) | Revenue mensual recurrente | $850-$2,000 | $3,000-$4,300 |
| ARPL | Revenue total ÷ locales activos | $60-$130 USD | $120-$150 USD |
| Commission Rate Effective | Revenue comisiones ÷ GMV | ~10% | ~8% |
| Fee Revenue | Σ fees premium+pro | $0 (mes 1 gratis) | $500+ USD |

*ARPL = Average Revenue Per Local*

---

## 🏴‍☠️ FRAMEWORK AARRR

### A — ACQUISITION (Adquisición de locales)

**¿Cómo conseguimos nuevos locales?**

| Canal | Método | Target Mes 1 | Costo |
|-------|--------|-------------|-------|
| Puerta a puerta | Muñeca visita locales | 10 locales | $0 |
| Referidos | Local activo refiere otro | 3 locales | $0 |
| Instagram | DMs a locales venezolanos CABA | 2 locales | $0 |
| Total | | **15 locales** | **$0** |

**KPIs de Acquisition:**

```
Tasa de conversión de visita = Locales cerrados ÷ Locales visitados
Target: >30% (1 de cada 3 visitas cierra)

Tiempo de ciclo de venta = Días desde primera visita hasta go-live
Target: <4 días

Costo de adquisición (CAC) = Gasto total ÷ Locales adquiridos
Target: $0 (sin gasto en ads mes 1)
```

---

### A — ACTIVATION (Primer valor real)

**Definición de local "activado":**
> Local tiene su perfil live Y recibió al menos 1 pedido real

**KPIs de Activation:**

```
Tasa de activación = Locales con 1+ pedidos ÷ Locales con perfil live
Target: >80% en primeros 7 días

Time to first order = Días desde go-live hasta primer pedido
Target: <3 días

Onboarding completion rate = Locales que completan checklist ÷ Locales iniciados
Target: 100% (si no terminan el onboarding, no lanzamos)
```

---

### R — RETENTION (Retención de locales)

**¿Los locales siguen usando la plataforma?**

```
Retención Mes 1 = Locales activos al día 30 ÷ Locales que hicieron go-live
Target: >85%

Retención Mes 3 = Locales activos al día 90 ÷ Locales onboardeados
Target: >70%

Churn mensual = Locales que se van ÷ Locales totales al inicio del mes
Target: <10%
```

**Señales de riesgo de churn:**
- Sin pedidos en 7 días
- No responde mensajes de check-in
- Quejas sobre el sistema

**Acción preventiva:** Check-in automático a los 7 días si no hay pedidos

---

### R — REFERRAL (Referidos)

**Los locales traen otros locales**

```
Referral Rate = Nuevos locales por referido ÷ Locales totales
Target mes 2: >20% (1 de cada 5 locales viene por referido)

Viral Coefficient (K) = Referidos por local × Tasa de conversión de referido
K > 1 = crecimiento orgánico exponencial (objetivo mes 3-6)
```

**Programa de referidos (a implementar mes 2):**
- Local que refiere → 1 mes sin comisión o fee reducido
- Incentivo para referidos: onboarding prioritario

---

### R — REVENUE (Ya cubierto arriba)

---

## 📦 MÉTRICAS DE PRODUCTO (Lado usuarios/clientes)

### KPIs de demanda

| KPI | Fórmula | Target Mes 1 |
|-----|---------|-------------|
| Pedidos totales | Conteo de pedidos completados | 150-200 |
| AOV (ticket promedio) | GMV ÷ pedidos | $300K ARS (~$300 USD) |
| Repeat Rate | Clientes con 2+ pedidos ÷ clientes totales | >30% |
| Conversion Rate | Pedidos iniciados ÷ visitas a checkout | >60% |
| Abandonment Rate | 100% - Conversion Rate | <40% |

### Eventos a trackear (implementar en código)

```typescript
// Evento 1: Usuario agrega producto al carrito
trackEvent('add_to_cart', {
  local_id: string,
  product_id: string,
  product_name: string,
  price: number,
  quantity: number
})

// Evento 2: Usuario inicia checkout
trackEvent('checkout_initiated', {
  local_id: string,
  cart_total: number,
  items_count: number
})

// Evento 3: Pedido confirmado (redirect a WhatsApp)
trackEvent('order_completed', {
  local_id: string,
  order_total: number,
  items_count: number,
  plan: 'basico' | 'pro' | 'premium'
})

// Evento 4: Usuario visita perfil de local
trackEvent('store_view', {
  local_id: string,
  source: 'home' | 'search' | 'direct'
})
```

---

## 🏪 MÉTRICAS POR LOCAL (Dashboard futuro)

Cada local debería ver en su dashboard:

```
Resumen semanal:
  - Pedidos recibidos: 23
  - GMV semanal: $890,000 ARS
  - Ticket promedio: $38,700 ARS
  - Producto más vendido: Arepa de Pabellón (8 unidades)
  - Horario pico: Sábado 13-15hs

Comparativa vs semana anterior:
  - Pedidos: +15% ↑
  - GMV: +22% ↑
  - Ticket promedio: +6% ↑
```

---

## 💸 MÉTRICAS FINANCIERAS (Supervivencia)

### Burn Rate y Runway

```
Burn rate mensual: $1,780 USD
  Personal (Freedom + Muñeca): $1,600 USD
  Tech stack: $80 USD
  Legal/otros: $100 USD

Runway actual: 30 días (hasta 27 abril 2026)
Capital disponible: <$100 USD

Runway = Capital disponible ÷ Burn rate mensual
         = $100 ÷ $1,780 = 0.056 meses = ~2 días de buffer

⚠️ CRÍTICO: Depende 100% de ingresos de este mes
```

### Umbrales de decisión

```
$0 - $500 USD/mes   → CRISIS: activar plan de emergencia
$500 - $1,000 USD   → SOBREVIVIR: seguir igual, buscar proyectos IA
$1,000 - $1,780 USD → CASI: optimizar gastos, acelerar ventas
$1,780 USD          → BREAKEVEN: cubrimos todos los gastos
$2,500+ USD         → CRECIMIENTO: reinvertir en adquisición
$5,000+ USD         → ESCALA: contratar, expandir a Córdoba
$10,000+ USD        → OBJETIVO VALIDADO ✅
```

---

## 📅 CADENCIA DE REVISIÓN

| Frecuencia | Qué revisar | Quién |
|-----------|------------|-------|
| **Diario** | Pedidos del día, locales activos, problemas | Freedom |
| **Semanal (viernes)** | GMV, revenue, comisiones a cobrar, nuevos locales | Freedom + Muñeca |
| **Mensual** | Todos los KPIs, retención, proyección mes siguiente | Ambos |
| **Trimestral** | OKRs, estrategia, expansión | Ambos |

### Dashboard diario (5 minutos)

```
Abrir Notion → "Finanzas" → Ver:
  ✅ Pedidos de ayer: ___
  ✅ GMV acumulado del mes: ___
  ✅ Locales activos: ___
  ✅ Incidencias: ___
```

---

## 🎯 OKRs MES 1 (Abril 2026)

**Objective:** Validar product-market fit con primeros locales

| Key Result | Métrica | Target | Tracking |
|-----------|---------|--------|---------|
| KR1 | Locales onboardeados | 15 | Notion "Locales" |
| KR2 | Pedidos totales | 150-200 | Notion "Finanzas" |
| KR3 | Revenue mensual | $850-$2,000 USD | Notion "Finanzas" |
| KR4 | NPS locales | >8/10 | Survey manual |
| KR5 | Tiempo onboarding | <4 horas | Planilla tiempo |
| KR6 | Retención día 30 | >85% | Notion "Locales" |

---

*Métricas v1.0 — Agregar Google Analytics o Posthog en mes 2 para datos automáticos*
