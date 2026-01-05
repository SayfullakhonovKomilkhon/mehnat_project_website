'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import { FileText, Check, X, Loader2, AlertCircle, Clock, Eye } from 'lucide-react';
import {
  adminGetPendingArticles,
  adminApproveArticle,
  adminRejectArticle,
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
    article: 'Modda',
    chapter: 'Bob',
    section: "Bo'lim",
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    view: "Ko'rish",
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    approved: 'Modda tasdiqlandi',
    rejected: 'Modda rad etildi',
    confirmApprove: "Ushbu moddani tasdiqlashni xohlaysizmi? U saytda ko'rinadi.",
    confirmReject: 'Ushbu moddani rad etishni xohlaysizmi?',
  },
  ru: {
    title: 'Модерация',
    pending: 'На рассмотрении',
    noPending: 'Нет статей на рассмотрении',
    article: 'Статья',
    chapter: 'Глава',
    section: 'Раздел',
    approve: 'Одобрить',
    reject: 'Отклонить',
    view: 'Просмотр',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    approved: 'Статья одобрена',
    rejected: 'Статья отклонена',
    confirmApprove: 'Вы уверены, что хотите одобрить эту статью? Она будет опубликована на сайте.',
    confirmReject: 'Вы уверены, что хотите отклонить эту статью?',
  },
  en: {
    title: 'Moderation',
    pending: 'Pending Review',
    noPending: 'No articles pending review',
    article: 'Article',
    chapter: 'Chapter',
    section: 'Section',
    approve: 'Approve',
    reject: 'Reject',
    view: 'View',
    loading: 'Loading...',
    error: 'An error occurred',
    approved: 'Article approved',
    rejected: 'Article rejected',
    confirmApprove:
      'Are you sure you want to approve this article? It will be published on the site.',
    confirmReject: 'Are you sure you want to reject this article?',
  },
};

interface PendingArticle {
  id: number;
  article_number: string;
  title: { uz?: string; ru?: string; en?: string };
  chapter: {
    id: number;
    chapter_number: string;
    name: { uz?: string; ru?: string; en?: string };
    section?: {
      id: number;
      section_number: string;
      name: { uz?: string; ru?: string; en?: string };
    };
  };
  created_at: string;
}

export default function ModerationPage({ params: { locale } }: ModerationPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [articles, setArticles] = useState<PendingArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadPendingArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetPendingArticles(locale as Locale);
      setArticles(data);
      // Clear error if successful
      setError(null);
    } catch (err: any) {
      console.error('Error loading pending articles:', err);
      setError(err?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingArticles();
  }, [locale]);

  const handleApprove = async (id: number) => {
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
      console.error('Error approving article:', err);
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
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
      console.error('Error rejecting article:', err);
      setError(t.error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'moderator']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary-600" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

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
            {articles.length} {t.pending.toLowerCase()}
          </span>
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

        {/* Articles List - only show if no error */}
        {!error && articles.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Clock className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">{t.noPending}</h3>
          </div>
        ) : (
          !error && (
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
                          {getLocalizedText(article.title as any, locale) || article.title || '-'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {article.chapter?.section && (
                            <>
                              {t.section} {article.chapter.section.section_number}:{' '}
                              {getLocalizedText(article.chapter.section.name as any, locale) || '-'}
                              {' → '}
                            </>
                          )}
                          {t.chapter} {article.chapter?.chapter_number}:{' '}
                          {getLocalizedText(article.chapter?.name as any, locale) || '-'}
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
                          onClick={() => handleApprove(article.id)}
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
                          onClick={() => handleReject(article.id)}
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
          )
        )}
      </div>
    </RoleGuard>
  );
}
