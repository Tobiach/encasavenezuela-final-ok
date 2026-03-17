import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase Error: Missing environment variables.')
  throw new Error('Faltan las variables de entorno de Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)')
}

if (supabaseUrl.includes('YOUR_SUPABASE') || supabaseAnonKey.includes('YOUR_SUPABASE')) {
  console.error('❌ Supabase Error: Placeholder values detected.')
  throw new Error('Las variables de Supabase tienen valores de ejemplo (placeholders). Por favor configura las reales.')
}

// Debugging (safe)
console.log('✅ Supabase Client Initializing...')
console.log('URL:', supabaseUrl.substring(0, 20) + '...')
console.log('Key starts with:', supabaseAnonKey.substring(0, 10) + '...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Obtiene la URL pública de una imagen en el bucket "imagenes"
 * @param path El path o nombre del archivo
 * @returns La URL pública completa
 */
export function getImageUrl(path: string): string {
  if (!path) return 'https://picsum.photos/seed/placeholder/400/400'
  
  // Si ya es una URL completa (http/https), la devolvemos tal cual
  if (path.startsWith('http')) return path

  // Limpiamos el path: quitamos el slash inicial y carpetas si existen
  // ya que en Supabase subimos todo a la raíz del bucket "imagenes"
  const filename = path.split('/').pop() || path
  
  // Limpiamos caracteres especiales para que coincida con lo subido
  const cleanFilename = filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")

  const { data } = supabase.storage.from('imagenes').getPublicUrl(cleanFilename)
  return data.publicUrl
}
