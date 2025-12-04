'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GovEmblem } from '@/components/layout';

interface PageLoaderProps {
  /** Loading text to display */
  text?: string;
  /** Show full-screen overlay */
  fullScreen?: boolean;
  /** Background opacity */
  opacity?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export function PageLoader({
  text = "Yuklanmoqda...",
  fullScreen = true,
  opacity = 'medium',
  className,
}: PageLoaderProps) {
  const opacityStyles = {
    light: 'bg-white/80',
    medium: 'bg-white/90',
    heavy: 'bg-white/95',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 z-[200]',
        opacityStyles[opacity],
        'backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Government Emblem with animation */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <GovEmblem size="lg" variant="color" />
      </motion.div>

      {/* Spinner Ring */}
      <div className="relative w-16 h-16 mb-4">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-primary-100 border-t-primary-600"
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-accent-gold/20 border-b-accent-gold"
        />
      </div>

      {/* Loading Text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-text-secondary font-medium"
      >
        {text}
      </motion.p>

      {/* Screen reader text */}
      <span className="sr-only">Sahifa yuklanmoqda, iltimos kuting</span>
    </motion.div>
  );
}

// Minimal inline page loader
interface InlinePageLoaderProps {
  text?: string;
  className?: string;
}

export function InlinePageLoader({ text, className }: InlinePageLoaderProps) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-3 border-primary-100 border-t-primary-600"
          />
        </div>
        {text && (
          <p className="text-sm text-text-muted">{text}</p>
        )}
      </div>
    </div>
  );
}

export default PageLoader;



