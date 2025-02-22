import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import categories, { galleryImages } from '../../data/galleries';
import { GalleryImage } from '../../types/gallery';
import ImageLightbox from '../../components/gallery/ImageLightbox';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import GalleryGrid from '../../components/gallery/GalleryGrid';

export default function CategoryGallery() {
  const { category } = useParams<{ category: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  
  const categoryData = categories.find(c => c.id === category);
  const images = category ? galleryImages[category] : [];

  const handleImageClick = (_: GalleryImage, index: number) => {
    setSelectedImageIndex(index);
  };

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Gallery not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 to-white">
      {/* Hero Section - Responsive height */}
      <section className="relative h-[30vh] sm:h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          {/* Loading state */}
          {!isHeroLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <LoadingSpinner size="lg" />
            </div>
          )}
          
          {/* Hero images with progressive loading */}
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={categoryData.thumbnailUrl}
            alt={categoryData.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isHeroLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            fetchPriority="high"
          />
          
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={categoryData.coverImage}
            alt={categoryData.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHeroLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsHeroLoaded(true)}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/80" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl md:text-7xl font-serif text-white mb-4 sm:mb-6"
            >
              {categoryData.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-beige text-sm sm:text-lg md:text-xl max-w-2xl mx-auto"
            >
              {categoryData.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Images Grid - Optimized padding for mobile */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        <GalleryGrid
          images={images}
          onImageClick={handleImageClick}
        />
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <ImageLightbox
            images={images}
            currentIndex={selectedImageIndex}
            isOpen={true}
            onClose={() => setSelectedImageIndex(null)}
            onNext={() => setSelectedImageIndex((prev) => 
              prev !== null ? (prev + 1) % images.length : null
            )}
            onPrev={() => setSelectedImageIndex((prev) => 
              prev !== null ? (prev - 1 + images.length) % images.length : null
            )}
          />
        )}
      </AnimatePresence>
    </div>
  );
}