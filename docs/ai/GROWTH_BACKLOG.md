# GROWTH_BACKLOG.md — Ideas de crecimiento priorizadas

## Criterio de priorización

| Criterio | Descripción |
|---|---|
| **Impacto** | ¿Cuánto acerca al usuario al pedido? (1-5) |
| **Complejidad** | ¿Qué tan difícil es implementar? (1=fácil, 5=difícil) |
| **Riesgo** | ¿Puede romper algo existente? (bajo/medio/alto) |

---

## Backlog activo

### 🟡 ALTA PRIORIDAD — Alto impacto, baja complejidad

| ID | Idea | Impacto | Complejidad | Riesgo |
|---|---|---|---|---|
| G-01 | Reordenar home: lo más pedido primero, luego combos, luego categorías | 5 | 1 | bajo |
| G-02 | CTA "Pedir por WhatsApp" sticky en la parte inferior | 5 | 2 | bajo |
| G-03 | Badge visual "Nuevo" en productos recientes | 3 | 1 | bajo |
| G-04 | Badge "Oferta" con porcentaje de descuento en cards de catálogo | 4 | 1 | bajo |
| G-05 | Mensaje de WhatsApp más claro: incluir imagen, precio, local | 5 | 2 | bajo |

---

### 🟠 MEDIA PRIORIDAD — Buen impacto, complejidad moderada

| ID | Idea | Impacto | Complejidad | Riesgo |
|---|---|---|---|---|
| G-06 | Sección "Lo más pedido" con productos destacados | 4 | 2 | bajo |
| G-07 | Sección "Nuevos ingresos" con productos de la semana | 3 | 2 | bajo |
| G-08 | Recompra rápida: últimos productos vistos | 4 | 3 | medio |
| G-09 | Búsqueda rápida por nombre de producto | 4 | 3 | medio |
| G-10 | Filtro por precio en catálogo | 3 | 2 | bajo |
| G-11 | Página de local con todos sus productos | 4 | 3 | medio |

---

### 🔵 BAJA PRIORIDAD — Valor diferencial, mayor esfuerzo

| ID | Idea | Impacto | Complejidad | Riesgo |
|---|---|---|---|---|
| G-12 | Sistema de favoritos con localStorage | 3 | 3 | bajo |
| G-13 | Compartir producto por link | 3 | 2 | bajo |
| G-14 | Notificaciones push de ofertas | 3 | 5 | alto |
| G-15 | Historial de pedidos | 3 | 4 | medio |
| G-16 | Reviews de productos | 3 | 4 | alto |
| G-17 | Sección de recetas venezolanas con ingredientes del catálogo | 4 | 4 | bajo |

---

## Ideas descartadas (por ahora)

- Carrito propio con checkout nativo → complejidad alta, cambiaría el modelo de negocio
- Login obligatorio → fricción alta, impacto negativo en conversión
- App nativa (React Native) → muy pronto en el ciclo
- Sistema de puntos/fidelización (FEATURE_LOYALTY=false) → desactivado intencionalmente

---

## Próximos pasos sugeridos

1. Completar G-01 + G-02 + G-05 en el mismo sprint (3 cambios de bajo riesgo, alto impacto)
2. Luego G-06 + G-07 (aprovechan datos ya disponibles en useProducts)
3. Evaluar G-09 cuando el catálogo supere los 50 productos activos
