import { useState, useEffect } from 'react';

interface UseBlurImageOptions {
  threshold?: number;
  quality?: 'low' | 'medium' | 'high';
  priority?: boolean;
}

// Cache for blur images
const blurCache = new Map<string, string>();

// Debounced blur generation
const generateBlur = (
  img: HTMLImageElement, 
  scale: number,
  onComplete: (blurUrl: string) => void
) => {
  const key = `${img.src}-${scale}`;
  if (blurCache.has(key)) {
    onComplete(blurCache.get(key)!);
    return;
  }

  const work = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      try {
        canvas.width = Math.max(img.width * scale, 1);
        canvas.height = Math.max(img.height * scale, 1);
        
        // Optimize canvas operations
        ctx.imageSmoothingQuality = 'low';
        ctx.filter = 'blur(8px)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const blurUrl = canvas.toDataURL('image/jpeg', 0.3);
        blurCache.set(key, blurUrl);
        onComplete(blurUrl);
      } catch (error) {
        console.warn('Failed to generate blur image:', error);
      } finally {
        canvas.remove();
      }
    }
  };

  setTimeout(work, 0);
};

export function useBlurImage(src: string, options: UseBlurImageOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBlurReady, setIsBlurReady] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string>('');

  useEffect(() => {
    setIsLoaded(false);
    setIsBlurReady(false);
    setBlurDataUrl('');

    if (!src) return;

    let isUnmounted = false;
    const fullImage = new Image();
    
    // Handle full image load
    fullImage.onload = () => {
      if (!isUnmounted) {
        setIsLoaded(true);
      }
    };

    // Generate blur effect
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';

    tempImg.onload = () => {
      if (isUnmounted) return;

      const scale = options.quality === 'high' ? 0.3 : 
                   options.quality === 'medium' ? 0.2 : 0.1;

      generateBlur(tempImg, scale, (blurUrl) => {
        if (!isUnmounted) {
          setBlurDataUrl(blurUrl);
          setIsBlurReady(true);
        }
      });
    };

    tempImg.onerror = () => {
      if (!isUnmounted) {
        console.warn('Failed to load image for blur effect');
        setIsBlurReady(false);
      }
    };

    // Load images
    tempImg.src = src;
    fullImage.src = src;

    return () => {
      isUnmounted = true;
      fullImage.onload = null;
      tempImg.onload = null;
      tempImg.onerror = null;
    };
  }, [src, options.quality]);

  return {
    isLoaded,
    isBlurReady,
    blurDataUrl
  };
}