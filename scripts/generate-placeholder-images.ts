/**
 * generate-placeholder-images.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Genera imágenes placeholder 400×400 WebP con fondo blanco y texto del producto.
 * Solo usa Sharp (sin descargar nada de internet).
 * Luego podés reemplazarlas una a una con las fotos reales.
 *
 * Uso:
 *   npx tsx scripts/generate-placeholder-images.ts
 * ──────────────────────────────────────────────────────────────────────────────
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'imagenes_productos');
const SIZE = 400;

// Colores por categoría (fondo sutil diferente para distinguirlas visualmente)
const CATEGORY_COLORS: Record<string, { bg: string; accent: string }> = {
  Harinas:      { bg: '#FFF8F0', accent: '#D97706' },
  Cereales:     { bg: '#FFF8F0', accent: '#D97706' },
  Granos:       { bg: '#F0FFF4', accent: '#16A34A' },
  Secos:        { bg: '#FEFCE8', accent: '#CA8A04' },
  Lácteos:      { bg: '#F0F9FF', accent: '#0284C7' },
  Carnes:       { bg: '#FFF1F2', accent: '#BE123C' },
  Condimentos:  { bg: '#FFF7ED', accent: '#C2410C' },
  Salsas:       { bg: '#FFF7ED', accent: '#EA580C' },
  Untables:     { bg: '#FEFCE8', accent: '#CA8A04' },
  Bebidas:      { bg: '#EFF6FF', accent: '#1D4ED8' },
  Chucherías:   { bg: '#FDF4FF', accent: '#9333EA' },
  Snacks:       { bg: '#FFF7ED', accent: '#EA580C' },
  Preparados:   { bg: '#F0FDF4', accent: '#15803D' },
  Congelados:   { bg: '#EFF6FF', accent: '#2563EB' },
  Hogar:        { bg: '#F8FAFC', accent: '#475569' },
  default:      { bg: '#F9FAFB', accent: '#6B7280' },
};

interface ImageDef {
  filename: string;
  label: string;
  category: string;
  emoji: string;
}

const IMAGES: ImageDef[] = [
  // HARINAS
  { filename: 'harina_pan_blanca.webp',   label: 'Harina PAN\nBlanca 1kg',      category: 'Harinas',     emoji: '🌽' },
  { filename: 'harina_pan_amarilla.webp', label: 'Harina PAN\nAmarilla 1kg',    category: 'Harinas',     emoji: '🌽' },
  { filename: 'harina_maseca.webp',       label: 'Harina\nMaseca 1kg',          category: 'Harinas',     emoji: '🌽' },
  { filename: 'harina_morixe.webp',       label: 'Harina\nMorixe 1kg',          category: 'Harinas',     emoji: '🌾' },
  { filename: 'harina_cachapas.webp',     label: 'Harina para\nCachapas',       category: 'Harinas',     emoji: '🥞' },
  { filename: 'casabe.webp',              label: 'Casabe',                       category: 'Harinas',     emoji: '🫓' },
  // CEREALES
  { filename: 'fororo.webp',              label: 'Fororo',                       category: 'Cereales',    emoji: '🌾' },
  // GRANOS
  { filename: 'caraotas_negras.webp',     label: 'Caraotas\nNegras 500gr',      category: 'Granos',      emoji: '🫘' },
  // SECOS
  { filename: 'papelon_molido.webp',      label: 'Papelón\nMolido',             category: 'Secos',       emoji: '🍯' },
  { filename: 'papelon_panela.webp',      label: 'Papelón\nen Panela',          category: 'Secos',       emoji: '🍯' },
  // LÁCTEOS
  { filename: 'queso_duro.webp',          label: 'Queso\nDuro 1kg',             category: 'Lácteos',     emoji: '🧀' },
  { filename: 'queso_de_mano.webp',       label: 'Queso\nde Mano',              category: 'Lácteos',     emoji: '🧀' },
  { filename: 'nata_criolla.webp',        label: 'Nata\nCriolla',               category: 'Lácteos',     emoji: '🥛' },
  // CARNES
  { filename: 'chuleta_ahumada.webp',     label: 'Chuleta\nAhumada',            category: 'Carnes',      emoji: '🥩' },
  { filename: 'huesos_ahumados.webp',     label: 'Huesos\nAhumados',            category: 'Carnes',      emoji: '🦴' },
  { filename: 'chicharron.webp',          label: 'Chicharrón',                  category: 'Carnes',      emoji: '🥓' },
  // CONDIMENTOS
  { filename: 'adobo_criollo.webp',       label: 'Adobo\nCriollo',              category: 'Condimentos', emoji: '🧂' },
  { filename: 'aji_condimento.webp',      label: 'Ají',                         category: 'Condimentos', emoji: '🌶️' },
  // SALSAS
  { filename: 'salsa_inglesa.webp',       label: 'Salsa\nInglesa',              category: 'Salsas',      emoji: '🫙' },
  { filename: 'salsa_maiz.webp',          label: 'Salsa\nde Maíz',              category: 'Salsas',      emoji: '🌽' },
  { filename: 'salsa_ahumada.webp',       label: 'Salsa\nAhumada',              category: 'Salsas',      emoji: '🫙' },
  { filename: 'salsa_picante.webp',       label: 'Salsa\nPicante',              category: 'Salsas',      emoji: '🌶️' },
  { filename: 'salsa_cheddar.webp',       label: 'Salsa\nCheddar',              category: 'Salsas',      emoji: '🧀' },
  { filename: 'salsa_guasacaca.webp',     label: 'Salsa\nGuasacaca',            category: 'Salsas',      emoji: '🥑' },
  // UNTABLES
  { filename: 'mantequilla_qualy.webp',   label: 'Mantequilla\nQualy',          category: 'Untables',    emoji: '🧈' },
  { filename: 'mantequilla_danica.webp',  label: 'Mantequilla\nDanica',         category: 'Untables',    emoji: '🧈' },
  { filename: 'mavesa_mayonesa.webp',     label: 'Mavesa\nMayonesa',            category: 'Untables',    emoji: '🫙' },
  { filename: 'diablito_underwood.webp',  label: 'Diablito',                    category: 'Untables',    emoji: '👿' },
  { filename: 'rikesa.webp',              label: 'Rikesa',                      category: 'Untables',    emoji: '🍫' },
  // BEBIDAS
  { filename: 'cafe_fama_america.webp',   label: 'Café Fama\nde América',       category: 'Bebidas',     emoji: '☕' },
  { filename: 'toddy.webp',               label: 'Toddy',                       category: 'Bebidas',     emoji: '🍫' },
  { filename: 'nesquik.webp',             label: 'Nesquik',                     category: 'Bebidas',     emoji: '🐰' },
  { filename: 'nestea.webp',              label: 'Nestea',                      category: 'Bebidas',     emoji: '🍵' },
  { filename: 'tamarindo_bebida.webp',    label: 'Tamarindo',                   category: 'Bebidas',     emoji: '🥤' },
  { filename: 'reko_uva.webp',            label: 'Reko Uva',                    category: 'Bebidas',     emoji: '🍇' },
  { filename: 'reko_pina.webp',           label: 'Reko Piña',                   category: 'Bebidas',     emoji: '🍍' },
  { filename: 'reko_manzana.webp',        label: 'Reko Manzana',                category: 'Bebidas',     emoji: '🍎' },
  // CHUCHERÍAS
  { filename: 'obleas.webp',              label: 'Obleas',                      category: 'Chucherías',  emoji: '🍪' },
  { filename: 'pinguinito.webp',          label: 'Pinguinito',                  category: 'Chucherías',  emoji: '🐧' },
  { filename: 'flips_grande.webp',        label: 'Flips\nGrande',               category: 'Chucherías',  emoji: '🍬' },
  { filename: 'cocosete.webp',            label: 'Cocosete',                    category: 'Chucherías',  emoji: '🥥' },
  { filename: 'chupetas.webp',            label: 'Chupetas',                    category: 'Chucherías',  emoji: '🍭' },
  { filename: 'catalina_galleta.webp',    label: 'Catalina',                    category: 'Chucherías',  emoji: '🍪' },
  // SNACKS
  { filename: 'torontos.webp',            label: 'Torontos',                    category: 'Snacks',      emoji: '🍿' },
  { filename: 'savoy_chocolate.webp',     label: 'Savoy',                       category: 'Snacks',      emoji: '🍫' },
  { filename: 'platanito.webp',           label: 'Platanito',                   category: 'Snacks',      emoji: '🍌' },
  // PREPARADOS / CONGELADOS / HOGAR
  { filename: 'arepas.webp',              label: 'Arepas',                      category: 'Preparados',  emoji: '🫓' },
  { filename: 'tequenos_congelados.webp', label: 'Tequeños\nCongelados',        category: 'Congelados',  emoji: '🧆' },
  { filename: 'tetas_congeladas.webp',    label: 'Tetas\nde Leche',             category: 'Congelados',  emoji: '🧊' },
  { filename: 'cachapas_congeladas.webp', label: 'Cachapas\nCongeladas',        category: 'Congelados',  emoji: '🥞' },
  { filename: 'budare.webp',              label: 'Budare',                      category: 'Hogar',       emoji: '🍳' },
];

// ── Generador de SVG base ────────────────────────────────────────────────────
function buildSvg(label: string, emoji: string, colors: { bg: string; accent: string }): string {
  // Partir el label en líneas
  const lines = label.split('\n');
  const lineHeight = 28;
  const startY = 220 - (lines.length - 1) * lineHeight / 2;

  const textLines = lines.map((line, i) =>
    `<text x="200" y="${startY + i * lineHeight}" font-family="Arial,sans-serif" font-size="22" font-weight="600" fill="#1F2937" text-anchor="middle">${line}</text>`
  ).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo blanco base -->
  <rect width="${SIZE}" height="${SIZE}" fill="white"/>
  <!-- Fondo suave de categoría -->
  <rect x="20" y="20" width="360" height="360" rx="16" fill="${colors.bg}" stroke="${colors.accent}" stroke-width="1.5" stroke-opacity="0.3"/>
  <!-- Emoji grande -->
  <text x="200" y="165" font-size="72" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <!-- Nombre del producto -->
  ${textLines}
  <!-- Línea decorativa -->
  <rect x="80" y="${startY + lines.length * lineHeight + 8}" width="240" height="2" rx="1" fill="${colors.accent}" opacity="0.4"/>
</svg>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\n🎨 Generando ${IMAGES.length} imágenes placeholder WebP (400×400, fondo blanco)...\n`);

  let created = 0;
  let skipped = 0;

  for (const img of IMAGES) {
    const destPath = path.join(OUTPUT_DIR, img.filename);

    // Saltar si ya existe con tamaño real (> 5KB = imagen real, no placeholder SVG)
    if (fs.existsSync(destPath)) {
      const stat = fs.statSync(destPath);
      if (stat.size > 20000) {
        console.log(`  ⏭️  ${img.filename} (imagen real ya existe, ${Math.round(stat.size / 1024)}KB)`);
        skipped++;
        continue;
      }
    }

    const colors = CATEGORY_COLORS[img.category] ?? CATEGORY_COLORS.default;
    const svg = buildSvg(img.label, img.emoji, colors);

    try {
      const webpBuffer = await sharp(Buffer.from(svg))
        .resize(SIZE, SIZE)
        .webp({ quality: 80 })
        .toBuffer();

      fs.writeFileSync(destPath, webpBuffer);
      console.log(`  ✅ ${img.filename} (${Math.round(webpBuffer.length / 1024)}KB) — ${img.label.replace('\n', ' ')}`);
      created++;
    } catch (err) {
      console.error(`  ❌ ${img.filename}:`, err);
    }
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log(`   ✅ Generadas : ${created}`);
  console.log(`   ⏭️  Saltadas  : ${skipped}`);
  console.log('─────────────────────────────────────────────────');
  console.log('\n📤 Ahora subí las imágenes a Supabase:');
  console.log('   npx tsx scripts/upload-images-to-supabase.ts');
  console.log('\n💡 Para reemplazar un placeholder con foto real:');
  console.log('   1. Guardá la foto como WebP en /imagenes_productos/<nombre>.webp');
  console.log('   2. Corré npx tsx scripts/upload-images-to-supabase.ts');
}

main().catch((err) => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
