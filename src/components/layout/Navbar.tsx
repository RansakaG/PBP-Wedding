import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import LoginModal from '../auth/LoginModal';
import { scrollToTop, createScrollListener } from '../../utils/scrollUtils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = createScrollListener(() => {
      setIsScrolled(window.scrollY > 50);
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-colors duration-200 will-change-transform ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0,0,0)'
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-2xl transition-colors z-50 ${
                isScrolled ? 'text-brand-dark hover:text-brand-primary' : 'text-white hover:text-brand-beige'
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Link 
                to="/" 
                onClick={scrollToTop} 
                className="block transition-all duration-300"
              >
                <Logo 
                  variant={isScrolled ? 'dark' : 'light'} 
                  className="transition-all duration-300" 
                />
              </Link>
            </motion.div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-2 ${
                      isScrolled ? 'text-brand-dark' : 'text-white'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">
                      {user?.fullName}
                    </span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 transition-colors ${
                      isScrolled 
                        ? 'text-brand-dark hover:text-brand-primary' 
                        : 'text-white hover:text-brand-beige'
                    }`}
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">
                      Logout
                    </span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isScrolled 
                      ? 'text-brand-dark hover:text-brand-primary' 
                      : 'text-white hover:text-brand-beige'
                  }`}
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">
                    Login
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onLoginClick={() => {
          setIsMenuOpen(false);
          setIsLoginModalOpen(true);
        }} 
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}