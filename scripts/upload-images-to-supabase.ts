import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Cargar variables de entorno desde .env
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las variables de entorno')
  process.exit(1)
}

console.log('🔑 Usando service_role key:', supabaseKey.substring(0, 15) + '...')
const supabase = createClient(supabaseUrl, supabaseKey)

// Carpetas en /public que contienen las imágenes
const folders = [
  'imagenes_productos',
  'imagenes_combos',
  'portadas_locales'
]

function isImage(filename: string) {
  const ext = path.extname(filename).toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)
}

async function uploadImages() {
  console.log('🚀 Iniciando subida de imágenes a Supabase Storage...')
  console.log(`URL: ${supabaseUrl}`)

  for (const folder of folders) {
    const dirPath = path.join(process.cwd(), folder)
    
    if (!fs.existsSync(dirPath)) {
      console.warn(`⚠️ La carpeta "${dirPath}" no se encontró. Saltando...`)
      continue
    }

    console.log(`\n📁 Procesando carpeta: ${folder}`)
    const files = fs.readdirSync(dirPath)

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile() && !file.startsWith('.') && isImage(file)) {
        console.log(`  📤 Subiendo: ${file}...`)
        const fileBuffer = fs.readFileSync(filePath)
        
        // Subimos al bucket "imagenes" (asegúrate de que el bucket exista en Supabase)
        // El path en el bucket será el nombre del archivo directamente
        const { error } = await supabase.storage
          .from('imagenes')
          .upload(file, fileBuffer, {
            contentType: getContentType(file),
            upsert: true
          })

        if (error) {
          console.error(`    ❌ Error subiendo ${file}:`, error.message)
        } else {
          console.log(`    ✅ ${file} subido correctamente.`)
        }
      }
    }
  }
  console.log('\n✨ Proceso de subida finalizado.')
}

function getContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase()
  switch (ext) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    case '.svg': return 'image/svg+xml'
    case '.gif': return 'image/gif'
    default: return 'application/octet-stream'
  }
}

uploadImages().catch(err => {
  console.error('💥 Error fatal en el script:', err)
  process.exit(1)
})
