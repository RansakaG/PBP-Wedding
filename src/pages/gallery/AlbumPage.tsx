import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Share2, Download, Heart } from 'lucide-react';
import categories, { galleryImages } from '../../data/galleries';
import { GalleryImage, GalleryCategory } from '../../types/gallery';
import ImageLightbox from '../../components/gallery/ImageLightbox';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import ImageWithSkeleton from '../../components/ui/ImageWithSkeleton';
import toast from '../../utils/toast';

export default function AlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  
  const allImages = albumId ? galleryImages[albumId] : [];
  const heroImage = allImages[0]?.url;
  const heroImageThumb = allImages[0]?.thumbnailUrl;
  const category = categories.find((c: GalleryCategory) => c.id === albumId);

  const handleImageClick = useCallback((_: GalleryImage, index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const toggleFavorite = useCallback((imageId: string) => {
    setFavorites((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
        toast.success('Image removed from favorites');
      } else {
        next.add(imageId);
        toast.success('Image added to favorites');
      }
      return next;
    });
  }, []);

  const handleShare = useCallback(async (image: GalleryImage) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: image.url,
        });
        toast.success('Image shared successfully');
      } else {
        await navigator.clipboard.writeText(image.url);
        toast.success('Image URL copied to clipboard');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share image');
      }
    }
  }, []);

  const handleDownload = useCallback((image: GalleryImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${image.title || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download image');
    }
  }, []);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
    } else if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
      lastFocusedElement.current = null;
    }
  }, [selectedImageIndex]);

  const scrollToGallery = () => {
    window.scrollTo({
      top: window.innerHeight * 0.6,
      behavior: 'smooth'
    });
  };

  if (!allImages || allImages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Album not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 to-white">
      {/* Hero Section - Responsive height */}
      <section className="relative h-[30vh] sm:h-[40vh] lg:h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          {/* Progressive image loading */}
          <ImageWithSkeleton
            src={heroImageThumb || heroImage}
            alt={`${category?.title || 'Album'} hero thumbnail`}
            priority
            quality="auto"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isHeroLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <ImageWithSkeleton
            src={heroImage}
            alt={`${category?.title || 'Album'} hero`}
            priority
            quality="high"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHeroLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/80" />
        </div>

        <div className="relative h-full flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-4 sm:mb-6"
            >
              {category?.title || 'Album'}
            </motion.h1>
            {category?.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-brand-beige text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
              >
                {category.description}
              </motion.p>
            )}
          </div>
        </div>

        {/* Mobile-optimized scroll indicator */}
        <motion.button
          onClick={scrollToGallery}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5
          }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white cursor-pointer touch-manipulation"
          aria-label="Scroll to gallery"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.button>
      </section>

      {/* Images Grid - Optimized spacing for mobile */}
      <section 
        className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16"
        aria-label={`${category?.title || 'Album'} gallery`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pb-16 sm:pb-0" // Add padding for mobile action buttons
        >
          <GalleryGrid
            images={allImages}
            onImageClick={handleImageClick}
            isAlbumView={true}
          />
        </motion.div>

        {/* Mobile action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-0 left-0 right-0 sm:hidden bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex justify-around items-center"
        >
          <button
            onClick={() => {
              if (allImages[0]) handleShare(allImages[0]);
            }}
            className="flex flex-col items-center gap-1"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-gray-600">Share</span>
          </button>
          <button
            onClick={() => {
              if (allImages[0]) handleDownload(allImages[0]);
            }}
            className="flex flex-col items-center gap-1"
          >
            <Download className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-gray-600">Download</span>
          </button>
          <button
            onClick={() => {
              if (allImages[0]) toggleFavorite(allImages[0].id);
            }}
            className="flex flex-col items-center gap-1"
          >
            <Heart className={`w-5 h-5 ${favorites.has(allImages[0]?.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            <span className="text-xs text-gray-600">Favorite</span>
          </button>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <ImageLightbox
            images={allImages}
            currentIndex={selectedImageIndex}
            isOpen={true}
            onClose={() => setSelectedImageIndex(null)}
            onNext={() => setSelectedImageIndex((prev) => 
              prev !== null ? (prev + 1) % allImages.length : null
            )}
            onPrev={() => setSelectedImageIndex((prev) => 
              prev !== null ? (prev - 1 + allImages.length) % allImages.length : null
            )}
            onFavorite={toggleFavorite}
            onShare={handleShare}
            onDownload={handleDownload}
            favorites={favorites}
          />
        )}
      </AnimatePresence>
    </div>
  );
}