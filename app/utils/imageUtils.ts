// Helper function to validate and format image URLs
export const getValidImageUrl = (url: string | undefined, fallback: string = '/assets/images/blog.png'): string => {
  if (!url) return fallback;
  
  // თუ URL აბსოლუტურია (http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // თუ URL relative path-ია და '/' ით იწყება
  if (url.startsWith('/')) {
    return url;
  }
  
  // თუ URL-ი მხოლოდ ფაილის სახელია (არასწორი)
  if (url && !url.startsWith('/') && !url.startsWith('http')) {
    console.warn(`⚠️ Invalid image URL: "${url}", using fallback`);
    return fallback;
  }
  
  return fallback;
}; 