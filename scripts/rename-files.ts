import fs from 'fs';
import path from 'path';

const folders = [
  'imagenes_productos',
  'imagenes_combos',
  'portadas_locales'
];

const charMap: { [key: string]: string } = {
  'ñ': 'n',
  'á': 'a',
  'é': 'e',
  'í': 'i',
  'ó': 'o',
  'ú': 'u',
  'Ñ': 'N',
  'Á': 'A',
  'É': 'E',
  'Í': 'I',
  'Ó': 'O',
  'Ú': 'U'
};

function cleanName(name: string): string {
  let newName = name;
  for (const [char, replacement] of Object.entries(charMap)) {
    newName = newName.split(char).join(replacement);
  }
  return newName;
}

async function renameFiles() {
  console.log('🔄 Iniciando renombramiento de archivos...');
  
  for (const folder of folders) {
    const dirPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const oldPath = path.join(dirPath, file);
      const newFileName = cleanName(file);
      
      if (file !== newFileName) {
        const newPath = path.join(dirPath, newFileName);
        
        // Si el archivo destino ya existe, lo borramos o manejamos el conflicto
        if (fs.existsSync(newPath)) {
           console.log(`  ⚠️ El archivo ${newFileName} ya existe. Borrando el antiguo ${file}...`);
           fs.unlinkSync(oldPath);
        } else {
           fs.renameSync(oldPath, newPath);
           console.log(`  ✅ Renombrado: ${file} -> ${newFileName}`);
        }
      }
    }
  }
  console.log('✨ Renombramiento finalizado.');
}

renameFiles().catch(console.error);
