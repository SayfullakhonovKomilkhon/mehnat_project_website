'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import {
  FileText,
  Check,
  X,
  Loader2,
  AlertCircle,
  Clock,
  Eye,
  Award,
  CheckCircle,
  List,
  User,
} from 'lucide-react';
import {
  adminGetPendingArticles,
  adminApproveArticle,
  adminRejectArticle,
  getLocalizedText,
  apiRequest,
} from '@/lib/api';
import type { Locale } from '@/types';

interface ModerationPageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    title: 'Moderatsiya',
    // Articles
    tabArticles: 'Moddalar',
    noPendingArticles: "Tekshirishda kutilayotgan moddalar yo'q",
    article: 'Modda',
    chapter: 'Bob',
    section: "Bo'lim",
    // Expertise tabs
    tabExpertise: 'Ekspertiza',
    tabPending: 'Tekshirishda',
    tabApproved: 'Tasdiqlangan',
    tabAll: 'Barchasi',
    noPendingExpertise: "Tekshirishda kutilayotgan ekspertizalar yo'q",
    noApprovedExpertise: "Tasdiqlangan ekspertizalar yo'q",
    noExpertise: "Ekspertizalar yo'q",
    // Actions
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    view: "Ko'rish",
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    approved: 'Tasdiqlandi',
    rejected: 'Rad etildi',
    confirmApprove: 'Tasdiqlashni xohlaysizmi?',
    confirmReject: 'Rad etishni xohlaysizmi?',
    expertComment: 'Ekspert xulosasi',
    by: 'tomonidan',
    submittedAt: 'Yuborilgan',
    statusPending: 'Tekshirilmoqda',
    statusApproved: 'Tasdiqlangan',
  },
  ru: {
    title: 'Модерация',
    // Articles
    tabArticles: 'Статьи',
    noPendingArticles: 'Нет статей на рассмотрении',
    article: 'Статья',
    chapter: 'Глава',
    section: 'Раздел',
    // Expertise tabs
    tabExpertise: 'Экспертиза',
    tabPending: 'На рассмотрении',
    tabApproved: 'Одобренные',
    tabAll: 'Все',
    noPendingExpertise: 'Нет экспертиз на рассмотрении',
    noApprovedExpertise: 'Нет одобренных экспертиз',
    noExpertise: 'Нет экспертиз',
    // Actions
    approve: 'Одобрить',
    reject: 'Отклонить',
    view: 'Просмотр',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    confirmApprove: 'Вы уверены, что хотите одобрить?',
    confirmReject: 'Вы уверены, что хотите отклонить?',
    expertComment: 'Экспертное заключение',
    by: 'от',
    submittedAt: 'Отправлено',
    statusPending: 'На проверке',
    statusApproved: 'Одобрено',
  },
  en: {
    title: 'Moderation',
    // Articles
    tabArticles: 'Articles',
    noPendingArticles: 'No articles pending review',
    article: 'Article',
    chapter: 'Chapter',
    section: 'Section',
    // Expertise tabs
    tabExpertise: 'Expertise',
    tabPending: 'Pending',
    tabApproved: 'Approved',
    tabAll: 'All',
    noPendingExpertise: 'No expertises pending review',
    noApprovedExpertise: 'No approved expertises',
    noExpertise: 'No expertises',
    // Actions
    approve: 'Approve',
    reject: 'Reject',
    view: 'View',
    loading: 'Loading...',
    error: 'An error occurred',
    approved: 'Approved',
    rejected: 'Rejected',
    confirmApprove: 'Are you sure you want to approve?',
    confirmReject: 'Are you sure you want to reject?',
    expertComment: 'Expert Opinion',
    by: 'by',
    submittedAt: 'Submitted',
    statusPending: 'Pending',
    statusApproved: 'Approved',
  },
};

interface PendingArticle {
  id: number;
  article_number: string;
  title: { uz?: string; ru?: string; en?: string } | string;
  chapter?: {
    id: number;
    chapter_number: string;
    name: { uz?: string; ru?: string; en?: string } | string;
    section?: {
      id: number;
      section_number: string;
      name: { uz?: string; ru?: string; en?: string } | string;
    };
  };
  created_at: string;
}

interface ExpertiseItem {
  id: number;
  article_id: number;
  article?: {
    id: number;
    article_number: string;
    title: string;
  };
  expert_comment: string;
  status: 'pending' | 'approved' | 'rejected';
  user?: {
    id: number;
    name: string;
  };
  created_at: string;
}

type MainTab = 'articles' | 'expertise';
type ExpertiseTab = 'pending' | 'approved' | 'all';

export default function ModerationPage({ params: { locale } }: ModerationPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [mainTab, setMainTab] = useState<MainTab>('articles');
  const [expertiseTab, setExpertiseTab] = useState<ExpertiseTab>('pending');

  const [articles, setArticles] = useState<PendingArticle[]>([]);
  const [expertises, setExpertises] = useState<ExpertiseItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Stats
  const [expertiseStats, setExpertiseStats] = useState({
    pending: 0,
    approved: 0,
    all: 0,
  });

  // Load expertise stats on initial load
  useEffect(() => {
    loadExpertiseStats();
  }, [locale]);

  useEffect(() => {
    if (mainTab === 'articles') {
      loadPendingArticles();
    } else {
      loadExpertises();
    }
  }, [mainTab, expertiseTab, locale]);

  const loadExpertiseStats = async () => {
    try {
      const pendingResult = await apiRequest<any>('/admin/expertise/pending', {}, locale as Locale);
      const approvedResult = await apiRequest<any>(
        '/admin/expertise?status=approved',
        {},
        locale as Locale
      );
      const allResult = await apiRequest<any>('/admin/expertise', {}, locale as Locale);

      setExpertiseStats({
        pending: (pendingResult.data?.items || pendingResult.data || []).length,
        approved: (approvedResult.data?.items || approvedResult.data || []).length,
        all: (allResult.data?.items || allResult.data || []).length,
      });
    } catch (err) {
      console.error('Error loading expertise stats:', err);
    }
  };

  const loadPendingArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetPendingArticles(locale as Locale);
      setArticles(data);
    } catch (err: any) {
      console.error('Error loading pending articles:', err);
      setError(err?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const loadExpertises = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load expertises based on tab
      let endpoint = '/admin/expertise';
      if (expertiseTab === 'pending') {
        endpoint = '/admin/expertise/pending';
      } else if (expertiseTab === 'approved') {
        endpoint = '/admin/expertise?status=approved';
      }

      const result = await apiRequest<any>(endpoint, {}, locale as Locale);

      if (result.success) {
        const items = result.data?.items || result.data || [];
        setExpertises(Array.isArray(items) ? items : []);

        // Also update stats
        await loadExpertiseStats();
      } else {
        throw new Error(result.error || t.error);
      }
    } catch (err: any) {
      console.error('Error loading expertises:', err);
      setError(err?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveArticle = async (id: number) => {
    if (!confirm(t.confirmApprove)) return;

    setProcessing(id);
    setError(null);
    try {
      const result = await adminApproveArticle(id, locale as Locale);
      if (result.success) {
        setSuccessMessage(t.approved);
        setArticles(articles.filter(a => a.id !== id));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectArticle = async (id: number) => {
    if (!confirm(t.confirmReject)) return;

    setProcessing(id);
    setError(null);
    try {
      const result = await adminRejectArticle(id, locale as Locale);
      if (result.success) {
        setSuccessMessage(t.rejected);
        setArticles(articles.filter(a => a.id !== id));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <CheckCircle className="h-3 w-3" />
          {t.statusApproved}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        <Clock className="h-3 w-3" />
        {t.statusPending}
      </span>
    );
  };

  return (
    <RoleGuard allowedRoles={['admin', 'moderator']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Clock className="h-6 w-6 text-primary-600" />
            {t.title}
          </h1>
        </div>

        {/* Main Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setMainTab('articles')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors ${
                mainTab === 'articles'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5" />
              {t.tabArticles}
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {articles.length}
              </span>
            </button>
            <button
              onClick={() => setMainTab('expertise')}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors ${
                mainTab === 'expertise'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Award className="h-5 w-5" />
              {t.tabExpertise}
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                {expertiseStats.pending}
              </span>
            </button>
          </nav>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <Check className="h-5 w-5" />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Articles Tab Content */}
        {!loading && mainTab === 'articles' && (
          <>
            {articles.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">{t.noPendingArticles}</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map(article => (
                  <div
                    key={article.id}
                    className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded-lg bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                            {article.article_number}-modda
                          </span>
                          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            <Clock className="mr-1 inline h-3 w-3" />
                            {t.statusPending}
                          </span>
                        </div>
                        <h3 className="truncate font-medium text-gray-900">
                          {typeof article.title === 'string'
                            ? article.title
                            : getLocalizedText(article.title as any, locale as Locale) || '-'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {article.chapter?.section && (
                            <span>
                              {t.section}:{' '}
                              {typeof article.chapter.section.name === 'string'
                                ? article.chapter.section.name
                                : getLocalizedText(
                                    article.chapter.section.name as any,
                                    locale as Locale
                                  ) || '-'}{' '}
                              →{' '}
                            </span>
                          )}
                          {article.chapter && (
                            <span>
                              {t.chapter}:{' '}
                              {typeof article.chapter.name === 'string'
                                ? article.chapter.name
                                : getLocalizedText(article.chapter.name as any, locale as Locale) ||
                                  '-'}
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {t.submittedAt}: {formatDate(article.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/dashboard/articles/${article.id}`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleApproveArticle(article.id)}
                          disabled={processing === article.id}
                          className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {processing === article.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectArticle(article.id)}
                          disabled={processing === article.id}
                          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Expertise Tab Content */}
        {!loading && mainTab === 'expertise' && (
          <>
            {/* Expertise Sub-tabs */}
            <div className="inline-flex gap-1 rounded-xl bg-white p-1 shadow-sm">
              {[
                {
                  key: 'pending' as const,
                  label: t.tabPending,
                  count: expertiseStats.pending,
                  icon: Clock,
                },
                {
                  key: 'approved' as const,
                  label: t.tabApproved,
                  count: expertiseStats.approved,
                  icon: CheckCircle,
                },
                { key: 'all' as const, label: t.tabAll, count: expertiseStats.all, icon: List },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setExpertiseTab(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    expertiseTab === tab.key
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      expertiseTab === tab.key
                        ? 'bg-white/20 text-white'
                        : tab.key === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : tab.key === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Expertise List */}
            {expertises.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Award className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {expertiseTab === 'pending'
                    ? t.noPendingExpertise
                    : expertiseTab === 'approved'
                      ? t.noApprovedExpertise
                      : t.noExpertise}
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                {expertises.map(expertise => (
                  <div
                    key={expertise.id}
                    className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded-lg bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                            {expertise.article?.article_number}-modda
                          </span>
                          {getStatusBadge(expertise.status)}
                        </div>
                        <h3 className="truncate font-medium text-gray-900">
                          {expertise.article?.title || '-'}
                        </h3>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{expertise.user?.name || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(expertise.created_at)}</span>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {expertise.expert_comment}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/dashboard/moderation/expertise/${expertise.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
                        >
                          <Eye className="h-4 w-4" />
                          {t.view}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </RoleGuard>
  );
}
