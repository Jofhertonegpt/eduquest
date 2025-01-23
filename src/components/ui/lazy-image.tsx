import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.svg",
  ...props 
}: LazyImageProps) => {
  const [imgSrc, setImgSrc] = useState(fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        !isLoaded && "opacity-50",
        className
      )}
      {...props}
    />
  );
};