# Skill: image-loading-safe

## Objetivo
Tratar imágenes rotas, lentas o faltantes de forma elegante: placeholders visuales, fondo de color mientras carga, sin layout shifts y sin broken icon visible.

## Cuándo usarla
- Aparecen imágenes rotas (broken icon) en productos o locales
- El layout "salta" cuando las imágenes cargan
- Las cards se ven vacías antes de que cargue la imagen
- Hay imágenes con `img_path` incorrecto o vacío en la DB

## Contexto del proyecto
- Proyecto: EnCasa Venezuela
- Stack: React 19 + TypeScript + Tailwind CSS v4 + Vite
- Imágenes viven en Supabase Storage bucket `imagenes`
- Se accede con `getImageUrl(img_path)` → URL pública
- El bucket de Storage suele estar disponible aunque la DB falle
- Mobile-first obligatorio

## Instrucciones para Claude Code

```
Quiero mejorar el manejo de imágenes en [COMPONENTE] para que las imágenes
rotas o lentas no destruyan la experiencia visual.

Pasos:
1. Leé el componente indicado
2. Identificá todos los elementos <img>
3. Verificar que el wrapper tiene bg-gray-50 (o similar) para placeholder visual
4. Si la imagen puede fallar, agregar onError con src de placeholder
5. No cambiar la fuente de datos (getImageUrl) ni la lógica del hook

Patrón seguro que debe quedar:
<div className="rounded-xl overflow-hidden bg-gray-50">
  <img
    src={item.img}
    alt={item.name}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
    onError={(e) => {
      (e.target as HTMLImageElement).src = '/placeholder.png';
    }}
  />
</div>

Solo modificar el JSX de las imágenes. No tocar lógica de datos.
```

## Riesgos
- Si `/placeholder.png` no existe, el `onError` puede entrar en loop (imagen rota → onError → imagen rota)
- Verificar que existe un placeholder en `/public/` antes de usar `onError`

## Test
1. Cambiar temporalmente un `img_path` en fallbackProducts a string inválido
2. Verificar que la card muestra el placeholder o el fondo gris, no el broken icon
3. Restaurar el img_path original

## Archivos que probablemente toque
- `components/Offers.tsx`
- `components/Promotions.tsx`
- `components/PartnerStores.tsx`
- `components/CatalogView.tsx`
- `components/ProductDetailView.tsx`
