import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { scrollToTop } from '../utils/scrollUtils';
import { validateBookingForm } from '../utils/validation-utils';
import PageTransition from '../components/ui/PageTransition';
import emailjs from '@emailjs/browser';
import toast from '../utils/toast';

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface FormData {
  clientName: string;
  clientEmail: string;
  packageId: string;
  date: string;
  phone: string;
  location: string;
  notes: string;
  addons: string[];
}

interface FormError {
  field: string;
  message: string;
}

const additionalServices: Record<string, AdditionalService[]> = {
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

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { packages, addBooking } = useBookingStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<FormData>(() => {
    const savedForm = localStorage.getItem('bookingFormData');
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return parsed.data;
      }
    }
    
    return {
      clientName: user?.fullName || '',
      clientEmail: user?.email || '',
      packageId: location.state?.packageId || new URLSearchParams(location.search).get('package') || packages[0]?.id || 'wedding-premium',
      addons: location.state?.addons || [],
      date: '',
      phone: '',
      location: '',
      notes: ''
    };
  });

  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddonChangeNotice, setShowAddonChangeNotice] = useState(false);
  const [removedAddons, setRemovedAddons] = useState<string[]>([]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bookingFormData', JSON.stringify({
      data: formData,
      timestamp: Date.now()
    }));
  }, [formData]);

  // Track form changes
  useEffect(() => {
    const savedForm = localStorage.getItem('bookingFormData');
    if (!savedForm) {
      setHasChanges(false);
      return;
    }

    const { data: savedData } = JSON.parse(savedForm);
    const hasUnsavedChanges = Object.entries(formData).some(([key, value]) => {
      if (key === 'addons') {
        return JSON.stringify(value) !== JSON.stringify(savedData[key]);
      }
      return value !== savedData[key];
    });
    
    setHasChanges(hasUnsavedChanges);
  }, [formData]);

  // Add beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Use useLocation and check for navigation changes
  useEffect(() => {
    if (hasChanges && location.pathname !== '/booking-confirmation') {
      const shouldLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!shouldLeave) {
        navigate(-1); // Go back if user doesn't want to leave
      }
    }
  }, [location, hasChanges, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        clientName: user.fullName,
        clientEmail: user.email
      }));
    }
  }, [user]);

  // Update form data when package selection changes from route
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      packageId: location.state?.packageId || new URLSearchParams(location.search).get('package') || packages[0]?.id || 'wedding-premium',
      addons: location.state?.addons || []
    }));
  }, [location.state?.packageId, location.state?.addons]);

  // Clear form errors when input changes
  useEffect(() => {
    setFormErrors([]);
  }, [formData]);

  // Clear localStorage after successful submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors.map(error => ({
        ...error,
        field: String(error.field)
      })));
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    try {
      const selectedPackage = packages.find(pkg => pkg.id === formData.packageId);
      const templateParams = {
        to_name: 'Prauda',
        from_name: formData.clientName,
        reply_to: formData.clientEmail,
        message: `
📸 New Wedding Booking Request
═══════════════════════════

👤 Client Details
───────────────
• Name: ${formData.clientName}
• Email: ${formData.clientEmail}
• Phone: ${formData.phone}

📅 Wedding Details
───────────────
• Package: ${selectedPackage?.name || ''}
• Date: ${formData.date}
• Venue/Location: ${formData.location}
${formData.addons?.length ? `
🎁 Additional Services
───────────────
${formData.addons.map(addon => `• ${addon}`).join('\n')}
` : ''}

📝 Additional Notes
───────────────
${formData.notes || 'No additional notes provided'}
        `,
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('EmailJS Response:', response);

      // Add booking to store
      const booking = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending' as const,
        photos: [],
        totalPhotos: 0,
        selectedPhotos: 0,
        printedPhotos: 0,
        deliveredPhotos: 0
      };
      addBooking(booking);
      
      // Show success message
      toast.success("Wedding booking request sent successfully! We'll get back to you soon.");
      
      // Clear the form
      setFormData({
        clientName: user?.fullName || '',
        clientEmail: user?.email || '',
        packageId: '',
        date: '',
        phone: '',
        location: '',
        notes: '',
        addons: []
      });
      
      // Clear saved form data after successful submission
      localStorage.removeItem('bookingFormData');

      scrollToTop();
      navigate('/booking-confirmation');

    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("There was an error sending your booking request. Please try again.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If package changes, validate addons
    if (name === 'packageId') {
      const availableAddons = additionalServices[value]?.map((s: AdditionalService) => s.id) || [];
      const removedOnes = formData.addons.filter((addon: string) => !availableAddons.includes(addon));
      
      if (removedOnes.length > 0) {
        setRemovedAddons(removedOnes.map((id: string) => {
          const addon = getAddonDetails(id);
          return addon?.name || id;
        }));
        setShowAddonChangeNotice(true);
        setTimeout(() => setShowAddonChangeNotice(false), 5000);
      }
      
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
        addons: prev.addons.filter((addon: string) => availableAddons.includes(addon))
      }));
    } else {
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Validate field on blur
    if (e.type === 'blur') {
      const validation = validateBookingForm({ 
        ...formData, 
        [name]: value 
      });
      const fieldError = validation.errors.find(error => String(error.field) === name);
      if (fieldError) {
        setFormErrors(prev => [...prev.filter(e => e.field !== name), {
          ...fieldError,
          field: String(fieldError.field)
        }]);
      }
    }
  };

  const getFieldError = (fieldName: string) => {
    return formErrors.find(error => error.field === fieldName)?.message;
  };

  const renderErrorMessage = (fieldName: string) => {
    const error = getFieldError(fieldName);
    if (!error) return null;
    
    return (
      <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  // Add helper to get addon details including price
  const getAddonDetails = (addonId: string) => {
    if (!formData.packageId) return null;
    const additionalServices = {
      'wedding-premium': [
        { id: 'engagement', name: 'Engagement Session', price: 250 },
        { id: 'album', name: 'Premium Photo Album', price: 300 },
        { id: 'drone', name: 'Drone Coverage', price: 200 },
        { id: 'prints', name: 'Premium Prints Package', price: 150 }
      ],
      'wedding-essential': [
        { id: 'engagement', name: 'Engagement Session', price: 200 },
        { id: 'album', name: 'Photo Album', price: 200 },
        { id: 'prints', name: 'Prints Package', price: 150 }
      ]
    };
    
    return additionalServices[formData.packageId as keyof typeof additionalServices]?.find(s => s.id === addonId) || null;
  };

  const calculateTotal = () => {
    const basePrices: Record<string, number> = {
      'basic-digital-engagement': 144000,
      'standard-engagement-album': 214000,
      'premium-wedding-full': 334000
    };

    const basePrice = basePrices[formData.packageId] || 0;
    const addonsTotal = formData.addons?.reduce((total: number, addonId: string) => {
      const addon = getAddonDetails(addonId);
      return total + (addon?.price || 0);
    }, 0) || 0;

    return basePrice + addonsTotal;
  };

  const removeAddon = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter(id => id !== addonId)
    }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 to-white">
        {/* Hero Section */}
        <div className="relative h-[40vh] bg-brand-dark overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Wedding photography session"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/80" />
          </div>
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4"
              >
                Book Your Wedding Session
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-brand-beige max-w-2xl mx-auto"
              >
                Let's capture the magic of your special day together
              </motion.p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-[2rem] p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-beige via-transparent to-brand-light" />
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative">
              {/* Package Selection */}
              <div>
                <label htmlFor="packageId" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                  Select Wedding Package
                </label>
                <div className="space-y-2">
                  <div className="relative group">
                    <CheckCircle2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-muted group-focus-within:text-brand-beige transition-colors h-5 w-5" />
                    <select
                      id="packageId"
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-brand-beige/50 focus:border-brand-beige focus:ring-2 focus:ring-brand-beige/20 bg-white/50 backdrop-blur-sm transition-all"
                      required
                    >
                      <option value="">Select a wedding package</option>
                      {packages
                        .filter(pkg => pkg.category === 'Wedding')
                        .map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  {/* Addon Change Notice */}
                  {showAddonChangeNotice && removedAddons.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2"
                    >
                      <p>
                        Some selected services are not available in this package:
                        <span className="font-medium block mt-1">
                          {removedAddons.join(', ')}
                        </span>
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Selected Addons and Total */}
              {formData.addons?.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-brand-muted mb-2">Selected Additional Services:</p>
                    <div className="space-y-2">
                      {formData.addons.map(addon => {
                        const addonDetails = getAddonDetails(addon);
                        return (
                          <div 
                            key={addon} 
                            className="flex items-center justify-between text-sm text-brand-dark bg-brand-beige/10 px-3 py-2 rounded-lg group"
                          >
                            <div className="flex items-center">
                              <Check className="w-4 h-4 mr-2 text-brand-beige" />
                              <span>{addonDetails?.name || addon}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              {user && (
                                <span className="text-brand-primary font-medium">
                                  LKR {addonDetails?.price.toLocaleString() || 0}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeAddon(addon)}
                                className="text-brand-muted hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                aria-label="Remove addon"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {user && (
                    <div className="flex justify-between items-center pt-4 border-t border-brand-beige/30">
                      <span className="text-sm font-medium text-brand-dark">Total Package Price:</span>
                      <span className="text-lg font-serif text-brand-primary">
                        LKR {calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    required
                    value={formData.clientName}
                    onChange={handleChange}
                    onBlur={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      getFieldError('clientName') 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-brand-beige/50 focus:border-brand-beige focus:ring-brand-beige/20'
                    } bg-white/50 backdrop-blur-sm transition-all`}
                  />
                  {renderErrorMessage('clientName')}
                </div>

                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    required
                    value={formData.clientEmail}
                    onChange={handleChange}
                    onBlur={handleChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      getFieldError('clientEmail') 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-brand-beige/50 focus:border-brand-beige focus:ring-brand-beige/20'
                    } bg-white/50 backdrop-blur-sm transition-all`}
                  />
                  {renderErrorMessage('clientEmail')}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-muted group-focus-within:text-brand-beige transition-colors h-5 w-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                        getFieldError('phone') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                          : 'border-brand-beige/50 focus:border-brand-beige focus:ring-brand-beige/20'
                      } bg-white/50 backdrop-blur-sm transition-all`}
                      required
                    />
                    {renderErrorMessage('phone')}
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                    Wedding Venue
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-muted group-focus-within:text-brand-beige transition-colors h-5 w-5" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={handleChange}
                      placeholder="Enter wedding venue or location"
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                        getFieldError('location') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                          : 'border-brand-beige/50 focus:border-brand-beige focus:ring-brand-beige/20'
                      } bg-white/50 backdrop-blur-sm transition-all`}
                      required
                    />
                    {renderErrorMessage('location')}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                  Wedding Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-muted group-focus-within:text-brand-beige transition-colors h-5 w-5" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                      getFieldError('date') 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                        : 'border-brand-beige/50 focus:border-brand-beige focus:ring-brand-beige/20'
                    } bg-white/50 backdrop-blur-sm transition-all`}
                  />
                  {renderErrorMessage('date')}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-brand-dark mb-2 ml-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  onBlur={handleChange}
                  placeholder="Tell us about your wedding vision, any specific photo requirements, or questions you may have..."
                  className={`w-full px-4 py-3 rounded-2xl border ${
                    getFieldError('notes') 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
                      : 'border-brand-beige/50 focus:border-brand-beige focus:ring-brand-beige/20'
                  } bg-white/50 backdrop-blur-sm transition-all`}
                />
                {renderErrorMessage('notes')}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col items-center border-t border-brand-beige/30 pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full md:w-64 px-8 py-4 bg-brand-beige text-white rounded-full font-medium hover:bg-brand-muted transition-all duration-300 relative overflow-hidden group shadow-lg shadow-brand-beige/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-muted to-brand-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Book Wedding Session</span>
                </motion.button>

                <p className="mt-4 text-sm text-brand-muted text-center">
                  We'll get back to you within 24 hours to confirm your wedding photography booking details.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}