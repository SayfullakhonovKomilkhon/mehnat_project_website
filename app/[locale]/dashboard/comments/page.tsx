'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit, 
  MessageSquare,
  User,
  FileText,
  Calendar,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface CommentsPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Sharhlar moderatsiyasi',
    subtitle: 'Foydalanuvchilar sharhlarini boshqarish',
    pending: 'Kutilmoqda',
    approved: 'Tasdiqlangan',
    rejected: 'Rad etilgan',
    all: 'Barchasi',
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    edit: 'Tahrirlash',
    article: 'Modda',
    author: 'Muallif',
    date: 'Sana',
    comment: 'Sharh matni',
    noComments: 'Sharhlar topilmadi',
    rejectReason: 'Rad etish sababi',
    submit: 'Yuborish',
    cancel: 'Bekor qilish',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    refresh: 'Yangilash',
    approveSuccess: 'Sharh tasdiqlandi!',
    rejectSuccess: 'Sharh rad etildi!',
  },
  ru: {
    title: 'Модерация комментариев',
    subtitle: 'Управление комментариями пользователей',
    pending: 'Ожидают',
    approved: 'Одобренные',
    rejected: 'Отклоненные',
    all: 'Все',
    approve: 'Одобрить',
    reject: 'Отклонить',
    edit: 'Редактировать',
    article: 'Статья',
    author: 'Автор',
    date: 'Дата',
    comment: 'Текст комментария',
    noComments: 'Комментарии не найдены',
    rejectReason: 'Причина отклонения',
    submit: 'Отправить',
    cancel: 'Отмена',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    refresh: 'Обновить',
    approveSuccess: 'Комментарий одобрен!',
    rejectSuccess: 'Комментарий отклонён!',
  },
  en: {
    title: 'Comments Moderation',
    subtitle: 'Manage user comments',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    all: 'All',
    approve: 'Approve',
    reject: 'Reject',
    edit: 'Edit',
    article: 'Article',
    author: 'Author',
    date: 'Date',
    comment: 'Comment text',
    noComments: 'No comments found',
    rejectReason: 'Rejection reason',
    submit: 'Submit',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'An error occurred',
    refresh: 'Refresh',
    approveSuccess: 'Comment approved!',
    rejectSuccess: 'Comment rejected!',
  },
};

interface Comment {
  id: number;
  article_id: number;
  content: string;
  status: string;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
  article?: {
    id: number;
    article_number?: string;
    translations?: {
      uz?: { title?: string };
      ru?: { title?: string };
      en?: { title?: string };
    };
    title?: string;
  };
}

export default function CommentsPage({ params: { locale } }: CommentsPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';

  // Load comments from API
  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all comments (we'll filter on frontend)
      const response = await fetch(`${API_BASE_URL}/admin/comments`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const items = data.data?.items || data.items || data.data || [];
        setComments(items);
      } else {
        // If API fails, show empty state (no mock data)
        console.error('Failed to load comments:', response.status);
        setComments([]);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      setError(t.error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, locale, t.error]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Filter comments based on active tab
  const filteredComments = comments.filter(comment => 
    activeTab === 'all' || comment.status === activeTab
  );

  const pendingCount = comments.filter(c => c.status === 'pending').length;
  const approvedCount = comments.filter(c => c.status === 'approved').length;
  const rejectedCount = comments.filter(c => c.status === 'rejected').length;

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/comments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (response.ok) {
        // Update local state
        setComments(prev => prev.map(c => 
          c.id === id ? { ...c, status: 'approved' } : c
        ));
        alert(t.approveSuccess);
      } else {
        const data = await response.json();
        alert(data.message || 'Error approving comment');
      }
    } catch (err) {
      console.error('Error approving comment:', err);
      alert(t.error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (id: number) => {
    setSelectedComment(id);
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!selectedComment) return;
    
    setActionLoading(selectedComment);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/comments/${selectedComment}/reject`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      
      if (response.ok) {
        // Update local state
        setComments(prev => prev.map(c => 
          c.id === selectedComment ? { ...c, status: 'rejected' } : c
        ));
        alert(t.rejectSuccess);
      } else {
        const data = await response.json();
        alert(data.message || 'Error rejecting comment');
      }
    } catch (err) {
      console.error('Error rejecting comment:', err);
      alert(t.error);
    } finally {
      setActionLoading(null);
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedComment(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const icons: Record<string, any> = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };
    const Icon = icons[status] || Clock;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        <Icon className="w-3 h-3" />
        {t[status as keyof typeof t] || status}
      </span>
    );
  };

  // Get article title from translations
  const getArticleTitle = (comment: Comment) => {
    if (!comment.article) return 'Unknown';
    
    const article = comment.article;
    const articleNumber = article.article_number || article.id;
    
    let title = '';
    if (article.translations) {
      title = article.translations[locale as 'uz' | 'ru' | 'en']?.title || 
              article.translations.uz?.title || 
              article.title || '';
    } else {
      title = article.title || '';
    }
    
    return `${articleNumber}-modda${title ? `: ${title}` : ''}`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(
        locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
        { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }
      );
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'moderator']}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600">{t.loading}</span>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'moderator']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <button
            onClick={loadComments}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t.refresh}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex gap-1">
          {[
            { key: 'pending', count: pendingCount },
            { key: 'approved', count: approvedCount },
            { key: 'rejected', count: rejectedCount },
            { key: 'all', count: comments.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t[tab.key as keyof typeof t]}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.key === 'pending'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.length > 0 ? (
            filteredComments.map(comment => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{comment.author?.name || 'Unknown'}</span>
                        {getStatusBadge(comment.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {getArticleTitle(comment)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>

                {/* Actions */}
                {comment.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(comment.id)}
                      disabled={actionLoading === comment.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === comment.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {t.approve}
                    </button>
                    <button
                      onClick={() => handleReject(comment.id)}
                      disabled={actionLoading === comment.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      {t.reject}
                    </button>
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      {t.edit}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t.noComments}</p>
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setRejectModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.reject}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.rejectReason}
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={submitReject}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading !== null ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t.submit
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
