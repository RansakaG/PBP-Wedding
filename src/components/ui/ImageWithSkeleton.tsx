import { useImageLoad } from '../../hooks/useImageLoad';

export interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export default function ImageWithSkeleton({ src, alt, className = '', containerClassName = '', priority = false }: ImageWithSkeletonProps) {
  const { isLoading } = useImageLoad(src, { priority });

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-beige/20 to-brand-beige/30 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
}