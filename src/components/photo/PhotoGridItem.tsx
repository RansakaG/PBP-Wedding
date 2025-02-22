import { memo, useState, useEffect } from 'react';
import type { GalleryImage } from '../../types/gallery';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PhotoGridItemProps {
  photo: GalleryImage;
  onClick: (photo: GalleryImage) => void;
  index: number;
}

const PhotoGridItem = memo(({ photo, onClick, index }: PhotoGridItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the full image
    const fullImage = new Image();
    fullImage.src = photo.url;
    fullImage.onload = () => setIsFullImageLoaded(true);
  }, [photo.url]);

  return (
    <div 
      className="relative aspect-square overflow-hidden group cursor-pointer"
      onClick={() => onClick(photo)}
    >
      {/* Thumbnail or low-quality image */}
      <img
        src={photo.thumbnailUrl || photo.url}
        alt={photo.title || 'Wedding photo'}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isFullImageLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading={index < 6 ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Full quality image */}
      <img
        src={photo.url}
        alt={photo.title || 'Wedding photo'}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
          isFullImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={index < 6 ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore - fetchpriority is valid but not in TS types
        fetchpriority={index < 3 ? "high" : "auto"}
      />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
});

PhotoGridItem.displayName = 'PhotoGridItem';

export default PhotoGridItem;