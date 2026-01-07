'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Globe,
  FolderTree,
  Award,
  Bell,
  Shield,
  Clock,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  locale: string;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  href: string;
  roles: UserRole[];
  badge?: number;
}

// Role-based menu configuration
const getMenuItems = (locale: string): MenuItem[] => [
  {
    key: 'dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: `/${locale}/dashboard`,
    roles: ['admin', 'muallif', 'tarjimon', 'ishchi_guruh', 'ekspert'],
  },
  {
    key: 'articles',
    icon: <FileText className="h-5 w-5" />,
    href: `/${locale}/dashboard/articles`,
    roles: ['admin', 'muallif'],
  },
  {
    key: 'users',
    icon: <Users className="h-5 w-5" />,
    href: `/${locale}/dashboard/users`,
    roles: ['admin'],
  },
  {
    key: 'comments',
    icon: <MessageSquare className="h-5 w-5" />,
    href: `/${locale}/dashboard/comments`,
    roles: ['admin', 'muallif'],
  },
  {
    key: 'translations',
    icon: <Globe className="h-5 w-5" />,
    href: `/${locale}/dashboard/translations`,
    roles: ['admin', 'tarjimon'],
  },
  {
    key: 'structure',
    icon: <FolderTree className="h-5 w-5" />,
    href: `/${locale}/dashboard/structure`,
    roles: ['admin', 'ishchi_guruh'],
  },
  {
    key: 'expertise',
    icon: <Award className="h-5 w-5" />,
    href: `/${locale}/dashboard/expertise`,
    roles: ['admin', 'ekspert'],
  },
  {
    key: 'moderation',
    icon: <Clock className="h-5 w-5" />,
    href: `/${locale}/dashboard/moderation`,
    roles: ['admin', 'moderator'],
  },
  {
    key: 'settings',
    icon: <Settings className="h-5 w-5" />,
    href: `/${locale}/dashboard/settings`,
    roles: ['admin'],
  },
];

// Menu labels in 3 languages
const menuLabels: Record<string, Record<string, string>> = {
  dashboard: { uz: 'Bosh sahifa', ru: 'Главная', en: 'Dashboard' },
  articles: { uz: 'Moddalar', ru: 'Статьи', en: 'Articles' },
  users: { uz: 'Foydalanuvchilar', ru: 'Пользователи', en: 'Users' },
  comments: { uz: 'Sharhlar', ru: 'Комментарии', en: 'Comments' },
  translations: { uz: 'Tarjimalar', ru: 'Переводы', en: 'Translations' },
  structure: { uz: "Bo'limlar", ru: 'Разделы', en: 'Sections' },
  expertise: { uz: 'Ekspertiza', ru: 'Экспертиза', en: 'Expertise' },
  moderation: { uz: 'Moderatsiya', ru: 'Модерация', en: 'Moderation' },
  settings: { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings' },
};

// Role display names
const roleDisplayNames: Record<UserRole, Record<string, string>> = {
  admin: { uz: 'Administrator', ru: 'Администратор', en: 'Administrator' },
  muallif: { uz: 'Muallif', ru: 'Автор', en: 'Author' },
  tarjimon: { uz: 'Tarjimon', ru: 'Переводчик', en: 'Translator' },
  ishchi_guruh: { uz: 'Ishchi guruh', ru: 'Рабочая группа', en: 'Working Group' },
  ekspert: { uz: 'Ekspert', ru: 'Эксперт', en: 'Expert' },
  moderator: { uz: 'Moderator', ru: 'Модератор', en: 'Moderator' },
  user: { uz: 'Foydalanuvchi', ru: 'Пользователь', en: 'User' },
};

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
  const { user, logout, isAuthenticated, isLoading, checkRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isLoading, isAuthenticated, router, locale]);

  // Loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  const menuItems = getMenuItems(locale);
  // Use role name (e.g., 'admin') which is the slug in our User type
  const userRole = user?.role?.name as UserRole;
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    logout();
  };

  const isActiveLink = (href: string) => {
    if (href === `/${locale}/dashboard`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white">
        <div className="flex h-full items-center justify-between px-4">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href={`/${locale}/dashboard`} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-900">Mehnat Kodeksi</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Right: Language, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg bg-gray-100 p-1">
              {['uz', 'ru', 'en'].map(lang => (
                <Link
                  key={lang}
                  href={pathname.replace(`/${locale}`, `/${lang}`)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    locale === lang
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-medium text-primary-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {roleDisplayNames[userRole]?.[locale] || userRole}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {locale === 'uz' ? 'Chiqish' : locale === 'ru' ? 'Выйти' : 'Logout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="h-full space-y-1 overflow-y-auto p-4">
          {filteredMenuItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActiveLink(item.href)
                  ? '-ml-1 border-l-4 border-primary-600 bg-primary-50 pl-4 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{menuLabels[item.key]?.[locale] || item.key}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
