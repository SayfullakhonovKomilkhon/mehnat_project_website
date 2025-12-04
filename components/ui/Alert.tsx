'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  /** Show dismiss button */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Hide the icon */
  hideIcon?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  className?: string;
}

const typeConfig: Record<AlertType, {
  icon: typeof Info;
  containerStyles: string;
  iconStyles: string;
  titleStyles: string;
}> = {
  info: {
    icon: Info,
    containerStyles: 'bg-blue-50 border-blue-200',
    iconStyles: 'text-blue-500',
    titleStyles: 'text-blue-800',
  },
  success: {
    icon: CheckCircle,
    containerStyles: 'bg-success-light border-success/20',
    iconStyles: 'text-success',
    titleStyles: 'text-green-800',
  },
  warning: {
    icon: AlertTriangle,
    containerStyles: 'bg-accent-light border-accent-amber/20',
    iconStyles: 'text-accent-amber',
    titleStyles: 'text-amber-800',
  },
  error: {
    icon: XCircle,
    containerStyles: 'bg-error-light border-error/20',
    iconStyles: 'text-error',
    titleStyles: 'text-red-800',
  },
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  action,
  hideIcon = false,
  icon,
  className,
}, ref) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
          role="alert"
          className={cn(
            'relative flex gap-3 p-4 rounded-lg border',
            config.containerStyles,
            className
          )}
        >
          {/* Icon */}
          {!hideIcon && (
            <div className={cn('flex-shrink-0 mt-0.5', config.iconStyles)}>
              {icon || <IconComponent className="w-5 h-5" aria-hidden="true" />}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className={cn('font-medium mb-1', config.titleStyles)}>
                {title}
              </h5>
            )}
            <div className="text-sm text-text-secondary">
              {children}
            </div>

            {/* Action */}
            {action && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                'flex-shrink-0 p-1 rounded-md',
                'hover:bg-black/5 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                type === 'info' && 'focus-visible:ring-blue-500',
                type === 'success' && 'focus-visible:ring-green-500',
                type === 'warning' && 'focus-visible:ring-amber-500',
                type === 'error' && 'focus-visible:ring-red-500'
              )}
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Alert.displayName = 'Alert';

// Inline Alert - more compact version
interface InlineAlertProps {
  type?: AlertType;
  children: React.ReactNode;
  className?: string;
}

export function InlineAlert({ type = 'info', children, className }: InlineAlertProps) {
  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 text-sm',
        config.iconStyles,
        className
      )}
      role="alert"
    >
      <IconComponent className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

// Banner Alert - full width, typically at top of page
interface BannerAlertProps extends Omit<AlertProps, 'className'> {
  /** Centered content */
  centered?: boolean;
  className?: string;
}

export function BannerAlert({ centered = false, className, ...props }: BannerAlertProps) {
  return (
    <Alert
      {...props}
      className={cn(
        'rounded-none border-x-0 border-t-0',
        centered && 'justify-center',
        className
      )}
    />
  );
}

export default Alert;



