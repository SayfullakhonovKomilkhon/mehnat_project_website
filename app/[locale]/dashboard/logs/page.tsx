'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  History,
  Loader2,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Locale } from '@/types';

interface LogsPageProps {
  params: { locale: string };
}

interface Log {
  id: number;
  user: string;
  action: string;
  description: string;
  status: 'approved' | 'rejected' | 'pending';
  date: string;
}

const translations = {
  uz: {
    title: 'Tizim jurnali',
    subtitle: "Barcha o'zgarishlar va harakatlar tarixi",
    searchPlaceholder: 'Qidirish...',
    filterAll: 'Barchasi',
    filterApproved: 'Tasdiqlangan',
    filterRejected: 'Rad etilgan',
    filterPending: 'Kutilmoqda',
    date: 'Sana',
    user: 'Foydalanuvchi',
    action: 'Harakat',
    description: 'Tavsif',
    status: 'Holat',
    noLogs: 'Jurnallar topilmadi',
    loading: 'Yuklanmoqda...',
    approved: 'Tasdiqlandi',
    rejected: 'Rad etildi',
    pending: 'Kutilmoqda',
    login: 'Tizimga kirdi',
    logout: 'Tizimdan chiqdi',
    created: 'Yaratildi',
    updated: 'Yangilandi',
    deleted: "O'chirildi",
    articleCreated: 'Modda yaratildi',
    articleUpdated: 'Modda yangilandi',
    articleDeleted: "Modda o'chirildi",
    sectionCreated: "Bo'lim yaratildi",
    chapterCreated: 'Bob yaratildi',
    commentApproved: 'Sharh tasdiqlandi',
    commentRejected: 'Sharh rad etildi',
    userLoggedIn: 'Foydalanuvchi tizimga kirdi',
    userLoggedOut: 'Foydalanuvchi tizimdan chiqdi',
    page: 'Sahifa',
    of: 'dan',
    perPage: 'har sahifada',
  },
  ru: {
    title: 'Журнал системы',
    subtitle: 'История всех изменений и действий',
    searchPlaceholder: 'Поиск...',
    filterAll: 'Все',
    filterApproved: 'Одобренные',
    filterRejected: 'Отклонённые',
    filterPending: 'Ожидающие',
    date: 'Дата',
    user: 'Пользователь',
    action: 'Действие',
    description: 'Описание',
    status: 'Статус',
    noLogs: 'Журналы не найдены',
    loading: 'Загрузка...',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    pending: 'Ожидает',
    login: 'Вошёл в систему',
    logout: 'Вышел из системы',
    created: 'Создано',
    updated: 'Обновлено',
    deleted: 'Удалено',
    articleCreated: 'Статья создана',
    articleUpdated: 'Статья обновлена',
    articleDeleted: 'Статья удалена',
    sectionCreated: 'Раздел создан',
    chapterCreated: 'Глава создана',
    commentApproved: 'Комментарий одобрен',
    commentRejected: 'Комментарий отклонён',
    userLoggedIn: 'Пользователь вошёл в систему',
    userLoggedOut: 'Пользователь вышел из системы',
    page: 'Страница',
    of: 'из',
    perPage: 'на странице',
  },
};

export default function LogsPage({ params: { locale } }: LogsPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  // Action labels mapping
  const actionLabels: Record<string, string> = {
    login: t.login,
    logout: t.logout,
    create: t.created,
    update: t.updated,
    delete: t.deleted,
    article_created: t.articleCreated,
    article_updated: t.articleUpdated,
    article_deleted: t.articleDeleted,
    section_created: t.sectionCreated,
    chapter_created: t.chapterCreated,
    approve_comment: t.commentApproved,
    reject_comment: t.commentRejected,
  };

  // Description translations
  const descriptionTranslations: Record<string, string> = {
    'User logged in': t.userLoggedIn,
    'User logged out': t.userLoggedOut,
    'Article created': t.articleCreated,
    'Article updated': t.articleUpdated,
    'Article deleted': t.articleDeleted,
    'Section created': t.sectionCreated,
    'Chapter created': t.chapterCreated,
    'Comment approved': t.commentApproved,
    'Comment rejected': t.commentRejected,
  };

  // Model name translations
  const modelNames: Record<string, string> = {
    articles: locale === 'ru' ? 'Статья' : 'Modda',
    sections: locale === 'ru' ? 'Раздел' : "Bo'lim",
    chapters: locale === 'ru' ? 'Глава' : 'Bob',
    users: locale === 'ru' ? 'Пользователь' : 'Foydalanuvchi',
    comments: locale === 'ru' ? 'Комментарий' : 'Sharh',
  };

  const formatDescription = (desc: string): string => {
    // Check for direct translation
    if (descriptionTranslations[desc]) {
      return descriptionTranslations[desc];
    }

    // Parse API paths
    if (desc.includes('API:') || desc.includes('api/')) {
      const match = desc.match(/\/(articles|sections|chapters|users|comments)\/(\d+)/);
      if (match) {
        return `${modelNames[match[1]] || match[1]} #${match[2]}`;
      }
    }

    return desc || '-';
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1'}/admin/logs?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept-Language': locale,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const logsData = data.data?.items || data.data || [];

        const formattedLogs = logsData.map((log: any) => {
          const userName = log.user?.name || 'System';
          const userRole = log.user?.role_display || log.user?.role || '';
          const userDisplay = userRole ? `${userName} (${userRole})` : userName;

          return {
            id: log.id,
            user: userDisplay,
            action: actionLabels[log.action] || log.action || t.updated,
            description: formatDescription(log.description || ''),
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

        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Filter and search logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / perPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            {t.approved}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
            <XCircle className="h-3 w-3" />
            {t.rejected}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
            <Clock className="h-3 w-3" />
            {t.pending}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary-100 p-3">
            <History className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t.filterAll}</option>
              <option value="approved">{t.filterApproved}</option>
              <option value="rejected">{t.filterRejected}</option>
              <option value="pending">{t.filterPending}</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Logs Table */}
        {!loading && paginatedLogs.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <History className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{t.noLogs}</p>
          </div>
        )}

        {!loading && paginatedLogs.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t.date}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {t.user}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.action}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t.description}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.status}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {log.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.user}</td>
                      <td className="px-6 py-4 text-sm text-primary-600">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{log.description}</td>
                      <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-gray-500">
                  {t.page} {currentPage} {t.of} {totalPages} ({filteredLogs.length} {t.perPage})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
