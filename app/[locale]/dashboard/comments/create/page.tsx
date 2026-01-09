'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  MessageSquare,
  FileText,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { getArticles, createComment } from '@/lib/api';
import type { Locale } from '@/types';

interface CreateCommentPageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    title: "Yangi sharh qo'shish",
    back: 'Orqaga',
    selectArticle: 'Moddani tanlang',
    searchArticle: 'Modda raqami yoki sarlavhasini kiriting...',
    commentType: 'Sharh turi',
    authorComment: 'Muallif sharhi',
    explanation: 'Tushuntirish',
    example: 'Misol',
    note: 'Izoh',
    commentText: 'Sharh matni',
    commentPlaceholder: 'Sharh matnini kiriting...',
    sendForReview: 'Tekshiruvga yuborish',
    cancel: 'Bekor qilish',
    selectedArticle: 'Tanlangan modda',
    noArticleSelected: 'Modda tanlanmagan',
    loading: 'Yuklanmoqda...',
    saving: 'Saqlanmoqda...',
    success: 'Sharh muvaffaqiyatli yuborildi! Admin tasdiqlashini kuting.',
    error: 'Xatolik yuz berdi',
    noResults: 'Natija topilmadi',
  },
  ru: {
    title: 'Добавить комментарий',
    back: 'Назад',
    selectArticle: 'Выберите статью',
    searchArticle: 'Введите номер или название статьи...',
    commentType: 'Тип комментария',
    authorComment: 'Комментарий автора',
    explanation: 'Объяснение',
    example: 'Пример',
    note: 'Примечание',
    commentText: 'Текст комментария',
    commentPlaceholder: 'Введите текст комментария...',
    sendForReview: 'Отправить на проверку',
    cancel: 'Отмена',
    selectedArticle: 'Выбранная статья',
    noArticleSelected: 'Статья не выбрана',
    loading: 'Загрузка...',
    saving: 'Сохранение...',
    success: 'Комментарий успешно отправлен! Ожидайте подтверждения администратора.',
    error: 'Произошла ошибка',
    noResults: 'Ничего не найдено',
  },
  en: {
    title: 'Add Comment',
    back: 'Back',
    selectArticle: 'Select Article',
    searchArticle: 'Enter article number or title...',
    commentType: 'Comment Type',
    authorComment: 'Author Comment',
    explanation: 'Explanation',
    example: 'Example',
    note: 'Note',
    commentText: 'Comment Text',
    commentPlaceholder: 'Enter comment text...',
    sendForReview: 'Send for Review',
    cancel: 'Cancel',
    selectedArticle: 'Selected Article',
    noArticleSelected: 'No article selected',
    loading: 'Loading...',
    saving: 'Saving...',
    success: 'Comment submitted successfully! Wait for admin approval.',
    error: 'An error occurred',
    noResults: 'No results found',
  },
};

interface ArticleOption {
  id: number;
  number: string;
  title: string;
}

export default function CreateCommentPage({ params: { locale } }: CreateCommentPageProps) {
  const router = useRouter();
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleOption | null>(null);
  const [commentType, setCommentType] = useState('explanation');
  const [commentText, setCommentText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Load articles from API
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const result = await getArticles({ page: 1, limit: 100 }, locale as Locale);
        const articleOptions: ArticleOption[] = result.data.map((article: any) => ({
          id: article.id,
          number: article.number || article.article_number || String(article.id),
          title:
            typeof article.title === 'string'
              ? article.title
              : article.title?.[locale] || article.title?.uz || '',
        }));
        setArticles(articleOptions);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [locale]);

  const filteredArticles = articles.filter(
    article =>
      article.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedArticle || !commentText.trim()) return;

    setSaving(true);
    setError(null);

    try {
      // Format comment with type prefix
      const formattedContent = `[${commentType.toUpperCase()}] ${commentText}`;

      const result = await createComment(
        selectedArticle.id,
        { content: formattedContent },
        locale as Locale
      );

      if (result.success) {
        setSuccessMessage(t.success);
        setTimeout(() => {
          router.push(`/${locale}/dashboard/comments`);
        }, 2000);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      setError(t.error);
    } finally {
      setSaving(false);
    }
  };

  const commentTypes = [
    { value: 'explanation', label: t.explanation },
    { value: 'example', label: t.example },
    { value: 'note', label: t.note },
  ];

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

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/dashboard/comments`}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Select Article */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5 text-primary-600" />
            {t.selectArticle}
          </h2>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchArticle}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>

            {showDropdown && searchQuery && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => {
                        setSelectedArticle(article);
                        setSearchQuery('');
                        setShowDropdown(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <span className="rounded bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-800">
                        {article.number}-modda
                      </span>
                      <span className="truncate text-gray-700">{article.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">{t.noResults}</div>
                )}
              </div>
            )}
          </div>

          {/* Selected Article */}
          {selectedArticle ? (
            <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <p className="mb-1 text-sm text-gray-600">{t.selectedArticle}:</p>
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary-600 px-2.5 py-0.5 text-sm font-medium text-white">
                  {selectedArticle.number}-modda
                </span>
                <span className="truncate font-medium text-gray-900">{selectedArticle.title}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500">
              {t.noArticleSelected}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MessageSquare className="h-5 w-5 text-green-600" />
            {t.commentType}
          </h2>

          <div className="mb-6 flex gap-3">
            {commentTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setCommentType(type.value)}
                disabled={saving}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  commentType === type.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t.commentText} *
            </label>
            <textarea
              rows={10}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              disabled={saving}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/${locale}/dashboard/comments`}
            className="rounded-lg border border-gray-300 px-4 py-2.5 transition-colors hover:bg-gray-50"
          >
            {t.cancel}
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!selectedArticle || !commentText.trim() || saving}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {saving ? t.saving : t.sendForReview}
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
