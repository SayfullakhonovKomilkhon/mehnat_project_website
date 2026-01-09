'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  FolderTree,
  Award,
  Edit,
  Plus,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';
import {
  adminGetDashboardAnalytics,
  adminGetActivityLogs,
  adminGetUsers,
  getSections,
  getArticles,
} from '@/lib/api';
import type { Locale } from '@/types';

interface DashboardPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    welcome: 'Xush kelibsiz',
    dashboard: 'Bosh sahifa',
    totalArticles: 'Jami moddalar',
    totalSuggestions: 'Takliflar',
    totalSections: "Bo'limlar soni",
    totalUsers: 'Foydalanuvchilar',
    recentUpdates: "So'nggi yangilanishlar",
    viewAll: "Barchasini ko'rish",
    date: 'Sana',
    user: 'Foydalanuvchi',
    action: 'Harakat',
    article: 'Modda',
    status: 'Holat',
    created: 'Yaratildi',
    updated: 'Yangilandi',
    approved: 'Tasdiqlandi',
    rejected: 'Rad etildi',
    pending: 'Kutilmoqda',
    login: 'Tizimga kirdi',
    logout: 'Tizimdan chiqdi',
    translationSubmitted: 'Tarjima tekshiruvga yuborildi',
    translationApproved: 'Tarjima tasdiqlandi',
    translationRejected: 'Tarjima rad etildi',
    articleCreated: 'Modda yaratildi',
    articleUpdated: 'Modda yangilandi',
    articleDeleted: "Modda o'chirildi",
    sectionCreated: "Bo'lim yaratildi",
    chapterCreated: 'Bob yaratildi',
    commentApproved: 'Sharh tasdiqlandi',
    commentRejected: 'Sharh rad etildi',
    roleChanged: "Rol o'zgartirildi",
    userActivated: 'Foydalanuvchi faollashtirildi',
    userDeactivated: 'Foydalanuvchi bloklandi',
    myArticles: 'Mening moddalarim',
    myComments: 'Mening sharhlarim',
    newComment: 'Yangi sharh',
    needsTranslation: 'Tarjima talab qiladi',
    myTranslations: 'Mening tarjimalarim',
    translationProgress: 'Tarjima jarayoni',
    structureOverview: "Tuzilma ko'rinishi",
    sectionsCount: "Bo'limlar",
    chaptersCount: 'Boblar',
    articlesCount: 'Moddalar',
    needsExpertise: 'Ekspertiza talab qiladi',
    myExpertReviews: 'Mening xulosalarim',
    quickActions: 'Tezkor harakatlar',
    addArticle: "Modda qo'shish",
    addComment: "Sharh qo'shish",
    addTranslation: "Tarjima qo'shish",
    addSection: "Bo'lim qo'shish",
    addExpertise: "Ekspertiza qo'shish",
  },
  ru: {
    welcome: 'Добро пожаловать',
    dashboard: 'Главная',
    totalArticles: 'Всего статей',
    totalSuggestions: 'Предложений',
    totalSections: 'Разделов',
    totalUsers: 'Пользователей',
    recentUpdates: 'Последние обновления',
    viewAll: 'Смотреть все',
    date: 'Дата',
    user: 'Пользователь',
    action: 'Действие',
    article: 'Статья',
    status: 'Статус',
    created: 'Создано',
    updated: 'Обновлено',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    pending: 'Ожидает',
    login: 'Вошёл в систему',
    logout: 'Вышел из системы',
    translationSubmitted: 'Перевод отправлен на проверку',
    translationApproved: 'Перевод одобрен',
    translationRejected: 'Перевод отклонён',
    articleCreated: 'Статья создана',
    articleUpdated: 'Статья обновлена',
    articleDeleted: 'Статья удалена',
    sectionCreated: 'Раздел создан',
    chapterCreated: 'Глава создана',
    commentApproved: 'Комментарий одобрен',
    commentRejected: 'Комментарий отклонён',
    roleChanged: 'Роль изменена',
    userActivated: 'Пользователь активирован',
    userDeactivated: 'Пользователь заблокирован',
    myArticles: 'Мои статьи',
    myComments: 'Мои комментарии',
    newComment: 'Новый комментарий',
    needsTranslation: 'Требует перевода',
    myTranslations: 'Мои переводы',
    translationProgress: 'Прогресс перевода',
    structureOverview: 'Обзор структуры',
    sectionsCount: 'Разделов',
    chaptersCount: 'Глав',
    articlesCount: 'Статей',
    needsExpertise: 'Требует экспертизы',
    myExpertReviews: 'Мои заключения',
    quickActions: 'Быстрые действия',
    addArticle: 'Добавить статью',
    addComment: 'Добавить комментарий',
    addTranslation: 'Добавить перевод',
    addSection: 'Добавить раздел',
    addExpertise: 'Добавить экспертизу',
  },
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    totalArticles: 'Total Articles',
    totalSuggestions: 'Suggestions',
    totalSections: 'Sections',
    totalUsers: 'Users',
    recentUpdates: 'Recent Updates',
    viewAll: 'View All',
    date: 'Date',
    user: 'User',
    action: 'Action',
    article: 'Article',
    status: 'Status',
    created: 'Created',
    updated: 'Updated',
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
    login: 'Logged in',
    logout: 'Logged out',
    translationSubmitted: 'Translation submitted for review',
    translationApproved: 'Translation approved',
    translationRejected: 'Translation rejected',
    articleCreated: 'Article created',
    articleUpdated: 'Article updated',
    articleDeleted: 'Article deleted',
    sectionCreated: 'Section created',
    chapterCreated: 'Chapter created',
    commentApproved: 'Comment approved',
    commentRejected: 'Comment rejected',
    roleChanged: 'Role changed',
    userActivated: 'User activated',
    userDeactivated: 'User deactivated',
    myArticles: 'My Articles',
    myComments: 'My Comments',
    newComment: 'New Comment',
    needsTranslation: 'Needs Translation',
    myTranslations: 'My Translations',
    translationProgress: 'Translation Progress',
    structureOverview: 'Structure Overview',
    sectionsCount: 'Sections',
    chaptersCount: 'Chapters',
    articlesCount: 'Articles',
    needsExpertise: 'Needs Expertise',
    myExpertReviews: 'My Expert Reviews',
    quickActions: 'Quick Actions',
    addArticle: 'Add Article',
    addComment: 'Add Comment',
    addTranslation: 'Add Translation',
    addSection: 'Add Section',
    addExpertise: 'Add Expertise',
  },
};

// Stats Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500 border-t-blue-500',
    yellow: 'bg-yellow-500 border-t-yellow-500',
    green: 'bg-green-500 border-t-green-500',
    purple: 'bg-purple-500 border-t-purple-500',
    red: 'bg-red-500 border-t-red-500',
  };

  return (
    <div className={`rounded-xl border-t-4 bg-white shadow-sm ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div
          className={`h-12 w-12 ${colorClasses[color].split(' ')[0]} flex items-center justify-center rounded-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Quick Action Button
function QuickActionButton({
  icon: Icon,
  label,
  href,
  color = 'primary',
}: {
  icon: any;
  label: string;
  href: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={`h-10 w-10 bg-${color}-100 flex items-center justify-center rounded-lg`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </Link>
  );
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const { user, checkRole } = useAuth();
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalSuggestions: 0,
    totalSections: 0,
    totalUsers: 0,
    myArticles: 0,
    myComments: 0,
    needsTranslation: 0,
    myTranslations: 0,
    sections: 0,
    chapters: 0,
    articles: 0,
    needsExpertise: 0,
    myExpertReviews: 0,
  });
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);

  const isAdmin = checkRole(['admin']);
  const isMuallif = false; // Role removed
  const isTarjimon = false; // Role removed
  const isIshchiGuruh = false; // Role removed
  const isEkspert = false; // Role removed

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch suggestions count
      const fetchSuggestionsCount = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1'}/admin/suggestions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            return data.data?.items?.length || 0;
          }
          return 0;
        } catch {
          return 0;
        }
      };

      // Fetch data in parallel
      const [sectionsData, articlesData, analyticsData, logsData, usersData, suggestionsCount] =
        await Promise.all([
          getSections(locale as Locale),
          getArticles({ limit: 100 }, locale as Locale),
          isAdmin ? adminGetDashboardAnalytics(locale as Locale) : null,
          isAdmin ? adminGetActivityLogs(locale as Locale, 5) : [],
          isAdmin ? adminGetUsers(locale as Locale) : [],
          isAdmin ? fetchSuggestionsCount() : 0,
        ]);

      // Calculate stats
      const totalChapters = sectionsData.reduce((acc, s) => acc + (s.chaptersCount || 0), 0);

      setStats({
        totalArticles: articlesData.pagination.total || articlesData.data.length,
        totalSuggestions: suggestionsCount,
        totalSections: sectionsData.length,
        totalUsers: usersData.length || 0,
        myArticles: 0,
        myComments: 0,
        needsTranslation: 0,
        myTranslations: 0,
        sections: sectionsData.length,
        chapters: totalChapters,
        articles: articlesData.pagination.total || articlesData.data.length,
        needsExpertise: 0,
        myExpertReviews: 0,
      });

      // Action name mapping
      const actionLabels: Record<string, string> = {
        login: t.login,
        logout: t.logout,
        create: t.created,
        update: t.updated,
        delete: t.articleDeleted,
        translation_submitted: t.translationSubmitted,
        translation_approved: t.translationApproved,
        translation_rejected: t.translationRejected,
        article_created: t.articleCreated,
        article_updated: t.articleUpdated,
        article_deleted: t.articleDeleted,
        section_created: t.sectionCreated,
        chapter_created: t.chapterCreated,
        approve_comment: t.commentApproved,
        reject_comment: t.commentRejected,
        change_role: t.roleChanged,
        activate_user: t.userActivated,
        deactivate_user: t.userDeactivated,
      };

      // Helper function to format description with translations
      const formatDescription = (log: any): string => {
        const desc = log.description || '';

        // Translation map for common English descriptions
        const descriptionTranslations: Record<string, Record<string, string>> = {
          'User logged in': {
            uz: 'Foydalanuvchi tizimga kirdi',
            ru: 'Пользователь вошёл в систему',
          },
          'User logged out': {
            uz: 'Foydalanuvchi tizimdan chiqdi',
            ru: 'Пользователь вышел из системы',
          },
          'Article created': { uz: 'Modda yaratildi', ru: 'Статья создана' },
          'Article updated': { uz: 'Modda yangilandi', ru: 'Статья обновлена' },
          'Article deleted': { uz: "Modda o'chirildi", ru: 'Статья удалена' },
          'Section created': { uz: "Bo'lim yaratildi", ru: 'Раздел создан' },
          'Chapter created': { uz: 'Bob yaratildi', ru: 'Глава создана' },
          'Comment approved': { uz: 'Sharh tasdiqlandi', ru: 'Комментарий одобрен' },
          'Comment rejected': { uz: 'Sharh rad etildi', ru: 'Комментарий отклонён' },
        };

        // Check if description has a translation
        if (descriptionTranslations[desc]) {
          return descriptionTranslations[desc][locale as 'uz' | 'ru'] || desc;
        }

        // If description contains API path, extract meaningful info
        if (desc.includes('API:') || desc.includes('api/')) {
          // Extract model type and ID from API path
          const match = desc.match(/\/(articles|sections|chapters|users|comments)\/(\d+)/);
          if (match) {
            const modelType = match[1];
            const modelId = match[2];
            const modelNames: Record<string, Record<string, string>> = {
              articles: { uz: 'Modda', ru: 'Статья' },
              sections: { uz: "Bo'lim", ru: 'Раздел' },
              chapters: { uz: 'Bob', ru: 'Глава' },
              users: { uz: 'Foydalanuvchi', ru: 'Пользователь' },
              comments: { uz: 'Sharh', ru: 'Комментарий' },
            };
            const localeName = modelNames[modelType]?.[locale as 'uz' | 'ru'] || modelType;
            return `${localeName} #${modelId}`;
          }
          return log.model_id ? `ID: ${log.model_id}` : '-';
        }

        // If already a good description, return it
        if (desc && !desc.startsWith('API:')) {
          return desc;
        }

        return log.model_id ? `ID: ${log.model_id}` : '-';
      };

      // Format activity logs for display
      if (logsData && logsData.length > 0) {
        const formattedLogs = logsData.map((log: any) => {
          // Get user name with role
          const userName = log.user?.name || 'System';
          const userRole = log.user?.role_display || log.user?.role || '';
          const userDisplay = userRole ? `${userName} (${userRole})` : userName;

          return {
            id: log.id,
            user: userDisplay,
            action: actionLabels[log.action] || log.action || t.updated,
            article: formatDescription(log),
            status:
              log.action?.includes('approved') || log.action === 'login' || log.action === 'create'
                ? 'approved'
                : log.action?.includes('rejected') || log.action === 'delete'
                  ? 'rejected'
                  : log.action?.includes('pending') || log.action?.includes('submitted')
                    ? 'pending'
                    : 'approved',
            date: new Date(log.created_at).toLocaleString(locale === 'ru' ? 'ru-RU' : 'uz-UZ'),
          };
        });
        setRecentUpdates(formattedLogs);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, isAdmin]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary-600" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.welcome}, {user?.name}!
          </h1>
          <p className="mt-1 text-gray-500">{t.dashboard}</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t.totalArticles}
            value={stats.totalArticles}
            icon={FileText}
            color="blue"
            trend="+12 this month"
          />
          <StatCard
            title={t.totalSuggestions}
            value={stats.totalSuggestions}
            icon={Lightbulb}
            color="yellow"
          />
          <StatCard
            title={t.totalSections}
            value={stats.totalSections}
            icon={FolderTree}
            color="green"
          />
          <StatCard title={t.totalUsers} value={stats.totalUsers} icon={Users} color="purple" />
        </div>
      )}

      {/* Ishchi Guruh Stats - disabled, roles removed */}
      {false && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title={t.sectionsCount} value={stats.sections} icon={FolderTree} color="blue" />
          <StatCard
            title={t.chaptersCount}
            value={stats.chapters}
            icon={FolderTree}
            color="green"
          />
          <StatCard title={t.articlesCount} value={stats.articles} icon={FileText} color="purple" />
        </div>
      )}

      {/* Ekspert Stats */}
      {isEkspert && !isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            title={t.needsExpertise}
            value={stats.needsExpertise}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title={t.myExpertReviews}
            value={stats.myExpertReviews}
            icon={Award}
            color="green"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t.quickActions}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isAdmin && (
            <QuickActionButton
              icon={Users}
              label={t.totalUsers}
              href={`/${locale}/dashboard/users`}
            />
          )}
          {(isMuallif || isAdmin) && (
            <QuickActionButton
              icon={Plus}
              label={t.addArticle}
              href={`/${locale}/dashboard/articles/create`}
            />
          )}
          {(isMuallif || isAdmin) && (
            <QuickActionButton
              icon={Edit}
              label={t.addComment}
              href={`/${locale}/dashboard/comments/create`}
            />
          )}
          {(isTarjimon || isAdmin) && (
            <QuickActionButton
              icon={Globe}
              label={t.addTranslation}
              href={`/${locale}/dashboard/translations`}
            />
          )}
          {(isIshchiGuruh || isAdmin) && (
            <QuickActionButton
              icon={FolderTree}
              label={t.addSection}
              href={`/${locale}/dashboard/structure`}
            />
          )}
          {(isEkspert || isAdmin) && (
            <QuickActionButton
              icon={Award}
              label={t.addExpertise}
              href={`/${locale}/dashboard/expertise`}
            />
          )}
        </div>
      </div>

      {/* Recent Updates - Admin Only */}
      {isAdmin && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{t.recentUpdates}</h2>
            <Link
              href={`/${locale}/dashboard/logs`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {t.viewAll} →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.user}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.action}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.article}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.status}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUpdates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No recent updates found
                    </td>
                  </tr>
                ) : (
                  recentUpdates.map(update => (
                    <tr key={update.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {update.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {update.user}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-sm ${
                            update.action === 'created' || update.action === 'create'
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {update.action === 'created' || update.action === 'create' ? (
                            <Plus className="h-4 w-4" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                          {t[update.action as keyof typeof t] || update.action}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {update.article}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            update.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : update.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {update.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                          {update.status === 'pending' && <Clock className="h-3 w-3" />}
                          {update.status === 'rejected' && <XCircle className="h-3 w-3" />}
                          {t[update.status as keyof typeof t] || update.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
