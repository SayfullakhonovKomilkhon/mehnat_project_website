'use client';

import { useState } from 'react';
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
} from 'lucide-react';

interface ExpertisePageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Ekspertiza',
    subtitle: 'Moddalar bo\'yicha ekspert xulosalari',
    needsExpertise: 'Ekspertiza talab qiladi',
    myReviews: 'Mening xulosalarim',
    completed: 'Tugallangan',
    all: 'Barchasi',
    articleNumber: 'Modda raqami',
    articleTitle: 'Modda nomi',
    status: 'Holat',
    action: 'Amal',
    addExpertise: 'Xulosa qo\'shish',
    viewExpertise: 'Xulosani ko\'rish',
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
    addReference: 'Havola qo\'shish',
    referenceName: 'Qonun nomi',
    referenceUrl: 'Havola (URL)',
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
  },
};

// Mock articles for expertise
const mockArticles = [
  { id: 1, number: '77', title: 'Mehnat shartnomasini bekor qilish asoslari', status: 'needs_expertise', hasExpertise: false },
  { id: 2, number: '78', title: 'Ishdan bo\'shatish tartibi', status: 'needs_expertise', hasExpertise: false },
  { id: 3, number: '79', title: 'Ishdan bo\'shatishda cheklovlar', status: 'in_progress', hasExpertise: true, expertName: 'Gulnora Aliyeva' },
  { id: 4, number: '81', title: 'Ish vaqti normasi', status: 'completed', hasExpertise: true, expertName: 'Gulnora Aliyeva' },
  { id: 5, number: '100', title: 'Mehnat haqi to\'g\'risida', status: 'completed', hasExpertise: true, expertName: 'Gulnora Aliyeva' },
];

export default function ExpertisePage({ params: { locale } }: ExpertisePageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [activeTab, setActiveTab] = useState<'all' | 'needs_expertise' | 'in_progress' | 'completed'>('needs_expertise');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [references, setReferences] = useState([
    { id: 1, name: 'Mehnat kodeksi 77-modda', url: 'https://lex.uz/docs/142859#142952' },
  ]);

  const filteredArticles = mockArticles.filter(article => {
    const matchesTab = activeTab === 'all' || article.status === activeTab;
    const matchesSearch = article.number.includes(searchQuery) || 
                          article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    needs_expertise: mockArticles.filter(a => a.status === 'needs_expertise').length,
    in_progress: mockArticles.filter(a => a.status === 'in_progress').length,
    completed: mockArticles.filter(a => a.status === 'completed').length,
    all: mockArticles.length,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      needs_expertise: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    };
    const labels: Record<string, string> = {
      needs_expertise: t.needsExpertise,
      in_progress: t.myReviews,
      completed: t.completed,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {labels[status]}
      </span>
    );
  };

  const addReference = () => {
    setReferences([...references, { id: Date.now(), name: '', url: '' }]);
  };

  const removeReference = (id: number) => {
    setReferences(references.filter(r => r.id !== id));
  };

  if (selectedArticle) {
    return (
      <RoleGuard allowedRoles={['admin', 'ekspert']}>
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← {t.back}
          </button>

          {/* Article info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-lg font-medium">
                {selectedArticle.number}-modda
              </span>
              <h1 className="text-xl font-bold text-gray-900">{selectedArticle.title}</h1>
            </div>
            {selectedArticle.hasExpertise && (
              <div className="flex items-center gap-2 text-green-600">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">{t.verifiedByExpert}</span>
              </div>
            )}
          </div>

          {/* Expert Comment */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              {t.expertComment}
            </h2>
            <textarea
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ekspert xulosasini kiriting..."
            />
          </div>

          {/* Legal References */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                {t.legalReferences}
              </h2>
              <button
                onClick={addReference}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + {t.addReference}
              </button>
            </div>
            <div className="space-y-3">
              {references.map((ref, index) => (
                <div key={ref.id} className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={t.referenceName}
                      value={ref.name}
                      onChange={(e) => {
                        const newRefs = [...references];
                        newRefs[index].name = e.target.value;
                        setReferences(newRefs);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="url"
                      placeholder={t.referenceUrl}
                      value={ref.url}
                      onChange={(e) => {
                        const newRefs = [...references];
                        newRefs[index].url = e.target.value;
                        setReferences(newRefs);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {references.length > 1 && (
                    <button
                      onClick={() => removeReference(ref.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Court Practice */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              {t.courtPractice}
            </h2>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Sud amaliyotiga oid ma'lumotlarni kiriting..."
            />
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              {t.recommendations}
            </h2>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Professional tavsiyalarni kiriting..."
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              {t.save}
            </button>
            <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              {t.submit}
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'ekspert']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex gap-1 flex-wrap">
          {[
            { key: 'needs_expertise', label: t.needsExpertise },
            { key: 'in_progress', label: t.myReviews },
            { key: 'completed', label: t.completed },
            { key: 'all', label: t.all },
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
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.key === 'needs_expertise'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {counts[tab.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.articleNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.articleTitle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 bg-primary-100 text-primary-800 rounded text-sm font-medium">
                          {article.number}-modda
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{article.title}</span>
                          {article.hasExpertise && (
                            <Award className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedArticle(article)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          {article.status === 'completed' ? t.viewExpertise : t.addExpertise}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {t.noResults}
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

