'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Send,
  FileText,
  Globe,
  MessageSquare,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminGetSections, adminCreateArticle } from '@/lib/api';
import type { Locale } from '@/types';

interface CreateArticlePageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    title: 'Yangi modda yaratish',
    back: 'Orqaga',
    basicInfo: 'Asosiy ma\'lumotlar',
    articleNumber: 'Modda raqami',
    articleNumberPlaceholder: 'Masalan: 77, 81-1',
    section: 'Bo\'lim',
    selectSection: 'Bo\'limni tanlang',
    chapter: 'Bob',
    selectChapter: 'Bobni tanlang',
    order: 'Tartib raqami',
    isActive: 'Faol',
    contentUz: 'Kontent (O\'zbekcha)',
    contentRu: 'Kontent (Ruscha)',
    contentEn: 'Kontent (Inglizcha)',
    titleLabel: 'Sarlavha',
    titlePlaceholder: 'Modda sarlavhasini kiriting...',
    content: 'Mazmuni',
    contentPlaceholder: 'Modda mazmunini kiriting...',
    summary: 'Qisqacha mazmuni',
    summaryPlaceholder: 'Qisqacha mazmunini kiriting...',
    keywords: 'Kalit so\'zlar',
    keywordsPlaceholder: 'Kalit so\'zlarni vergul bilan ajrating...',
    save: 'Saqlash',
    saveDraft: 'Qoralama sifatida saqlash',
    publish: 'Chop etish',
    cancel: 'Bekor qilish',
    loading: 'Yuklanmoqda...',
    saving: 'Saqlanmoqda...',
    error: 'Xatolik yuz berdi',
    success: 'Modda muvaffaqiyatli yaratildi',
  },
  ru: {
    title: 'Создать статью',
    back: 'Назад',
    basicInfo: 'Основная информация',
    articleNumber: 'Номер статьи',
    articleNumberPlaceholder: 'Например: 77, 81-1',
    section: 'Раздел',
    selectSection: 'Выберите раздел',
    chapter: 'Глава',
    selectChapter: 'Выберите главу',
    order: 'Порядковый номер',
    isActive: 'Активна',
    contentUz: 'Контент (Узбекский)',
    contentRu: 'Контент (Русский)',
    contentEn: 'Контент (Английский)',
    titleLabel: 'Название',
    titlePlaceholder: 'Введите название статьи...',
    content: 'Содержание',
    contentPlaceholder: 'Введите содержание статьи...',
    summary: 'Краткое содержание',
    summaryPlaceholder: 'Введите краткое содержание...',
    keywords: 'Ключевые слова',
    keywordsPlaceholder: 'Разделите ключевые слова запятыми...',
    save: 'Сохранить',
    saveDraft: 'Сохранить как черновик',
    publish: 'Опубликовать',
    cancel: 'Отмена',
    loading: 'Загрузка...',
    saving: 'Сохранение...',
    error: 'Произошла ошибка',
    success: 'Статья успешно создана',
  },
  en: {
    title: 'Create Article',
    back: 'Back',
    basicInfo: 'Basic Information',
    articleNumber: 'Article Number',
    articleNumberPlaceholder: 'E.g.: 77, 81-1',
    section: 'Section',
    selectSection: 'Select section',
    chapter: 'Chapter',
    selectChapter: 'Select chapter',
    order: 'Order',
    isActive: 'Active',
    contentUz: 'Content (Uzbek)',
    contentRu: 'Content (Russian)',
    contentEn: 'Content (English)',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter article title...',
    content: 'Content',
    contentPlaceholder: 'Enter article content...',
    summary: 'Summary',
    summaryPlaceholder: 'Enter brief summary...',
    keywords: 'Keywords',
    keywordsPlaceholder: 'Separate keywords with commas...',
    save: 'Save',
    saveDraft: 'Save as Draft',
    publish: 'Publish',
    cancel: 'Cancel',
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'An error occurred',
    success: 'Article created successfully',
  },
};

export default function CreateArticlePage({ params: { locale } }: CreateArticlePageProps) {
  const router = useRouter();
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'uz' | 'ru' | 'en'>('uz');
  const [formData, setFormData] = useState({
    articleNumber: '',
    sectionId: '',
    chapterId: '',
    order: '',
    isActive: true,
    uz: { title: '', content: '', summary: '', keywords: '' },
    ru: { title: '', content: '', summary: '', keywords: '' },
    en: { title: '', content: '', summary: '', keywords: '' },
  });

  // Load sections and chapters from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await adminGetSections(locale as Locale);
        setSections(data);
      } catch (err) {
        console.error('Error loading sections:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [locale]);

  // Get chapters for selected section
  const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId));
  const chapters = selectedSection?.chapters || [];

  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (!formData.articleNumber || !formData.chapterId || !formData.uz.title || !formData.uz.content) {
      setError(t.error);
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      // Build translations object
      const translations: any = {
        uz: {
          title: formData.uz.title,
          content: formData.uz.content,
          summary: formData.uz.summary || undefined,
          keywords: formData.uz.keywords ? formData.uz.keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined,
        },
      };
      
      // Add Russian translation if provided
      if (formData.ru.title && formData.ru.content) {
        translations.ru = {
          title: formData.ru.title,
          content: formData.ru.content,
          summary: formData.ru.summary || undefined,
          keywords: formData.ru.keywords ? formData.ru.keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined,
        };
      }
      
      // Add English translation if provided
      if (formData.en.title && formData.en.content) {
        translations.en = {
          title: formData.en.title,
          content: formData.en.content,
          summary: formData.en.summary || undefined,
          keywords: formData.en.keywords ? formData.en.keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined,
        };
      }
      
      const result = await adminCreateArticle({
        chapter_id: parseInt(formData.chapterId),
        article_number: formData.articleNumber,
        order_number: parseInt(formData.order) || 1,
        is_active: action === 'publish',
        translations,
      }, locale as Locale);
      
      if (result.success) {
        router.push(`/${locale}/dashboard/articles`);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'uz', label: t.contentUz, icon: '🇺🇿' },
    { key: 'ru', label: t.contentRu, icon: '🇷🇺' },
    { key: 'en', label: t.contentEn, icon: '🇬🇧' },
  ];

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'ishchi_guruh']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'ishchi_guruh']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard/articles`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            {t.basicInfo}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.articleNumber} *
              </label>
              <input
                type="text"
                value={formData.articleNumber}
                onChange={(e) => setFormData({ ...formData, articleNumber: e.target.value })}
                placeholder={t.articleNumberPlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.section} *
              </label>
              <select
                value={formData.sectionId}
                onChange={(e) => setFormData({ ...formData, sectionId: e.target.value, chapterId: '' })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={saving}
              >
                <option value="">{t.selectSection}</option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.order_number}-bo'lim: {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.chapter} *
              </label>
              <select
                value={formData.chapterId}
                onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={!formData.sectionId || saving}
              >
                <option value="">{t.selectChapter}</option>
                {chapters.map((ch: any) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.order_number}-bob: {ch.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.order}
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                disabled={saving}
              />
              <span className="text-sm text-gray-700">{t.isActive}</span>
            </label>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                disabled={saving}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.titleLabel} *
              </label>
              <input
                type="text"
                value={formData[activeTab].title}
                onChange={(e) => setFormData({
                  ...formData,
                  [activeTab]: { ...formData[activeTab], title: e.target.value }
                })}
                placeholder={t.titlePlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.content} *
              </label>
              <textarea
                rows={10}
                value={formData[activeTab].content}
                onChange={(e) => setFormData({
                  ...formData,
                  [activeTab]: { ...formData[activeTab], content: e.target.value }
                })}
                placeholder={t.contentPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.summary}
              </label>
              <textarea
                rows={3}
                value={formData[activeTab].summary}
                onChange={(e) => setFormData({
                  ...formData,
                  [activeTab]: { ...formData[activeTab], summary: e.target.value }
                })}
                placeholder={t.summaryPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.keywords}
              </label>
              <input
                type="text"
                value={formData[activeTab].keywords}
                onChange={(e) => setFormData({
                  ...formData,
                  [activeTab]: { ...formData[activeTab], keywords: e.target.value }
                })}
                placeholder={t.keywordsPlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/${locale}/dashboard/articles`}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </Link>
          <button
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t.saving : t.saveDraft}
          </button>
          <button
            onClick={() => handleSubmit('publish')}
            className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {saving ? t.saving : t.publish}
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
