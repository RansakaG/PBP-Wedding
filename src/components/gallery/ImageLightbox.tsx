import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart, Calendar, MapPin } from 'lucide-react';
import { GalleryImage } from '../../types/gallery';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFavorite?: (imageId: string) => void;
  onShare?: (image: GalleryImage) => void;
  onDownload?: (image: GalleryImage) => void;
  favorites?: Set<string>;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onFavorite,
  onShare,
  onDownload,
  favorites = new Set()
}: ImageLightboxProps) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const xDiff = touchStart.x - e.touches[0].clientX;
    const yDiff = touchStart.y - e.touches[0].clientY;
    
    // Only handle horizontal swipes
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      setIsSwiping(true);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !isSwiping) return;
    
    const xDiff = touchStart.x - e.changedTouches[0].clientX;
    const swipeThreshold = window.innerWidth * 0.15; // 15% of screen width

    if (Math.abs(xDiff) > swipeThreshold) {
      if (xDiff > 0 && hasNext) {
        onNext();
      } else if (xDiff < 0 && hasPrev) {
        onPrev();
      }
    }
    
    setTouchStart({ x: 0, y: 0 });
    setIsSwiping(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowRight':
        onNext();
        break;
      case 'ArrowLeft':
        onPrev();
        break;
      case 'Escape':
        onClose();
        break;
      case 'f':
      case 'F':
        onFavorite?.(currentImage.id);
        break;
      case 'd':
      case 'D':
        onDownload?.(currentImage);
        break;
      case 's':
      case 'S':
        onShare?.(currentImage);
        break;
    }
  }, [isOpen, currentImage, onClose, onNext, onPrev, onFavorite, onDownload, onShare]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center touch-pan-y overscroll-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main content */}
      <div 
        className="relative max-w-[95vw] max-h-[90vh] touch-none select-none" 
        onClick={(e) => e.stopPropagation()}
      >
        <ImageWithSkeleton
          src={currentImage.url}
          alt={currentImage.title || "Gallery image"}
          priority
          quality="high"
          className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
          containerClassName="flex items-center justify-center"
        />

        {/* Swipe indicators - mobile only */}
        {(hasPrev || hasNext) && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none sm:hidden px-4"
          >
            {hasPrev && (
              <div className="bg-black/50 rounded-full p-2">
                <ChevronLeft className="w-6 h-6 text-white/70" />
              </div>
            )}
            {hasNext && (
              <div className="bg-black/50 rounded-full p-2">
                <ChevronRight className="w-6 h-6 text-white/70" />
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation buttons - hidden on mobile, visible on tablet and up */}
        <div className="hidden sm:block">
          {hasPrev && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>
          )}
          {hasNext && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>
          )}
        </div>

        {/* Mobile swipe indicator - only show briefly on first open */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-20 left-0 right-0 sm:hidden"
        >
          <p className="text-white/60 text-center text-sm">Swipe to navigate</p>
        </motion.div>

        {/* Image info and actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6"
        >
          <div className="flex items-center gap-4 text-gray-300 text-sm sm:text-base">
            {currentImage.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{currentImage.date}</span>
              </div>
            )}
            {currentImage.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{currentImage.location}</span>
              </div>
            )}
          </div>
          {currentImage.description && (
            <p className="text-gray-300 mt-2 text-sm sm:text-base">{currentImage.description}</p>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 flex gap-2"
        >
          {onFavorite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(currentImage.id);
              }}
              aria-label={`${favorites.has(currentImage.id) ? 'Remove from' : 'Add to'} favorites`}
            >
              <Heart 
                className={`w-5 h-5 ${favorites.has(currentImage.id) ? 'fill-current' : ''}`}
              />
            </motion.button>
          )}
          
          <div className="flex gap-2 sm:gap-3">
            {onDownload && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(currentImage);
                }}
                aria-label="Download image"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            )}
            {onShare && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(currentImage);
                }}
                aria-label="Share image"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Image counter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm sm:text-base"
      >
        {currentIndex + 1} / {images.length}
      </motion.div>
    </motion.div>
  );
}
