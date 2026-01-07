'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  Award,
  CheckCircle,
  Clock,
  FileText,
  User,
  ExternalLink,
  BookOpen,
  Scale,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  XCircle,
  List,
  Eye,
  X,
} from 'lucide-react';
import {
  getExpertiseArticles,
  getArticleExpertise,
  saveExpertise,
  updateExpertise,
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
    all: 'Barcha moddalar',
    pending: 'Kutilmoqda',
    approved: 'Tasdiqlangan',
    rejected: 'Rad etilgan',
    articleNumber: 'Modda raqami',
    articleTitle: 'Modda nomi',
    status: 'Holat',
    action: 'Amal',
    addExpertise: "Xulosa qo'shish",
    viewExpertise: "Xulosani ko'rish",
    editExpertise: 'Xulosani tahrirlash',
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
    submitted: 'Tekshirishga yuborildi! Admin tasdiqlashini kuting.',
    expertCommentPlaceholder: 'Ekspert xulosasini kiriting...',
    courtPracticePlaceholder: "Sud amaliyotiga oid ma'lumotlarni kiriting...",
    recommendationsPlaceholder: 'Professional tavsiyalarni kiriting...',
    rejectionReason: 'Rad etish sababi',
    viewReason: "Sababni ko'rish",
    noExpertise: "Hali ekspertiza qo'shilmagan",
    statusPending: 'Tekshirilmoqda',
    statusApproved: 'Tasdiqlangan',
    statusRejected: 'Rad etilgan',
    statusNone: "Ekspertiza yo'q",
  },
  ru: {
    title: 'Экспертиза',
    subtitle: 'Экспертные заключения по статьям',
    all: 'Все статьи',
    pending: 'Ожидают',
    approved: 'Одобренные',
    rejected: 'Отклонённые',
    articleNumber: 'Номер статьи',
    articleTitle: 'Название статьи',
    status: 'Статус',
    action: 'Действие',
    addExpertise: 'Добавить заключение',
    viewExpertise: 'Посмотреть заключение',
    editExpertise: 'Редактировать заключение',
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
    submitted: 'Отправлено на проверку! Ожидайте одобрения администратора.',
    expertCommentPlaceholder: 'Введите экспертное заключение...',
    courtPracticePlaceholder: 'Введите информацию о судебной практике...',
    recommendationsPlaceholder: 'Введите профессиональные рекомендации...',
    rejectionReason: 'Причина отклонения',
    viewReason: 'Посмотреть причину',
    noExpertise: 'Экспертиза ещё не добавлена',
    statusPending: 'На проверке',
    statusApproved: 'Одобрено',
    statusRejected: 'Отклонено',
    statusNone: 'Нет экспертизы',
  },
  en: {
    title: 'Expertise',
    subtitle: 'Expert reviews on articles',
    all: 'All Articles',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    articleNumber: 'Article Number',
    articleTitle: 'Article Title',
    status: 'Status',
    action: 'Action',
    addExpertise: 'Add Expertise',
    viewExpertise: 'View Expertise',
    editExpertise: 'Edit Expertise',
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
    submitted: 'Submitted for review! Wait for admin approval.',
    expertCommentPlaceholder: 'Enter expert opinion...',
    courtPracticePlaceholder: 'Enter court practice information...',
    recommendationsPlaceholder: 'Enter professional recommendations...',
    rejectionReason: 'Rejection Reason',
    viewReason: 'View Reason',
    noExpertise: 'No expertise added yet',
    statusPending: 'Under Review',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    statusNone: 'No Expertise',
  },
};

type TabType = 'all' | 'pending' | 'approved' | 'rejected';

interface ExpertiseWithStatus extends ExpertiseArticle {
  expertise_status?: 'pending' | 'approved' | 'rejected' | null;
  rejection_reason?: string;
}

export default function ExpertisePage({ params: { locale } }: ExpertisePageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  // State
  const [articles, setArticles] = useState<ExpertiseWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ExpertiseWithStatus | null>(null);
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
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Rejection reason modal state
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currentRejectionReason, setCurrentRejectionReason] = useState('');

  // Load articles
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const articlesData = await getExpertiseArticles('all', locale as Locale);

      // Transform to include expertise status from backend
      const transformedArticles: ExpertiseWithStatus[] = articlesData.map((article: any) => ({
        ...article,
        // Use expertise_status from backend if available, otherwise infer from status
        expertise_status:
          article.expertise_status ||
          (article.status === 'completed'
            ? 'approved'
            : article.status === 'in_progress'
              ? 'pending'
              : article.status === 'rejected'
                ? 'rejected'
                : null),
        rejection_reason: article.rejection_reason,
      }));

      setArticles(transformedArticles);

      // Calculate stats
      const pending = transformedArticles.filter(a => a.expertise_status === 'pending').length;
      const approved = transformedArticles.filter(a => a.expertise_status === 'approved').length;
      const rejected = transformedArticles.filter(a => a.expertise_status === 'rejected').length;

      setStats({
        all: transformedArticles.length,
        pending,
        approved,
        rejected,
      });
    } catch (err) {
      console.error('Error loading articles:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [locale, t.error]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Filter articles based on tab and search
  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.article_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.title?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = article.expertise_status === 'pending';
    } else if (activeTab === 'approved') {
      matchesTab = article.expertise_status === 'approved';
    } else if (activeTab === 'rejected') {
      matchesTab = article.expertise_status === 'rejected';
    }

    return matchesSearch && matchesTab;
  });

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
  const handleSelectArticle = async (article: ExpertiseWithStatus) => {
    setSelectedArticle(article);
    await loadExpertise(article.id);
  };

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
        if (status === 'submitted') {
          setSaveMessage(t.submitted);
        } else {
          setSaveMessage(t.saved);
        }

        if (result.data) {
          setExistingExpertise(result.data);
        }
        await loadArticles();
        setTimeout(() => setSaveMessage(null), 2000);

        if (status === 'submitted') {
          setTimeout(() => {
            setSelectedArticle(null);
          }, 1500);
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
  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          <Clock className="h-3 w-3" />
          {t.statusNone}
        </span>
      );
    }

    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: t.statusPending,
      approved: t.statusApproved,
      rejected: t.statusRejected,
    };
    const icons: Record<string, JSX.Element> = {
      pending: <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
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

  // Get action button based on status
  const getActionButton = (article: ExpertiseWithStatus) => {
    if (article.expertise_status === 'approved') {
      return (
        <button
          onClick={() => handleSelectArticle(article)}
          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700"
        >
          {t.viewExpertise}
        </button>
      );
    }
    if (article.expertise_status === 'pending') {
      return (
        <button
          onClick={() => handleSelectArticle(article)}
          className="inline-flex items-center gap-1 rounded-lg bg-yellow-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-yellow-700"
        >
          {t.viewExpertise}
        </button>
      );
    }
    if (article.expertise_status === 'rejected') {
      return (
        <button
          onClick={() => handleSelectArticle(article)}
          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
        >
          {t.editExpertise}
        </button>
      );
    }
    return (
      <button
        onClick={() => handleSelectArticle(article)}
        className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary-700"
      >
        {t.addExpertise}
      </button>
    );
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
    const isReadOnly = selectedArticle.expertise_status === 'approved';

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
              {getStatusBadge(selectedArticle.expertise_status)}
            </div>

            {/* Rejection reason if rejected */}
            {selectedArticle.expertise_status === 'rejected' &&
              selectedArticle.rejection_reason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-red-800">
                    <XCircle className="h-5 w-5" />
                    {t.rejectionReason}
                  </h3>
                  <p className="text-red-700">{selectedArticle.rejection_reason}</p>
                </div>
              )}
          </div>

          {/* Messages */}
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder={t.expertCommentPlaceholder}
              disabled={saving || isReadOnly}
            />
          </div>

          {/* Legal References */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Scale className="h-5 w-5 text-blue-600" />
                {t.legalReferences}
              </h2>
              {!isReadOnly && (
                <button
                  onClick={addReference}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  disabled={saving}
                >
                  + {t.addReference}
                </button>
              )}
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
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                      disabled={saving || isReadOnly}
                    />
                    <input
                      type="url"
                      placeholder={t.referenceUrl}
                      value={ref.url}
                      onChange={e => updateReference(ref.id, 'url', e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                      disabled={saving || isReadOnly}
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
                  {references.length > 1 && !isReadOnly && (
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder={t.courtPracticePlaceholder}
              disabled={saving || isReadOnly}
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              placeholder={t.recommendationsPlaceholder}
              disabled={saving || isReadOnly}
            />
          </div>

          {/* Action buttons */}
          {!isReadOnly && (
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
          )}
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
            { key: 'all' as const, label: t.all, count: stats.all, icon: List },
            { key: 'pending' as const, label: t.pending, count: stats.pending, icon: Clock },
            {
              key: 'approved' as const,
              label: t.approved,
              count: stats.approved,
              icon: CheckCircle,
            },
            { key: 'rejected' as const, label: t.rejected, count: stats.rejected, icon: XCircle },
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
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : tab.key === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : tab.key === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : tab.key === 'rejected'
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
                          {article.expertise_status === 'approved' && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {article.expert_name && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            {article.expert_name}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(article.expertise_status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Show view reason button for rejected articles */}
                          {article.expertise_status === 'rejected' && article.rejection_reason && (
                            <button
                              onClick={() => {
                                setCurrentRejectionReason(article.rejection_reason || '');
                                setShowReasonModal(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                              title={t.viewReason}
                            >
                              <Eye className="h-4 w-4" />
                              {t.viewReason}
                            </button>
                          )}
                          {getActionButton(article)}
                        </div>
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

        {/* Rejection Reason Modal */}
        {showReasonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <XCircle className="h-5 w-5 text-red-600" />
                  {t.rejectionReason}
                </h3>
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="whitespace-pre-wrap text-red-700">{currentRejectionReason}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  {t.back}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
