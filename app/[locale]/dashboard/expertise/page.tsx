'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  Award,
  CheckCircle,
  Clock,
  FileText,
  User,
  Calendar,
  ExternalLink,
  BookOpen,
  Scale,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  getExpertiseArticles,
  getArticleExpertise,
  saveExpertise,
  updateExpertise,
  getExpertiseStats,
  type ExpertiseArticle,
  type ExpertiseData,
} from '@/lib/api';
import type { Locale } from '@/types';

interface ExpertisePageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Ekspertiza',
    subtitle: "Moddalar bo'yicha ekspert xulosalari",
    needsExpertise: 'Ekspertiza talab qiladi',
    myReviews: 'Mening xulosalarim',
    completed: 'Tugallangan',
    all: 'Barchasi',
    articleNumber: 'Modda raqami',
    articleTitle: 'Modda nomi',
    status: 'Holat',
    action: 'Amal',
    addExpertise: "Xulosa qo'shish",
    viewExpertise: "Xulosani ko'rish",
    search: 'Modda raqami yoki sarlavhasini kiriting...',
    noResults: 'Natija topilmadi',
    expertComment: 'Ekspert xulosasi',
    legalReferences: 'Qonuniy havolalar',
    courtPractice: 'Sud amaliyoti',
    recommendations: 'Tavsiyalar',
    save: 'Saqlash',
    submit: 'Yuborish',
    back: 'Orqaga',
    verifiedByExpert: 'Ekspert tomonidan tekshirilgan',
    addReference: "Havola qo'shish",
    referenceName: 'Qonun nomi',
    referenceUrl: 'Havola (URL)',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    saving: 'Saqlanmoqda...',
    saved: 'Saqlandi!',
    savedLocally: "Mahalliy saqlandi! (Backend tayyor bo'lganda sinxronlanadi)",
    submitted: 'Tekshirishga yuborildi! Admin tasdiqlashini kuting.',
    submittedLocally: "Mahalliy yuborildi! (Backend tayyor bo'lganda sinxronlanadi)",
    pendingReview: 'Tekshirishda. Admin tasdiqlashini kuting.',
    expertCommentPlaceholder: 'Ekspert xulosasini kiriting...',
    courtPracticePlaceholder: "Sud amaliyotiga oid ma'lumotlarni kiriting...",
    recommendationsPlaceholder: 'Professional tavsiyalarni kiriting...',
    inProgress: 'Jarayonda',
  },
  ru: {
    title: 'Экспертиза',
    subtitle: 'Экспертные заключения по статьям',
    needsExpertise: 'Требует экспертизы',
    myReviews: 'Мои заключения',
    completed: 'Завершено',
    all: 'Все',
    articleNumber: 'Номер статьи',
    articleTitle: 'Название статьи',
    status: 'Статус',
    action: 'Действие',
    addExpertise: 'Добавить заключение',
    viewExpertise: 'Посмотреть заключение',
    search: 'Введите номер или название статьи...',
    noResults: 'Ничего не найдено',
    expertComment: 'Экспертное заключение',
    legalReferences: 'Правовые ссылки',
    courtPractice: 'Судебная практика',
    recommendations: 'Рекомендации',
    save: 'Сохранить',
    submit: 'Отправить',
    back: 'Назад',
    verifiedByExpert: 'Проверено экспертом',
    addReference: 'Добавить ссылку',
    referenceName: 'Название закона',
    referenceUrl: 'Ссылка (URL)',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    saving: 'Сохранение...',
    saved: 'Сохранено!',
    savedLocally: 'Сохранено локально! (Синхронизируется когда backend будет готов)',
    submitted: 'Отправлено на проверку! Ожидайте одобрения администратора.',
    submittedLocally: 'Отправлено локально! (Синхронизируется когда backend будет готов)',
    pendingReview: 'На проверке. Ожидайте одобрения администратора.',
    expertCommentPlaceholder: 'Введите экспертное заключение...',
    courtPracticePlaceholder: 'Введите информацию о судебной практике...',
    recommendationsPlaceholder: 'Введите профессиональные рекомендации...',
    inProgress: 'В процессе',
  },
  en: {
    title: 'Expertise',
    subtitle: 'Expert reviews on articles',
    needsExpertise: 'Needs Expertise',
    myReviews: 'My Reviews',
    completed: 'Completed',
    all: 'All',
    articleNumber: 'Article Number',
    articleTitle: 'Article Title',
    status: 'Status',
    action: 'Action',
    addExpertise: 'Add Expertise',
    viewExpertise: 'View Expertise',
    search: 'Enter article number or title...',
    noResults: 'No results found',
    expertComment: 'Expert Opinion',
    legalReferences: 'Legal References',
    courtPractice: 'Court Practice',
    recommendations: 'Recommendations',
    save: 'Save',
    submit: 'Submit',
    back: 'Back',
    verifiedByExpert: 'Verified by Expert',
    addReference: 'Add Reference',
    referenceName: 'Law Name',
    referenceUrl: 'Link (URL)',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    saving: 'Saving...',
    saved: 'Saved!',
    savedLocally: 'Saved locally! (Will sync when backend is ready)',
    submitted: 'Submitted for review! Wait for admin approval.',
    submittedLocally: 'Submitted locally! (Will sync when backend is ready)',
    pendingReview: 'Under review. Wait for admin approval.',
    expertCommentPlaceholder: 'Enter expert opinion...',
    courtPracticePlaceholder: 'Enter court practice information...',
    recommendationsPlaceholder: 'Enter professional recommendations...',
    inProgress: 'In Progress',
  },
};

export default function ExpertisePage({ params: { locale } }: ExpertisePageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  // State
  const [articles, setArticles] = useState<ExpertiseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'needs_expertise' | 'in_progress' | 'completed' | 'all'
  >('needs_expertise');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ExpertiseArticle | null>(null);
  const [existingExpertise, setExistingExpertise] = useState<ExpertiseData | null>(null);

  // Form state
  const [expertComment, setExpertComment] = useState('');
  const [courtPractice, setCourtPractice] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [references, setReferences] = useState<Array<{ id: number; name: string; url: string }>>([
    { id: 1, name: '', url: '' },
  ]);

  // Stats
  const [stats, setStats] = useState({
    needs_expertise: 0,
    in_progress: 0,
    completed: 0,
    total: 0,
  });

  // Load articles
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [articlesData, statsData] = await Promise.all([
        getExpertiseArticles(activeTab, locale as Locale),
        getExpertiseStats(locale as Locale),
      ]);
      setArticles(articlesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, locale, t.error]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Load expertise when article is selected
  const loadExpertise = useCallback(
    async (articleId: number) => {
      try {
        const data = await getArticleExpertise(articleId, locale as Locale);
        if (data) {
          setExistingExpertise(data);
          setExpertComment(data.expert_comment || '');
          setCourtPractice(data.court_practice || '');
          setRecommendations(data.recommendations || '');
          setReferences(
            data.legal_references?.length > 0
              ? data.legal_references.map((ref, index) => ({ id: index + 1, ...ref }))
              : [{ id: 1, name: '', url: '' }]
          );
        } else {
          // Reset form for new expertise
          setExistingExpertise(null);
          setExpertComment('');
          setCourtPractice('');
          setRecommendations('');
          setReferences([{ id: 1, name: '', url: '' }]);
        }
      } catch (err) {
        console.error('Error loading expertise:', err);
      }
    },
    [locale]
  );

  // Handle article selection
  const handleSelectArticle = async (article: ExpertiseArticle) => {
    setSelectedArticle(article);
    await loadExpertise(article.id);
  };

  // Filter articles based on search
  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.article_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Save expertise
  const handleSave = async (status: 'draft' | 'submitted') => {
    if (!selectedArticle) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const data = {
        article_id: selectedArticle.id,
        expert_comment: expertComment,
        legal_references: references
          .filter(r => r.name || r.url)
          .map(r => ({ name: r.name, url: r.url })),
        court_practice: courtPractice,
        recommendations: recommendations,
        status,
      };

      let result;
      if (existingExpertise?.id) {
        result = await updateExpertise(existingExpertise.id, data, locale as Locale);
      } else {
        result = await saveExpertise(data, locale as Locale);
      }

      if (result.success) {
        // Show appropriate message based on whether saved to server or locally
        const isLocal = (result as any).isLocal;
        if (status === 'submitted') {
          setSaveMessage(isLocal ? (t as any).submittedLocally || t.submitted : t.submitted);
        } else {
          setSaveMessage(isLocal ? (t as any).savedLocally || t.saved : t.saved);
        }

        if (result.data) {
          setExistingExpertise(result.data);
        }
        // Reload articles to update counts
        await loadArticles();

        // Clear message after 3 seconds (longer for local save info)
        setTimeout(() => setSaveMessage(null), isLocal ? 4000 : 2000);

        // If submitted, go back to list
        if (status === 'submitted') {
          setTimeout(
            () => {
              setSelectedArticle(null);
            },
            isLocal ? 3000 : 1500
          );
        }
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      console.error('Error saving expertise:', err);
      setError(t.error);
    } finally {
      setSaving(false);
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      needs_expertise: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    };
    const labels: Record<string, string> = {
      needs_expertise: t.needsExpertise,
      in_progress: t.inProgress,
      completed: t.completed,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.needs_expertise}`}
      >
        {status === 'completed' ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <Clock className="h-3 w-3" />
        )}
        {labels[status] || status}
      </span>
    );
  };

  // Reference management
  const addReference = () => {
    setReferences([...references, { id: Date.now(), name: '', url: '' }]);
  };

  const removeReference = (id: number) => {
    if (references.length > 1) {
      setReferences(references.filter(r => r.id !== id));
    }
  };

  const updateReference = (id: number, field: 'name' | 'url', value: string) => {
    setReferences(references.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // Back handler
  const handleBack = () => {
    setSelectedArticle(null);
    setExistingExpertise(null);
    setExpertComment('');
    setCourtPractice('');
    setRecommendations('');
    setReferences([{ id: 1, name: '', url: '' }]);
  };

  // Loading state
  if (loading && !selectedArticle) {
    return (
      <RoleGuard allowedRoles={['admin', 'ekspert']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary-600" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // Error state
  if (error && !selectedArticle) {
    return (
      <RoleGuard allowedRoles={['admin', 'ekspert']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-500" />
            <p className="mb-4 text-gray-700">{error}</p>
            <button
              onClick={loadArticles}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              <RefreshCw className="h-4 w-4" />
              {t.retry}
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // Article detail view
  if (selectedArticle) {
    return (
      <RoleGuard allowedRoles={['admin', 'ekspert']}>
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← {t.back}
          </button>

          {/* Article info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-lg bg-primary-100 px-3 py-1 font-medium text-primary-800">
                {selectedArticle.article_number}-modda
              </span>
              <h1 className="text-xl font-bold text-gray-900">{selectedArticle.title}</h1>
            </div>
            {selectedArticle.has_expertise && (
              <div className="flex items-center gap-2 text-green-600">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium">{t.verifiedByExpert}</span>
                {selectedArticle.expert_name && (
                  <span className="text-gray-500">- {selectedArticle.expert_name}</span>
                )}
              </div>
            )}
          </div>

          {/* Success/Error message */}
          {saveMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              <CheckCircle className="h-5 w-5" />
              {saveMessage}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {/* Expert Comment */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Award className="h-5 w-5 text-yellow-600" />
              {t.expertComment}
            </h2>
            <textarea
              rows={6}
              value={expertComment}
              onChange={e => setExpertComment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={t.expertCommentPlaceholder}
              disabled={saving}
            />
          </div>

          {/* Legal References */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Scale className="h-5 w-5 text-blue-600" />
                {t.legalReferences}
              </h2>
              <button
                onClick={addReference}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                disabled={saving}
              >
                + {t.addReference}
              </button>
            </div>
            <div className="space-y-3">
              {references.map(ref => (
                <div key={ref.id} className="flex items-start gap-3">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder={t.referenceName}
                      value={ref.name}
                      onChange={e => updateReference(ref.id, 'name', e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={saving}
                    />
                    <input
                      type="url"
                      placeholder={t.referenceUrl}
                      value={ref.url}
                      onChange={e => updateReference(ref.id, 'url', e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={saving}
                    />
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-primary-600 hover:bg-primary-50"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                  {references.length > 1 && (
                    <button
                      onClick={() => removeReference(ref.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Court Practice */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <BookOpen className="h-5 w-5 text-purple-600" />
              {t.courtPractice}
            </h2>
            <textarea
              rows={4}
              value={courtPractice}
              onChange={e => setCourtPractice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={t.courtPracticePlaceholder}
              disabled={saving}
            />
          </div>

          {/* Recommendations */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-green-600" />
              {t.recommendations}
            </h2>
            <textarea
              rows={4}
              value={recommendations}
              onChange={e => setRecommendations(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={t.recommendationsPlaceholder}
              disabled={saving}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t.save}
            </button>
            <button
              onClick={() => handleSave('submitted')}
              disabled={saving || !expertComment.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t.submit}
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // Articles list view
  return (
    <RoleGuard allowedRoles={['admin', 'ekspert']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="mt-1 text-gray-500">{t.subtitle}</p>
          </div>
          <button
            onClick={loadArticles}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="inline-flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
          {[
            {
              key: 'needs_expertise' as const,
              label: t.needsExpertise,
              count: stats.needs_expertise,
            },
            { key: 'in_progress' as const, label: t.myReviews, count: stats.in_progress },
            { key: 'completed' as const, label: t.completed, count: stats.completed },
            { key: 'all' as const, label: t.all, count: stats.total },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : tab.key === 'needs_expertise'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.articleNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.articleTitle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded bg-primary-100 px-2.5 py-0.5 text-sm font-medium text-primary-800">
                          {article.article_number}-modda
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{article.title}</span>
                          {article.has_expertise && <Award className="h-4 w-4 text-yellow-500" />}
                        </div>
                        {article.expert_name && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            {article.expert_name}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => handleSelectArticle(article)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary-700"
                        >
                          {article.status === 'completed' ? t.viewExpertise : t.addExpertise}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t.loading}
                        </div>
                      ) : (
                        t.noResults
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
