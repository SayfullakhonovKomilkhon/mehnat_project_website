'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { getArticles, adminDeleteArticle, adminGetSections } from '@/lib/api';
import type { Locale, Article } from '@/types';

interface ArticlesPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Moddalar ro\'yxati',
    subtitle: 'Mehnat kodeksining barcha moddalari',
    addArticle: 'Yangi modda',
    search: 'Modda raqami yoki sarlavhasini kiriting...',
    filter: 'Filtr',
    export: 'Eksport',
    allSections: 'Barcha bo\'limlar',
    allStatuses: 'Barcha holatlar',
    published: 'Chop etilgan',
    draft: 'Qoralama',
    pending: 'Kutilmoqda',
    rejected: 'Rad etilgan',
    number: '№',
    articleNumber: 'Modda raqami',
    titleCol: 'Sarlavha',
    section: 'Bo\'lim',
    status: 'Holat',
    author: 'Muallif',
    date: 'Sana',
    actions: 'Amallar',
    view: 'Ko\'rish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    confirmDelete: 'Rostdan ham bu moddani o\'chirmoqchimisiz?',
    noResults: 'Natija topilmadi',
    showing: 'Ko\'rsatilmoqda',
    of: 'dan',
    results: 'natija',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    cancel: 'Bekor qilish',
  },
  ru: {
    title: 'Список статей',
    subtitle: 'Все статьи Трудового кодекса',
    addArticle: 'Новая статья',
    search: 'Введите номер или название статьи...',
    filter: 'Фильтр',
    export: 'Экспорт',
    allSections: 'Все разделы',
    allStatuses: 'Все статусы',
    published: 'Опубликовано',
    draft: 'Черновик',
    pending: 'На проверке',
    rejected: 'Отклонено',
    number: '№',
    articleNumber: 'Номер статьи',
    titleCol: 'Название',
    section: 'Раздел',
    status: 'Статус',
    author: 'Автор',
    date: 'Дата',
    actions: 'Действия',
    view: 'Просмотр',
    edit: 'Редактировать',
    delete: 'Удалить',
    confirmDelete: 'Вы уверены, что хотите удалить эту статью?',
    noResults: 'Результаты не найдены',
    showing: 'Показано',
    of: 'из',
    results: 'результатов',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    cancel: 'Отмена',
  },
  en: {
    title: 'Articles List',
    subtitle: 'All articles of the Labor Code',
    addArticle: 'New Article',
    search: 'Enter article number or title...',
    filter: 'Filter',
    export: 'Export',
    allSections: 'All Sections',
    allStatuses: 'All Statuses',
    published: 'Published',
    draft: 'Draft',
    pending: 'Pending',
    rejected: 'Rejected',
    number: '#',
    articleNumber: 'Article Number',
    titleCol: 'Title',
    section: 'Section',
    status: 'Status',
    author: 'Author',
    date: 'Date',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this article?',
    noResults: 'No results found',
    showing: 'Showing',
    of: 'of',
    results: 'results',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
  },
};

function getLocalizedText(content: any, locale: string): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return content[locale] || content.uz || '';
}

export default function ArticlesPage({ params: { locale } }: ArticlesPageProps) {
  const { user, checkRole } = useAuth();
  const t = translations[locale as keyof typeof translations] || translations.uz;
  const isAdmin = checkRole(['admin']);

  const [articles, setArticles] = useState<Article[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  
  const itemsPerPage = 10;

  // Load data
  const loadData = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const [articlesResult, sectionsData] = await Promise.all([
        getArticles({ page, limit: itemsPerPage }, locale as Locale),
        adminGetSections(locale as Locale),
      ]);
      
      setArticles(articlesResult.data);
      setTotalPages(articlesResult.pagination.totalPages);
      setTotalItems(articlesResult.pagination.total);
      setSections(sectionsData);
    } catch (err) {
      setError(t.error);
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [locale, currentPage]);

  // Filter articles locally
  const filteredArticles = articles.filter(article => {
    const title = getLocalizedText(article.title, locale);
    const matchesSearch = article.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const icons: Record<string, any> = {
      published: CheckCircle,
      draft: FileText,
      pending: Clock,
      rejected: XCircle,
    };
    const Icon = icons[status] || FileText;
    const label = t[status as keyof typeof t] || status;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const handleDelete = (id: number) => {
    setArticleToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    
    setSaving(true);
    try {
      const result = await adminDeleteArticle(articleToDelete, locale as Locale);
      if (result.success) {
        setDeleteModalOpen(false);
        setArticleToDelete(null);
        await loadData(currentPage);
      } else {
        alert(result.error || t.error);
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(articles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'articles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'muallif']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['admin', 'muallif']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => loadData(currentPage)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <RefreshCw className="w-4 h-4" />
              {t.retry}
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'muallif']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(currentPage)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {isAdmin && (
              <Link
                href={`/${locale}/dashboard/articles/create`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t.addArticle}
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="published">{t.published}</option>
              <option value="draft">{t.draft}</option>
              <option value="pending">{t.pending}</option>
              <option value="rejected">{t.rejected}</option>
            </select>

            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">{t.allSections}</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.order_number}-{locale === 'uz' ? "bo'lim" : locale === 'ru' ? 'раздел' : 'section'}: {section.title}
                </option>
              ))}
            </select>

            {/* Export Button */}
            {isAdmin && (
              <button 
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                {t.export}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.number}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.articleNumber}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.titleCol}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.date}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article, index) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-primary-100 text-primary-800 text-sm font-medium">
                          {article.number}-modda
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {getLocalizedText(article.title, locale)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${locale}/articles/${article.id}`}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title={t.view}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/${locale}/dashboard/articles/create?edit=${article.id}`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t.edit}
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={t.delete}
                              disabled={saving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t.showing} {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalItems)} {t.of}{' '}
                {totalItems} {t.results}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !saving && setDeleteModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.delete}
              </h3>
              <p className="text-gray-600 mb-6">{t.confirmDelete}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                  disabled={saving}
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
