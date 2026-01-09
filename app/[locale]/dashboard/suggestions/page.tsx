'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  Lightbulb,
  Loader2,
  Eye,
  X,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface SuggestionsPageProps {
  params: { locale: string };
}

interface Suggestion {
  id: number;
  article_id: number;
  article_number: string;
  article_title?: string;
  name: string;
  suggestion: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  admin_notes?: string;
  created_at: string;
}

const translations = {
  uz: {
    title: 'Foydalanuvchi takliflari',
    subtitle: 'Foydalanuvchilar yuborgan taklif va tuzatishlar',
    loading: 'Yuklanmoqda...',
    noSuggestions: "Hozircha takliflar yo'q",
    article: 'Modda',
    user: 'Foydalanuvchi',
    date: 'Sana',
    status: 'Holat',
    viewDetails: "Batafsil ko'rish",
    statuses: {
      new: 'Yangi',
      reviewed: "Ko'rib chiqilgan",
      accepted: 'Qabul qilingan',
      rejected: 'Rad etilgan',
    },
    filterAll: 'Barchasi',
    filterNew: 'Yangi',
    filterReviewed: "Ko'rib chiqilgan",
    close: 'Yopish',
    suggestionDetails: 'Taklif tafsilotlari',
    suggestionText: 'Taklif matni',
    markAsReviewed: "Ko'rib chiqildi",
    accept: 'Qabul qilish',
    reject: 'Rad etish',
  },
  ru: {
    title: 'Предложения пользователей',
    subtitle: 'Предложения и исправления от пользователей',
    loading: 'Загрузка...',
    noSuggestions: 'Предложений пока нет',
    article: 'Статья',
    user: 'Пользователь',
    date: 'Дата',
    status: 'Статус',
    viewDetails: 'Подробнее',
    statuses: {
      new: 'Новое',
      reviewed: 'Рассмотрено',
      accepted: 'Принято',
      rejected: 'Отклонено',
    },
    filterAll: 'Все',
    filterNew: 'Новые',
    filterReviewed: 'Рассмотренные',
    close: 'Закрыть',
    suggestionDetails: 'Детали предложения',
    suggestionText: 'Текст предложения',
    markAsReviewed: 'Отметить как рассмотренное',
    accept: 'Принять',
    reject: 'Отклонить',
  },
  en: {
    title: 'User Suggestions',
    subtitle: 'Suggestions and corrections from users',
    loading: 'Loading...',
    noSuggestions: 'No suggestions yet',
    article: 'Article',
    user: 'User',
    date: 'Date',
    status: 'Status',
    viewDetails: 'View Details',
    statuses: {
      new: 'New',
      reviewed: 'Reviewed',
      accepted: 'Accepted',
      rejected: 'Rejected',
    },
    filterAll: 'All',
    filterNew: 'New',
    filterReviewed: 'Reviewed',
    close: 'Close',
    suggestionDetails: 'Suggestion Details',
    suggestionText: 'Suggestion Text',
    markAsReviewed: 'Mark as Reviewed',
    accept: 'Accept',
    reject: 'Reject',
  },
};

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusIcons = {
  new: Clock,
  reviewed: AlertCircle,
  accepted: CheckCircle,
  rejected: XCircle,
};

export default function SuggestionsPage({ params: { locale } }: SuggestionsPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed'>('all');
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const statusParam = filter === 'all' ? '' : `?status=${filter}`;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api'}/v1/admin/suggestions${statusParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept-Language': locale,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.data?.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [filter, locale]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api'}/v1/admin/suggestions/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Accept-Language': locale,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        // Update local state
        setSuggestions(prev => prev.map(s => (s.id === id ? { ...s, status: status as any } : s)));
        if (selectedSuggestion?.id === id) {
          setSelectedSuggestion({ ...selectedSuggestion, status: status as any });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-100 p-3">
              <Lightbulb className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-500">{t.subtitle}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'new', 'reviewed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? t.filterAll : f === 'new' ? t.filterNew : t.filterReviewed}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Suggestions List */}
        {!loading && suggestions.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Lightbulb className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{t.noSuggestions}</p>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.article}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.user}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.date}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.status}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {suggestions.map(suggestion => {
                    const StatusIcon = statusIcons[suggestion.status];
                    return (
                      <tr key={suggestion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link
                            href={`/${locale}/articles/${suggestion.article_id}`}
                            className="flex items-center gap-2 text-primary-600 hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            {suggestion.article_number}-modda
                          </Link>
                          {suggestion.article_title && (
                            <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                              {suggestion.article_title}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{suggestion.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(suggestion.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                              statusColors[suggestion.status]
                            }`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {t.statuses[suggestion.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedSuggestion(suggestion)}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                          >
                            <Eye className="h-4 w-4" />
                            {t.viewDetails}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedSuggestion && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedSuggestion(null)}
            />

            {/* Modal */}
            <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-x-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{t.suggestionDetails}</h2>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {/* Article Info */}
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-primary-50 p-4">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <div>
                    <Link
                      href={`/${locale}/articles/${selectedSuggestion.article_id}`}
                      className="font-medium text-primary-600 hover:underline"
                    >
                      {selectedSuggestion.article_number}-modda
                    </Link>
                    {selectedSuggestion.article_title && (
                      <p className="text-sm text-gray-600">{selectedSuggestion.article_title}</p>
                    )}
                  </div>
                </div>

                {/* User & Date */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      {t.user}
                    </div>
                    <p className="mt-1 font-medium text-gray-900">{selectedSuggestion.name}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {t.date}
                    </div>
                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(selectedSuggestion.created_at)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-gray-500">{t.status}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                      statusColors[selectedSuggestion.status]
                    }`}
                  >
                    {(() => {
                      const StatusIcon = statusIcons[selectedSuggestion.status];
                      return <StatusIcon className="h-4 w-4" />;
                    })()}
                    {t.statuses[selectedSuggestion.status]}
                  </span>
                </div>

                {/* Suggestion Text */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-500">{t.suggestionText}</p>
                  <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                    {selectedSuggestion.suggestion}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                {selectedSuggestion.status === 'new' && (
                  <>
                    <button
                      onClick={() => updateStatus(selectedSuggestion.id, 'reviewed')}
                      disabled={updating}
                      className="rounded-lg bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-200 disabled:opacity-50"
                    >
                      {t.markAsReviewed}
                    </button>
                    <button
                      onClick={() => updateStatus(selectedSuggestion.id, 'accepted')}
                      disabled={updating}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      {t.accept}
                    </button>
                    <button
                      onClick={() => updateStatus(selectedSuggestion.id, 'rejected')}
                      disabled={updating}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {t.reject}
                    </button>
                  </>
                )}
                {selectedSuggestion.status === 'reviewed' && (
                  <>
                    <button
                      onClick={() => updateStatus(selectedSuggestion.id, 'accepted')}
                      disabled={updating}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                    >
                      {t.accept}
                    </button>
                    <button
                      onClick={() => updateStatus(selectedSuggestion.id, 'rejected')}
                      disabled={updating}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {t.reject}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
