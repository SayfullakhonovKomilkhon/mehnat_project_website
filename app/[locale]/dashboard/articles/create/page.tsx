'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  ImagePlus,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import {
  adminGetSections,
  adminCreateArticle,
  adminGetArticle,
  adminUpdateArticle,
  adminUploadArticleImages,
} from '@/lib/api';
import type { Locale } from '@/types';

interface CreateArticlePageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    title: 'Yangi modda yaratish',
    editTitle: 'Moddani tahrirlash',
    back: 'Orqaga',
    basicInfo: "Asosiy ma'lumotlar",
    articleNumber: 'Modda raqami',
    articleNumberPlaceholder: 'Masalan: 77, 81-1',
    section: "Bo'lim",
    selectSection: "Bo'limni tanlang",
    chapter: 'Bob',
    selectChapter: 'Bobni tanlang',
    order: 'Tartib raqami',
    isActive: 'Faol',
    contentUz: "Kontent (O'zbekcha)",
    contentRu: 'Kontent (Ruscha)',
    contentEn: 'Kontent (Inglizcha)',
    titleLabel: 'Sarlavha',
    titlePlaceholder: 'Modda sarlavhasini kiriting...',
    content: 'Mazmuni',
    contentPlaceholder: 'Modda mazmunini kiriting...',
    summary: 'Qisqacha mazmuni',
    summaryPlaceholder: 'Qisqacha mazmunini kiriting...',
    keywords: "Kalit so'zlar",
    keywordsPlaceholder: "Kalit so'zlarni vergul bilan ajrating...",
    comment: 'Sharh',
    commentPlaceholder: 'Moddaga sharh kiriting (ixtiyoriy)...',
    commentSection: 'Sharh',
    save: 'Saqlash',
    saveDraft: 'Qoralama sifatida saqlash',
    publish: 'Chop etish',
    cancel: 'Bekor qilish',
    loading: 'Yuklanmoqda...',
    saving: 'Saqlanmoqda...',
    error: 'Xatolik yuz berdi',
    success: 'Modda muvaffaqiyatli yaratildi',
    successEdit: 'Modda muvaffaqiyatli tahrirlandi',
    pendingModeration: 'Modda moderatsiyaga yuborildi. Admin tasdiqlashini kuting.',
    submitForReview: 'Tekshirishga yuborish',
    update: 'Yangilash',
    images: 'Rasmlar',
    imagesDescription: "Moddaga rasmlar qo'shing (ixtiyoriy)",
    addImages: "Rasm qo'shish",
    dragDrop: 'Rasmlarni bu yerga tashlang yoki',
    browse: 'tanlang',
    maxSize: "Maksimal o'lcham: 5MB. Formatlar: JPG, PNG, GIF",
    removeImage: "Rasmni o'chirish",
  },
  ru: {
    title: 'Создать статью',
    editTitle: 'Редактировать статью',
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
    comment: 'Комментарий',
    commentPlaceholder: 'Введите комментарий к статье (необязательно)...',
    commentSection: 'Комментарий',
    save: 'Сохранить',
    saveDraft: 'Сохранить как черновик',
    publish: 'Опубликовать',
    cancel: 'Отмена',
    loading: 'Загрузка...',
    saving: 'Сохранение...',
    error: 'Произошла ошибка',
    success: 'Статья успешно создана',
    successEdit: 'Статья успешно обновлена',
    pendingModeration: 'Статья отправлена на модерацию. Ожидайте подтверждения администратора.',
    submitForReview: 'Отправить на проверку',
    update: 'Обновить',
    images: 'Изображения',
    imagesDescription: 'Добавьте изображения к статье (необязательно)',
    addImages: 'Добавить изображения',
    dragDrop: 'Перетащите изображения сюда или',
    browse: 'выберите',
    maxSize: 'Максимальный размер: 5MB. Форматы: JPG, PNG, GIF',
    removeImage: 'Удалить изображение',
  },
  en: {
    title: 'Create Article',
    editTitle: 'Edit Article',
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
    comment: 'Comment',
    commentPlaceholder: 'Enter comment for this article (optional)...',
    commentSection: 'Commentary',
    save: 'Save',
    saveDraft: 'Save as Draft',
    publish: 'Publish',
    cancel: 'Cancel',
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'An error occurred',
    success: 'Article created successfully',
    successEdit: 'Article updated successfully',
    pendingModeration: 'Article submitted for moderation. Wait for admin approval.',
    submitForReview: 'Submit for Review',
    update: 'Update',
    images: 'Images',
    imagesDescription: 'Add images to the article (optional)',
    addImages: 'Add images',
    dragDrop: 'Drag and drop images here or',
    browse: 'browse',
    maxSize: 'Max size: 5MB. Formats: JPG, PNG, GIF',
    removeImage: 'Remove image',
  },
};

export default function CreateArticlePage({ params: { locale } }: CreateArticlePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const t = translations[locale as keyof typeof translations] || translations.uz;

  // Check if user is admin or moderator (can publish directly)
  const userRole = user?.role?.name;
  const canPublishDirectly = userRole === 'admin' || userRole === 'moderator';

  // Get pre-filled values from URL params
  const urlChapterId = searchParams.get('chapter');
  const urlSectionId = searchParams.get('section');
  const editId = searchParams.get('edit'); // ID of article to edit
  const isEditMode = Boolean(editId);
  const fromStructure = urlChapterId && urlSectionId; // Came from structure page

  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [articleLoaded, setArticleLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');
  const [formData, setFormData] = useState({
    articleNumber: '',
    sectionId: urlSectionId || '',
    chapterId: urlChapterId || '',
    order: '',
    isActive: true,
    uz: { title: '', content: '', summary: '', keywords: '' },
    ru: { title: '', content: '', summary: '', keywords: '' },
    comment: { uz: '', ru: '' },
  });

  // Images state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);

  // Load sections and chapters from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await adminGetSections(locale as Locale);
        setSections(data);

        // Pre-fill section and chapter if provided in URL
        if (urlSectionId && urlChapterId) {
          setFormData(prev => ({
            ...prev,
            sectionId: urlSectionId,
            chapterId: urlChapterId,
          }));
        }

        // Load existing article if in edit mode
        if (isEditMode && editId && !articleLoaded) {
          const article = await adminGetArticle(parseInt(editId), locale as Locale);
          if (article) {
            // Extract translations
            const translations = article.translations_data || {};
            const uzTrans = translations.uz || {};
            const ruTrans = translations.ru || {};

            // Find section ID from chapter
            let sectionId = '';
            if (article.chapter?.section_id) {
              sectionId = String(article.chapter.section_id);
            } else if (article.chapter?.section?.id) {
              sectionId = String(article.chapter.section.id);
            } else {
              // Find section by chapter from loaded sections
              for (const section of data) {
                const foundChapter = section.chapters?.find(
                  (ch: any) => ch.id === article.chapter_id
                );
                if (foundChapter) {
                  sectionId = String(section.id);
                  break;
                }
              }
            }

            // Get comment data
            const articleComment = article.article_comment || {};

            setFormData({
              articleNumber: article.article_number || '',
              sectionId: sectionId,
              chapterId: String(article.chapter_id || ''),
              order: String(article.order_number || ''),
              isActive: article.is_active ?? true,
              uz: {
                title: uzTrans.title || article.title?.uz || '',
                content: uzTrans.content || article.content?.uz || '',
                summary: uzTrans.summary || '',
                keywords: Array.isArray(uzTrans.keywords) ? uzTrans.keywords.join(', ') : '',
              },
              ru: {
                title: ruTrans.title || article.title?.ru || '',
                content: ruTrans.content || article.content?.ru || '',
                summary: ruTrans.summary || '',
                keywords: Array.isArray(ruTrans.keywords) ? ruTrans.keywords.join(', ') : '',
              },
              comment: {
                uz: articleComment.comment_uz || '',
                ru: articleComment.comment_ru || '',
              },
            });

            // Load existing images
            if (article.images && Array.isArray(article.images)) {
              setExistingImages(
                article.images.map((img: any) => ({
                  id: img.id,
                  url: img.url,
                }))
              );
            }

            setArticleLoaded(true);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [locale, urlSectionId, urlChapterId, isEditMode, editId, articleLoaded, t.error]);

  // Get chapters for selected section
  const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId));
  const chapters = selectedSection?.chapters || [];

  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (
      !formData.articleNumber ||
      !formData.chapterId ||
      !formData.uz.title ||
      !formData.uz.content
    ) {
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
          keywords: formData.uz.keywords
            ? formData.uz.keywords
                .split(',')
                .map(k => k.trim())
                .filter(Boolean)
            : undefined,
        },
      };

      // Add Russian translation if provided
      if (formData.ru.title && formData.ru.content) {
        translations.ru = {
          title: formData.ru.title,
          content: formData.ru.content,
          summary: formData.ru.summary || undefined,
          keywords: formData.ru.keywords
            ? formData.ru.keywords
                .split(',')
                .map(k => k.trim())
                .filter(Boolean)
            : undefined,
        };
      }

      // Add English translation if provided
      // Build comment object if any language has content
      const hasComment = formData.comment.uz || formData.comment.ru;
      const comment = hasComment
        ? {
            uz: formData.comment.uz || undefined,
            ru: formData.comment.ru || undefined,
          }
        : undefined;

      let result;

      if (isEditMode && editId) {
        // Update existing article
        result = await adminUpdateArticle(
          parseInt(editId),
          {
            chapter_id: parseInt(formData.chapterId),
            article_number: formData.articleNumber,
            order_number: parseInt(formData.order) || 1,
            is_active: action === 'publish',
            translations,
            comment,
          },
          locale as Locale
        );
      } else {
        // Create new article
        result = await adminCreateArticle(
          {
            chapter_id: parseInt(formData.chapterId),
            article_number: formData.articleNumber,
            order_number: parseInt(formData.order) || 1,
            is_active: action === 'publish',
            translations,
            comment,
          },
          locale as Locale
        );
      }

      if (result.success) {
        // Upload images if any
        const articleId = isEditMode ? parseInt(editId!) : result.data?.id;
        if (articleId && images.length > 0) {
          await adminUploadArticleImages(articleId, images, locale as Locale);
        }

        // Show success message
        setSuccessMessage(
          isEditMode ? t.successEdit : !canPublishDirectly ? t.pendingModeration : t.success
        );
        // Wait a bit before redirecting so user sees the message
        setTimeout(() => {
          router.push(
            fromStructure ? `/${locale}/dashboard/structure` : `/${locale}/dashboard/articles`
          );
        }, 1500);
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
  ];

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'muallif', 'ishchi_guruh']}>
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
    <RoleGuard allowedRoles={['admin', 'muallif', 'ishchi_guruh']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={
                fromStructure ? `/${locale}/dashboard/structure` : `/${locale}/dashboard/articles`
              }
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? t.editTitle : t.title}
            </h1>
          </div>
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

        {/* Moderation Notice for non-admin users */}
        {!canPublishDirectly && (
          <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <Clock className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800">{t.pendingModeration.split('.')[0]}.</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5 text-primary-600" />
            {t.basicInfo}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t.articleNumber} *
              </label>
              <input
                type="text"
                value={formData.articleNumber}
                onChange={e => setFormData({ ...formData, articleNumber: e.target.value })}
                placeholder={t.articleNumberPlaceholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t.section} *</label>
              <select
                value={formData.sectionId}
                onChange={e =>
                  setFormData({ ...formData, sectionId: e.target.value, chapterId: '' })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label className="mb-1 block text-sm font-medium text-gray-700">{t.chapter} *</label>
              <select
                value={formData.chapterId}
                onChange={e => setFormData({ ...formData, chapterId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label className="mb-1 block text-sm font-medium text-gray-700">{t.order}</label>
              <input
                type="number"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                disabled={saving}
              />
              <span className="text-sm text-gray-700">{t.isActive}</span>
            </label>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-primary-600 bg-primary-50 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                disabled={saving}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4 p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t.titleLabel} *
              </label>
              <input
                type="text"
                value={formData[activeTab].title}
                onChange={e =>
                  setFormData({
                    ...formData,
                    [activeTab]: { ...formData[activeTab], title: e.target.value },
                  })
                }
                placeholder={t.titlePlaceholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t.content} *</label>
              <textarea
                rows={10}
                value={formData[activeTab].content}
                onChange={e =>
                  setFormData({
                    ...formData,
                    [activeTab]: { ...formData[activeTab], content: e.target.value },
                  })
                }
                placeholder={t.contentPlaceholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t.summary}</label>
              <textarea
                rows={3}
                value={formData[activeTab].summary}
                onChange={e =>
                  setFormData({
                    ...formData,
                    [activeTab]: { ...formData[activeTab], summary: e.target.value },
                  })
                }
                placeholder={t.summaryPlaceholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t.keywords}</label>
              <input
                type="text"
                value={formData[activeTab].keywords}
                onChange={e =>
                  setFormData({
                    ...formData,
                    [activeTab]: { ...formData[activeTab], keywords: e.target.value },
                  })
                }
                placeholder={t.keywordsPlaceholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            {t.commentSection}
          </h2>

          {/* Comment Tabs */}
          <div className="mb-4 flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={`comment-${tab.key}`}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={saving}
              >
                <span>{tab.icon}</span>
                {tab.label
                  .replace('Kontent', t.comment)
                  .replace('Контент', t.comment)
                  .replace('Content', t.comment)}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t.comment} ({activeTab.toUpperCase()})
            </label>
            <textarea
              rows={6}
              value={formData.comment[activeTab]}
              onChange={e =>
                setFormData({
                  ...formData,
                  comment: { ...formData.comment, [activeTab]: e.target.value },
                })
              }
              placeholder={t.commentPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={saving}
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ImageIcon className="h-5 w-5 text-primary-600" />
            {t.images}
          </h2>
          <p className="mb-4 text-sm text-gray-500">{t.imagesDescription}</p>

          {/* Image Upload Area */}
          <div
            className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary-400"
            onDragOver={e => {
              e.preventDefault();
              e.currentTarget.classList.add('border-primary-500', 'bg-primary-50');
            }}
            onDragLeave={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50');
            }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50');
              const files = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
              );
              if (files.length > 0) {
                setImages(prev => [...prev, ...files]);
                files.forEach(file => {
                  const reader = new FileReader();
                  reader.onload = e => {
                    setImagePreviews(prev => [...prev, e.target?.result as string]);
                  };
                  reader.readAsDataURL(file);
                });
              }
            }}
          >
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={e => {
                const files = Array.from(e.target.files || []).filter(
                  file => file.size <= 5 * 1024 * 1024
                );
                if (files.length > 0) {
                  setImages(prev => [...prev, ...files]);
                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = e => {
                      setImagePreviews(prev => [...prev, e.target?.result as string]);
                    };
                    reader.readAsDataURL(file);
                  });
                }
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={saving}
            />
            <div className="flex flex-col items-center justify-center text-center">
              <ImagePlus className="mb-3 h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                {t.dragDrop} <span className="font-medium text-primary-600">{t.browse}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">{t.maxSize}</p>
            </div>
          </div>

          {/* Image Previews */}
          {(imagePreviews.length > 0 || existingImages.length > 0) && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {/* Existing Images */}
              {existingImages.map((img, index) => (
                <div
                  key={`existing-${img.id}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <img
                    src={img.url}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setExistingImages(prev => prev.filter(i => i.id !== img.id))}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title={t.removeImage}
                    disabled={saving}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {/* New Images */}
              {imagePreviews.map((preview, index) => (
                <div
                  key={`new-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImages(prev => prev.filter((_, i) => i !== index));
                      setImagePreviews(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title={t.removeImage}
                    disabled={saving}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={
              fromStructure ? `/${locale}/dashboard/structure` : `/${locale}/dashboard/articles`
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 transition-colors hover:bg-gray-50"
          >
            {t.cancel}
          </Link>

          {canPublishDirectly ? (
            <>
              <button
                onClick={() => handleSubmit('draft')}
                className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? t.saving : t.saveDraft}
              </button>
              <button
                onClick={() => handleSubmit('publish')}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {saving ? t.saving : isEditMode ? t.update : t.publish}
              </button>
            </>
          ) : (
            <button
              onClick={() => handleSubmit('publish')}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              {saving ? t.saving : t.submitForReview}
            </button>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
