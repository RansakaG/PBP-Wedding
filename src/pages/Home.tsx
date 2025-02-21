import { useState, useEffect, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../components/packages/PackageCard';
import { useBookingStore } from '../store/bookingStore';
import homeHeroImage from '../assets/home-hero.webp';

// Importing wedding photos
import dilushaWedding from '../assets/wedding/Dilusha-Ruwindi,Wedding/P1.webp';
import kalpanaWedding from '../assets/wedding/Kalpana-Isuru/R6PB4326.webp';
import nishdiWedding from '../assets/wedding/Nishdi-Sahan,Wedding/IMGL7034.webp';

const featuredWork = [
  {
    title: "Dilusha & Ruwindi",
    category: "Wedding",
    image: dilushaWedding,
    link: "/gallery/dilusha-wedding"
  },
  {
    title: "Kalpana & Isuru",
    category: "Wedding",
    image: kalpanaWedding,
    link: "/gallery/kalpana-isuru"
  },
  {
    title: "Nishdi & Sahan",
    category: "Wedding",
    image: nishdiWedding,
    link: "/gallery/nishdi-sahan"
  }
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { packages } = useBookingStore();

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.fetchPriority = 'high';
    img.src = homeHeroImage;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  // Scroll to section effect
  useEffect(() => {
    if (location.state?.scrollToSection) {
      const section = document.getElementById(location.state.scrollToSection);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  // Debounced scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          const heroHeight = heroSection.offsetHeight;
          const scrollPosition = window.scrollY;
          setShowBackToTop(scrollPosition > heroHeight);
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Optimized smooth scroll
  const handleSmoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = element.offsetTop - 80; // Subtract header height if needed
      requestAnimationFrame(() => {
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Hero Section */}
      <div id="hero-section" className="relative h-[100svh] bg-brand-dark overflow-hidden">
        {/* Background Image with loading state */}
        <div className="absolute inset-0">
          {isImageLoaded ? (
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              src={homeHeroImage}
              alt="Hero background"
              className="w-full h-full object-cover opacity-50 sm:opacity-60"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div className="w-full h-full bg-brand-dark animate-pulse" />
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50 sm:from-black/50 sm:via-black/30 sm:to-black/40" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto translate-y-[10%]">
          <div className="text-center mb-6 sm:mb-8 w-full">
            <h1 className="text-[#E2D9D0] font-serif">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="block text-[2.5rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 sm:mb-8 tracking-wide"
              >
                Prauda Buwaneka
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] text-[#E2D9D0]/60 font-light"
              >
                Photography
              </motion.span>
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center w-full max-w-[280px] sm:max-w-lg mx-auto mt-6 sm:mt-8"
          >
            <Link
              to="/gallery"
              className="group relative inline-flex items-center justify-center px-6 sm:px-12 py-2.5 sm:py-4 text-[#E2D9D0]/90 overflow-hidden rounded-full border border-[#E2D9D0]/20 hover:border-[#E2D9D0]/40 transition-colors duration-300 w-full sm:w-auto mx-auto"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent group-hover:from-brand-primary/20 transition-all duration-300"></span>
              <span className="relative flex items-center justify-center text-xs sm:text-base tracking-[0.15em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
                Explore Gallery 
                <ArrowRight className="ml-1.5 sm:ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>

          {/* Scroll/Swipe Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="text-white flex flex-col items-center cursor-pointer fixed md:absolute bottom-8 md:bottom-32 left-1/2 transform -translate-x-1/2 z-[100] hover:text-[#E2D9D0] transition-colors"
            onClick={() => handleSmoothScroll('photography-packages')}
          >
            {/* Desktop Scroll Indicator */}
            <div className="hidden md:flex flex-col items-center">
              <span className="text-sm tracking-[0.2em] uppercase mb-2 font-medium">Scroll</span>
              <div className="w-[2px] h-8 bg-white/70 relative overflow-hidden">
                <motion.div
                  animate={{ 
                    y: [0, 32, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-white"
                />
              </div>
            </div>

            {/* Mobile Swipe Indicator */}
            <div className="flex md:hidden items-center">
              <span className="text-sm tracking-[0.1em] uppercase font-medium">Swipe</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="ml-1.5"
                animate={{ 
                  y: [-1, 1, -1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </motion.svg>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Wrap sections in Suspense for lazy loading */}
      <Suspense fallback={<div className="w-full h-64 bg-brand-beige/50 animate-pulse" />}>
        {/* Photography Packages Section */}
        <section id="photography-packages" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-beige/20 via-white to-brand-beige/10">
          <div className="absolute inset-0 bg-[url('/src/assets/home-hero.webp')] bg-fixed bg-cover bg-center opacity-5" />
          <div className="relative max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-4 sm:px-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-brand-beige/30 text-brand-dark px-3 sm:px-4 py-1 rounded-full text-sm tracking-wider mb-4 sm:mb-6"
              >
                Wedding Photography
              </motion.span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-brand-dark mb-4 sm:mb-6">Capture Your Perfect Day</h2>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-2xl mx-auto">
                Choose from our carefully curated collection of wedding photography packages, each designed to preserve your precious moments in timeless elegance.
              </p>
            </motion.div>

            {/* Package Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-[90rem] mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <PackageCard 
                    package={pkg} 
                    onBook={() => navigate(`/packages/${pkg.id}`)} 
                    index={index}
                    featured={pkg.id === 'premium-wedding-full'}
                  />
                </motion.div>
              ))}
            </div>

            {/* Enhanced CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12 sm:mt-16 md:mt-20"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <Link
                  to="/packages"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-brand-dark text-brand-beige rounded-full hover:bg-brand-dark/90 transition-all duration-300 group shadow-lg text-sm sm:text-base"
                >
                  <span className="tracking-wider font-medium">Compare All Packages</span>
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-brand-dark text-brand-dark rounded-full hover:bg-brand-dark hover:text-brand-beige transition-all duration-300 group text-sm sm:text-base"
                >
                  <span className="tracking-wider font-medium">Request Custom Package</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<div className="w-full h-64 bg-brand-beige/50 animate-pulse" />}>
        {/* Featured Work Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#F8F5F3]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-dark mb-3 sm:mb-4">Featured Wedding Photos</h2>
              <p className="text-sm sm:text-base md:text-lg text-brand-muted">
                Explore a curated collection of our most beautiful wedding photography moments that tell unique love stories.
              </p>
            </div>

            <div className="max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                {featuredWork.map((image, index) => (
                  <motion.div
                    key={image.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative aspect-square group cursor-pointer rounded-xl overflow-hidden bg-white shadow-md"
                  >
                    <Link 
                      to="/gallery"
                      className="block w-full h-full"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-sm md:text-base text-white font-medium truncate">
                            {image.title}
                          </h3>
                          <p className="text-xs md:text-sm text-white/80 truncate">
                            Wedding Photography
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/gallery"
                  className="inline-flex items-center justify-center gap-2 px-8 sm:px-12 py-3 sm:py-4 bg-[#D9CFC4] text-gray-800 rounded-full text-sm sm:text-base font-medium tracking-wider sm:tracking-[0.2em] uppercase hover:bg-[#D9CFC4]/90 transition-all duration-300 group"
                >
                  <span>View Wedding Gallery</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Suspense>

      {/* Contact CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-beige">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-dark mb-3 sm:mb-4">
              Ready to Create Your Story?
            </h2>
            <p className="text-sm sm:text-base text-brand-muted mb-6 sm:mb-8">
              Let's work together to capture your special moments in extraordinary ways
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 border-2 border-brand-dark text-brand-dark rounded-full hover:bg-brand-dark hover:text-brand-beige transition-all duration-300 text-sm sm:text-base font-medium tracking-wider sm:tracking-[0.2em] uppercase"
            >
              Book a Session
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={handleScrollToTop}
            className="group fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary/20 to-transparent group-hover:from-brand-primary/40 transition-all duration-300"></span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="relative h-6 w-6 text-white transform group-hover:-translate-y-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4M5 11l7-7 7 7"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}