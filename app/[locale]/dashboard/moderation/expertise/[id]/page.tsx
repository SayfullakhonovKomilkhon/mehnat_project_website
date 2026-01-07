'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  Award,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Scale,
  BookOpen,
  FileText,
  User,
  Calendar,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { adminGetExpertise, adminApproveExpertise, adminRejectExpertise } from '@/lib/api';
import type { Locale } from '@/types';

interface ExpertiseViewPageProps {
  params: { locale: string; id: string };
}

const translations = {
  uz: {
    title: "Ekspertizani ko'rish",
    back: 'Orqaga',
    article: 'Modda',
    expert: 'Ekspert',
    submittedAt: 'Yuborilgan sana',
    expertComment: 'Ekspert xulosasi',
    legalReferences: 'Qonuniy havolalar',
    courtPractice: 'Sud amaliyoti',
    recommendations: 'Tavsiyalar',
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    status: 'Holat',
    statusPending: 'Tekshirilmoqda',
    statusApproved: 'Tasdiqlangan',
    statusRejected: 'Rad etilgan',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    notFound: 'Ekspertiza topilmadi',
    confirmApprove: 'Ushbu ekspertizani tasdiqlashni xohlaysizmi?',
    approved: 'Ekspertiza tasdiqlandi!',
    rejected: 'Ekspertiza rad etildi!',
    rejectionModal: {
      title: 'Rad etish sababi',
      placeholder: 'Rad etish sababini kiriting...',
      cancel: 'Bekor qilish',
      confirm: 'Rad etish',
    },
    noData: "Ma'lumot mavjud emas",
  },
  ru: {
    title: 'Просмотр экспертизы',
    back: 'Назад',
    article: 'Статья',
    expert: 'Эксперт',
    submittedAt: 'Дата отправки',
    expertComment: 'Экспертное заключение',
    legalReferences: 'Правовые ссылки',
    courtPractice: 'Судебная практика',
    recommendations: 'Рекомендации',
    approve: 'Одобрить',
    reject: 'Отклонить',
    status: 'Статус',
    statusPending: 'На рассмотрении',
    statusApproved: 'Одобрено',
    statusRejected: 'Отклонено',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    notFound: 'Экспертиза не найдена',
    confirmApprove: 'Вы уверены, что хотите одобрить эту экспертизу?',
    approved: 'Экспертиза одобрена!',
    rejected: 'Экспертиза отклонена!',
    rejectionModal: {
      title: 'Причина отклонения',
      placeholder: 'Введите причину отклонения...',
      cancel: 'Отмена',
      confirm: 'Отклонить',
    },
    noData: 'Нет данных',
  },
  en: {
    title: 'View Expertise',
    back: 'Back',
    article: 'Article',
    expert: 'Expert',
    submittedAt: 'Submitted At',
    expertComment: 'Expert Opinion',
    legalReferences: 'Legal References',
    courtPractice: 'Court Practice',
    recommendations: 'Recommendations',
    approve: 'Approve',
    reject: 'Reject',
    status: 'Status',
    statusPending: 'Pending',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',
    loading: 'Loading...',
    error: 'An error occurred',
    notFound: 'Expertise not found',
    confirmApprove: 'Are you sure you want to approve this expertise?',
    approved: 'Expertise approved!',
    rejected: 'Expertise rejected!',
    rejectionModal: {
      title: 'Rejection Reason',
      placeholder: 'Enter rejection reason...',
      cancel: 'Cancel',
      confirm: 'Reject',
    },
    noData: 'No data',
  },
};

interface ExpertiseDetail {
  id: number;
  article_id: number;
  article?: {
    id: number;
    article_number: string;
    title: string;
  };
  expert_comment: string;
  legal_references?: Array<{ name: string; url: string }>;
  court_practice?: string;
  recommendations?: string;
  status: 'pending' | 'approved' | 'rejected';
  user?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ExpertiseViewPage({ params: { locale, id } }: ExpertiseViewPageProps) {
  const router = useRouter();
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [expertise, setExpertise] = useState<ExpertiseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadExpertise();
  }, [id, locale]);

  const loadExpertise = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetExpertise(parseInt(id), locale as Locale);
      setExpertise(data);
    } catch (err: any) {
      console.error('Error loading expertise:', err);
      setError(err?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm(t.confirmApprove)) return;

    setProcessing(true);
    setError(null);
    try {
      const result = await adminApproveExpertise(parseInt(id), locale as Locale);
      if (result.success) {
        setSuccessMessage(t.approved);
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
    if (!rejectionReason.trim()) return;

    setProcessing(true);
    setError(null);
    try {
      const result = await adminRejectExpertise(parseInt(id), rejectionReason, locale as Locale);
      if (result.success) {
        setSuccessMessage(t.rejected);
        setShowRejectModal(false);
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

  const getStatusBadge = (status: string) => {
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
      pending: <Clock className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (error && !expertise) {
    return (
      <RoleGuard allowedRoles={['admin', 'moderator']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-500" />
            <p className="text-gray-700">{error}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (!expertise) {
    return (
      <RoleGuard allowedRoles={['admin', 'moderator']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
            <p className="text-gray-700">{t.notFound}</p>
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
          <button
            onClick={() => router.push(`/${locale}/dashboard/moderation`)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            {t.back}
          </button>
          <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Article & Expert info */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Article info */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">{t.article}</h3>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-primary-100 px-3 py-1 font-medium text-primary-800">
                  {expertise.article?.article_number}-modda
                </span>
                <span className="font-medium text-gray-900">{expertise.article?.title}</span>
              </div>
            </div>

            {/* Expert info */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">{t.expert}</h3>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{expertise.user?.name || '-'}</span>
              </div>
            </div>

            {/* Submitted date */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">{t.submittedAt}</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{formatDate(expertise.created_at)}</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">{t.status}</h3>
              {getStatusBadge(expertise.status)}
            </div>
          </div>
        </div>

        {/* Expert Comment */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Award className="h-5 w-5 text-yellow-600" />
            {t.expertComment}
          </h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-gray-700">
              {expertise.expert_comment || t.noData}
            </p>
          </div>
        </div>

        {/* Legal References */}
        {expertise.legal_references && expertise.legal_references.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Scale className="h-5 w-5 text-blue-600" />
              {t.legalReferences}
            </h2>
            <div className="space-y-2">
              {expertise.legal_references.map((ref, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <span className="font-medium text-gray-900">{ref.name}</span>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {ref.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Court Practice */}
        {expertise.court_practice && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <BookOpen className="h-5 w-5 text-purple-600" />
              {t.courtPractice}
            </h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-gray-700">{expertise.court_practice}</p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {expertise.recommendations && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-green-600" />
              {t.recommendations}
            </h2>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-gray-700">{expertise.recommendations}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {expertise.status === 'pending' && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-6 py-2.5 font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle className="h-5 w-5" />
              {t.reject}
            </button>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              {processing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {t.approve}
            </button>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <XCircle className="h-5 w-5 text-red-600" />
                {t.rejectionModal.title}
              </h3>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder={t.rejectionModal.placeholder}
                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={processing}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  disabled={processing}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  {t.rejectionModal.cancel}
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing || !rejectionReason.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t.rejectionModal.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
