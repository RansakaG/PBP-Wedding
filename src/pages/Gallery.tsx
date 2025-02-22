import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import categories from '../data/galleries';
import { GalleryCategory } from '../types/gallery';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import PageTransition from '../components/ui/PageTransition';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Import hero image
import heroImage from '../assets/wedding/Dilusha-Ruwindi,Wedding/P1.webp';

const galleryVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const CategoryCard = ({ category }: { category: GalleryCategory }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullImageLoaded, setIsFullImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the full resolution image
    const img = new Image();
    img.src = category.coverImage;
    img.onload = () => setIsFullImageLoaded(true);
  }, [category.coverImage]);

  return (
    <motion.div
      variants={galleryVariants}
      style={{ willChange: 'opacity' }}
      className="group"
    >
      <Link to={`/gallery/album/${category.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          {/* Loading state */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <LoadingSpinner size="md" />
            </div>
          )}

          {/* Main image */}
          <img
            src={category.thumbnailUrl}
            alt={category.title}
            className={`w-full h-full object-cover transform transition-all duration-500 ${
              isFullImageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoaded(true)}
          />
          
          {/* Full resolution image */}
          <img
            src={category.coverImage}
            alt={category.title}
            className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-500 ${
              isFullImageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-serif text-white mb-2">{category.title}</h2>
            <p className="text-gray-200 text-sm">{category.description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Gallery() {
  return (
    <PageTransition>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 to-white will-change-transform">
          {/* Hero Section */}
          <section className="relative h-[40vh] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={heroImage}
                alt="Gallery Hero"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/40 to-brand-dark/80" />
            </div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center px-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-serif text-white mb-6"
                >
                  Wedding Albums
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-brand-beige text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                >
                  Browse through our beautiful collection of wedding memories
                </motion.p>
              </div>
            </div>
          </section>

          {/* Gallery Grid */}
          <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </motion.div>
          </section>
        </div>
      </ErrorBoundary>
    </PageTransition>
  );
}