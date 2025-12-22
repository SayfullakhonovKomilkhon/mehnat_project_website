'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

// Check if user prefers reduced motion
export function useMotionSafe() {
  const prefersReducedMotion = useReducedMotion();
  return !prefersReducedMotion;
}

// Simple fade in animation (CSS-based, more performant)
export const fadeInClass = 'animate-fadeIn';
export const slideUpClass = 'animate-slideUp';

// Minimal motion variants - only used when motion is allowed
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Stagger container - shorter delays
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Reduced from 0.1-0.15
      delayChildren: 0,
    },
  },
};

// Static fade props - returns empty object if motion disabled
export function useFadeInProps(delay = 0) {
  const shouldAnimate = useMotionSafe();
  
  if (!shouldAnimate) {
    return {};
  }
  
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay },
  };
}

// Lightweight motion div that respects prefers-reduced-motion
interface SafeMotionProps {
  children: ReactNode;
  animate?: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const SafeMotionDiv = forwardRef<HTMLDivElement, SafeMotionProps>(
  function SafeMotionDivInner({ children, animate = true, delay = 0, className, style, id }, ref) {
    const shouldAnimate = useMotionSafe();
    
    if (!shouldAnimate || !animate) {
      return (
        <div ref={ref} className={className} style={style} id={id}>
          {children}
        </div>
      );
    }
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className={className}
        style={style}
        id={id}
      >
        {children}
      </motion.div>
    );
  }
);

SafeMotionDiv.displayName = 'SafeMotionDiv';

// Export minimal motion components for critical animations only
export { motion } from 'framer-motion';

