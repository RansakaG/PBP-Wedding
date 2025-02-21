import { motion, AnimatePresence } from 'framer-motion';
import { User, Instagram, Facebook, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { branding } from '../../config/branding';
import NavLinks from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function MobileMenu({ isOpen, onClose, onLoginClick }: MobileMenuProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-brand-beige z-40"
          style={{ willChange: 'opacity' }}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.15 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-24"
            style={{ willChange: 'opacity' }}
          >
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
              >
                <div className="flex items-center justify-center space-x-2 text-brand-dark mb-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.fullName}</span>
                </div>
              </motion.div>
            )}

            <NavLinks
              className="space-y-8 text-center"
              onClick={onClose}
              linkClassName="text-3xl font-serif text-brand-dark hover:text-brand-muted transition-colors duration-200"
            />

            <div className="mt-12 flex items-center space-x-8">
              <motion.a
                href={branding.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-brand-dark hover:text-brand-muted transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
              <motion.a
                href={branding.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-brand-dark hover:text-brand-muted transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </motion.a>

              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-brand-dark hover:text-brand-muted transition-colors"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-lg font-medium">Logout</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onClose();
                    onLoginClick();
                  }}
                  className="flex items-center space-x-2 text-brand-dark hover:text-brand-muted transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="text-lg font-medium">Login</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}