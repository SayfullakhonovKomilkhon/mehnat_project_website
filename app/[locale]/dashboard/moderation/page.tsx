'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import { FileText, Check, X, Loader2, AlertCircle, Clock, Eye, Award } from 'lucide-react';
import {
  adminGetPendingArticles,
  adminApproveArticle,
  adminRejectArticle,
  adminGetPendingExpertises,
  adminApproveExpertise,
  adminRejectExpertise,
  getLocalizedText,
} from '@/lib/api';
import type { Locale } from '@/types';

interface ModerationPageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    title: 'Moderatsiya',
    pending: 'Tekshirishda kutmoqda',
    noPending: "Tekshirishda kutilayotgan maqolalar yo'q",
    noPendingExpertise: "Tekshirishda kutilayotgan ekspertizalar yo'q",
    article: 'Modda',
    chapter: 'Bob',
    section: "Bo'lim",
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    view: "Ko'rish",
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    approved: 'Tasdiqlandi',
    rejected: 'Rad etildi',
    confirmApprove: "Ushbu moddani tasdiqlashni xohlaysizmi? U saytda ko'rinadi.",
    confirmReject: 'Ushbu moddani rad etishni xohlaysizmi?',
    tabArticles: 'Moddalar',
    tabExpertise: 'Ekspertiza',
    expertComment: 'Ekspert xulosasi',
    by: 'tomonidan',
  },
  ru: {
    title: 'Модерация',
    pending: 'На рассмотрении',
    noPending: 'Нет статей на рассмотрении',
    noPendingExpertise: 'Нет экспертиз на рассмотрении',
    article: 'Статья',
    chapter: 'Глава',
    section: 'Раздел',
    approve: 'Одобрить',
    reject: 'Отклонить',
    view: 'Просмотр',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    confirmApprove: 'Вы уверены, что хотите одобрить? Это будет опубликовано на сайте.',
    confirmReject: 'Вы уверены, что хотите отклонить?',
    tabArticles: 'Статьи',
    tabExpertise: 'Экспертиза',
    expertComment: 'Экспертное заключение',
    by: 'от',
  },
  en: {
    title: 'Moderation',
    pending: 'Pending Review',
    noPending: 'No articles pending review',
    noPendingExpertise: 'No expertises pending review',
    article: 'Article',
    chapter: 'Chapter',
    section: 'Section',
    approve: 'Approve',
    reject: 'Reject',
    view: 'View',
    loading: 'Loading...',
    error: 'An error occurred',
    approved: 'Approved',
    rejected: 'Rejected',
    confirmApprove: 'Are you sure you want to approve? It will be published on the site.',
    confirmReject: 'Are you sure you want to reject?',
    tabArticles: 'Articles',
    tabExpertise: 'Expertise',
    expertComment: 'Expert Opinion',
    by: 'by',
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

interface PendingExpertise {
  id: number;
  article_id: number;
  article?: {
    id: number;
    article_number: string;
    title: string;
  };
  expert_comment: string;
  user?: {
    id: number;
    name: string;
  };
  created_at: string;
}

export default function ModerationPage({ params: { locale } }: ModerationPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [activeTab, setActiveTab] = useState<'articles' | 'expertise'>('articles');
  const [articles, setArticles] = useState<PendingArticle[]>([]);
  const [expertises, setExpertises] = useState<PendingExpertise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadPendingData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'articles') {
        const data = await adminGetPendingArticles(locale as Locale);
        setArticles(data);
      } else {
        const data = await adminGetPendingExpertises(locale as Locale);
        setExpertises(data);
      }
    } catch (err: any) {
      console.error('Error loading pending data:', err);
      setError(err?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingData();
  }, [locale, activeTab]);

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

  const handleApproveExpertise = async (id: number) => {
    if (!confirm(t.confirmApprove)) return;

    setProcessing(id);
    setError(null);
    try {
      const result = await adminApproveExpertise(id, locale as Locale);
      if (result.success) {
        setSuccessMessage(t.approved);
        setExpertises(expertises.filter(e => e.id !== id));
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

  const handleRejectExpertise = async (id: number) => {
    if (!confirm(t.confirmReject)) return;

    setProcessing(id);
    setError(null);
    try {
      const result = await adminRejectExpertise(id, locale as Locale);
      if (result.success) {
        setSuccessMessage(t.rejected);
        setExpertises(expertises.filter(e => e.id !== id));
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

  const pendingCount = activeTab === 'articles' ? articles.length : expertises.length;

  return (
    <RoleGuard allowedRoles={['admin', 'moderator']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Clock className="h-6 w-6 text-primary-600" />
            {t.title}
          </h1>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            {pendingCount} {t.pending.toLowerCase()}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'articles'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            {t.tabArticles}
          </button>
          <button
            onClick={() => setActiveTab('expertise')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'expertise'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="h-4 w-4" />
            {t.tabExpertise}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Articles List */}
        {!loading && activeTab === 'articles' && (
          <>
            {articles.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Clock className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">{t.noPending}</h3>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="divide-y divide-gray-200">
                  {articles.map(article => (
                    <div key={article.id} className="p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-800">
                              {t.article} {article.article_number}
                            </span>
                          </div>
                          <h3 className="truncate font-medium text-gray-900">
                            {typeof article.title === 'string'
                              ? article.title
                              : getLocalizedText(article.title as any, locale) || '-'}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {article.chapter?.section && (
                              <>
                                {t.section} {article.chapter.section.section_number}:{' '}
                                {typeof article.chapter.section.name === 'string'
                                  ? article.chapter.section.name
                                  : getLocalizedText(article.chapter.section.name as any, locale) ||
                                    '-'}
                                {' → '}
                              </>
                            )}
                            {article.chapter && (
                              <>
                                {t.chapter} {article.chapter.chapter_number}:{' '}
                                {typeof article.chapter.name === 'string'
                                  ? article.chapter.name
                                  : getLocalizedText(article.chapter.name as any, locale) || '-'}
                              </>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(article.created_at).toLocaleDateString(locale)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${locale}/dashboard/articles/${article.id}`}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                            title={t.view}
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleApproveArticle(article.id)}
                            disabled={processing === article.id}
                            className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
                            title={t.approve}
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
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                            title={t.reject}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Expertise List */}
        {!loading && activeTab === 'expertise' && (
          <>
            {expertises.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Award className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">{t.noPendingExpertise}</h3>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="divide-y divide-gray-200">
                  {expertises.map(expertise => (
                    <div key={expertise.id} className="p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded bg-yellow-100 px-2 py-0.5 text-sm font-medium text-yellow-800">
                              <Award className="mr-1 inline h-3 w-3" />
                              {t.expertComment}
                            </span>
                            {expertise.article && (
                              <span className="rounded bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-800">
                                {t.article} {expertise.article.article_number}
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900">
                            {expertise.article?.title || '-'}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {expertise.expert_comment}
                          </p>
                          <p className="mt-2 text-xs text-gray-400">
                            {expertise.user && (
                              <span className="mr-2">
                                {t.by} <span className="font-medium">{expertise.user.name}</span>
                              </span>
                            )}
                            {new Date(expertise.created_at).toLocaleDateString(locale)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveExpertise(expertise.id)}
                            disabled={processing === expertise.id}
                            className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
                            title={t.approve}
                          >
                            {processing === expertise.id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Check className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectExpertise(expertise.id)}
                            disabled={processing === expertise.id}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                            title={t.reject}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </RoleGuard>
  );
}
