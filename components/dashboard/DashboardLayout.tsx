'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Languages,
  PenTool,
  Globe,
  FolderTree,
  Award,
  Bell,
  Shield
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
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: `/${locale}/dashboard`,
    roles: ['admin', 'muallif', 'tarjimon', 'ishchi_guruh', 'ekspert'],
  },
  {
    key: 'articles',
    icon: <FileText className="w-5 h-5" />,
    href: `/${locale}/dashboard/articles`,
    roles: ['admin', 'muallif'],
  },
  {
    key: 'users',
    icon: <Users className="w-5 h-5" />,
    href: `/${locale}/dashboard/users`,
    roles: ['admin'],
  },
  {
    key: 'comments',
    icon: <MessageSquare className="w-5 h-5" />,
    href: `/${locale}/dashboard/comments`,
    roles: ['admin', 'muallif'],
  },
  {
    key: 'translations',
    icon: <Globe className="w-5 h-5" />,
    href: `/${locale}/dashboard/translations`,
    roles: ['admin', 'tarjimon'],
  },
  {
    key: 'structure',
    icon: <FolderTree className="w-5 h-5" />,
    href: `/${locale}/dashboard/structure`,
    roles: ['admin', 'ishchi_guruh'],
  },
  {
    key: 'expertise',
    icon: <Award className="w-5 h-5" />,
    href: `/${locale}/dashboard/expertise`,
    roles: ['admin', 'ekspert'],
  },
  {
    key: 'statistics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: `/${locale}/dashboard/statistics`,
    roles: ['admin'],
  },
  {
    key: 'settings',
    icon: <Settings className="w-5 h-5" />,
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
  statistics: { uz: 'Statistika', ru: 'Статистика', en: 'Statistics' },
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const menuItems = getMenuItems(locale);
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
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href={`/${locale}/dashboard`} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
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
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['uz', 'ru', 'en'].map((lang) => (
                <Link
                  key={lang}
                  href={pathname.replace(`/${locale}`, `/${lang}`)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
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
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {roleDisplayNames[userRole]?.[locale] || userRole}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActiveLink(item.href)
                  ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 -ml-1 pl-4'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">
                {menuLabels[item.key]?.[locale] || item.key}
              </span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;

