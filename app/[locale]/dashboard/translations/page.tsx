'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import { 
  Globe, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Book,
  Search,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { adminGetArticles } from '@/lib/api';
import type { Locale } from '@/types';

interface TranslationsPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Tarjimalar',
    subtitle: 'Moddalarni rus va ingliz tillariga tarjima qilish',
    needsTranslation: 'Tarjima talab qiladi',
    inProgress: 'Jarayonda',
    completed: 'Tugallangan',
    all: 'Barchasi',
    articleNumber: 'Modda raqami',
    titleUz: 'Sarlavha (O\'zbekcha)',
    russianProgress: 'Ruscha',
    englishProgress: 'Inglizcha',
    status: 'Holat',
    action: 'Amal',
    translate: 'Tarjima qilish',
    continue: 'Davom ettirish',
    view: 'Ko\'rish',
    search: 'Modda raqami yoki sarlavhasini kiriting...',
    noResults: 'Natija topilmadi',
    glossary: 'Lug\'at',
    originalText: 'Asl matn (O\'zbekcha)',
    translationRu: 'Tarjima (Ruscha)',
    translationEn: 'Tarjima (Inglizcha)',
    save: 'Saqlash',
    complete: 'Tugatish',
    back: 'Orqaga',
  },
  ru: {
    title: 'Переводы',
    subtitle: 'Перевод статей на русский и английский языки',
    needsTranslation: 'Требует перевода',
    inProgress: 'В процессе',
    completed: 'Завершено',
    all: 'Все',
    articleNumber: 'Номер статьи',
    titleUz: 'Название (Узбекский)',
    russianProgress: 'Русский',
    englishProgress: 'Английский',
    status: 'Статус',
    action: 'Действие',
    translate: 'Перевести',
    continue: 'Продолжить',
    view: 'Просмотр',
    search: 'Введите номер или название статьи...',
    noResults: 'Ничего не найдено',
    glossary: 'Глоссарий',
    originalText: 'Оригинал (Узбекский)',
    translationRu: 'Перевод (Русский)',
    translationEn: 'Перевод (Английский)',
    save: 'Сохранить',
    complete: 'Завершить',
    back: 'Назад',
  },
  en: {
    title: 'Translations',
    subtitle: 'Translate articles to Russian and English',
    needsTranslation: 'Needs Translation',
    inProgress: 'In Progress',
    completed: 'Completed',
    all: 'All',
    articleNumber: 'Article Number',
    titleUz: 'Title (Uzbek)',
    russianProgress: 'Russian',
    englishProgress: 'English',
    status: 'Status',
    action: 'Action',
    translate: 'Translate',
    continue: 'Continue',
    view: 'View',
    search: 'Enter article number or title...',
    noResults: 'No results found',
    glossary: 'Glossary',
    originalText: 'Original (Uzbek)',
    translationRu: 'Translation (Russian)',
    translationEn: 'Translation (English)',
    save: 'Save',
    complete: 'Complete',
    back: 'Back',
  },
};

// Mock articles for translation
const mockArticles = [
  { id: 1, number: '77', titleUz: 'Mehnat shartnomasini bekor qilish asoslari', ruProgress: 0, enProgress: 0, status: 'needs_translation' },
  { id: 2, number: '78', titleUz: 'Ishdan bo\'shatish tartibi', ruProgress: 50, enProgress: 0, status: 'in_progress' },
  { id: 3, number: '79', titleUz: 'Ishdan bo\'shatishda cheklovlar', ruProgress: 100, enProgress: 50, status: 'in_progress' },
  { id: 4, number: '80', titleUz: 'Mexnat shartnomasi muddatining uzaytirilishi', ruProgress: 100, enProgress: 100, status: 'completed' },
  { id: 5, number: '81', titleUz: 'Ish vaqti normasi', ruProgress: 100, enProgress: 100, status: 'completed' },
  { id: 6, number: '82', titleUz: 'Qisqartirilgan ish vaqti', ruProgress: 0, enProgress: 0, status: 'needs_translation' },
];

// Progress bar component
function ProgressBar({ progress, label }: { progress: number; label: string }) {
  const getColor = () => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 50) return 'bg-red-500';
    if (progress < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function TranslationsPage({ params: { locale } }: TranslationsPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [activeTab, setActiveTab] = useState<'all' | 'needs_translation' | 'in_progress' | 'completed'>('needs_translation');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Translation form state
  const [translationRu, setTranslationRu] = useState('');
  const [translationEn, setTranslationEn] = useState('');
  const [originalText, setOriginalText] = useState('');
  
  // Load articles from API
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetArticles(locale as Locale);
      // Calculate translation progress for each article
      const articlesWithProgress = data.map((article: any) => {
        const hasRu = article.translations?.ru?.content || article.content?.ru;
        const hasEn = article.translations?.en?.content || article.content?.en;
        const hasUz = article.translations?.uz?.content || article.content?.uz;
        
        const ruProgress = hasRu ? 100 : 0;
        const enProgress = hasEn ? 100 : 0;
        
        let status = 'needs_translation';
        if (ruProgress === 100 && enProgress === 100) {
          status = 'completed';
        } else if (ruProgress > 0 || enProgress > 0) {
          status = 'in_progress';
        }
        
        return {
          id: article.id,
          number: article.article_number || article.number || String(article.id),
          titleUz: article.translations?.uz?.title || article.title?.uz || article.title || 'Без названия',
          contentUz: article.translations?.uz?.content || article.content?.uz || '',
          contentRu: article.translations?.ru?.content || article.content?.ru || '',
          contentEn: article.translations?.en?.content || article.content?.en || '',
          ruProgress,
          enProgress,
          status,
        };
      });
      setArticles(articlesWithProgress);
    } catch (err) {
      console.error('Error loading articles:', err);
      // Fallback to mock data if API fails
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  }, [locale]);
  
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);
  
  // When article is selected, populate translation fields
  useEffect(() => {
    if (selectedArticle) {
      setOriginalText(selectedArticle.contentUz || '');
      setTranslationRu(selectedArticle.contentRu || '');
      setTranslationEn(selectedArticle.contentEn || '');
    }
  }, [selectedArticle]);
  
  // Save translation
  const handleSave = async () => {
    if (!selectedArticle) return;
    
    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/admin/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          translations: {
            uz: { content: originalText },
            ru: { content: translationRu },
            en: { content: translationEn },
          },
        }),
      });
      
      if (response.ok) {
        alert(locale === 'ru' ? 'Перевод сохранён!' : locale === 'en' ? 'Translation saved!' : 'Tarjima saqlandi!');
        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === selectedArticle.id 
            ? { 
                ...a, 
                contentRu: translationRu, 
                contentEn: translationEn,
                ruProgress: translationRu ? 100 : 0,
                enProgress: translationEn ? 100 : 0,
                status: translationRu && translationEn ? 'completed' : (translationRu || translationEn ? 'in_progress' : 'needs_translation'),
              } 
            : a
        ));
      } else {
        const data = await response.json();
        alert(data.message || 'Error saving translation');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(locale === 'ru' ? 'Ошибка сохранения' : locale === 'en' ? 'Save error' : 'Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };
  
  // Complete translation
  const handleComplete = async () => {
    if (!selectedArticle) return;
    
    // Check if both translations are filled
    if (!translationRu.trim() || !translationEn.trim()) {
      alert(locale === 'ru' ? 'Заполните оба перевода!' : locale === 'en' ? 'Fill in both translations!' : 'Ikkala tarjimani to\'ldiring!');
      return;
    }
    
    await handleSave();
    setSelectedArticle(null);
    await loadArticles();
  };

  const filteredArticles = articles.filter(article => {
    const matchesTab = activeTab === 'all' || article.status === activeTab;
    const matchesSearch = article.number.includes(searchQuery) || 
                          article.titleUz.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    needs_translation: articles.filter(a => a.status === 'needs_translation').length,
    in_progress: articles.filter(a => a.status === 'in_progress').length,
    completed: articles.filter(a => a.status === 'completed').length,
    all: articles.length,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      needs_translation: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
    };
    const icons: Record<string, any> = {
      needs_translation: AlertCircle,
      in_progress: Clock,
      completed: CheckCircle,
    };
    const labels: Record<string, string> = {
      needs_translation: t.needsTranslation,
      in_progress: t.inProgress,
      completed: t.completed,
    };
    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {labels[status]}
      </span>
    );
  };

  if (selectedArticle) {
    return (
      <RoleGuard allowedRoles={['admin', 'tarjimon']}>
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            disabled={saving}
          >
            ← {t.back}
          </button>

          {/* Article info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-lg font-medium">
                {selectedArticle.number}-modda
              </span>
              <h1 className="text-xl font-bold text-gray-900">{selectedArticle.titleUz}</h1>
            </div>
          </div>

          {/* Translation interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original text */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-primary-600" />
                {t.originalText}
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {originalText || selectedArticle.contentUz || 'Контент отсутствует'}
                </p>
              </div>
            </div>

            {/* Translation fields */}
            <div className="space-y-6">
              {/* Russian translation */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  {t.translationRu}
                </h2>
                <textarea
                  rows={8}
                  value={translationRu}
                  onChange={(e) => setTranslationRu(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Введите перевод на русский язык..."
                  disabled={saving}
                />
              </div>

              {/* English translation */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  {t.translationEn}
                </h2>
                <textarea
                  rows={8}
                  value={translationEn}
                  onChange={(e) => setTranslationEn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter English translation..."
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.save}
            </button>
            <button 
              onClick={handleComplete}
              disabled={saving}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.complete}
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'tarjimon']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-gray-500">{locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...'}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'tarjimon']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex gap-1 flex-wrap">
          {[
            { key: 'needs_translation', label: t.needsTranslation },
            { key: 'in_progress', label: t.inProgress },
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
                  : tab.key === 'needs_translation'
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

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.articleNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.titleUz}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    {t.russianProgress}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    {t.englishProgress}
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
                        <span className="text-sm text-gray-900">{article.titleUz}</span>
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar progress={article.ruProgress} label="RU" />
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar progress={article.enProgress} label="EN" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedArticle(article)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          {article.status === 'needs_translation' ? t.translate : 
                           article.status === 'in_progress' ? t.continue : t.view}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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

