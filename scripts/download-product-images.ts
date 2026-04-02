/**
 * download-product-images.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Descarga imágenes de productos venezolanos desde URLs de marcas oficiales,
 * las convierte a WebP con fondo blanco y las guarda en /imagenes_productos/
 *
 * Uso:
 *   npx tsx scripts/download-product-images.ts
 *
 * Requiere:
 *   npm install sharp axios
 * ──────────────────────────────────────────────────────────────────────────────
 */

import sharp from 'sharp';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'imagenes_productos');
const SIZE = 400;        // 400×400 px
const QUALITY = 82;      // WebP quality (82 → ~30-70KB con fondo blanco)

// ── Mapa de producto → URL de imagen ────────────────────────────────────────
// Usamos imágenes de dominio público o de marcas venezolanas conocidas.
// Cada entrada: { output: 'nombre_archivo.webp', url: 'https://...', bg: true/false }
// bg: true = agregar fondo blanco (para imágenes con transparencia o fondo oscuro)

const IMAGE_MAP: { output: string; url: string; bg: boolean }[] = [
  // HARINAS
  {
    output: 'harina_pan_blanca.webp',
    url: 'https://www.arepaspanvzla.com/cdn/shop/products/harina-pan-blanca.jpg',
    bg: true,
  },
  {
    output: 'harina_pan_amarilla.webp',
    url: 'https://www.arepaspanvzla.com/cdn/shop/products/harina-pan-amarilla.jpg',
    bg: true,
  },
  {
    output: 'harina_maseca.webp',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Maseca.jpg/400px-Maseca.jpg',
    bg: true,
  },
  {
    output: 'harina_morixe.webp',
    url: 'https://morixe.com.ar/wp-content/uploads/2021/01/Morixe-Harina-0000-1kg.png',
    bg: true,
  },
  {
    output: 'harina_cachapas.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Harina+Cachapas',
    bg: false,
  },
  {
    output: 'casabe.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Casabe',
    bg: false,
  },

  // CEREALES
  {
    output: 'fororo.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Fororo',
    bg: false,
  },

  // GRANOS
  {
    output: 'caraotas_negras.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Caraotas+Negras',
    bg: false,
  },

  // SECOS
  {
    output: 'papelon_molido.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Papelon+Molido',
    bg: false,
  },
  {
    output: 'papelon_panela.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Papelon+Panela',
    bg: false,
  },

  // LÁCTEOS
  {
    output: 'queso_duro.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Queso+Duro',
    bg: false,
  },
  {
    output: 'queso_de_mano.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Queso+de+Mano',
    bg: false,
  },
  {
    output: 'nata_criolla.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Nata+Criolla',
    bg: false,
  },

  // CARNES
  {
    output: 'chuleta_ahumada.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Chuleta+Ahumada',
    bg: false,
  },
  {
    output: 'huesos_ahumados.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Huesos+Ahumados',
    bg: false,
  },
  {
    output: 'chicharron.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Chicharron',
    bg: false,
  },

  // CONDIMENTOS
  {
    output: 'adobo_criollo.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Adobo+Criollo',
    bg: false,
  },
  {
    output: 'aji_condimento.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Aji',
    bg: false,
  },

  // SALSAS
  {
    output: 'salsa_inglesa.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Salsa+Inglesa',
    bg: false,
  },
  {
    output: 'salsa_maiz.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Salsa+Maiz',
    bg: false,
  },
  {
    output: 'salsa_ahumada.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Salsa+Ahumada',
    bg: false,
  },
  {
    output: 'salsa_picante.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Salsa+Picante',
    bg: false,
  },
  {
    output: 'salsa_cheddar.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Salsa+Cheddar',
    bg: false,
  },
  {
    output: 'salsa_guasacaca.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Salsa+Guasacaca',
    bg: false,
  },

  // UNTABLES
  {
    output: 'mantequilla_qualy.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Mantequilla+Qualy',
    bg: false,
  },
  {
    output: 'mantequilla_danica.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Mantequilla+Danica',
    bg: false,
  },
  {
    output: 'mavesa_mayonesa.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Mavesa+Mayonesa',
    bg: false,
  },
  {
    output: 'diablito_underwood.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Diablito',
    bg: false,
  },
  {
    output: 'rikesa.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Rikesa',
    bg: false,
  },

  // BEBIDAS
  {
    output: 'cafe_fama_america.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Cafe+Fama',
    bg: false,
  },
  {
    output: 'toddy.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Toddy',
    bg: false,
  },
  {
    output: 'nesquik.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Nesquik',
    bg: false,
  },
  {
    output: 'nestea.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Nestea',
    bg: false,
  },
  {
    output: 'tamarindo_bebida.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Tamarindo',
    bg: false,
  },
  {
    output: 'reko_uva.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Reko+Uva',
    bg: false,
  },
  {
    output: 'reko_pina.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Reko+Pina',
    bg: false,
  },
  {
    output: 'reko_manzana.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Reko+Manzana',
    bg: false,
  },

  // CHUCHERÍAS
  {
    output: 'obleas.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Obleas',
    bg: false,
  },
  {
    output: 'pinguinito.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Pinguinito',
    bg: false,
  },
  {
    output: 'flips_grande.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Flips+Grande',
    bg: false,
  },
  {
    output: 'cocosete.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Cocosete',
    bg: false,
  },
  {
    output: 'chupetas.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Chupetas',
    bg: false,
  },
  {
    output: 'catalina_galleta.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Catalina',
    bg: false,
  },

  // SNACKS
  {
    output: 'torontos.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Torontos',
    bg: false,
  },
  {
    output: 'savoy_chocolate.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Savoy',
    bg: false,
  },
  {
    output: 'platanito.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Platanito',
    bg: false,
  },

  // PREPARADOS / CONGELADOS / HOGAR
  {
    output: 'arepas.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Arepas',
    bg: false,
  },
  {
    output: 'tequenos_congelados.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Tequenos+Congelados',
    bg: false,
  },
  {
    output: 'tetas_congeladas.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Tetas+de+Leche',
    bg: false,
  },
  {
    output: 'cachapas_congeladas.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Cachapas+Congeladas',
    bg: false,
  },
  {
    output: 'budare.webp',
    url: 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Budare',
    bg: false,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
async function downloadBuffer(url: string): Promise<Buffer> {
  const resp = await axios.get<Buffer>(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; EnCasaBot/1.0)',
    },
  });
  return Buffer.from(resp.data);
}

/**
 * Procesa una imagen con Sharp:
 *   1. Reescala a 400×400 (contain + fondo blanco)
 *   2. Aplana cualquier transparencia sobre blanco
 *   3. Convierte a WebP quality=82
 */
async function processImage(buffer: Buffer, addWhiteBg: boolean): Promise<Buffer> {
  let pipeline = sharp(buffer).resize(SIZE, SIZE, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  });

  if (addWhiteBg) {
    // Flatten transparencia sobre blanco
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  return pipeline
    .webp({ quality: QUALITY, effort: 4 })
    .toBuffer();
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Crear carpeta de salida si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Carpeta creada: ${OUTPUT_DIR}`);
  }

  console.log(`\n🚀 Descargando y optimizando ${IMAGE_MAP.length} imágenes...\n`);

  let ok = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of IMAGE_MAP) {
    const destPath = path.join(OUTPUT_DIR, item.output);

    // Si ya existe y no es placeholder, saltar
    if (fs.existsSync(destPath)) {
      const stat = fs.statSync(destPath);
      if (stat.size > 5000) { // > 5KB → no es placeholder
        console.log(`  ⏭️  ${item.output} (ya existe, ${Math.round(stat.size / 1024)}KB)`);
        skipped++;
        continue;
      }
    }

    try {
      const rawBuffer = await downloadBuffer(item.url);
      const webpBuffer = await processImage(rawBuffer, item.bg);
      fs.writeFileSync(destPath, webpBuffer);
      console.log(`  ✅ ${item.output} (${Math.round(webpBuffer.length / 1024)}KB)`);
      ok++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠️  ${item.output} → FALLÓ: ${msg}`);
      errors++;
    }
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log('📊 Resumen:');
  console.log(`   ✅ Descargadas y optimizadas : ${ok}`);
  console.log(`   ⏭️  Ya existían (saltadas)   : ${skipped}`);
  console.log(`   ❌ Errores                   : ${errors}`);
  console.log('─────────────────────────────────────────────────');
  console.log(`\n📂 Imágenes guardadas en: ${OUTPUT_DIR}`);
  console.log('\n⚠️  Las imágenes con placeholder (texto gris) necesitan reemplazo manual.');
  console.log('   Para subirlas a Supabase: npx tsx scripts/upload-images-to-supabase.ts');
  console.log('\n💡 TIP: Para reemplazar una imagen placeholder, guardala en:');
  console.log(`   ${OUTPUT_DIR}/<nombre_producto>.webp`);
  console.log('   y volvé a correr el script de subida.');
}

main().catch((err) => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
