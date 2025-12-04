'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <ErrorState
        type="500"
        onRetry={reset}
      />
    </div>
  );
}




