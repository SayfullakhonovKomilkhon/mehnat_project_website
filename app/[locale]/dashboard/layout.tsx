'use client';

import { AuthProvider } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ToastProvider } from '@/components/ui';

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function DashboardLayoutWrapper({
  children,
  params: { locale },
}: DashboardLayoutWrapperProps) {
  return (
    <AuthProvider>
      <ToastProvider position="top-right">
        <DashboardLayout locale={locale}>
          {children}
        </DashboardLayout>
      </ToastProvider>
    </AuthProvider>
  );
}

