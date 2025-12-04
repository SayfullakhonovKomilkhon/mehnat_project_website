'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  /** For icon-only buttons */
  iconOnly?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-800 text-white hover:bg-primary-700 active:bg-primary-900 shadow-gov',
  secondary: 'bg-primary-50 text-primary-800 hover:bg-primary-100 active:bg-primary-200',
  outline: 'border-2 border-primary-800 text-primary-800 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-800 hover:bg-primary-50 active:bg-primary-100',
  gold: 'bg-accent-gold text-white hover:bg-accent-amber active:bg-accent-amber shadow-gov',
  danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-gov',
};

const sizes: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-base gap-2',
  lg: 'h-13 px-8 text-lg gap-2.5',
  xl: 'h-14 px-10 text-xl gap-3',
};

const iconOnlySizes: Record<ButtonSize, string> = {
  xs: 'h-7 w-7',
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-13 w-13',
  xl: 'h-14 w-14',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      iconOnly = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'hover:scale-[1.02] active:scale-[0.98]',
          'transition-transform duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100',
          variants[variant],
          iconOnly ? iconOnlySizes[size] : sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && <span aria-hidden="true">{leftIcon}</span>
        )}
        {!iconOnly && children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        {isLoading && <span className="sr-only">Loading...</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
