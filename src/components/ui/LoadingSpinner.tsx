import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`border-4 border-brand-light rounded-full ${sizeClasses[size]}`}
        style={{ 
          borderTopColor: 'var(--brand-primary)',
          borderRightColor: 'var(--brand-primary)',
          willChange: 'transform'
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop'
        }}
      />
    </div>
  );
}
