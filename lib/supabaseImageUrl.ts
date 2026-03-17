export const getSupabaseImageUrl = (path: string): string => {
    const baseUrl = 'https://weerwaqwrdngbikqaxng.supabase.co/storage/v1/object/public/imagenes';
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${cleanPath}`;
};