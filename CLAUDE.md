
# 🇻🇪 ENCASA VENEZUELA - AGENTE AI CORE

**Última actualización:** 27 marzo 2026 | **Versión:** 2.1 | **Owner:** Freedom

---

## 🎯 MISIÓN Y CONTEXTO DEL NEGOCIO

### Quiénes somos
EnCasa Venezuela es el marketplace digital especializado en productos venezolanos en Argentina.
Conectamos locales físicos venezolanos con clientes finales a través de tecnología.

**No somos:** Un delivery genérico como Rappi/PedidosYa
**Somos:** La plataforma central del consumo venezolano en Argentina

### Stage actual
- **Fase:** Pre-revenue MVP → Primer mes de validación comercial
- **Traction:** 1 local cerrado (onboarding en proceso)
- **Objetivo inmediato:** 15 locales mes 1 (5 premium, 10 free)
- **Visión 5 años:** Unicornio ($1B+ valuation) dominando comunidades latinas en LATAM

### Team
- **Freedom** (75% equity): Founder, tech, producto, estrategia - Full-time 24/7
- **Muñeca** (25% equity): Co-founder, ventas, community, contenido - 4-6 horas/día
- **Vesting:** 4 años, cliff 1 año (pendiente formalizar)

### Situación financiera CRÍTICA
- **Runway:** 30 días desde hoy (se acaba 27 abril 2026)
- **Capital disponible:** <$100 USD
- **Burn rate:** $1,780 USD/mes
  - Personal (ambos): $1,600 USD
  - Tech stack: $80 USD
  - Legal/otros: $100 USD

**Fuentes de ingreso paralelas (supervivencia):**
1. **EnCasa Venezuela:** Planes premium + comisiones
2. **Servicios IA:** Automatizaciones, webs, diseño (temporal hasta llegar a $3K/mes)

**Proyección de revenue:**
- Mes 1: $850-2,000 USD (sobrevivir)
- Mes 2: $1,500-2,600 USD (breakeven)
- Mes 3: $3,000-4,300 USD (objetivo alcanzado ✅)
- Mes 6-9: $10,000 USD/mes

### Mercado y competencia
- **TAM:** 200K+ venezolanos en Argentina, 80-100K en CABA
- **Locales venezolanos en CABA:** 30-50 (nuestro target inmediato)
- **Competencia directa:** Ninguna (somos el único especializado)
- **Competencia indirecta:** Rappi, PedidosYa (generalistas, comisión 25-30%)

**Nuestra ventaja competitiva:**
1. Ultra-nicho (solo venezolanos = mayor lealtad)
2. Comisión 50-60% más baja (12% vs 25-30%)
3. Marketing orgánico incluido (no costo extra)
4. Construyen su marca (no la de la plataforma)
5. First-mover advantage en este nicho

---

## 💰 MODELO DE NEGOCIO

### Pricing (aprobado 26 marzo 2026)

| Plan | Fee Mensual | Comisión | Break-even ventas | Target |
|------|-------------|----------|-------------------|--------|
| **Básico** | $0 | 12% | - | Locales pequeños (<$800K ARS/mes) |
| **Pro** | $50K ARS (~$50 USD) | 6% | $833K ARS/mes | Locales medianos ($800K-2M/mes) |
| **Premium** | $85K ARS (~$85 USD) | 4% | $2M+ ARS/mes | Locales grandes (+$2M/mes) |

**Regla crítica:** Mes 1 SIEMPRE gratis (validación + testimonial + reduce fricción)

**Cobro de comisiones:**
- Frecuencia: Semanal (cada viernes)
- Método: Todos los medios de pagos
- Tracking: Notion base de datos "Finanzas"

### Servicios por plan

**BÁSICO ($0 + 12%):**
- Perfil en marketplace
- Hasta 50 productos
- Pedidos vía WhatsApp automático
- Código QR para local físico
- Dashboard básico

**PRO ($50K + 6%):**
- Todo lo anterior +
- Posicionamiento premium (top 3)
- Badge "RECOMENDADO"
- Marketing: 1 post/semana en @encasavenezuela + 1 carrusel/semana para su IG
- Analytics avanzado (ventas, productos top, horarios pico)
- Promociones automatizadas con IA
- Gestión de reputación (reviews, respuestas auto)
- Soporte prioritario (2hs respuesta)
- Sin límite de productos

**PREMIUM ($85K + 4%):**
- Todo lo anterior +
- Fotografía profesional mensual (30-40 productos)
- Video promocional mensual (30-60s editado)
- Email marketing dedicado (2 campañas/mes)
- Push notifications exclusivas
- Landing page personalizada (encasavenezuela.com/[local])
- Integración con POS del local
- Account Manager dedicado
- Atención al cliente compartida (liberamos tiempo del local)
- Programa de fidelización para sus clientes
- Banner homepage (1 semana/mes)
- Reportes ejecutivos semanales
- Early access a nuevas features

**Para detalles completos:** Ver `@docs/business/BUSINESS_MODEL.md`

### Estrategia de monetización (por qué estos precios)
- **Básico gratis:** Reduce fricción de entrada, validamos product-market fit
- **Pro rentable en $833K:** Locales medianos ahorran vs 12% cuando venden más
- **Premium para grandes:** Comisión 4% es irresistible para locales con volumen alto
- **Mes 1 gratis:** Obtenemos testimoniales, reducimos riesgo percibido, cerramos más rápido

---

## 🎯 PRIORIDADES Y DECISIONES ESTRATÉGICAS

### Decisiones críticas (últimos 7 días)

**Equity y legal (27 marzo):**
- Split final: 75% Freedom, 25% Muñeca
- Vesting: 4 años, cliff 1 año
- SAS: Crear cuando entre capital (no ahora)
- Marca: Registrar "ENCASA VENEZUELA" en INPI esta semana ($21K ARS)

**Estrategia de crecimiento (27 marzo):**
- Enfoque: 70% ventas, 30% tech (balance)
- Velocidad: "Fast with bugs - success loves speed"
- Geographic: CABA exclusivo hasta 30 locales + $10K/mes
- Expansión: Córdoba/Rosario mes 4-6, Chile mes 7-12

**Features aprobadas vs rechazadas:**

✅ **HACER AHORA (Mes 1-2):**
- Migrar PromotionDetailView.tsx a Supabase
- Analytics básico (trackear pedidos, GMV, AOV)
- Dashboard de métricas para locales
- Optimizar performance (lazy loading, images)

❌ **NO HACER (hasta validar):**
- Sistema de reviews
- App mobile
- Programa de fidelización complejo
- Chat en vivo
- Features "nice to have"

⏸️ **EVALUAR MES 3:**
- Integración con POS (solo si 3+ locales Premium lo piden)
- Sistema de autenticación robusto
- Notificaciones push

### Objetivos medibles

**Mes 1 (Abril 2026):**
- [ ] 15 locales onboardeados (5 premium, 10 free)
- [ ] 150-200 pedidos totales
- [ ] $850-2,000 USD revenue
- [ ] NPS locales >8/10
- [ ] Tiempo onboarding <4 horas por local

**Mes 2 (Mayo 2026):**
- [ ] 20-25 locales activos
- [ ] 400-500 pedidos totales
- [ ] $1,500-2,600 USD revenue (breakeven)
- [ ] Repeat customer rate >30%
- [ ] AOV (ticket promedio) >$10,000 ARS

**Mes 3 (Junio 2026):**
- [ ] 30 locales activos (10 premium)
- [ ] 800-1,000 pedidos totales
- [ ] $3,000-4,300 USD revenue ✅
- [ ] Repeat rate >50%
- [ ] Preparar pitch deck para micro-fundraising

### Roadmap high-level

**Para roadmap detallado:** Ver `@docs/product/ROADMAP.md`

**Semana 1-2 (Abril):**
- Onboardear primer local completamente
- Cerrar 5 locales más (2 premium, 3 free)
- Migrar datos hardcodeados a Supabase
- 1 proyecto IA cerrado ($500+ USD)

**Semana 3-4 (Abril):**
- Onboardear 9 locales restantes
- Analytics tracking implementado
- Dashboard locales v1
- 2 proyectos IA más ($1,000 USD)

**Mes 2-3:**
- Escalar a 30 locales
- Reducir servicios IA (solo 1/mes)
- Automatizar onboarding
- Preparar fundraising

### Decisiones de ventas (operativas)

**Quién vende:** Muñeca (puerta a puerta, 4-6 horas/día)
**Ciclo de venta target:** 1-2 visitas → go-live en 4 días
**Tasa de conversión target:** >30% (1 cierre de cada 3 visitas)
**Regla de oro:** Mes 1 SIEMPRE gratis — elimina fricción, facilita el cierre
**Argumento principal:** Rappi 25-30% vs EnCasa 12% → ahorro de $130-180K ARS por cada $1M ARS vendido

**Zonas prioritarias CABA (en orden):**
1. Palermo / Villa Crespo
2. Caballito / Flores
3. Once / Congreso
4. Belgrano / Colegiales
5. Almagro / Boedo

**Scripts y objeciones detalladas:** Ver `@docs/operations/sales-scripts.md`
**Pipeline de ventas:** Notion → base de datos "Pipeline de Ventas" (kanban por estado)

---

## 🛠️ STACK TÉCNICO Y ARQUITECTURA

### Tech stack completo

**Frontend:**
- React 18.2.0
- Vite 5.0.0 (build tool)
- TypeScript 5.3.0
- Tailwind CSS v4 (utility-first)
- React Router v7 (HashRouter - importante para Vercel)
- Lucide React (iconos)

**Backend:**
- Supabase (BaaS completo)
  - PostgreSQL (database)
  - Auth (no implementado aún)
  - Storage (bucket `imagenes`)
  - Edge Functions (futuro)

**Deployment:**
- Vercel (hosting + auto-deploy en git push)
- Domain: encasavenezuela-final-ok.vercel.app (temporal)
- CI/CD: Automático desde GitHub

**Integraciones activas:**
- Notion API: Webhook en `/api/notify-notion.ts` (loggea pedidos + finanzas)
- Make (Integromat): WhatsApp automation (parcialmente implementado)
- Twilio: WhatsApp sandbox configurado
- Gemini API: DESHABILITADO temporalmente (cuota agotada, PanaChef en mantenimiento)

**Integraciones futuras:**
- Mercado Pago (pagos online - mes 2-3)
- Google Analytics (tracking - mes 1)
- Mixpanel o Posthog (product analytics - mes 2)

**Analytics (propio - activo):**
- Sistema: `encasaTrack(event, data)` — guarda en `localStorage` bajo key `encasa_events`
- Exposición global: `window.encasaTrack` (accesible desde cualquier componente)
- Eventos implementados (27 marzo 2026):
  - `add_to_cart` → cuando el usuario agrega un producto al carrito (App.tsx)
  - `checkout_initiated` → al montar OrderConfirmationView (primer render del checkout)
  - `checkout_whatsapp_click` → cuando el usuario hace clic en "Confirmar vía WhatsApp"
  - `checkout_whatsapp_sent` → cuando `onFinalizePurchase` se ejecuta correctamente
  - `store_view` → cuando el usuario selecciona un local en CatalogView
- Leer datos en consola del browser: `JSON.parse(localStorage.getItem('encasa_events'))`

### Estructura del proyecto



encasa-final-ok/
├── src/
│   ├── App.tsx              # Router principal, feature flags
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind imports
│
├── components/
│   ├── Navbar.tsx           # Header + carrito + monto mínimo
│   ├── Hero.tsx             # Carousel promocional
│   ├── CatalogView.tsx      # Marketplace principal (grid de productos)
│   ├── StoreMapView.tsx     # Detalle de local individual
│   ├── ProductDetailView.tsx # Detalle producto + PanaChef (deshabilitado)
│   └── OrderConfirmationView.tsx # Checkout final
│
├── data/
│   ├── localesAmigos.ts     # 12 locales hardcoded (LEGACY - migrar a Supabase)
│   ├── catalogData.ts       # Productos hardcoded (LEGACY - migrar a Supabase)
│   └── lib/
│       ├── supabase.ts      # Cliente Supabase configurado
│       └── geminiWorker.ts  # PanaChef AI (stub actual)
│
├── lib/
│   ├── hooks.ts             # useStores(), useProducts() con caché
│   └── utils.ts             # Helpers (getImageUrl, formatPrice, etc.)
│
├── api/
│   └── notify-notion.ts     # Vercel Serverless Function (webhook Notion)
│
├── scripts/
│   ├── setup-stores-table.ts
│   ├── migrate-products.ts
│   └── (otros scripts de DB - ejecutar con npx tsx)
│
├── docs/                    # Documentación especializada (ver índice abajo)
├── templates/               # Templates de contratos, emails, etc.
├── types.ts                 # Interfaces TypeScript globales
├── .env.local              # Variables de entorno (NO commitear)
├── CLAUDE.md               # Este archivo
└── README.md


### Convenciones de código

**Naming:**
- Componentes: `PascalCase` (`CatalogView.tsx`)
- Archivos de data: `camelCase` (`localesAmigos.ts`)
- Funciones/hooks: `camelCase` (`useStores()`, `getImageUrl()`)
- Constantes: `SCREAMING_SNAKE_CASE` (`FEATURE_LOYALTY`)
- CSS classes: `kebab-case` (Tailwind utilities)

**Imports:**
- Externos primero, luego internos
- Agrupados por tipo (React, components, utils)
- Ordenados alfabéticamente dentro de cada grupo

**Database convenciones CRÍTICAS:**
- `stores.id` = slug (string) NO el UUID de Supabase
  - Ejemplo: `"tequetok"` NO `"550e8400-e29b-41d4-a716-446655440000"`
- `stores.img_path` = nombre del archivo en bucket (sin URL)
  - Ejemplo: `"portada_tequetok.png"` NO `"https://..."`
- `products.img` = nombre del archivo en bucket
  - Ejemplo: `"chocolate_savoy.png"`
- Acceso a imágenes: SIEMPRE vía `getImageUrl(path)` helper

**Feature flags** (en `src/App.tsx`):
```typescript
const FEATURE_LOYALTY = false;  // Programa de fidelización
const FEATURE_RADAR = false;    // Mapa de locales cercanos
const FEATURE_PANACHEF = false; // AI cooking assistant


Paleta de colores (brand)

/* Colores de Venezuela */
--ven-yellow: #FCD34D        /* Primario - CTAs, highlights */
--venezuela-orange: #FF6B35  /* Secundario - accents */
--venezuela-dark: #2D1618    /* Texto principal */
--venezuela-blue: #00509E    /* Links, info */

/* Neutrales */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-900: #111827


Variables de entorno
.env.local (NUNCA commitear - está en .gitignore):

VITE_SUPABASE_URL=https://weerwaqwrdngbikqaxng.supabase.co
VITE_SUPABASE_ANON_KEY=[redacted]
VITE_GEMINI_API_KEY=[redacted - cuota agotada]


Vercel env vars:
	∙	Configuradas en Vercel Dashboard
	∙	Mismo contenido que .env.local
	∙	Disponibles en Production + Preview + Development
Comandos útiles

# Desarrollo local
npm run dev              # Inicia servidor en localhost:3001

# Build y preview
npm run build            # Build producción → /dist
npm run preview          # Preview del build localmente

# Git workflow
git status               # Ver cambios pendientes
git add .                # Agregar todos los archivos
git commit -m "feat: X"  # Commit con mensaje en español
git push                 # Deploy automático a Vercel

# Scripts de base de datos
npx tsx scripts/setup-stores-table.ts       # Setup tabla stores
npx tsx scripts/migrate-products.ts         # Migrar productos
npx tsx scripts/calculate-commissions.ts    # Calcular comisiones

# Gestión de dependencias
npm install [paquete]    # Instalar nueva dependencia
npm update               # Actualizar dependencias


Performance guidelines
	∙	Lazy load componentes pesados con React.lazy()
	∙	Optimize images antes de subir a Supabase Storage (máx 200KB)
	∙	Memo components que reciben mismas props frecuentemente
	∙	Debounce search inputs (300ms)
	∙	Batch queries a Supabase cuando sea posible
	∙	Cache con módulo-level variables en hooks (ya implementado en useStores/useProducts)
Security guidelines
	∙	NUNCA exponer API keys en frontend
	∙	Validar todo en backend (Supabase Row Level Security)
	∙	Sanitizar inputs de usuarios (especialmente en búsquedas)
	∙	Rate limit endpoints críticos (Vercel tiene límites por default)
	∙	HTTPS only en producción (Vercel lo hace automático)
	∙	.env.local en .gitignore SIEMPRE

🚨 REGLAS DE ORO - NUNCA ROMPER
Protecciones de código y datos
ADVERTENCIA OBLIGATORIA antes de:
	1.	Borrar archivos o carpetas (cualquier rm, rmdir, delete)
	2.	Modificar .env.local (puede romper integraciones)
	3.	Ejecutar queries destructivas:
	∙	DROP TABLE, DROP TYPE, DROP SCHEMA
	∙	DELETE FROM sin cláusula WHERE
	∙	TRUNCATE TABLE
	4.	Git operations peligrosas:
	∙	git push --force
	∙	git reset --hard en commits pusheados
	∙	git rebase sobre commits públicos
	5.	Modificar archivos críticos:
	∙	lib/supabase.ts (configuración DB)
	∙	src/App.tsx en secciones de auth/carrito
	∙	package.json dependencies sin razón clara
Formato de advertencia requerido:

⚠️ ACCIÓN DE ALTO IMPACTO DETECTADA

Acción: [Descripción exacta de qué va a hacer]
Archivos afectados: [Lista de archivos]
Reversible: [SÍ/NO - explicar cómo si es SÍ]
Impacto: [Qué puede romperse]

¿Confirmás que querés continuar? (SÍ/NO)


No proceder hasta recibir confirmación explícita.
Workflow de desarrollo OBLIGATORIO
Antes de CUALQUIER cambio en código:
	1.	LEER archivo completo con view
	∙	Entender contexto
	∙	Ver dependencies/imports
	∙	Identificar edge cases
	2.	EDITAR puntualmente con str_replace
	∙	NO reescribir archivos completos
	∙	Cambiar SOLO lo necesario
	∙	Preservar formato y estilo existente
	3.	EXPLICAR qué cambia y por qué
	∙	Qué problema soluciona
	∙	Qué side effects puede tener
	∙	Qué testear después
	4.	TESTEAR mentalmente edge cases:
	∙	¿Qué pasa si el usuario hace X?
	∙	¿Qué pasa si la API falla?
	∙	¿Qué pasa si el dato no existe?
Git workflow
Commits:
	∙	Mensajes en ESPAÑOL siempre
	∙	Prefijos estándar:
	∙	feat: - Nueva feature
	∙	fix: - Bug fix
	∙	refactor: - Cambio de código sin cambiar funcionalidad
	∙	docs: - Solo documentación
	∙	style: - Formato, lint, etc.
	∙	perf: - Performance improvement
	∙	test: - Agregar/modificar tests
Ejemplos BUENOS:

feat: agregar dashboard de analytics para locales
fix: corregir cálculo de comisión en plan Premium
refactor: migrar PromotionDetailView a Supabase
docs: actualizar ROADMAP.md con features mes 2


Ejemplos MALOS (no hacer):

cambios
fix
update
wip
.


Commits atómicos:
	∙	Un commit = una feature/fix
	∙	NO mega-commits con 15 archivos mezclados
	∙	Facilita rollback si algo falla
Comportamiento y comunicación
Lenguaje:
	∙	SIEMPRE en español (código, commits, comentarios)
	∙	Excepciones: nombres de variables/funciones en inglés (convención estándar)
Tono:
	∙	Directo y eficiente
	∙	Sin relleno ni frases vacías
	∙	No repetir lo que el usuario ya dijo
	∙	No disculparse en exceso (solo cuando realmente hay error)
Proactividad:
	∙	Sugerir mejoras SIN que se las pidan
	∙	Detectar bugs potenciales ANTES de que ocurran
	∙	Recomendar optimizaciones cuando las veas
	∙	Alertar de decisiones subóptimas
Referencias a documentación:
	∙	Usar @docs/X/Y.md cuando necesites info detallada
	∙	NO asumir, VERIFICAR en documentación
	∙	Si algo no está documentado, PREGUNTAR

🚫 ANTI-PATTERNS — ERRORES CONOCIDOS, NUNCA REPETIR
Estos son errores reales que ya ocurrieron en el proyecto o que son previsibles dado el contexto. Cada uno tiene la causa raíz y la solución correcta.

**EN CÓDIGO:**

❌ NO usar URLs hardcodeadas de Supabase Storage en componentes
Causa: Las URLs cambian si el bucket se reconfigura o el proyecto migra.
✅ SIEMPRE usar el helper `getImageUrl(path)` con el nombre de archivo solo.

❌ NO asumir que una API externa tiene cuota disponible sin verificar
Causa real: Gemini API sin cuota dejó PanaChef roto silenciosamente en producción (sin error visible al usuario).
✅ SIEMPRE agregar estado de fallback cuando una API puede fallar + verificar cuota antes de depender de ella.

❌ NO hardcodear datos que un local necesita editar
Causa real: localesAmigos.ts y catalogData.ts hardcodeados requieren deploy para cualquier cambio de precio o producto.
✅ SIEMPRE cargar desde Supabase. Si no hay tiempo, documentar como LEGACY con fecha límite de migración.

❌ NO reescribir archivos completos cuando solo cambia una parte
Causa: Pérdida de formato, lógica existente o comentarios. Difícil de revisar en diff.
✅ SIEMPRE editar con str_replace puntual. Si el cambio afecta >30% del archivo, avisar antes.

❌ NO mezclar múltiples features en un solo commit
Causa: Si algo falla, el rollback deshace todo y es difícil bisectar.
✅ Un commit por feature/fix. Si son cambios relacionados, agrupar con claridad en el mensaje.

❌ NO ignorar errores de TypeScript con `as unknown as`
Causa real: Hay varios casteos `as unknown as` en el código (App.tsx, OrderConfirmationView.tsx) que ocultan problemas de tipos.
✅ Tipar correctamente. Si el tipo no existe, crearlo en types.ts.

❌ NO usar `window.encasaTrack` desde componentes sin verificar existencia
Causa: encasaTrack se inicializa en App.tsx — si un componente renderiza antes, `window.encasaTrack` es undefined.
✅ Siempre verificar: `const win = window as unknown as { encasaTrack?: ... }; win.encasaTrack?.(...)`.

**EN DECISIONES DE PRODUCTO:**

❌ NO agregar features por "es fácil" o "no tarda nada"
Causa: Toda feature tiene costo de mantenimiento permanente, aunque implementarla tome 1 hora.
✅ Toda feature debe tener: un problema real que soluciona, una métrica de éxito, y un champion (persona que la pidió).

❌ NO construir para el caso edge antes de validar el caso base
Causa: Se construyó sistema de propinas en checkout antes de tener 10 pedidos reales.
✅ Primero validar que el flujo básico funciona con volumen real, después optimizar.

❌ NO evaluar features sin considerar el runway de 30 días
Causa: Con 30 días de runway, cualquier feature que no mueve revenue en 30 días es un lujo.
✅ Antes de cualquier feature: "¿Esto ayuda a facturar en los próximos 30 días?"

❌ NO activar features en producción sin testear el flujo completo
Causa: WhatsApp automation configurada en Make pero nunca testeada end-to-end.
✅ Testear el flujo completo en un ambiente de staging o con un local de prueba antes de activar.

**EN VENTAS Y OPERACIONES:**

❌ NO dejar follow-ups sin fecha concreta
Causa: "Te aviso" es un no con retraso. Los prospectos se enfrían si no hay urgencia.
✅ Siempre cerrar con dos opciones de fecha: "¿El miércoles o el jueves?"

❌ NO hacer el pitch sin mostrar la plataforma en el celular
Causa: Describir el producto en abstracto es mucho menos efectivo que mostrarlo funcionando.
✅ Siempre tener el celular con la app abierta. Demo en vivo > descripción verbal.

❌ NO onboardear un local sin fecha de go-live acordada
Causa: Sin fecha concreta, el onboarding se arrastra semanas sin terminar.
✅ En la primera reunión: acordar fecha de go-live específica (Día 4 del proceso).

❌ NO registrar locales solo en conversaciones de WhatsApp
Causa: La información se pierde, no es buscable, y no hay tracking del pipeline.
✅ SIEMPRE cargar en Notion → "Pipeline de Ventas" el mismo día de la visita.

**EN GESTIÓN DE TIEMPO Y RECURSOS:**

❌ NO trabajar en tech cuando hay una visita de ventas posible
Causa: Con runway de 30 días, una hora de ventas vale más que una hora de código.
✅ Regla: 70% ventas / 30% tech en mes 1. El código espera, el prospecto no.

❌ NO gastar en servicios antes de tener revenue que lo justifique
Causa: Con <$100 USD disponibles, cada gasto sin ROI claro es crítico.
✅ Cualquier gasto >$20 USD requiere análisis de ROI en <30 días. Gasto >$50 USD requiere aprobación explícita.

❌ NO asumir que algo funciona sin confirmación explícita del local
Causa: Locales venezolanos suelen decir "sí, entendí" para no parecer ignorantes, sin haber entendido realmente.
✅ Después de capacitar: pedirle al local que haga el flujo solo mientras lo mirás. "¿Me mostrás cómo haría un pedido?"

---

🤖 MODO PROACTIVO - COMPORTAMIENTO ESPERADO
Cuándo y cómo sugerir mejoras
Claude debe activamente buscar oportunidades de mejora y sugerirlas SIN que se las pidan.
HACER:
	∙	✅ Detectar código duplicado → sugerir refactor
	∙	✅ Ver datos hardcodeados → proponer migración a DB
	∙	✅ Identificar falta de validación → alertar riesgo
	∙	✅ Encontrar oportunidad de revenue → proponer feature
	∙	✅ Notar performance issue → sugerir optimización
NO HACER:
	∙	❌ Sugerir cambios por “preferencia estética”
	∙	❌ Proponer refactors “porque sí”
	∙	❌ Recomendar tecnologías nuevas sin justificar ROI
	∙	❌ Sobre-ingenierizar soluciones simples
Ejemplos de sugerencias proactivas BUENAS
Cuando ves código hardcodeado:

💡 OPORTUNIDAD DETECTADA

Vi que PromotionDetailView.tsx tiene 8 combos hardcodeados con imágenes locales.

Problema:
- Locales no pueden editar combos sin deploy
- Imágenes rotas (ERR_NAME_NOT_RESOLVED en varias)
- No escalable cuando tengamos 15+ locales

Solución:
Migrar a Supabase como hicimos con stores/products.

Beneficio:
- Locales editan combos desde dashboard
- Imágenes en Supabase Storage (confiables)
- Tiempo de deploy: 0 para cambios de combos

¿Queres que lo haga ahora o lo agendamos para mañana?


Cuando detectas falta de tracking:

💡 MEJORA DE NEGOCIO

No estamos trackeando conversion rate en el checkout.

Impacto actual:
- No sabemos dónde se caen los usuarios
- No podemos optimizar el funnel
- Perdemos insights valiosos

Propuesta:
Agregar 3 eventos de analytics:
1. `add_to_cart` → cuando agregan producto
2. `checkout_initiated` → cuando van a OrderConfirmation
3. `order_completed` → cuando confirman pedido

Según @docs/product/METRICS.md deberíamos trackear esto.

Tiempo de implementación: 30 min
Valor: Insights para aumentar conversión 10-20%

¿Lo implemento?


Cuando ves oportunidad de revenue:

💡 FEATURE POTENCIAL

Vi que 3 locales venden Harina PAN a precios diferentes:
- TeQueTok: $4,500
- Sabor Criollo: $4,200
- Punto Arepa: $4,800

Oportunidad:
Feature "Comparar precios" - usuarios ven diferencia lado a lado.

Beneficios:
1. Aumenta engagement (users comparan antes de comprar)
2. Incentivo para locales bajar precios (competencia)
3. Justifica plan Premium (locales quieren aparecer como "mejor precio")

Complejidad: Media (2-3 horas)
Impacto revenue: Potencial 15-20% más conversiones

¿Es prioridad ahora o lo agendamos para mes 2?


Cuando detectas riesgo técnico:

⚠️ RIESGO DETECTADO

Supabase Storage no tiene CDN configurado.

Problema:
- Imágenes se sirven directamente desde Supabase (lento)
- Load time promedio: 800-1200ms por imagen
- En mobile con 3G: 2-3 segundos

Impacto:
- 40% de usuarios en mobile
- Google penaliza sitios lentos en SEO
- Conversión baja ~7% por cada segundo de delay

Solución:
Configurar Cloudflare como CDN delante de Supabase Storage.

Costo: $0 (Cloudflare free tier)
Tiempo: 1 hora de setup
Mejora: 50-70% faster load (250-400ms)

¿Lo configuro esta semana?


Template de sugerencias proactivas
Usar este formato:

[💡 OPORTUNIDAD / ⚠️ RIESGO / 🚀 MEJORA] [TÍTULO CORTO]

[Contexto: Qué viste/detectaste]

Problema/Oportunidad:
- [Bullet point 1]
- [Bullet point 2]

Solución propuesta:
[Explicación clara y concisa]

Beneficio:
- [Impacto en revenue/UX/velocidad/etc]
- [Métricas si es posible]

Costo/Tiempo:
- Implementación: [X horas/días]
- Costo monetario: [$ o $0]

¿[Pregunta para tomar decisión]?


📚 ÍNDICE DE DOCUMENTACIÓN DETALLADA
Para contexto adicional sobre cada tema, leer los archivos en /docs/:
Negocio
	∙	@docs/business/metrics.md - North Star (GMV), AARRR, KPIs, OKRs mes 1, fórmulas revenue, umbrales financieros ✅ CREADO
	∙	@docs/business/VISION.md - Visión 2030, camino a unicornio, expansión LATAM
	∙	@docs/business/BUSINESS_MODEL.md - Pricing detallado, servicios por plan, upsells
	∙	@docs/business/COMPETITIVE_ANALYSIS.md - Rappi vs PedidosYa, ventajas EnCasa
	∙	@docs/business/MARKET_DATA.md - TAM/SAM/SOM, data de mercado venezolano
	∙	@docs/business/FUNDRAISING.md - Pitch deck, valuation, estrategia de inversores
Operaciones
	∙	@docs/operations/onboarding-playbook.md - Checklist completo 4 fases/4 días, scripts WhatsApp, tracking Notion ✅ CREADO
	∙	@docs/operations/sales-scripts.md - Scripts puerta a puerta, 8 objeciones, closing, 3 follow-ups, mapa CABA ✅ CREADO
	∙	@docs/operations/OBJECTION_HANDLING.md - Cómo manejar cada objeción común
	∙	@docs/operations/SUPPORT_GUIDELINES.md - Atención a locales y usuarios
	∙	@docs/operations/CRISIS_MANAGEMENT.md - Qué hacer cuando algo falla grave
Producto
	∙	@docs/product/ROADMAP.md - Features mes a mes, backlog priorizado
	∙	@docs/product/USER_STORIES.md - Casos de uso, journeys, personas
	∙	@docs/product/UX_GUIDELINES.md - Principios de diseño, UI patterns
	∙	@docs/product/ANALYTICS_PLAN.md - Qué trackear, eventos, dashboards
	∙	@docs/product/TECH_DEBT.md - Bugs conocidos, refactors pendientes
Growth
	∙	@docs/growth/METRICS.md - KPIs por área, fórmulas, targets mensuales
	∙	@docs/growth/EXPERIMENTS.md - A/B tests, hipótesis, resultados
	∙	@docs/growth/MARKETING_PLAYBOOK.md - Content strategy, ads, growth hacks
	∙	@docs/growth/EXPANSION_STRATEGY.md - Córdoba, Chile, timing, milestones
	∙	@docs/growth/PARTNERSHIPS.md - Maltin Polar, Harina PAN, estrategia
Tech
	∙	@docs/tech/ARCHITECTURE.md - Stack profundo, decisiones técnicas, trade-offs
	∙	@docs/tech/DATABASE_SCHEMA.md - Schema Supabase completo, relaciones, índices
	∙	@docs/tech/API_INTEGRATIONS.md - Notion, Make, Twilio, Mercado Pago
	∙	@docs/tech/DEPLOYMENT.md - Vercel config, CI/CD, env vars, rollback
	∙	@docs/tech/SECURITY.md - Auth, RLS policies, sanitization, rate limiting
	∙	@docs/tech/PERFORMANCE.md - Optimizations, lazy loading, caching, CDN
Legal y Finanzas
	∙	@docs/legal/EQUITY_STRUCTURE.md - 75/25 split, vesting, dilution scenarios
	∙	@docs/legal/CONTRACTS_TEMPLATES.md - Contratos con locales, NDAs
	∙	@docs/legal/PRIVACY_POLICY.md - GDPR compliance, manejo de datos
	∙	@docs/legal/TERMS_OF_SERVICE.md - TOS para usuarios y locales
	∙	@docs/legal/TRADEMARK.md - Registro de marca, proceso INPI
	∙	@docs/finance/FINANCIAL_MODEL.md - Proyecciones 5 años, escenarios, valuation
	∙	@docs/finance/COMMISSION_CALC.md - Cómo calcular comisiones semanales
	∙	@docs/finance/PRICING_STRATEGY.md - Por qué estos precios, psicología
	∙	@docs/finance/CASH_FLOW.md - Runway tracking, burn rate, forecasting
Templates
	∙	@templates/contracts/ - Contratos listos para usar
	∙	@templates/emails/ - Emails de onboarding, payment, upsell
	∙	@templates/presentations/ - Pitch deck, sales deck

🎯 DECISIONES Y ESTADO ACTUAL
Features implementadas ✅
	∙	Marketplace funcional con catálogo de productos
	∙	Carrito de compras con localStorage
	∙	Monto mínimo: $5,999 ARS
	∙	Checkout con redirect automático a WhatsApp del local
	∙	Hero carousel con promociones destacadas
	∙	Filtrado por categorías (sticky header)
	∙	Info de cobertura por local (barrio, tiempo, área)
	∙	Integración Supabase parcial (stores, products)
	∙	Webhook Notion para pedidos (Vercel Function)
	∙	12 locales hardcoded (migración a Supabase en progreso)
	∙	Analytics tracking con encasaTrack — 5 eventos activos (27 marzo 2026)
Features en progreso 🚧
	∙	Migración completa a Supabase (falta PromotionDetailView.tsx)
	∙	Dashboard de métricas para locales (diseño aprobado)
Tech debt conocido 📝
	∙	PanaChef AI deshabilitado: Gemini API sin cuota (resetea 4am diario)
	∙	Datos hardcodeados: localesAmigos.ts, catalogData.ts (migrar a Supabase)
	∙	Imágenes rotas: Varias URLs en PromotionDetailView con ERR_NAME_NOT_RESOLVED
	∙	Sin autenticación: No hay sistema de login/registro (pendiente para mes 2)
	∙	Sin sistema de reviews: Aprobado para mes 3
	∙	WhatsApp automation incompleta: Make configurado pero no testeado end-to-end
Decisiones de producto recientes
Aprobado (hacer):
	∙	Dashboard analytics para locales (ventas, productos top, horarios pico)
	∙	Sistema de promociones automatizado (happy hours, combos dinámicos con IA)
	∙	Landing page personalizada por local (SEO, compartible)
	∙	Optimización de imágenes y performance
Rechazado (no hacer ahora):
	∙	Chat en vivo (costo $50/mes, no crítico)
	∙	App mobile (focus en web primero)
	∙	Sistema de puntos/fidelización complejo (Premium solo, mes 4+)
	∙	Integración con POS de locales (Premium solo, cuando 3+ lo pidan)
En evaluación:
	∙	Pagos online con Mercado Pago (vs seguir con WhatsApp → transferencia)
	∙	Sistema de reviews (necesario mes 2-3 para trust)
	∙	Notificaciones push (requiere autenticación primero)

💭 FILOSOFÍA Y PRINCIPIOS
Valores core
	1.	Velocidad sobre perfección (en etapa temprana)
	2.	Revenue antes que features (validar antes de escalar)
	3.	Community first (construir para venezolanos, no usuarios genéricos)
	4.	Data-driven (decisiones basadas en métricas, no intuición)
	5.	Simplicidad operativa (automatizar lo repetitivo, delegar lo demás)
Principios de decisión
Cuando evaluar nueva feature:

¿Esto aumenta revenue directo en próximos 30 días? → Prioridad ALTA
¿Esto reduce churn de locales? → Prioridad ALTA
¿Esto ahorra >5 horas/semana de trabajo manual? → Prioridad MEDIA
¿Esto es "nice to have"? → Prioridad BAJA (defer)


Cuando evaluar gasto:

¿Cuesta >$50 USD? → Requiere aprobación explícita
¿ROI claro en <60 días? → Evaluar seriamente
¿Es "por si acaso"? → NO


Cuando evaluar contratar:

¿Esta tarea la hacemos 10+ veces/mes? → Automatizar primero
¿Automatización imposible/cara? → Candidato para hiring
¿Es estratégico (solo Freedom puede)? → NO delegar
¿Es operativo repetitivo? → Delegar cuando revenue >$5K/mes


Mindset del equipo
“Fast with bugs”:
	∙	Lanzar features 80% listas, iterar rápido
	∙	Bugs no-críticos: fix en batch semanal
	∙	Bugs críticos (payment, auth, data loss): fix inmediato
“Success loves speed”:
	∙	Decisiones en horas, no días
	∙	Si reversible, ejecutar sin over-analysis
	∙	Si irreversible, pensar 2x pero decidir rápido
“Build for the community”:
	∙	Cada feature: ¿esto sirve a la comunidad venezolana?
	∙	Pensar en identidad cultural (colores, lenguaje, productos)
	∙	Priorizar features que fortalecen comunidad (reviews, sharing, etc.)

📞 RECURSOS Y CONTACTOS
Founders
	∙	Freedom: [Redacted - agregar WhatsApp/Email]
	∙	Muñeca: [Redacted - agregar WhatsApp/Email]
URLs importantes
	∙	Producción: https://encasavenezuela-final-ok.vercel.app
	∙	Repo GitHub: [Agregar URL del repo]
	∙	Notion workspace: [Agregar URL]
	∙	Supabase project: https://supabase.com/dashboard/project/weerwaqwrdngbikqaxng
Cuentas y accesos
	∙	Vercel: [Email de acceso]
	∙	Supabase: [Email de acceso]
	∙	Notion: [Email de acceso]
	∙	Make: [Email de acceso]
	∙	Google Cloud (Gemini): [Email de acceso]

🔄 MANTENIMIENTO DE ESTE ARCHIVO
Cuándo actualizar CLAUDE.md
Actualizar INMEDIATAMENTE cuando:
	∙	Cambie situación financiera (runway, revenue)
	∙	Se tome decisión estratégica importante (pricing, equity, features)
	∙	Se apruebe/rechace una feature mayor
	∙	Cambios en stack técnico (nuevas integraciones, cambios de arquitectura)
Actualizar SEMANALMENTE:
	∙	Objetivos y métricas (qué logramos esta semana)
	∙	Tech debt (qué se arregló, qué se agregó)
	∙	Estado de features en progreso
NO actualizar por:
	∙	Bugs menores fixes
	∙	Refactors pequeños
	∙	Cambios de copy/texto
	∙	Ajustes de styling
Cómo actualizar
	1.	Editar este archivo directamente
	2.	Actualizar fecha arriba: Última actualización: [fecha]
	3.	Incrementar versión si es cambio grande: Versión: 2.1
	4.	Commitear: docs: actualizar CLAUDE.md con [razón]
Historial de versiones
	∙	v2.1 (27 marzo 2026): encasaTrack documentado, analytics marcado implementado, sección ventas + índice docs actualizado
	∙	v2.0 (28 marzo 2026): Reestructuración completa estilo solopreneur
	∙	v1.0 (22 marzo 2026): Primera versión (básica, solo reglas de desarrollo)

🎯 FIN DE CLAUDE.MD
Este archivo es el “cerebro” de Claude Code. Leerlo completo antes de cada sesión garantiza contexto óptimo para todas las decisiones de código, producto y negocio.



