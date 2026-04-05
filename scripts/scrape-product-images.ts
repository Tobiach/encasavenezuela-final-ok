/**
 * scrape-product-images.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Busca automáticamente cada producto en Google Images usando Puppeteer,
 * descarga la mejor imagen encontrada, la convierte a WebP 400×400 fondo blanco
 * y la guarda en /imagenes_productos/.
 *
 * Solo procesa los archivos que son placeholders (< 20KB).
 * Las imágenes reales ya existentes se saltean.
 *
 * Uso:
 *   npx tsx scripts/scrape-product-images.ts
 *
 * Opciones:
 *   --only="harina_pan_blanca,toddy"   → solo esos archivos
 *   --force                             → reprocesar aunque ya existan
 * ──────────────────────────────────────────────────────────────────────────────
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const OUTPUT_DIR = path.join(process.cwd(), 'imagenes_productos');
const SIZE = 400;
const QUALITY = 85;
const PLACEHOLDER_MAX_SIZE = 20 * 1024; // < 20KB = placeholder generado por nosotros

// ── Lista de productos a buscar ───────────────────────────────────────────────
// query: término exacto para Google Images (más específico = mejores resultados)
const PRODUCTS: { filename: string; query: string }[] = [
  // HARINAS
  { filename: 'harina_pan_blanca.webp',   query: 'Harina PAN Blanca 1kg producto Venezuela' },
  { filename: 'harina_pan_amarilla.webp', query: 'Harina PAN Amarilla 1kg producto Venezuela' },
  { filename: 'harina_maseca.webp',       query: 'Harina Maseca maiz 1kg producto empaque' },
  { filename: 'harina_morixe.webp',       query: 'Harina Morixe 0000 1kg producto Argentina' },
  { filename: 'harina_cachapas.webp',     query: 'harina cachapas venezolanas producto empaque' },
  { filename: 'casabe.webp',              query: 'casabe venezolano producto empaque fondo blanco' },
  // CEREALES
  { filename: 'fororo.webp',              query: 'fororo harina maiz tostado venezolano producto' },
  // GRANOS
  { filename: 'caraotas_negras.webp',     query: 'caraotas negras 500g Venezuela producto empaque' },
  // SECOS
  { filename: 'papelon_molido.webp',      query: 'papelón molido venezolano producto empaque' },
  { filename: 'papelon_panela.webp',      query: 'papelón panela venezolano producto empaque' },
  // LÁCTEOS
  { filename: 'queso_duro.webp',          query: 'queso duro venezolano llanero producto empaque' },
  { filename: 'queso_de_mano.webp',       query: 'queso de mano venezolano producto empaque' },
  { filename: 'nata_criolla.webp',        query: 'nata criolla venezolana producto empaque' },
  // CARNES
  { filename: 'chuleta_ahumada.webp',     query: 'chuleta ahumada venezolana producto empaque' },
  { filename: 'huesos_ahumados.webp',     query: 'huesos ahumados cerdo venezolano producto' },
  { filename: 'chicharron.webp',          query: 'chicharrón venezolano empaque producto' },
  // CONDIMENTOS
  { filename: 'adobo_criollo.webp',       query: 'adobo criollo venezolano condimento producto empaque' },
  { filename: 'aji_condimento.webp',      query: 'ají molido venezolano condimento producto empaque' },
  // SALSAS
  { filename: 'salsa_inglesa.webp',       query: 'salsa inglesa venezolana worcestershire producto' },
  { filename: 'salsa_maiz.webp',          query: 'salsa de maiz venezolana producto empaque' },
  { filename: 'salsa_ahumada.webp',       query: 'salsa ahumada venezolana producto empaque' },
  { filename: 'salsa_picante.webp',       query: 'salsa picante venezolana producto empaque' },
  { filename: 'salsa_cheddar.webp',       query: 'salsa cheddar queso venezolana producto empaque' },
  { filename: 'salsa_guasacaca.webp',     query: 'guasacaca venezolana salsa aguacate producto empaque' },
  // UNTABLES
  { filename: 'mantequilla_qualy.webp',   query: 'Mantequilla Qualy Venezuela producto empaque' },
  { filename: 'mantequilla_danica.webp',  query: 'Mantequilla Danica Venezuela producto empaque' },
  { filename: 'mavesa_mayonesa.webp',     query: 'Mavesa Mayonesa Venezuela producto empaque fondo blanco' },
  { filename: 'diablito_underwood.webp',  query: 'Diablitos Underwood lata Venezuela producto' },
  { filename: 'rikesa.webp',              query: 'Rikesa crema Venezuela producto empaque' },
  // BEBIDAS
  { filename: 'cafe_fama_america.webp',   query: 'Café Fama de América Venezuela producto empaque' },
  { filename: 'toddy.webp',              query: 'Toddy bebida chocolate Venezuela producto empaque' },
  { filename: 'nesquik.webp',            query: 'Nesquik polvo chocolate producto empaque' },
  { filename: 'nestea.webp',             query: 'Nestea té helado polvo producto empaque' },
  { filename: 'tamarindo_bebida.webp',   query: 'refresco tamarindo venezolano lata producto' },
  { filename: 'reko_uva.webp',           query: 'Re-Ko uva refresco Venezuela lata producto' },
  { filename: 'reko_pina.webp',          query: 'Re-Ko piña refresco Venezuela lata producto' },
  { filename: 'reko_manzana.webp',       query: 'Re-Ko manzana refresco Venezuela lata producto' },
  // CHUCHERÍAS
  { filename: 'obleas.webp',             query: 'obleas venezolanas dulce producto empaque' },
  { filename: 'pinguinito.webp',         query: 'Pinguinito Savoy Venezuela chocolate producto' },
  { filename: 'flips_grande.webp',       query: 'Flips dulce de leche cereal Venezuela producto grande' },
  { filename: 'cocosete.webp',           query: 'Cocosete Savoy coco Venezuela producto empaque' },
  { filename: 'chupetas.webp',           query: 'chupetas venezolanas caramelo producto empaque' },
  { filename: 'catalina_galleta.webp',   query: 'Catalina galleta venezolana papelon producto' },
  // SNACKS
  { filename: 'torontos.webp',           query: 'Torontos snack maiz Venezuela producto empaque' },
  { filename: 'savoy_chocolate.webp',    query: 'Savoy chocolate Venezuela barra producto empaque' },
  { filename: 'platanito.webp',          query: 'Platanito chips plátano Venezuela producto empaque' },
  // PREPARADOS / CONGELADOS / HOGAR
  { filename: 'arepas.webp',             query: 'arepas venezolanas caseras producto fotografía' },
  { filename: 'tequenos_congelados.webp',query: 'tequeños congelados Venezuela queso producto empaque' },
  { filename: 'tetas_congeladas.webp',   query: 'tetas de leche venezolanas dulce congelado producto' },
  { filename: 'cachapas_congeladas.webp',query: 'cachapas congeladas PAN Venezuela producto empaque' },
  { filename: 'budare.webp',             query: 'budare plancha hierro arepas Venezuela producto' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function isPlaceholder(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return true;
  return fs.statSync(filePath).size < PLACEHOLDER_MAX_SIZE;
}

function downloadBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return downloadBuffer(loc).then(resolve).catch(reject);
      }
      if (!res.statusCode || res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function processAndSave(buffer: Buffer, destPath: string): Promise<number> {
  const webp = await sharp(buffer)
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .webp({ quality: QUALITY })
    .toBuffer();
  fs.writeFileSync(destPath, webp);
  return webp.length;
}

// ── Scraper Google Images ─────────────────────────────────────────────────────
async function getImageUrlFromGoogle(page: Page, query: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=itp:photo`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForSelector('img[data-src], img[src*="encrypted-tbn"]', { timeout: 8000 }).catch(() => {});

    // Hacer clic en la primera imagen real (no ícono de Google)
    const clicked = await page.evaluate(() => {
      const imgs = document.querySelectorAll('div[data-ved] img, g-img img');
      for (const img of Array.from(imgs)) {
        const el = img as HTMLImageElement;
        // Filtrar íconos pequeños de Google
        if (el.naturalWidth > 100 && el.naturalHeight > 100) {
          (el.closest('div[data-ved]') as HTMLElement | null)?.click();
          return true;
        }
      }
      // Fallback: clic en primer resultado de imagen
      const first = document.querySelector('div[jsname="dTDiAc"]') as HTMLElement | null;
      if (first) { first.click(); return true; }
      return false;
    });

    if (!clicked) return null;

    // Esperar panel lateral con imagen full size
    await page.waitForSelector('img[data-noaft]', { timeout: 6000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));

    // Extraer URL de la imagen full-size del panel lateral
    const imgUrl = await page.evaluate(() => {
      // Buscar la imagen full-size en el panel de detalle
      const candidates = document.querySelectorAll('img[data-noaft], c-wiz img[src^="http"]:not([src*="gstatic"]):not([src*="google.com"])');
      for (const img of Array.from(candidates)) {
        const src = (img as HTMLImageElement).src;
        if (src && src.startsWith('http') && !src.includes('gstatic') && !src.includes('google.com/logos')) {
          if ((img as HTMLImageElement).naturalWidth > 150) return src;
        }
      }
      return null;
    });

    return imgUrl;
  } catch {
    return null;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const onlyArg = args.find(a => a.startsWith('--only='))?.replace('--only=', '').split(',') ?? null;
  const force = args.includes('--force');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const toProcess = PRODUCTS.filter(p => {
    if (onlyArg && !onlyArg.some(o => p.filename.includes(o))) return false;
    if (!force && !isPlaceholder(path.join(OUTPUT_DIR, p.filename))) return false;
    return true;
  });

  console.log(`\n🔍 Buscando imágenes en Google para ${toProcess.length} productos...`);
  if (toProcess.length === 0) {
    console.log('✅ Todos los productos ya tienen imagen real. Usá --force para re-descargar.');
    return;
  }
  console.log('   (Esto abre un browser visible — no lo cierres)\n');

  const browser: Browser = await puppeteer.launch({
    headless: false,          // visible para que Google no bloquee
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=es-AR'],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');

  // Aceptar cookies de Google si aparece el banner
  await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of Array.from(btns)) {
      if (btn.textContent?.includes('Aceptar') || btn.textContent?.includes('Accept')) {
        btn.click(); break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  let ok = 0; let skipped = 0; let errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const { filename, query } = toProcess[i];
    const destPath = path.join(OUTPUT_DIR, filename);
    const num = `[${i + 1}/${toProcess.length}]`;

    process.stdout.write(`  ${num} ${filename} → buscando...`);

    try {
      const imgUrl = await getImageUrlFromGoogle(page, query);

      if (!imgUrl) {
        console.log(` ⚠️  no se encontró imagen`);
        skipped++;
        continue;
      }

      const buffer = await downloadBuffer(imgUrl);
      if (buffer.length < 2000) throw new Error('Imagen demasiado pequeña (<2KB)');

      const savedSize = await processAndSave(buffer, destPath);
      console.log(` ✅ ${Math.round(savedSize / 1024)}KB`);
      ok++;

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(` ❌ ${msg}`);
      errors++;
    }

    // Pausa entre búsquedas para no gatillar CAPTCHA de Google
    if (i < toProcess.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();

  console.log('\n─────────────────────────────────────────────────');
  console.log(`   ✅ Descargadas : ${ok}`);
  console.log(`   ⚠️  Sin imagen  : ${skipped}`);
  console.log(`   ❌ Errores     : ${errors}`);
  console.log('─────────────────────────────────────────────────');

  if (ok > 0) {
    console.log('\n📤 Subí las imágenes descargadas a Supabase:');
    console.log('   npx tsx scripts/upload-new-images.ts');
  }
  if (errors + skipped > 0) {
    console.log('\n💡 Para reintentar solo los fallidos:');
    console.log('   npx tsx scripts/scrape-product-images.ts --force');
  }
}

main().catch((err) => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
