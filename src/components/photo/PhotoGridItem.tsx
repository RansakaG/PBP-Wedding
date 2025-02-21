import { memo } from 'react';
import type { Photo } from '../../types/gallery';

interface PhotoGridItemProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  index: number;
}

const PhotoGridItem = memo(({ photo, onClick, index }: PhotoGridItemProps) => {
  return (
    <div 
      className="relative aspect-square overflow-hidden group cursor-pointer"
      onClick={() => onClick(photo)}
    >
      <img
        src={photo.url}
        alt={photo.title || 'Wedding photo'}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading={index < 6 ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={index < 3 ? "high" : "auto"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
});

PhotoGridItem.displayName = 'PhotoGridItem';

export default PhotoGridItem;