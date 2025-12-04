'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Shield, CheckCircle, Star, Award, Info, AlertTriangle, XCircle } from 'lucide-react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gov' | 'gold';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: 'shield' | 'check' | 'star' | 'award' | 'info' | 'warning' | 'error' | 'none';
  /** Use rounded-full instead of rounded-md */
  pill?: boolean;
  /** Remove background, just text color */
  outline?: boolean;
  /** Add dot indicator before text */
  dot?: boolean;
  /** Custom dot color */
  dotColor?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gov-border text-text-secondary',
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-primary-50 text-primary-700',
  success: 'bg-success-light text-success',
  warning: 'bg-accent-light text-accent-amber',
  error: 'bg-error-light text-error',
  info: 'bg-blue-100 text-blue-700',
  gov: 'bg-primary-800 text-white',
  gold: 'bg-accent-gold text-white',
};

const outlineStyles: Record<BadgeVariant, string> = {
  default: 'border-gov-border text-text-secondary',
  primary: 'border-primary-500 text-primary-700',
  secondary: 'border-primary-300 text-primary-600',
  success: 'border-success text-success',
  warning: 'border-accent-amber text-accent-amber',
  error: 'border-error text-error',
  info: 'border-blue-500 text-blue-600',
  gov: 'border-primary-800 text-primary-800',
  gold: 'border-accent-gold text-accent-gold',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-text-muted',
  primary: 'bg-primary-500',
  secondary: 'bg-primary-400',
  success: 'bg-success',
  warning: 'bg-accent-amber',
  error: 'bg-error',
  info: 'bg-blue-500',
  gov: 'bg-white',
  gold: 'bg-white',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1',
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const iconSizeMap: Record<BadgeSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
};

const icons = {
  shield: Shield,
  check: CheckCircle,
  star: Star,
  award: Award,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  none: null,
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    icon = 'none', 
    pill = true,
    outline = false,
    dot = false,
    dotColor,
    children, 
    ...props 
  }, ref) => {
    const IconComponent = icons[icon];
    const iconSize = iconSizeMap[size];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium',
          pill ? 'rounded-full' : 'rounded-md',
          outline ? `bg-transparent border ${outlineStyles[variant]}` : variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span 
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              dotColor || dotColors[variant]
            )}
            aria-hidden="true"
          />
        )}
        {IconComponent && <IconComponent size={iconSize} aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Special Government Verified Badge
export const GovVerifiedBadge = forwardRef<HTMLSpanElement, Omit<BadgeProps, 'variant' | 'icon'>>(
  ({ className, children, ...props }, ref) => (
    <Badge
      ref={ref}
      variant="gov"
      icon="shield"
      className={cn('shadow-sm', className)}
      {...props}
    >
      {children}
    </Badge>
  )
);

GovVerifiedBadge.displayName = 'GovVerifiedBadge';

export default Badge;
