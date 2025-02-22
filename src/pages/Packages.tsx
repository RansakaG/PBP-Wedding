import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, LayoutGrid, Table, ArrowRight, Lock, Info, Filter, Star } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import PageTransition from '../components/ui/PageTransition';

type FilterOptions = {
  priceRange: { min: number; max: number } | null;
  features: string[];
};

export default function Packages() {
  const { packages } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(
    location.state?.viewMode || 'grid'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: null,
    features: []
  });
  const weddingPackages = packages.filter(pkg => pkg.category === 'Wedding');

  const basePrices = {
    'basic-digital-engagement': 144000,
    'standard-engagement-album': 214000,
    'premium-wedding-full': 334000
  };

  // Add-on services pricing data
  const additionalServices = {
    'basic-digital-engagement': [
      { id: 'extra-hour', name: 'Additional Hour Coverage', price: 10000 },
      { id: 'extra-enlargement', name: 'Extra 12x18 Wooden Enlargement', price: 15000 }
    ],
    'standard-engagement-album': [
      { id: 'extra-pages', name: 'Additional 10 Album Pages', price: 12000 },
      { id: 'extra-enlargement', name: 'Extra 16x24 Wooden Enlargement', price: 18000 },
      { id: 'thank-you-cards', name: 'Thank You Cards (4x6)', price: 80 }
    ],
    'premium-wedding-full': [
      { id: 'extra-pages', name: 'Additional 20 Album Pages', price: 20000 },
      { id: 'extra-enlargement', name: 'Extra 20x30 Wooden Enlargement', price: 20000 },
      { id: 'thank-you-cards', name: 'Additional Thank You Cards (4x6)', price: 80 },
      { id: 'second-day', name: 'Second-day Coverage (4 hours)', price: 50000 }
    ]
  };

  // Extract all unique features across packages
  const allFeatures = Array.from(new Set(
    weddingPackages.flatMap(pkg => pkg.features.map(feature => {
      // Normalize feature text by removing specific details in parentheses
      return feature.replace(/\([^)]*\)/g, '').trim();
    }))
  ));

  // Common features that should be shown first
  const priorityFeatures = [
    'coverage',
    'photographer',
    'album',
    'editing',
    'gallery',
    'engagement'
  ];

  // Sort features to show common ones first
  const sortedFeatures = [
    ...allFeatures.filter(feature => 
      priorityFeatures.some(pf => feature.toLowerCase().includes(pf))
    ),
    ...allFeatures.filter(feature => 
      !priorityFeatures.some(pf => feature.toLowerCase().includes(pf))
    )
  ];

  // Check if a package has a specific feature
  const hasFeature = (pkg: typeof packages[0], feature: string) => {
    return pkg.features.some(f => 
      f.replace(/\([^)]*\)/g, '').trim().toLowerCase() === feature.toLowerCase() ||
      f.replace(/\([^)]*\)/g, '').trim().toLowerCase().includes(feature.toLowerCase())
    );
  };

  // Get the specific detail for a feature in a package
  const getFeatureDetail = (pkg: typeof packages[0], feature: string) => {
    const matchingFeature = pkg.features.find(f => 
      f.replace(/\([^)]*\)/g, '').trim().toLowerCase().includes(feature.toLowerCase())
    );
    if (!matchingFeature) return null;
    const detail = matchingFeature.match(/\((.*?)\)/);
    return detail ? detail[1] : null;
  };

  // Calculate max potential price including all add-ons
  const getMaxPotentialPrice = (packageId: string) => {
    const basePrice = basePrices[packageId as keyof typeof basePrices];
    const addonsPrice = additionalServices[packageId as keyof typeof additionalServices]?.reduce(
      (total, addon) => total + addon.price,
      0
    ) || 0;
    return basePrice + addonsPrice;
  };

  // Key features for filtering
  const keyFeatures = [
    'Full day coverage',
    'Multiple photographers',
    'Drone coverage',
    'Same-day preview',
    'Engagement session',
    'Premium album'
  ];

  // Filter packages based on selected criteria
  const filteredPackages = weddingPackages.filter(pkg => {
    // Price range filter
    if (filters.priceRange && isAuthenticated) {
      const packagePrice = basePrices[pkg.id as keyof typeof basePrices];
      if (packagePrice < filters.priceRange.min || packagePrice > filters.priceRange.max) {
        return false;
      }
    }

    // Features filter
    if (filters.features.length > 0) {
      return filters.features.every(feature =>
        pkg.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
      );
    }

    return true;
  });

  const toggleFeatureFilter = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const setPriceRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: null,
      features: []
    });
  };

  // Popular features that most couples look for
  const popularFeatures = [
    {
      id: 'coverage',
      name: 'Coverage Duration',
      description: 'Total hours of photography coverage',
    },
    {
      id: 'photographers',
      name: 'Number of Photographers',
      description: 'How many photographers are included',
    },
    {
      id: 'engagement',
      name: 'Engagement Session',
      description: 'Pre-wedding photo session',
    },
    {
      id: 'album',
      name: 'Wedding Album',
      description: 'Type and size of included album',
    },
    {
      id: 'preview',
      name: 'Same-Day Preview',
      description: 'Get preview images on your wedding day',
    }
  ];

  // Get the value of a popular feature for a package
  const getPopularFeatureValue = (pkg: typeof packages[0], featureId: string) => {
    const featureMap: Record<string, (features: string[]) => string | null> = {
      coverage: (features) => {
        const coverage = features.find(f => f.toLowerCase().includes('coverage'));
        return coverage ? coverage.match(/\(([^)]+)\)/)?.[1] || coverage : null;
      },
      photographers: (features) => {
        const photographer = features.find(f => 
          f.toLowerCase().includes('photographer') && 
          !f.toLowerCase().includes('additional')
        );
        return photographer || null;
      },
      engagement: (features) => {
        const engagement = features.find(f => f.toLowerCase().includes('engagement'));
        return engagement || null;
      },
      album: (features) => {
        const album = features.find(f => f.toLowerCase().includes('album') && !f.toLowerCase().includes('additional'));
        return album ? album.match(/\(([^)]+)\)/)?.[1] || album : null;
      },
      preview: (features) => {
        const preview = features.find(f => f.toLowerCase().includes('preview'));
        return preview || null;
      }
    };

    return featureMap[featureId]?.(pkg.features) || null;
  };

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 to-white">
        {/* Hero Section */}
        <div className="relative h-[40vh] bg-brand-dark overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Wedding photography packages"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/80" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-serif text-white mb-4"
              >
                Wedding Photography Packages
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-brand-beige/90 max-w-2xl mx-auto"
              >
                Choose the perfect package to capture your special day
              </motion.p>
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-brand-beige/50 text-sm font-medium text-brand-dark hover:bg-brand-beige/20 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters {filters.features.length > 0 && `(${filters.features.length})`}
              </button>
              {(filters.features.length > 0 || filters.priceRange) && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="inline-flex rounded-lg border border-brand-beige/50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-dark hover:bg-brand-beige/20'
                }`}
              >
                <LayoutGrid className="w-4 h-4 mr-1.5" />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-dark hover:bg-brand-beige/20'
                }`}
              >
                <Table className="w-4 h-4 mr-1.5" />
                Compare All
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
              <div className="space-y-6">
                {isAuthenticated && (
                  <div>
                    <h3 className="text-sm font-medium text-brand-dark mb-3">Price Range</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setPriceRange(0, 200000)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.priceRange?.max === 200000
                            ? 'bg-brand-primary text-white'
                            : 'bg-brand-beige/20 text-brand-dark hover:bg-brand-beige/30'
                        }`}
                      >
                        Under LKR 200,000
                      </button>
                      <button
                        onClick={() => setPriceRange(200000, 300000)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.priceRange?.min === 200000 && filters.priceRange?.max === 300000
                            ? 'bg-brand-primary text-white'
                            : 'bg-brand-beige/20 text-brand-dark hover:bg-brand-beige/30'
                        }`}
                      >
                        LKR 200,000 - 300,000
                      </button>
                      <button
                        onClick={() => setPriceRange(300000, 500000)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.priceRange?.min === 300000 && filters.priceRange?.max === 500000
                            ? 'bg-brand-primary text-white'
                            : 'bg-brand-beige/20 text-brand-dark hover:bg-brand-beige/30'
                        }`}
                      >
                        LKR 300,000 - 500,000
                      </button>
                      <button
                        onClick={() => setPriceRange(500000, Infinity)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.priceRange?.min === 500000
                            ? 'bg-brand-primary text-white'
                            : 'bg-brand-beige/20 text-brand-dark hover:bg-brand-beige/30'
                        }`}
                      >
                        LKR 500,000+
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-brand-dark mb-3">Must-Have Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {keyFeatures.map(feature => (
                      <button
                        key={feature}
                        onClick={() => toggleFeatureFilter(feature)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          filters.features.includes(feature)
                            ? 'bg-brand-primary text-white'
                            : 'bg-brand-beige/20 text-brand-dark hover:bg-brand-beige/30'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Packages Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {filteredPackages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-brand-dark text-lg mb-4">No packages match your selected filters</p>
              <button
                onClick={clearFilters}
                className="text-brand-primary hover:text-brand-primary/80 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            // Grid View with filtered packages
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {filteredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* Package Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-brand-beige/40 text-brand-dark px-3 py-1 rounded-full text-xs font-medium">
                      {pkg.category}
                    </span>
                  </div>

                  {/* Package Name & Description */}
                  <h3 className="text-xl md:text-2xl font-serif text-brand-dark mb-3">{pkg.name}</h3>
                  <p className="text-sm text-brand-muted mb-6">{pkg.description}</p>

                  {/* Price */}
                  {isAuthenticated ? (
                    <div className="mb-6 text-center">
                      <span className="text-2xl font-serif text-brand-primary">
                        LKR {basePrices[pkg.id as keyof typeof basePrices]}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-6 text-center">
                      <button 
                        onClick={handleLoginClick}
                        className="inline-flex items-center text-brand-primary hover:text-brand-primary/80 transition-colors"
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        <span className="text-sm">Login to view price</span>
                      </button>
                    </div>
                  )}

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* View Details Link */}
                  <Link
                    to={`/packages/${pkg.id}`}
                    state={{ from: location.pathname }}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 
                            bg-brand-beige/50 text-brand-dark rounded-full text-sm font-medium 
                            hover:bg-brand-primary hover:text-white transition-all duration-300"
                  >
                    View Package Details
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            // Table View with filtered packages
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-brand-beige/20">
                      <th className="py-4 px-6 text-left text-sm font-medium text-brand-dark border-b border-brand-beige/20">Features</th>
                      {filteredPackages.map(pkg => (
                        <th key={pkg.id} className="py-4 px-6 text-center border-b border-brand-beige/20">
                          <div className="space-y-2">
                            <h3 className="text-lg font-serif text-brand-dark">{pkg.name}</h3>
                            <p className="text-xs text-brand-muted">{pkg.description}</p>
                            {isAuthenticated ? (
                              <div className="space-y-1 mt-2">
                                <p className="text-xl font-serif text-brand-primary">
                                  LKR {basePrices[pkg.id as keyof typeof basePrices]}
                                </p>
                                <div className="flex items-center justify-center text-xs text-brand-muted">
                                  <Info className="w-3 h-3 mr-1" />
                                  <span>Up to LKR {getMaxPotentialPrice(pkg.id)} with add-ons</span>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={handleLoginClick}
                                className="inline-flex items-center text-brand-primary hover:text-brand-primary/80 transition-colors mt-2"
                              >
                                <Lock className="w-4 h-4 mr-1" />
                                <span className="text-sm">Login to view price</span>
                              </button>
                            )}
                            <Link
                              to={`/packages/${pkg.id}`}
                              state={{ from: location.pathname }}
                              className="inline-flex items-center text-sm text-brand-primary hover:text-brand-primary/80 mt-2"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Popular Features Section */}
                    <tr>
                      <td colSpan={filteredPackages.length + 1} className="py-4 px-6 bg-brand-beige/10">
                        <div className="flex items-center text-brand-dark">
                          <Star className="w-4 h-4 text-brand-primary mr-2" />
                          <span className="font-medium">Popular Features</span>
                        </div>
                      </td>
                    </tr>
                    {popularFeatures.map((feature, idx) => (
                      <tr key={feature.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-brand-beige/5'}>
                        <td className="py-3 px-6 text-sm text-brand-dark border-b border-brand-beige/10">
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-xs text-brand-muted">{feature.description}</div>
                          </div>
                        </td>
                        {filteredPackages.map(pkg => (
                          <td key={pkg.id} className="py-3 px-6 text-center border-b border-brand-beige/10">
                            {getPopularFeatureValue(pkg, feature.id) ? (
                              <div className="text-sm text-brand-dark">
                                {getPopularFeatureValue(pkg, feature.id)}
                              </div>
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Pricing Section */}
                    <tr className="bg-brand-beige/10">
                      <td className="py-4 px-6 text-sm font-medium text-brand-dark border-b border-brand-beige/10">
                        Base Price
                      </td>
                      {filteredPackages.map(pkg => (
                        <td key={pkg.id} className="py-4 px-6 text-center border-b border-brand-beige/10">
                          {isAuthenticated ? (
                            <span className="text-lg font-serif text-brand-primary">
                              LKR {basePrices[pkg.id as keyof typeof basePrices]}
                            </span>
                          ) : (
                            <button
                              onClick={handleLoginClick}
                              className="inline-flex items-center text-brand-primary hover:text-brand-primary/80"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              <span className="text-sm">Login to view</span>
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* All Features Section */}
                    <tr>
                      <td colSpan={filteredPackages.length + 1} className="py-4 px-6 bg-brand-beige/10">
                        <div className="flex items-center text-brand-dark">
                          <Check className="w-4 h-4 text-brand-primary mr-2" />
                          <span className="font-medium">All Included Features</span>
                        </div>
                      </td>
                    </tr>
                    {sortedFeatures.map((feature, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-brand-beige/5' : ''}>
                        <td className="py-3 px-6 text-sm text-brand-dark border-b border-brand-beige/10">
                          {feature}
                        </td>
                        {filteredPackages.map(pkg => (
                          <td key={pkg.id} className="py-3 px-6 text-center border-b border-brand-beige/10">
                            {hasFeature(pkg, feature) ? (
                              <div className="flex flex-col items-center">
                                <Check className="w-5 h-5 text-green-500" />
                                {getFeatureDetail(pkg, feature) && (
                                  <span className="text-xs text-brand-muted mt-1">
                                    ({getFeatureDetail(pkg, feature)})
                                  </span>
                                )}
                              </div>
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Available Add-ons Row */}
                    <tr className="bg-brand-beige/10">
                      <td className="py-4 px-6 text-sm font-medium text-brand-dark border-b border-brand-beige/10">
                        Available Add-ons
                      </td>
                      {filteredPackages.map(pkg => (
                        <td key={pkg.id} className="py-4 px-6 text-center border-b border-brand-beige/10">
                          {isAuthenticated ? (
                            <div className="space-y-2">
                              {additionalServices[pkg.id as keyof typeof additionalServices]?.map(addon => (
                                <div key={addon.id} className="text-xs">
                                  <span className="text-brand-dark">{addon.name}</span>
                                  <span className="text-brand-primary ml-1">(+LKR {addon.price})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <button
                              onClick={handleLoginClick}
                              className="inline-flex items-center text-brand-primary hover:text-brand-primary/80"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              <span className="text-sm">Login to view</span>
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Max Potential Price Row */}
                    <tr className="bg-brand-beige/20 font-medium">
                      <td className="py-4 px-6 text-sm text-brand-dark border-b border-brand-beige/10">
                        Maximum Price with Add-ons
                      </td>
                      {filteredPackages.map(pkg => (
                        <td key={pkg.id} className="py-4 px-6 text-center border-b border-brand-beige/10">
                          {isAuthenticated ? (
                            <span className="text-lg font-serif text-brand-primary">
                              Up to LKR {getMaxPotentialPrice(pkg.id)}
                            </span>
                          ) : (
                            <button
                              onClick={handleLoginClick}
                              className="inline-flex items-center text-brand-primary hover:text-brand-primary/80"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              <span className="text-sm">Login to view</span>
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 md:px-6 bg-brand-beige mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">
                Need Help Choosing?
              </h2>
              <p className="text-brand-muted mb-8">
                Contact us to discuss your requirements and find the perfect package for your special day
              </p>
              <Link
                to="/contact"
                className="inline-block border-2 border-brand-dark text-brand-dark px-8 py-3 rounded-full hover:bg-brand-dark hover:text-brand-beige transition-colors duration-300 font-medium"
              >
                Get in Touch
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}