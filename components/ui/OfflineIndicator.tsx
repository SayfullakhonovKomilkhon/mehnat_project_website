'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  /** Position of the indicator */
  position?: 'top' | 'bottom';
  className?: string;
}

export function OfflineIndicator({ 
  position = 'top',
  className 
}: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide reconnected message after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const showIndicator = !isOnline || showReconnected;

  // Don't render on server
  if (!isMounted) return null;

  // Don't render if online and no reconnect message
  if (!showIndicator) return null;

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-[250] transition-transform duration-300',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
    >
      <div 
        className={cn(
          'flex items-center justify-center gap-3 px-4 py-3',
          'text-sm font-medium',
          isOnline 
            ? 'bg-success text-white' 
            : 'bg-error text-white'
        )}
        role="alert"
        aria-live="assertive"
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Internet aloqasi tiklandi</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Internet aloqasi yo'q</span>
            <button
              onClick={handleRetry}
              className={cn(
                'ml-2 px-3 py-1 rounded-md',
                'bg-white/20 hover:bg-white/30',
                'transition-colors inline-flex items-center gap-1'
              )}
            >
              <RefreshCw className="w-3 h-3" />
              Qayta urinish
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Hook to check online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default OfflineIndicator;


