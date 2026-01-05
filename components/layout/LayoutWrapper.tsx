'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Header, Footer, PageTransition } from '@/components/layout';
import { ToastProvider, BackToTop } from '@/components/ui';
import { AccessibilityProvider } from '@/lib/accessibility-context';

// Dynamic imports for non-critical components
const FloatingChatWidget = dynamic(
  () => import('@/components/chat').then(mod => mod.FloatingChatWidget),
  { ssr: false, loading: () => null }
);

const OfflineIndicator = dynamic(
  () => import('@/components/ui').then(mod => mod.OfflineIndicator),
  { ssr: false, loading: () => null }
);

interface LayoutWrapperProps {
  children: ReactNode;
  locale: string;
}

export function LayoutWrapper({ children, locale }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if current page is dashboard or login (admin pages)
  const isAdminPage = pathname?.includes('/dashboard') || pathname?.includes('/login');

  // For admin pages, just render children (they have their own layout)
  if (isAdminPage) {
    return (
      <AccessibilityProvider>
        <div className="min-h-screen">
          {children}
        </div>
      </AccessibilityProvider>
    );
  }

  // For public pages, render with Header/Footer
  return (
    <AccessibilityProvider>
      <ToastProvider position="top-right">
        <PageTransition />

        <Suspense fallback={null}>
          <OfflineIndicator position="top" />
        </Suspense>

        <Header locale={locale} />

        <div className="flex-1">
          {children}
        </div>

        <Footer locale={locale} />

        <BackToTop threshold={400} offset="bottom-24 right-6" />

        <Suspense fallback={null}>
          <FloatingChatWidget />
        </Suspense>
      </ToastProvider>
    </AccessibilityProvider>
  );
}

export default LayoutWrapper;

