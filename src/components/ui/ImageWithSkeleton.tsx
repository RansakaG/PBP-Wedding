import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memo } from 'react';

export interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

const ImageWithSkeleton = memo(({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '', 
  priority = false,
}: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <AnimatePresence mode="wait">
        {/* Loading skeleton */}
        {!isLoaded && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-brand-beige/20 to-brand-beige/30 animate-pulse"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main image */}
      <motion.img
        key={src}
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${className} transition-all duration-500`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
});

ImageWithSkeleton.displayName = 'ImageWithSkeleton';

export default ImageWithSkeleton;