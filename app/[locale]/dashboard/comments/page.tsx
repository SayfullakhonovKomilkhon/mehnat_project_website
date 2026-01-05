'use client';

import { useState } from 'react';
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
  },
};

// Mock comments data
const mockComments = [
  {
    id: 1,
    article: { number: '77', title: 'Mehnat shartnomasini bekor qilish asoslari' },
    author: { name: 'Sardor Azimov', role: 'Muallif' },
    text: 'Bu modda bo\'yicha muhim tushuntirishlar: Ish beruvchi mehnat shartnomasini bekor qilishda qonuniy asoslarga tayanishi kerak...',
    date: '2025-12-25 10:30',
    status: 'pending',
    type: 'author_comment',
  },
  {
    id: 2,
    article: { number: '81', title: 'Ish vaqti normasi' },
    author: { name: 'Gulnora Aliyeva', role: 'Ekspert' },
    text: 'Ekspert xulosasi: Ish vaqti normasi milliy qonunchilikda belgilangan standartlarga mos keladi...',
    date: '2025-12-24 15:20',
    status: 'pending',
    type: 'expert_comment',
  },
  {
    id: 3,
    article: { number: '21', title: 'Mehnat shartnomasi tushunchasi' },
    author: { name: 'Jasur Rahimov', role: 'Muallif' },
    text: 'Mehnat shartnomasi - bu ish beruvchi va xodim o\'rtasidagi huquqiy kelishuv bo\'lib...',
    date: '2025-12-23 09:45',
    status: 'approved',
    type: 'author_comment',
  },
  {
    id: 4,
    article: { number: '100', title: 'Mehnat haqi to\'g\'risida' },
    author: { name: 'Bekzod Toshmatov', role: 'Muallif' },
    text: 'Bu sharh to\'liq emas va qayta ko\'rib chiqilishi kerak...',
    date: '2025-12-22 14:10',
    status: 'rejected',
    type: 'author_comment',
    rejectReason: 'Sharh to\'liq emas, qo\'shimcha ma\'lumotlar kerak',
  },
];

export default function CommentsPage({ params: { locale } }: CommentsPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredComments = mockComments.filter(comment => 
    activeTab === 'all' || comment.status === activeTab
  );

  const pendingCount = mockComments.filter(c => c.status === 'pending').length;
  const approvedCount = mockComments.filter(c => c.status === 'approved').length;
  const rejectedCount = mockComments.filter(c => c.status === 'rejected').length;

  const handleApprove = (id: number) => {
    console.log('Approving comment:', id);
    // In real app, make API call
  };

  const handleReject = (id: number) => {
    setSelectedComment(id);
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    console.log('Rejecting comment:', selectedComment, 'Reason:', rejectReason);
    setRejectModalOpen(false);
    setRejectReason('');
    setSelectedComment(null);
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
    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {t[status as keyof typeof t] || status}
      </span>
    );
  };

  return (
    <RoleGuard allowedRoles={['admin', 'muallif']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex gap-1">
          {[
            { key: 'pending', count: pendingCount },
            { key: 'approved', count: approvedCount },
            { key: 'rejected', count: rejectedCount },
            { key: 'all', count: mockComments.length },
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
                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                        <span className="text-sm text-gray-500">({comment.author.role})</span>
                        {getStatusBadge(comment.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {comment.article.number}-modda: {comment.article.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        {comment.date}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                </div>

                {/* Rejection Reason */}
                {comment.status === 'rejected' && comment.rejectReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-700">
                      <strong>{t.rejectReason}:</strong> {comment.rejectReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {comment.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t.approve}
                    </button>
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t.submit}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

