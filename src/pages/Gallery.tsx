import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/galleries';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import PageTransition from '../components/ui/PageTransition';

// Import hero image
import heroImage from '../assets/wedding/Dilusha-Ruwindi,Wedding/P1.webp';

const galleryVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
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
                fetchPriority="high"
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
                  Our Galleries
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-brand-beige text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                >
                  Browse through our collection of wedding memories and celebrations
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
                <motion.div
                  key={category.id}
                  variants={galleryVariants}
                  style={{ willChange: 'opacity' }}
                  className="group"
                >
                  <Link to={category.path} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <img
                        src={category.coverImage}
                        alt={category.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-2xl font-serif text-white mb-2">{category.title}</h2>
                        <p className="text-gray-200 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </ErrorBoundary>
    </PageTransition>
  );
}