import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryImage } from '../../types/gallery';
import { useImageLoad } from '../../hooks/useImageLoad';
import LoadingSpinner from '../ui/LoadingSpinner';
import { X, ZoomIn, Download, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface GalleryGridProps {
  images: GalleryImage[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

interface LightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function Lightbox({ image, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 z-50 flex space-x-4">
        <button
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            window.open(image.url, '_blank');
          }}
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigator.share?.({
              title: image.title,
              text: image.description,
              url: image.url,
            }).catch(() => {});
          }}
        >
          <Share className="w-5 h-5" />
        </button>
        <button
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <button
        className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ${
          !hasPrev && 'opacity-50 cursor-not-allowed'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          hasPrev && onPrev();
        }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ${
          !hasNext && 'opacity-50 cursor-not-allowed'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          hasNext && onNext();
        }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="max-w-7xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={image.title}
          className="max-w-full max-h-[85vh] object-contain mx-auto"
        />
      </div>
    </motion.div>
  );
}

const GalleryItem = memo(({ image, index, onImageClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: Math.min(index * 0.1, 1) }}
      className="relative aspect-square group cursor-pointer"
      onClick={() => onImageClick(image)}
      style={{ willChange: 'opacity' }}
    >
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
    </motion.div>
  );
});

export default function GalleryGrid({ images, onLoadMore, hasMore = false }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {});

  useEffect(() => {
    if (loadMoreObserver?.isIntersecting && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [loadMoreObserver?.isIntersecting, hasMore, onLoadMore]);

  const handlePrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
  }, [images.length]);

  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {images.map((image, index) => (
            <GalleryItem 
              key={image.id} 
              image={image} 
              index={index}
              onImageClick={() => setSelectedImage(index)}
            />
          ))}
        </motion.div>

        {selectedImage !== null && (
          <Lightbox
            image={images[selectedImage]}
            onClose={() => setSelectedImage(null)}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            hasPrev={selectedImage > 0}
            hasNext={selectedImage < images.length - 1}
          />
        )}
      </AnimatePresence>

      {hasMore && (
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </>
  );
}