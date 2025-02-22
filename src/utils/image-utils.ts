import type { GalleryImage } from '../types/gallery';

/**
 * Generate a thumbnail URL for a given image URL
 * This function assumes the original image is in webp format and adds a size suffix
 */
export function generateThumbnailUrl(originalUrl: string): string {
  // Split URL and filename
  const urlParts = originalUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  const basePath = urlParts.slice(0, -1).join('/');
  
  // Add thumbnail suffix before the extension
  const thumbnailFilename = filename.replace('.webp', '-thumb.webp');
  return `${basePath}/${thumbnailFilename}`;
}

/**
 * Add thumbnail URLs to gallery images
 */
export function addThumbnailUrls(images: GalleryImage[]): GalleryImage[] {
  return images.map(image => ({
    ...image,
    thumbnailUrl: generateThumbnailUrl(image.url)
  }));
}