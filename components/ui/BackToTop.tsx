'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
  offset?: string;
}

export function BackToTop({ 
  threshold = 400, 
  className,
  offset = 'bottom-24 right-6' // Default: above the chat widget
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't render on server
  if (!isMounted) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed z-40',
        offset,
        'w-12 h-12 rounded-full',
        'bg-primary-600 hover:bg-primary-700 hover:scale-110 active:scale-95',
        'text-white shadow-lg shadow-primary-600/30',
        'flex items-center justify-center',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
      aria-label="Yuqoriga qaytish"
      aria-hidden={!isVisible}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

export default BackToTop;


