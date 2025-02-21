import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Lock, Minus, Camera } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import LoginModal from '../components/auth/LoginModal';
import SignUpModal from '../components/auth/SignUpModal';

export default function PackageDetails() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { packages } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const packageId = params.packageId || packages[0]?.id;
  const selectedPackage = packages.find(pkg => pkg.id === packageId) || packages[0];
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const basePrices = {
    'basic-digital-engagement': 144000,
    'standard-engagement-album': 214000,
    'premium-wedding-full': 334000
  };

  const additionalServices = {
    'basic-digital-engagement': [
      { id: 'extra-hour', name: 'Additional Hour Coverage', price: 10000, description: 'Extra hour of engagement coverage' },
      { id: 'extra-enlargement', name: 'Extra 12x18 Wooden Enlargement', price: 15000, description: 'Additional wooden enlargement print' }
    ],
    'standard-engagement-album': [
      { id: 'extra-pages', name: 'Additional 10 Album Pages', price: 12000, description: 'Add 10 more pages to your album' },
      { id: 'extra-enlargement', name: 'Extra 16x24 Wooden Enlargement', price: 18000, description: 'Additional large wooden enlargement' },
      { id: 'thank-you-cards', name: 'Thank You Cards (4x6)', price: 80, description: 'Per card, minimum order 50 cards' }
    ],
    'premium-wedding-full': [
      { id: 'extra-pages', name: 'Additional 20 Album Pages', price: 20000, description: 'Add 20 more pages to your wedding album' },
      { id: 'extra-enlargement', name: 'Extra 20x30 Wooden Enlargement', price: 20000, description: 'Additional large wooden enlargement' },
      { id: 'thank-you-cards', name: 'Additional Thank You Cards (4x6)', price: 80, description: 'Per card, minimum order 50 cards' },
      { id: 'second-day', name: 'Second-day Coverage (4 hours)', price: 50000, description: 'Additional coverage for next-day events' }
    ]
  };

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const services = additionalServices[packageId as keyof typeof additionalServices] || [];

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = basePrices[packageId as keyof typeof basePrices];
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const service = services.find(s => s.id === addonId);
      return total + (service?.price || 0);
    }, 0);
    return basePrice + addonsPrice;
  };

  const handleBack = () => {
    navigate('/', { 
      state: { 
        scrollToSection: 'photography-packages',
        activeCategory: location.state?.fromCategory || selectedPackage?.category || 'Wedding'
      }
    });
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-brand-dark mb-4">Package not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Get the category from the package ID if category is not directly available
  const getPackageCategory = (packageId: string) => {
    if (packageId.includes('wedding')) return 'Wedding';
    return 'Photography';
  };

  const packageCategory = selectedPackage.category || getPackageCategory(packageId);

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={`/images/${packageCategory.toLowerCase()}-bg.jpg`}
          alt={selectedPackage.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/photography-bg.jpg';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{selectedPackage.name}</h1>
            <p className="text-lg md:text-xl text-brand-beige/90">{packageCategory} Photography</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-brand-dark hover:text-brand-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Packages</span>
          </button>
        </div>

        {/* Package Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Package Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <span className="inline-block bg-brand-beige text-brand-dark px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {packageCategory}
                </span>
                <h2 className="text-2xl font-serif text-brand-dark mb-3">{selectedPackage.name}</h2>
                <p className="text-brand-muted">{selectedPackage.description}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-serif text-brand-dark">What's Included:</h3>
                <ul className="space-y-3">
                  {selectedPackage.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <Check className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-brand-muted">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Services */}
            {services.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-serif text-brand-dark mb-6">Additional Services</h3>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-brand-beige/30 hover:bg-brand-beige/50 transition-colors cursor-pointer"
                      onClick={() => toggleAddon(service.id)}
                    >
                      <div className="flex items-center space-x-4">
                        {selectedAddons.includes(service.id) ? (
                          <Minus className="w-5 h-5 text-brand-primary" />
                        ) : (
                          <Plus className="w-5 h-5 text-brand-dark" />
                        )}
                        <div>
                          <h4 className="font-medium text-brand-dark">{service.name}</h4>
                          <p className="text-sm text-brand-muted">{service.description}</p>
                        </div>
                      </div>
                      {isAuthenticated ? (
                        <span className="text-lg font-serif text-brand-primary">LKR {service.price}</span>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLoginModalOpen(true);
                          }}
                          className="flex items-center space-x-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Login to view price</span>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-8">
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-brand-beige/30 rounded-xl">
                  <p className="text-brand-dark text-sm mb-2">
                    Create a free account to view our pricing and make bookings. It only takes a minute!
                  </p>
                  <button
                    onClick={() => setIsSignUpModalOpen(true)}
                    className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium transition-colors"
                  >
                    Sign up now →
                  </button>
                </div>
              )}

              <h3 className="text-xl font-serif text-brand-dark mb-6">Booking Summary</h3>
              
              {/* Base Price */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-brand-beige">
                <span className="text-brand-muted">Base Package</span>
                {isAuthenticated ? (
                  <span className="text-lg font-serif text-brand-dark">
                    LKR {basePrices[packageId as keyof typeof basePrices]}
                  </span>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLoginModalOpen(true);
                    }}
                    className="flex items-center space-x-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Login to view price</span>
                  </button>
                )}
              </div>

              {/* Selected Add-ons */}
              {selectedAddons.length > 0 && isAuthenticated && (
                <div className="space-y-3 mb-4 pb-4 border-b border-brand-beige">
                  <span className="text-brand-muted">Additional Services:</span>
                  {selectedAddons.map(addonId => {
                    const service = services.find(s => s.id === addonId);
                    return service ? (
                      <div key={addonId} className="flex justify-between items-center">
                        <span className="text-sm text-brand-dark">{service.name}</span>
                        {isAuthenticated ? (
                          <span className="text-brand-dark">LKR {service.price}</span>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsLoginModalOpen(true);
                            }}
                            className="flex items-center space-x-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                          >
                            <Lock className="w-4 h-4" />
                            <span className="text-sm">Login to view price</span>
                          </button>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* Total Price */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-medium text-brand-dark">Total</span>
                {isAuthenticated ? (
                  <span className="text-2xl font-serif text-brand-primary">
                    LKR {calculateTotalPrice()}
                  </span>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLoginModalOpen(true);
                    }}
                    className="flex items-center space-x-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Login to view price</span>
                  </button>
                )}
              </div>

              {/* Book Now Button */}
              {isAuthenticated ? (
                <Link
                  to="/booking"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  state={{ 
                    packageId: selectedPackage.id,
                    category: packageCategory,
                    addons: selectedAddons
                  }}
                  className="w-full bg-brand-primary text-white py-3 px-6 rounded-full hover:bg-brand-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Book Now</span>
                  <Camera className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full bg-brand-primary text-white py-3 px-6 rounded-full hover:bg-brand-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login to Book</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking CTA Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-brand-beige mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">
              Ready to Book Your {packageCategory} Session?
            </h2>
            <p className="text-brand-muted mb-8">
              {packageCategory === 'Wedding' && "Let's capture the magic of your special day together"}
            </p>
            <Link
              to="/booking"
              className="inline-block border-2 border-brand-dark text-brand-dark px-8 py-3 rounded-full hover:bg-brand-dark hover:text-brand-beige transition-colors duration-300 font-medium"
            >
              Book Your Session Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}
