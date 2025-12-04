'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface BaseInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'search' | 'ghost' | 'filled';
  /** Show character count (for textarea) */
  showCount?: boolean;
  /** Max length for character count */
  maxLength?: number;
  /** Required field indicator */
  required?: boolean;
}

interface InputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  as?: 'input';
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg';
}

interface TextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  as: 'textarea';
  /** Textarea rows */
  rows?: number;
  /** Auto-resize textarea */
  autoResize?: boolean;
}

type CombinedInputProps = InputProps | TextareaProps;

const variantStyles = {
  default: 'border-gov-border focus:border-primary-500 bg-gov-surface',
  search: 'border-gov-border focus:border-primary-500 bg-gov-light pl-11',
  ghost: 'border-transparent bg-transparent focus:bg-gov-surface focus:border-gov-border',
  filled: 'border-transparent bg-gov-light focus:bg-gov-surface focus:border-primary-500',
};

const sizeStyles = {
  sm: 'h-9 text-sm px-3',
  md: 'h-11 px-4',
  lg: 'h-13 text-lg px-5',
};

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, CombinedInputProps>(
  (props, ref) => {
    const {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      showCount = false,
      maxLength,
      required = false,
      ...rest
    } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const isTextarea = props.as === 'textarea';
    const isSearch = variant === 'search';
    const isPassword = !isTextarea && (rest as InputProps).type === 'password';
    const inputSize = !isTextarea ? ((rest as InputProps).inputSize || 'md') : 'md';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (showCount) {
        setCharCount(e.target.value.length);
      }
      if (!isTextarea && (rest as InputProps).onChange) {
        (rest as InputProps).onChange?.(e as React.ChangeEvent<HTMLInputElement>);
      } else if (isTextarea && (rest as TextareaProps).onChange) {
        (rest as TextareaProps).onChange?.(e as React.ChangeEvent<HTMLTextAreaElement>);
      }
    };

    const baseClasses = cn(
      'w-full rounded-lg border',
      'text-text-primary placeholder:text-text-muted',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gov-light',
      variantStyles[variant],
      !isTextarea && sizeStyles[inputSize],
      leftIcon && !isSearch && 'pl-11',
      (rightIcon || isPassword) && 'pr-11',
      error && 'border-error focus:border-error focus:ring-error/20',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
            {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {isSearch && (
            <Search 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" 
              aria-hidden="true"
            />
          )}
          {leftIcon && !isSearch && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          
          {isTextarea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={cn(baseClasses, 'py-3 px-4 min-h-[120px] resize-y')}
              rows={(rest as TextareaProps).rows || 4}
              maxLength={maxLength}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={error ? `${label}-error` : hint ? `${label}-hint` : undefined}
              required={required}
              {...(rest as TextareaProps)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={isPassword && showPassword ? 'text' : (rest as InputProps).type || 'text'}
              className={baseClasses}
              maxLength={maxLength}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={error ? `${label}-error` : hint ? `${label}-hint` : undefined}
              required={required}
              {...(rest as InputProps)}
            />
          )}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {rightIcon && !isPassword && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">
              {rightIcon}
            </span>
          )}
          
          {error && !rightIcon && !isPassword && (
            <AlertCircle 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-error" 
              aria-hidden="true"
            />
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1.5">
          <div>
            {error && (
              <p id={`${label}-error`} className="text-sm text-error flex items-center gap-1" role="alert">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={`${label}-hint`} className="text-sm text-text-secondary">{hint}</p>
            )}
          </div>
          {showCount && (
            <p className={cn(
              'text-xs',
              maxLength && charCount >= maxLength ? 'text-error' : 'text-text-muted'
            )}>
              {charCount}{maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
