import { useState, useRef, memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GalleryImage } from '../../types/gallery';
import { ZoomIn } from 'lucide-react';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';
import LoadingSpinner from '../ui/LoadingSpinner';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface GalleryGridProps {
  images: GalleryImage[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
  isAlbumView?: boolean;
}

const GalleryItem = memo(({ 
  image, 
  index, 
  onImageClick,
  priority = false 
}: { 
  image: GalleryImage;
  index: number;
  onImageClick: (image: GalleryImage) => void;
  priority?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(imageRef, { threshold: 0.1 })?.isIntersecting;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isActive = isHovered || isFocused;

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
      className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2"
      onClick={() => onImageClick(image)}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <ImageWithSkeleton
        src={image.url}
        alt={image.title || 'Gallery image'}
        priority={priority}
        quality={priority ? 'high' : 'medium'}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isActive ? 'scale-105' : 'scale-100'
        }`}
        containerClassName="absolute inset-0"
      />

      {/* Hover/Focus overlay */}
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
          <ZoomIn className="w-8 h-8 text-white" aria-hidden="true" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

GalleryItem.displayName = 'GalleryItem';

export default function GalleryGrid({ images, onLoadMore, hasMore = false, onImageClick, isAlbumView = false }: GalleryGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {});

  // Handle infinite scroll
  useEffect(() => {
    if (loadMoreObserver?.isIntersecting && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [loadMoreObserver?.isIntersecting, hasMore, onLoadMore]);

  // Get viewport size once on mount
  const [viewportSize, setViewportSize] = useState({ 
    width: window.innerWidth,
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ 
        width: window.innerWidth,
        height: window.innerHeight 
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate priority images based on viewport
  const getPriorityCount = () => {
    if (isAlbumView) {
      // For album views, load more images initially
      return viewportSize.width < 640 ? 6  // Mobile: 2 rows of 1
        : viewportSize.width < 1024 ? 8    // Tablet: 2 rows of 2
        : 12;                              // Desktop: 2 rows of 3
    }
    // For regular gallery views
    return viewportSize.width < 640 ? 4    // Mobile: 2 rows of 1
      : viewportSize.width < 1024 ? 6      // Tablet: 2 rows of 2
      : 9;                                 // Desktop: 2 rows of 3
  };

  return (
    <>
      <motion.div 
        ref={gridRef}
        role="grid"
        aria-label="Image gallery"
        layout
        className={`grid gap-3 sm:gap-4 md:gap-6 p-1 ${
          isAlbumView 
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {images.map((image, index) => (
          <motion.div 
            key={image.id}
            role="gridcell"
            className="relative aspect-square"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: Math.min(index * 0.05, 0.3)
            }}
          >
            <ImageWithSkeleton 
              src={image.thumbnailUrl || image.url}
              alt={image.title || 'Gallery image'}
              priority={index < getPriorityCount()}
              quality={index < getPriorityCount() ? 'high' : 'auto'}
              className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              containerClassName="absolute inset-0"
              onClick={() => onImageClick?.(image, index)}
            />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div 
          ref={loadMoreRef} 
          className="mt-6 sm:mt-8 flex justify-center"
          role="status" 
          aria-label="Loading more images"
        >
          <LoadingSpinner size="lg" />
        </div>
      )}
    </>
  );
}