
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Reset loading state when src changes
    setIsLoaded(false);
    
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [src, priority]);

  // Function to get WebP version of image if from Unsplash
  const getWebpUrl = (url: string) => {
    if (url.includes('unsplash.com')) {
      // Append format parameter for Unsplash images
      return `${url}${url.includes('?') ? '&' : '?'}fm=webp&q=80`;
    }
    return url;
  };

  // Check if URL is an external image
  const isExternalImage = src.startsWith('http');
  
  // Generate URLs for different formats
  const webpSrc = getWebpUrl(src);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      {!isLoaded && !priority && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <picture>
        {/* WebP version */}
        <source srcSet={webpSrc} type="image/webp" />
        
        {/* Original format fallback */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
