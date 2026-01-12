'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Loader2,
  AlertCircle,
  Check,
  X,
  Calendar,
  Hash,
  FolderOpen,
  BookOpen,
  Maximize2,
} from 'lucide-react';
import { TruncatedText } from '@/components/ui';
import {
  adminGetArticle,
  adminApproveArticle,
  adminRejectArticle,
  getLocalizedText,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Locale } from '@/types';

interface ArticleViewPageProps {
  params: { locale: string; id: string };
}

const translations = {
  uz: {
    title: "Moddani ko'rish",
    back: 'Orqaga',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    notFound: 'Modda topilmadi',
    articleNumber: 'Modda raqami',
    section: "Bo'lim",
    chapter: 'Bob',
    content: 'Mazmuni',
    status: 'Holati',
    active: 'Faol',
    inactive: 'Nofaol',
    pending: 'Tekshiruvda',
    createdAt: 'Yaratilgan sana',
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    approved: 'Modda tasdiqlandi',
    rejected: 'Modda rad etildi',
    confirmApprove: 'Ushbu moddani tasdiqlashni xohlaysizmi?',
    confirmReject: 'Ushbu moddani rad etishni xohlaysizmi?',
    contentUz: "O'zbekcha",
    contentRu: 'Ruscha',
    contentEn: 'Inglizcha',
  },
  ru: {
    title: 'Просмотр статьи',
    back: 'Назад',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    notFound: 'Статья не найдена',
    articleNumber: 'Номер статьи',
    section: 'Раздел',
    chapter: 'Глава',
    content: 'Содержание',
    status: 'Статус',
    active: 'Активна',
    inactive: 'Неактивна',
    pending: 'На проверке',
    createdAt: 'Дата создания',
    approve: 'Одобрить',
    reject: 'Отклонить',
    approved: 'Статья одобрена',
    rejected: 'Статья отклонена',
    confirmApprove: 'Вы уверены, что хотите одобрить эту статью?',
    confirmReject: 'Вы уверены, что хотите отклонить эту статью?',
    contentUz: 'Узбекский',
    contentRu: 'Русский',
    contentEn: 'Английский',
  },
  en: {
    title: 'View Article',
    back: 'Back',
    loading: 'Loading...',
    error: 'An error occurred',
    notFound: 'Article not found',
    articleNumber: 'Article Number',
    section: 'Section',
    chapter: 'Chapter',
    content: 'Content',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    createdAt: 'Created At',
    approve: 'Approve',
    reject: 'Reject',
    approved: 'Article approved',
    rejected: 'Article rejected',
    confirmApprove: 'Are you sure you want to approve this article?',
    confirmReject: 'Are you sure you want to reject this article?',
    contentUz: 'Uzbek',
    contentRu: 'Russian',
    contentEn: 'English',
  },
};

export default function ArticleViewPage({ params: { locale, id } }: ArticleViewPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');

  const userRole = user?.role?.name;
  const canModerate = userRole === 'admin';

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminGetArticle(parseInt(id), locale as Locale);
        if (data) {
          setArticle(data);
        } else {
          setError(t.notFound);
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, locale, t.error, t.notFound]);

  const handleApprove = async () => {
    if (!confirm(t.confirmApprove)) return;

    setProcessing(true);
    try {
      const result = await adminApproveArticle(parseInt(id), locale as Locale);
      if (result.success) {
        setSuccessMessage(t.approved);
        setArticle({ ...article, is_active: true, translation_status: 'approved' });
        setTimeout(() => {
          router.push(`/${locale}/dashboard/moderation`);
        }, 1500);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(t.confirmReject)) return;

    setProcessing(true);
    try {
      const result = await adminRejectArticle(parseInt(id), locale as Locale);
      if (result.success) {
        setSuccessMessage(t.rejected);
        setTimeout(() => {
          router.push(`/${locale}/dashboard/moderation`);
        }, 1500);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setProcessing(false);
    }
  };

  // Get translation for a specific locale
  const getTranslation = (loc: string) => {
    if (!article?.translations) return null;

    // Handle both array and object formats
    if (Array.isArray(article.translations)) {
      return article.translations.find((tr: any) => tr.locale === loc);
    }

    // If translations is an object like { uz: {...}, ru: {...} }
    if (typeof article.translations === 'object') {
      return article.translations[loc] || null;
    }

    return null;
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary-600" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error && !article) {
    return (
      <RoleGuard allowedRoles={['admin']}>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard/moderation`}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  const isPending = !article?.is_active && article?.translation_status === 'pending';

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard/moderation`}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          </div>

          {/* Action buttons for pending articles */}
          {canModerate && isPending && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                {t.reject}
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {t.approve}
              </button>
            </div>
          )}
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

        {/* Article Info */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5 text-primary-600" />
            {getLocalizedText(article?.title, locale)}
          </h2>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t.articleNumber}</p>
                <p className="font-medium text-gray-900">{article?.article_number}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <FolderOpen className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t.section}</p>
                <p className="font-medium text-gray-900">
                  {getLocalizedText(article?.chapter?.section?.name, locale) || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t.chapter}</p>
                <p className="font-medium text-gray-900">
                  {getLocalizedText(article?.chapter?.name, locale) || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">{t.status}</p>
                <p
                  className={`font-medium ${
                    article?.is_active
                      ? 'text-green-600'
                      : isPending
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {article?.is_active ? t.active : isPending ? t.pending : t.inactive}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex">
              {(['uz', 'ru'] as const).map(lang => {
                const translation = getTranslation(lang);
                const hasContent = translation?.title || translation?.content;
                return (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === lang
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : hasContent
                          ? 'text-gray-600 hover:text-gray-900'
                          : 'text-gray-400'
                    }`}
                  >
                    {lang === 'uz' ? t.contentUz : lang === 'ru' ? t.contentRu : t.contentEn}
                    {!hasContent && <span className="ml-2 text-xs text-gray-400">—</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {(() => {
              const translation = getTranslation(activeTab);
              const title = translation?.title || article?.title?.[activeTab] || article?.title;
              const content =
                translation?.content || article?.content?.[activeTab] || article?.content;
              const summary =
                translation?.summary || article?.summary?.[activeTab] || article?.summary;

              if (!title && !content) {
                return (
                  <p className="py-8 text-center text-gray-500">
                    {locale === 'uz'
                      ? 'Bu tilda kontent mavjud emas'
                      : locale === 'ru'
                        ? 'Нет контента на этом языке'
                        : 'No content in this language'}
                  </p>
                );
              }
              const contentText =
                typeof content === 'string' ? content : getLocalizedText(content, activeTab) || '';
              const summaryText =
                typeof summary === 'string' ? summary : getLocalizedText(summary, activeTab) || '';
              const titleText =
                typeof title === 'string' ? title : getLocalizedText(title, activeTab);

              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{titleText}</h3>
                  </div>
                  {summaryText && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-600">
                        {locale === 'uz'
                          ? 'Qisqacha mazmuni'
                          : locale === 'ru'
                            ? 'Краткое содержание'
                            : 'Summary'}
                      </p>
                      <TruncatedText
                        text={summaryText}
                        maxLength={300}
                        title={
                          locale === 'uz'
                            ? 'Qisqacha mazmuni'
                            : locale === 'ru'
                              ? 'Краткое содержание'
                              : 'Summary'
                        }
                        locale={locale}
                        className="text-sm italic text-blue-700"
                      />
                    </div>
                  )}
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {locale === 'uz'
                        ? 'Asosiy matn'
                        : locale === 'ru'
                          ? 'Основной текст'
                          : 'Content'}
                    </p>
                    <TruncatedText
                      text={contentText}
                      maxLength={400}
                      title={titleText}
                      locale={locale}
                      className="prose max-w-none"
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
