'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Send,
  MessageSquare,
  FileText,
  Search,
} from 'lucide-react';

interface CreateCommentPageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    title: 'Yangi sharh qo\'shish',
    back: 'Orqaga',
    selectArticle: 'Moddani tanlang',
    searchArticle: 'Modda raqami yoki sarlavhasini kiriting...',
    commentType: 'Sharh turi',
    authorComment: 'Muallif sharhi',
    expertComment: 'Ekspert sharhi',
    explanation: 'Tushuntirish',
    example: 'Misol',
    note: 'Izoh',
    commentText: 'Sharh matni',
    commentPlaceholder: 'Sharh matnini kiriting...',
    save: 'Saqlash',
    saveDraft: 'Qoralama sifatida saqlash',
    sendForReview: 'Tekshiruvga yuborish',
    cancel: 'Bekor qilish',
    selectedArticle: 'Tanlangan modda',
    noArticleSelected: 'Modda tanlanmagan',
  },
  ru: {
    title: 'Добавить комментарий',
    back: 'Назад',
    selectArticle: 'Выберите статью',
    searchArticle: 'Введите номер или название статьи...',
    commentType: 'Тип комментария',
    authorComment: 'Комментарий автора',
    expertComment: 'Экспертный комментарий',
    explanation: 'Объяснение',
    example: 'Пример',
    note: 'Примечание',
    commentText: 'Текст комментария',
    commentPlaceholder: 'Введите текст комментария...',
    save: 'Сохранить',
    saveDraft: 'Сохранить как черновик',
    sendForReview: 'Отправить на проверку',
    cancel: 'Отмена',
    selectedArticle: 'Выбранная статья',
    noArticleSelected: 'Статья не выбрана',
  },
  en: {
    title: 'Add Comment',
    back: 'Back',
    selectArticle: 'Select Article',
    searchArticle: 'Enter article number or title...',
    commentType: 'Comment Type',
    authorComment: 'Author Comment',
    expertComment: 'Expert Comment',
    explanation: 'Explanation',
    example: 'Example',
    note: 'Note',
    commentText: 'Comment Text',
    commentPlaceholder: 'Enter comment text...',
    save: 'Save',
    saveDraft: 'Save as Draft',
    sendForReview: 'Send for Review',
    cancel: 'Cancel',
    selectedArticle: 'Selected Article',
    noArticleSelected: 'No article selected',
  },
};

const mockArticles = [
  { id: 1, number: '1', title: 'Mehnat to\'g\'risidagi qonun hujjatlari' },
  { id: 2, number: '21', title: 'Mehnat shartnomasi tushunchasi' },
  { id: 3, number: '77', title: 'Mehnat shartnomasini bekor qilish asoslari' },
  { id: 4, number: '81', title: 'Ish vaqti normasi' },
  { id: 5, number: '100', title: 'Mehnat haqi to\'g\'risida' },
];

export default function CreateCommentPage({ params: { locale } }: CreateCommentPageProps) {
  const router = useRouter();
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [commentType, setCommentType] = useState('explanation');
  const [commentText, setCommentText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredArticles = mockArticles.filter(article =>
    article.number.includes(searchQuery) ||
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (action: 'draft' | 'review') => {
    console.log('Submitting:', { action, selectedArticle, commentType, commentText });
    router.push(`/${locale}/dashboard/comments`);
  };

  const commentTypes = [
    { value: 'explanation', label: t.explanation },
    { value: 'example', label: t.example },
    { value: 'note', label: t.note },
  ];

  return (
    <RoleGuard allowedRoles={['admin', 'muallif']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/dashboard/comments`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Select Article */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            {t.selectArticle}
          </h2>
          
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.searchArticle}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {showDropdown && searchQuery && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => {
                        setSelectedArticle(article);
                        setSearchQuery('');
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded text-sm font-medium">
                        {article.number}-modda
                      </span>
                      <span className="text-gray-700">{article.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    Natija topilmadi
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Article */}
          {selectedArticle ? (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{t.selectedArticle}:</p>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-primary-600 text-white rounded text-sm font-medium">
                  {selectedArticle.number}-modda
                </span>
                <span className="font-medium text-gray-900">{selectedArticle.title}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
              {t.noArticleSelected}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            {t.commentType}
          </h2>
          
          <div className="flex gap-3 mb-6">
            {commentTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setCommentType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  commentType === type.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.commentText} *
            </label>
            <textarea
              rows={10}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.commentPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/${locale}/dashboard/comments`}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </Link>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={!selectedArticle || !commentText}
            className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {t.saveDraft}
          </button>
          <button
            onClick={() => handleSubmit('review')}
            disabled={!selectedArticle || !commentText}
            className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {t.sendForReview}
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}

