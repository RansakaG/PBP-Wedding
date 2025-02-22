import { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { GalleryImage } from '../../types/gallery';
import { ZoomIn } from 'lucide-react';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  onImageClick: (image: GalleryImage) => void;
  priority?: boolean;
}

const GalleryItem = memo(({ image, index, onImageClick, priority = false }: GalleryItemProps) => {
  const [isActive, setIsActive] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(imageRef, { threshold: 0.1 })?.isIntersecting;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsActive(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const touchDiff = Math.abs(touchEnd - touchStart);
    
    // Only trigger click if it's a tap (small movement) and not a scroll
    if (touchDiff < 10) {
      onImageClick(image);
    }
    setIsActive(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onImageClick(image);
    }
  };

  return (
    <motion.div
      ref={imageRef}
      role="button"
      tabIndex={0}
      aria-label={`View ${image.title || 'image'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.95 }}
      transition={{ 
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: "easeOut"
      }}
      className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2 touch-manipulation"
      onClick={() => onImageClick(image)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      <ImageWithSkeleton
        src={image.thumbnailUrl || image.url}
        alt={image.title || 'Gallery image'}
        priority={priority}
        quality={priority ? 'high' : 'auto'}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isActive ? 'scale-105' : 'scale-100'
        }`}
        containerClassName="absolute inset-0"
      />

      <motion.div 
        className="absolute inset-0 bg-black/40"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
        >
          <ZoomIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

GalleryItem.displayName = 'GalleryItem';

export default GalleryItem;