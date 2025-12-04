'use client';

import { useLocale } from 'next-intl';
import { ErrorState } from '@/components/ui';

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <ErrorState
        type="404"
        locale={locale}
      />
    </div>
  );
}
