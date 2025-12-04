'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** Show blur placeholder while loading */
  showBlur?: boolean;
  /** Custom blur data URL */
  blurDataURL?: string;
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Container className */
  containerClassName?: string;
  /** Aspect ratio for container (e.g., '16/9', '4/3', '1/1') */
  aspectRatio?: string;
}

// Default blur placeholder (tiny base64 image)
const defaultBlurDataURL = 
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAUABhESITFBUWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQEBAQEBAAAAAAAAAAAAAAABAgADEf/aAAwDAQACEQMRAD8AzLF7iu0MVXhkjpuIYljL+C3YcnxwPz11T4rNVMtJNJBFKGK9BEpPbvz+tGjRoqT5Nv/Z';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  showBlur = true,
  blurDataURL = defaultBlurDataURL,
  fallbackSrc = '/images/placeholder.png',
  containerClassName,
  aspectRatio,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={showBlur ? 'blur' : 'empty'}
        blurDataURL={showBlur ? blurDataURL : undefined}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gov-border animate-pulse" />
      )}
    </div>
  );
}

// Hero Image - optimized for above-the-fold
interface HeroImageProps extends OptimizedImageProps {
  overlay?: boolean;
  overlayOpacity?: number;
}

export function HeroImage({ 
  overlay = false, 
  overlayOpacity = 0.5,
  ...props 
}: HeroImageProps) {
  return (
    <div className="relative w-full h-full">
      <OptimizedImage
        priority // Load immediately for hero images
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        {...props}
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

// Avatar Image - optimized for small images
interface AvatarImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function AvatarImage({ src, alt, size = 'md', className }: AvatarImageProps) {
  const dimension = avatarSizes[size];
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={dimension}
      height={dimension}
      className={cn('rounded-full object-cover', className)}
      showBlur={false}
    />
  );
}

export default OptimizedImage;




