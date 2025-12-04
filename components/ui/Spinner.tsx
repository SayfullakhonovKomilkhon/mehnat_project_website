'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'white' | 'gray' | 'gold';
type SpinnerVariant = 'default' | 'dots' | 'bars' | 'ring';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  variant?: SpinnerVariant;
  /** Optional loading text */
  text?: string;
  /** Text position relative to spinner */
  textPosition?: 'right' | 'bottom';
  className?: string;
}

const sizeStyles: Record<SpinnerSize, { icon: string; text: string; dot: string; gap: string }> = {
  xs: { icon: 'w-3 h-3', text: 'text-xs', dot: 'w-1 h-1', gap: 'gap-1' },
  sm: { icon: 'w-4 h-4', text: 'text-sm', dot: 'w-1.5 h-1.5', gap: 'gap-1.5' },
  md: { icon: 'w-6 h-6', text: 'text-sm', dot: 'w-2 h-2', gap: 'gap-2' },
  lg: { icon: 'w-8 h-8', text: 'text-base', dot: 'w-2.5 h-2.5', gap: 'gap-2' },
  xl: { icon: 'w-12 h-12', text: 'text-lg', dot: 'w-3 h-3', gap: 'gap-3' },
};

const colorStyles: Record<SpinnerColor, string> = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-text-muted',
  gold: 'text-accent-gold',
};

export function Spinner({
  size = 'md',
  color = 'primary',
  variant = 'default',
  text,
  textPosition = 'right',
  className,
}: SpinnerProps) {
  const sizes = sizeStyles[size];
  const colorClass = colorStyles[color];

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn('flex items-center', sizes.gap)}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                className={cn('rounded-full bg-current', sizes.dot, colorClass)}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={cn('flex items-end', sizes.gap)}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 1.5, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                style={{ originY: 1 }}
                className={cn(
                  'w-1 bg-current rounded-full',
                  size === 'xs' && 'h-2',
                  size === 'sm' && 'h-3',
                  size === 'md' && 'h-4',
                  size === 'lg' && 'h-5',
                  size === 'xl' && 'h-6',
                  colorClass
                )}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className={cn('relative', sizes.icon)}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className={cn(
                'absolute inset-0 rounded-full border-2',
                'border-current opacity-20'
              )}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className={cn(
                'absolute inset-0 rounded-full border-2',
                'border-transparent border-t-current',
                colorClass
              )}
            />
          </div>
        );

      default:
        return (
          <Loader2 className={cn('animate-spin', sizes.icon, colorClass)} />
        );
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center',
        textPosition === 'bottom' ? 'flex-col' : 'flex-row',
        sizes.gap,
        className
      )}
    >
      {renderSpinner()}
      {text && (
        <span className={cn(sizes.text, colorClass)}>{text}</span>
      )}
      <span className="sr-only">Yuklanmoqda</span>
    </div>
  );
}

// Button loading spinner (smaller, inline)
export function ButtonSpinner({ color = 'white' }: { color?: SpinnerColor }) {
  return <Spinner size="sm" color={color} variant="default" />;
}

export default Spinner;




