import { branding } from '../../config/branding';
import logoImage from '../icons/logo.png';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'light', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center pt-4 pb-2 ${className}`}>
      <img 
        src={logoImage} 
        alt={branding.name}
        className={`h-10 w-auto object-contain transition-colors ${
          variant === 'dark' ? 'filter brightness-0' : 'filter brightness-0 invert'
        }`}
      />
    </div>
  );
}