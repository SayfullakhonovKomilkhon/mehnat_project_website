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
import { useAuth } from '@/context/AuthContext';
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
    inProgress: 'Tekshiruvda',
    completed: 'Tugallangan',
    pendingApproval: 'Tasdiqlash kutilmoqda',
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
    submitForReview: 'Tekshiruvga yuborish',
    approve: 'Tasdiqlash',
    reject: 'Rad etish',
    submittedSuccess: 'Tarjima tekshiruvga yuborildi!',
    approvedSuccess: 'Tarjima tasdiqlandi!',
    rejectReason: 'Rad etish sababi',
    rejectReasonPlaceholder: 'Rad etish sababini kiriting...',
    cancel: 'Bekor qilish',
    confirmReject: 'Rad etish',
    rejectSuccess: 'Tarjima rad etildi!',
  },
  ru: {
    title: 'Переводы',
    subtitle: 'Перевод статей на русский и английский языки',
    needsTranslation: 'Требует перевода',
    inProgress: 'На проверке',
    completed: 'Завершено',
    pendingApproval: 'Ожидает одобрения',
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
    submitForReview: 'Отправить на проверку',
    approve: 'Одобрить',
    reject: 'Отклонить',
    submittedSuccess: 'Перевод отправлен на проверку!',
    approvedSuccess: 'Перевод одобрен!',
    rejectReason: 'Причина отклонения',
    rejectReasonPlaceholder: 'Введите причину отклонения...',
    cancel: 'Отмена',
    confirmReject: 'Отклонить',
    rejectSuccess: 'Перевод отклонён!',
  },
  en: {
    title: 'Translations',
    subtitle: 'Translate articles to Russian and English',
    needsTranslation: 'Needs Translation',
    inProgress: 'Under Review',
    completed: 'Completed',
    pendingApproval: 'Pending Approval',
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
    submitForReview: 'Submit for Review',
    approve: 'Approve',
    reject: 'Reject',
    submittedSuccess: 'Translation submitted for review!',
    approvedSuccess: 'Translation approved!',
    rejectReason: 'Rejection Reason',
    rejectReasonPlaceholder: 'Enter rejection reason...',
    cancel: 'Cancel',
    confirmReject: 'Reject',
    rejectSuccess: 'Translation rejected!',
  },
};

// Mock articles for translation
const mockArticles = [
  { id: 1, number: '77', titleUz: 'Mehnat shartnomasini bekor qilish asoslari', contentUz: 'Mehnat shartnomasini bekor qilish asoslari quyidagilar...', contentRu: '', contentEn: '', ruProgress: 0, enProgress: 0, status: 'needs_translation', translationStatus: 'draft' },
  { id: 2, number: '78', titleUz: 'Ishdan bo\'shatish tartibi', contentUz: 'Ishdan bo\'shatish tartibi...', contentRu: 'Порядок увольнения...', contentEn: '', ruProgress: 100, enProgress: 0, status: 'in_progress', translationStatus: 'pending' },
  { id: 3, number: '79', titleUz: 'Ishdan bo\'shatishda cheklovlar', contentUz: 'Ishdan bo\'shatishda cheklovlar...', contentRu: 'Ограничения при увольнении...', contentEn: 'Restrictions on dismissal...', ruProgress: 100, enProgress: 100, status: 'in_progress', translationStatus: 'pending' },
  { id: 4, number: '80', titleUz: 'Mexnat shartnomasi muddatining uzaytirilishi', contentUz: '', contentRu: '', contentEn: '', ruProgress: 100, enProgress: 100, status: 'completed', translationStatus: 'approved' },
  { id: 5, number: '81', titleUz: 'Ish vaqti normasi', contentUz: '', contentRu: '', contentEn: '', ruProgress: 100, enProgress: 100, status: 'completed', translationStatus: 'approved' },
  { id: 6, number: '82', titleUz: 'Qisqartirilgan ish vaqti', contentUz: 'Qisqartirilgan ish vaqti...', contentRu: '', contentEn: '', ruProgress: 0, enProgress: 0, status: 'needs_translation', translationStatus: 'draft' },
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
  const { user } = useAuth();
  
  // Check if user is admin or moderator (can approve translations)
  const userRole = (user?.role as any)?.slug || user?.role?.name || 'user';
  const canApprove = userRole === 'admin' || userRole === 'moderator';
  const isTranslator = userRole === 'tarjimon';
  
  const [activeTab, setActiveTab] = useState<'all' | 'needs_translation' | 'pending' | 'completed'>(canApprove ? 'pending' : 'needs_translation');
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
  
  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Load articles from API (try admin endpoint first, fallback to public)
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try admin endpoint first
      let data = await adminGetArticles(locale as Locale);
      
      // If admin endpoint returns empty, try public endpoint
      if (!data || data.length === 0) {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/articles`, {
          headers: {
            'Accept': 'application/json',
            'Accept-Language': locale,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          data = result.data?.items || result.data || result.items || [];
        }
      }
      
      // If still no data, use mock data
      if (!data || data.length === 0) {
        console.log('No articles from API, using mock data');
        setArticles(mockArticles);
        setLoading(false);
        return;
      }
      
      // Calculate translation progress for each article
      const articlesWithProgress = data.map((article: any) => {
        const hasRu = article.translations?.ru?.content || article.content?.ru;
        const hasEn = article.translations?.en?.content || article.content?.en;
        
        const ruProgress = hasRu ? 100 : 0;
        const enProgress = hasEn ? 100 : 0;
        
        // Get translation status from API or calculate it
        let translationStatus = article.translation_status || article.translationStatus || 'draft';
        
        // If both translations exist but status is still 'draft', mark as 'pending' (needs approval)
        if (ruProgress === 100 && enProgress === 100 && translationStatus === 'draft') {
          translationStatus = 'pending';
        }
        
        // Determine display status based on translation status
        let status = 'needs_translation';
        if (translationStatus === 'approved') {
          status = 'completed';
        } else if (translationStatus === 'pending' || (ruProgress === 100 && enProgress === 100)) {
          // If pending or both translations complete - show as pending (needs approval)
          status = 'pending';
          translationStatus = 'pending';
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
          translationStatus,
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
      const token = localStorage.getItem('token');
      
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
  
  // Submit translation for review (translator action)
  const handleSubmitForReview = async () => {
    if (!selectedArticle) return;
    
    // Check if both translations are filled
    if (!translationRu.trim() || !translationEn.trim()) {
      alert(locale === 'ru' ? 'Заполните оба перевода!' : locale === 'en' ? 'Fill in both translations!' : 'Ikkala tarjimani to\'ldiring!');
      return;
    }
    
    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      // Save translations with pending status
      const response = await fetch(`${API_BASE_URL}/admin/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          translation_status: 'pending',
          translations: {
            uz: { content: originalText },
            ru: { content: translationRu },
            en: { content: translationEn },
          },
        }),
      });
      
      if (response.ok) {
        alert(t.submittedSuccess);
        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === selectedArticle.id 
            ? { 
                ...a, 
                contentRu: translationRu, 
                contentEn: translationEn,
                ruProgress: 100,
                enProgress: 100,
                status: 'in_progress',
                translationStatus: 'pending',
              } 
            : a
        ));
        setSelectedArticle(null);
      } else {
        const data = await response.json();
        alert(data.message || 'Error submitting translation');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert(locale === 'ru' ? 'Ошибка отправки' : locale === 'en' ? 'Submit error' : 'Yuborishda xatolik');
    } finally {
      setSaving(false);
    }
  };
  
  // Approve translation (admin action)
  const handleApprove = async () => {
    if (!selectedArticle) return;
    
    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          translation_status: 'approved',
        }),
      });
      
      if (response.ok) {
        alert(t.approvedSuccess);
        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === selectedArticle.id 
            ? { 
                ...a, 
                status: 'completed',
                translationStatus: 'approved',
              } 
            : a
        ));
        setSelectedArticle(null);
      } else {
        const data = await response.json();
        alert(data.message || 'Error approving translation');
      }
    } catch (err) {
      console.error('Approve error:', err);
      alert(locale === 'ru' ? 'Ошибка одобрения' : locale === 'en' ? 'Approve error' : 'Tasdiqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };
  
  // Open reject modal (admin action)
  const handleReject = () => {
    setRejectReason('');
    setRejectModalOpen(true);
  };
  
  // Submit rejection with reason (admin action) - sends back to translator
  const submitReject = async () => {
    if (!selectedArticle) return;
    
    if (!rejectReason.trim()) {
      alert(locale === 'ru' ? 'Введите причину отклонения' : locale === 'en' ? 'Enter rejection reason' : 'Rad etish sababini kiriting');
      return;
    }
    
    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          translation_status: 'draft',
          rejection_reason: rejectReason,
        }),
      });
      
      if (response.ok) {
        alert(t.rejectSuccess);
        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === selectedArticle.id 
            ? { 
                ...a, 
                status: 'needs_translation',
                translationStatus: 'draft',
              } 
            : a
        ));
        setSelectedArticle(null);
        setRejectModalOpen(false);
        setRejectReason('');
      } else {
        const data = await response.json();
        alert(data.message || 'Error rejecting translation');
      }
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setSaving(false);
    }
  };
  
  // Complete translation (legacy - for backwards compatibility)
  const handleComplete = async () => {
    if (canApprove) {
      await handleApprove();
    } else {
      await handleSubmitForReview();
    }
  };
  
  // Approve from list (without opening article detail)
  const handleApproveFromList = async (articleId: number) => {
    if (!confirm(locale === 'ru' ? 'Одобрить этот перевод?' : locale === 'en' ? 'Approve this translation?' : 'Ushbu tarjimani tasdiqlaysizmi?')) {
      return;
    }
    
    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          translation_status: 'approved',
        }),
      });
      
      if (response.ok) {
        alert(t.approvedSuccess);
        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === articleId 
            ? { ...a, status: 'completed', translationStatus: 'approved' } 
            : a
        ));
      } else {
        const data = await response.json();
        alert(data.message || 'Error approving translation');
      }
    } catch (err) {
      console.error('Approve error:', err);
      alert(locale === 'ru' ? 'Ошибка одобрения' : locale === 'en' ? 'Approve error' : 'Tasdiqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };
  
  // Reject from list (without opening article detail)
  const handleRejectFromList = async (articleId: number) => {
    if (!confirm(locale === 'ru' ? 'Отклонить этот перевод?' : locale === 'en' ? 'Reject this translation?' : 'Ushbu tarjimani rad etasizmi?')) {
      return;
    }
    
    setSaving(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': locale,
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          translation_status: 'draft',
        }),
      });
      
      if (response.ok) {
        alert(locale === 'ru' ? 'Перевод отклонён' : locale === 'en' ? 'Translation rejected' : 'Tarjima rad etildi');
        // Update local state
        setArticles(prev => prev.map(a => 
          a.id === articleId 
            ? { ...a, status: 'needs_translation', translationStatus: 'draft' } 
            : a
        ));
      } else {
        const data = await response.json();
        alert(data.message || 'Error rejecting translation');
      }
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    let matchesTab = activeTab === 'all';
    if (activeTab === 'pending') {
      // Show all articles with translationStatus === 'pending' (submitted for review)
      matchesTab = article.translationStatus === 'pending';
    } else if (activeTab === 'needs_translation') {
      // Show articles that need translation (not pending, not completed)
      matchesTab = article.status === 'needs_translation' || 
                   (article.status === 'in_progress' && article.translationStatus !== 'pending');
    } else if (activeTab === 'completed') {
      matchesTab = article.status === 'completed';
    }
    const matchesSearch = article.number.includes(searchQuery) || 
                          article.titleUz.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    // Needs translation includes both needs_translation and in_progress (not pending)
    needs_translation: articles.filter(a => 
      a.status === 'needs_translation' || 
      (a.status === 'in_progress' && a.translationStatus !== 'pending')
    ).length,
    pending: articles.filter(a => a.translationStatus === 'pending').length,
    completed: articles.filter(a => a.status === 'completed').length,
    all: articles.length,
  };

  const getStatusBadge = (status: string, translationStatus?: string) => {
    // If translation is pending approval, show pending badge
    let effectiveStatus = translationStatus === 'pending' ? 'pending' : status;
    // Treat in_progress as needs_translation for display
    if (effectiveStatus === 'in_progress') effectiveStatus = 'needs_translation';
    
    const styles: Record<string, string> = {
      needs_translation: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
    };
    const icons: Record<string, any> = {
      needs_translation: Clock,
      pending: Clock,
      completed: CheckCircle,
    };
    const labels: Record<string, string> = {
      needs_translation: t.needsTranslation,
      pending: t.pendingApproval,
      completed: t.completed,
    };
    const Icon = icons[effectiveStatus] || Clock;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[effectiveStatus] || styles.needs_translation}`}>
        <Icon className="w-3 h-3" />
        {labels[effectiveStatus] || effectiveStatus}
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
            {/* Save button - available to all */}
            {/* For translators only: Save button */}
            {isTranslator && (
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.save}
              </button>
            )}
            
            {/* For translators: Submit for review button */}
            {isTranslator && selectedArticle.translationStatus !== 'pending' && (
              <button 
                onClick={handleSubmitForReview}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.submitForReview}
              </button>
            )}
            
            {/* For translators: Show pending status if already submitted */}
            {isTranslator && selectedArticle.translationStatus === 'pending' && (
              <span className="px-6 py-2.5 bg-yellow-100 text-yellow-800 rounded-lg inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t.pendingApproval}
              </span>
            )}
            
            {/* For admins: Reject button (always visible when viewing translations) */}
            {canApprove && (
              <button 
                onClick={handleReject}
                disabled={saving}
                className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {t.reject}
              </button>
            )}
            
            {/* For admins: Approve button when pending */}
            {canApprove && selectedArticle.translationStatus === 'pending' && (
              <button 
                onClick={handleApprove}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.approve}
              </button>
            )}
            
            {/* For admins: Complete button if not pending (to approve directly) */}
            {canApprove && selectedArticle.translationStatus !== 'pending' && (
              <button 
                onClick={handleComplete}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.complete}
              </button>
            )}
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
            ...(canApprove ? [{ key: 'pending', label: t.pendingApproval, highlight: true }] : []),
            { key: 'needs_translation', label: t.needsTranslation },
            { key: 'completed', label: t.completed },
            { key: 'all', label: t.all },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? tab.key === 'pending' ? 'bg-orange-600 text-white' : 'bg-primary-600 text-white'
                  : tab.key === 'pending' && counts.pending > 0
                  ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.key === 'needs_translation'
                  ? 'bg-red-100 text-red-700'
                  : tab.key === 'pending'
                  ? 'bg-orange-100 text-orange-700'
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
                        {getStatusBadge(article.status, article.translationStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Approve/Reject buttons for admin on pending items */}
                          {canApprove && article.translationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveFromList(article.id)}
                                disabled={saving}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {t.approve}
                              </button>
                              <button
                                onClick={() => handleRejectFromList(article.id)}
                                disabled={saving}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                <AlertCircle className="w-4 h-4" />
                                {t.reject}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            {article.translationStatus === 'pending' || article.status === 'completed' 
                              ? t.view 
                              : t.translate}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.rejectReason}
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t.rejectReasonPlaceholder}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectReason('');
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={submitReject}
                  disabled={saving || !rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t.confirmReject}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

