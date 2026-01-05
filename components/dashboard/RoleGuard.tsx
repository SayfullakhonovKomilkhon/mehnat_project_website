'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Loader2, ShieldX } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: 'redirect' | 'forbidden';
  redirectTo?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = 'forbidden',
  redirectTo = '/dashboard',
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated, checkRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'uz';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isLoading, isAuthenticated, router, locale]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check role
  const hasAccess = checkRole(allowedRoles);

  if (!hasAccess) {
    if (fallback === 'redirect') {
      router.push(`/${locale}${redirectTo}`);
      return null;
    }

    // Show 403 Forbidden page
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ruxsat berilmagan
          </h1>
          <p className="text-gray-600 mb-6">
            Sizda bu sahifani ko'rish uchun ruxsat yo'q. Agar bu xatolik deb hisoblasangiz, administrator bilan bog'laning.
          </p>
          <button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGuard;

