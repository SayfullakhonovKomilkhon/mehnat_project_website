'use client';

import { useEffect, useState } from 'react';
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
  Eye,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface DashboardPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    welcome: 'Xush kelibsiz',
    dashboard: 'Bosh sahifa',
    totalArticles: 'Jami moddalar',
    pendingApproval: 'Tasdiqlashni kutmoqda',
    totalComments: 'Jami sharhlar',
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
    myArticles: 'Mening moddalarim',
    myComments: 'Mening sharhlarim',
    newComment: 'Yangi sharh',
    needsTranslation: 'Tarjima talab qiladi',
    myTranslations: 'Mening tarjimalarim',
    translationProgress: 'Tarjima jarayoni',
    structureOverview: 'Tuzilma ko\'rinishi',
    sectionsCount: 'Bo\'limlar',
    chaptersCount: 'Boblar',
    articlesCount: 'Moddalar',
    needsExpertise: 'Ekspertiza talab qiladi',
    myExpertReviews: 'Mening xulosalarim',
    quickActions: 'Tezkor harakatlar',
    addArticle: 'Modda qo\'shish',
    addComment: 'Sharh qo\'shish',
    addTranslation: 'Tarjima qo\'shish',
    addSection: 'Bo\'lim qo\'shish',
    addExpertise: 'Ekspertiza qo\'shish',
  },
  ru: {
    welcome: 'Добро пожаловать',
    dashboard: 'Главная',
    totalArticles: 'Всего статей',
    pendingApproval: 'Ожидают одобрения',
    totalComments: 'Всего комментариев',
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
    pendingApproval: 'Pending Approval',
    totalComments: 'Total Comments',
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
    <div className={`bg-white rounded-xl shadow-sm border-t-4 ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color].split(' ')[0]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
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
  color = 'primary'
}: { 
  icon: any; 
  label: string; 
  href: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </Link>
  );
}

export default function DashboardPage({ params: { locale } }: DashboardPageProps) {
  const { user, checkRole } = useAuth();
  const t = translations[locale as keyof typeof translations] || translations.uz;

  // Mock stats - in real app, fetch from API
  const [stats, setStats] = useState({
    totalArticles: 350,
    pendingApproval: 12,
    totalComments: 1247,
    totalUsers: 156,
    myArticles: 15,
    myComments: 42,
    needsTranslation: 23,
    myTranslations: 18,
    sections: 6,
    chapters: 28,
    articles: 350,
    needsExpertise: 8,
    myExpertReviews: 31,
  });

  // Mock recent updates
  const recentUpdates = [
    { id: 1, user: 'Azimov Sardor', action: 'updated', article: 'Modda 77', status: 'approved', date: '2025-12-25 10:30' },
    { id: 2, user: 'Karimova Nodira', action: 'created', article: 'Modda 81-1', status: 'pending', date: '2025-12-25 09:15' },
    { id: 3, user: 'Rahimov Jasur', action: 'updated', article: 'Modda 56', status: 'approved', date: '2025-12-24 16:45' },
    { id: 4, user: 'Aliyeva Gulnora', action: 'created', article: 'Modda 102', status: 'rejected', date: '2025-12-24 14:20' },
    { id: 5, user: 'Toshmatov Bekzod', action: 'updated', article: 'Modda 21', status: 'pending', date: '2025-12-24 11:00' },
  ];

  const isAdmin = checkRole(['admin']);
  const isMuallif = checkRole(['muallif']);
  const isTarjimon = checkRole(['tarjimon']);
  const isIshchiGuruh = checkRole(['ishchi_guruh']);
  const isEkspert = checkRole(['ekspert']);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.welcome}, {user?.name}!
          </h1>
          <p className="text-gray-500 mt-1">{t.dashboard}</p>
        </div>
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t.totalArticles}
            value={stats.totalArticles}
            icon={FileText}
            color="blue"
            trend="+12 this month"
          />
          <StatCard
            title={t.pendingApproval}
            value={stats.pendingApproval}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title={t.totalComments}
            value={stats.totalComments}
            icon={MessageSquare}
            color="green"
            trend="+47 this week"
          />
          <StatCard
            title={t.totalUsers}
            value={stats.totalUsers}
            icon={Users}
            color="purple"
          />
        </div>
      )}

      {/* Muallif Stats */}
      {isMuallif && !isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title={t.myArticles}
            value={stats.myArticles}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title={t.myComments}
            value={stats.myComments}
            icon={MessageSquare}
            color="green"
          />
          <StatCard
            title={t.pendingApproval}
            value={5}
            icon={Clock}
            color="yellow"
          />
        </div>
      )}

      {/* Tarjimon Stats */}
      {isTarjimon && !isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title={t.needsTranslation}
            value={stats.needsTranslation}
            icon={Globe}
            color="red"
          />
          <StatCard
            title={t.myTranslations}
            value={stats.myTranslations}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title={t.pendingApproval}
            value={3}
            icon={Clock}
            color="yellow"
          />
        </div>
      )}

      {/* Ishchi Guruh Stats */}
      {isIshchiGuruh && !isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title={t.sectionsCount}
            value={stats.sections}
            icon={FolderTree}
            color="blue"
          />
          <StatCard
            title={t.chaptersCount}
            value={stats.chapters}
            icon={FolderTree}
            color="green"
          />
          <StatCard
            title={t.articlesCount}
            value={stats.articles}
            icon={FileText}
            color="purple"
          />
        </div>
      )}

      {/* Ekspert Stats */}
      {isEkspert && !isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.quickActions}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isAdmin && (
            <>
              <QuickActionButton
                icon={Plus}
                label={t.addArticle}
                href={`/${locale}/dashboard/articles/create`}
              />
              <QuickActionButton
                icon={Users}
                label={t.totalUsers}
                href={`/${locale}/dashboard/users`}
              />
            </>
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t.recentUpdates}</h2>
            <Link
              href={`/${locale}/dashboard/articles`}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t.viewAll} →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.user}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.action}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.article}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUpdates.map((update) => (
                  <tr key={update.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {update.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {update.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-sm ${
                        update.action === 'created' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {update.action === 'created' ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        {t[update.action as keyof typeof t] || update.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {update.article}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        update.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : update.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {update.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {update.status === 'pending' && <Clock className="w-3 h-3" />}
                        {update.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {t[update.status as keyof typeof t] || update.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

