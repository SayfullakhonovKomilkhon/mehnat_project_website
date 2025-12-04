'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Only render portal after mounting on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const newToasts = [...prev, { ...toast, id }];
      return newToasts.slice(-maxToasts);
    });
    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const positionStyles: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      {isMounted && createPortal(
        <div
          className={cn(
            'fixed z-[300] flex flex-col gap-2',
            positionStyles[position],
            position.includes('bottom') ? 'flex-col-reverse' : 'flex-col'
          )}
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
              position={position}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// Individual Toast Item
interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
  position: ToastPosition;
}

const typeConfig: Record<ToastType, {
  icon: typeof CheckCircle;
  iconColor: string;
  progressColor: string;
  borderColor: string;
}> = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-success',
    progressColor: 'bg-success',
    borderColor: 'border-l-success',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-error',
    progressColor: 'bg-error',
    borderColor: 'border-l-error',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-accent-amber',
    progressColor: 'bg-accent-amber',
    borderColor: 'border-l-accent-amber',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary-600',
    progressColor: 'bg-primary-600',
    borderColor: 'border-l-primary-600',
  },
};

function ToastItem({ toast, onDismiss, position }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const config = typeConfig[toast.type];
  const IconComponent = config.icon;
  const duration = toast.duration ?? 5000;
  const dismissible = toast.dismissible ?? true;

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration === 0 || isPaused) return;

    const startTime = Date.now();
    const endTime = startTime + (duration * progress / 100);

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);
      
      if (newProgress <= 0) {
        onDismiss();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, isPaused, onDismiss, progress]);

  // Get transform based on position
  const getTransform = () => {
    if (!isVisible) {
      if (position.includes('right')) return 'translateX(100%)';
      if (position.includes('left')) return 'translateX(-100%)';
      return 'translateY(-20px)';
    }
    return 'translate(0)';
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'relative w-80 bg-gov-surface rounded-lg shadow-lg overflow-hidden',
        'border border-gov-border border-l-4',
        'transition-all duration-300 ease-out',
        config.borderColor
      )}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
      }}
      role="alert"
    >
      <div className="flex gap-3 p-4">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <IconComponent className="w-5 h-5" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary text-sm">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-sm text-text-secondary">
              {toast.description}
            </p>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-md',
              'text-text-muted hover:text-text-primary',
              'hover:bg-gov-light transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="h-1 bg-gov-border">
          <div
            className={cn('h-full transition-all duration-100', config.progressColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  return {
    toast: addToast,
    success: (title: string, description?: string) => 
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) => 
      addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) => 
      addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) => 
      addToast({ type: 'info', title, description }),
    dismiss: removeToast,
    clearAll: clearToasts,
  };
}

export default ToastProvider;


