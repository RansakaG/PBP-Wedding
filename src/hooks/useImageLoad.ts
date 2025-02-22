import { useState, useEffect } from 'react';

interface UseImageLoadOptions {
  priority?: boolean;
  lazy?: boolean;
}

export function useImageLoad(src: string, options: UseImageLoadOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();
    
    if (options.priority) {
      // @ts-ignore - fetchpriority is a valid attribute but not in TS types yet
      img.fetchpriority = 'high';
    }

    if (options.lazy) {
      img.loading = 'lazy';
    }

    const handleLoad = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError(new Error(`Failed to load image: ${src}`));
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      img.src = '';
    };
  }, [src, options.priority, options.lazy]);

  return { isLoading, error };
}
