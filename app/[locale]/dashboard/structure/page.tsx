'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  GripVertical,
  Download,
  Upload,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  adminGetSections,
  adminCreateSection,
  adminUpdateSection,
  adminDeleteSection,
  adminCreateChapter,
  adminUpdateChapter,
  adminDeleteChapter,
} from '@/lib/api';
import type { Locale } from '@/types';

interface StructurePageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Kodeks tuzilmasi',
    subtitle: 'Bo\'limlar, boblar va moddalar tuzilmasini boshqarish',
    addSection: 'Yangi bo\'lim',
    addChapter: 'Yangi bob',
    addArticle: 'Yangi modda',
    exportJson: 'JSON eksport',
    importJson: 'JSON import',
    section: 'Bo\'lim',
    chapter: 'Bob',
    article: 'Modda',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    name: 'Nomi',
    number: 'Raqami',
    description: 'Tavsif',
    order: 'Tartib raqami',
    createSection: 'Yangi bo\'lim yaratish',
    createChapter: 'Yangi bob yaratish',
    editSection: 'Bo\'limni tahrirlash',
    editChapter: 'Bobni tahrirlash',
    confirmDelete: 'Rostdan ham o\'chirmoqchimisiz?',
    sectionsCount: 'bo\'lim',
    chaptersCount: 'bob',
    articlesCount: 'modda',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    noData: 'Ma\'lumot topilmadi',
    saving: 'Saqlanmoqda...',
  },
  ru: {
    title: 'Структура кодекса',
    subtitle: 'Управление структурой разделов, глав и статей',
    addSection: 'Новый раздел',
    addChapter: 'Новая глава',
    addArticle: 'Новая статья',
    exportJson: 'Экспорт JSON',
    importJson: 'Импорт JSON',
    section: 'Раздел',
    chapter: 'Глава',
    article: 'Статья',
    edit: 'Редактировать',
    delete: 'Удалить',
    save: 'Сохранить',
    cancel: 'Отмена',
    name: 'Название',
    number: 'Номер',
    description: 'Описание',
    order: 'Порядковый номер',
    createSection: 'Создать раздел',
    createChapter: 'Создать главу',
    editSection: 'Редактировать раздел',
    editChapter: 'Редактировать главу',
    confirmDelete: 'Вы уверены, что хотите удалить?',
    sectionsCount: 'разделов',
    chaptersCount: 'глав',
    articlesCount: 'статей',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    noData: 'Данные не найдены',
    saving: 'Сохранение...',
  },
  en: {
    title: 'Code Structure',
    subtitle: 'Manage structure of sections, chapters and articles',
    addSection: 'New Section',
    addChapter: 'New Chapter',
    addArticle: 'New Article',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    section: 'Section',
    chapter: 'Chapter',
    article: 'Article',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    name: 'Name',
    number: 'Number',
    description: 'Description',
    order: 'Order',
    createSection: 'Create Section',
    createChapter: 'Create Chapter',
    editSection: 'Edit Section',
    editChapter: 'Edit Chapter',
    confirmDelete: 'Are you sure you want to delete?',
    sectionsCount: 'sections',
    chaptersCount: 'chapters',
    articlesCount: 'articles',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    noData: 'No data found',
    saving: 'Saving...',
  },
};

interface TreeNodeData {
  id: number;
  type: 'section' | 'chapter' | 'article';
  number: string;
  name: string;
  description?: string;
  sectionId?: number;
  children?: TreeNodeData[];
}

// Tree Node Component
function TreeNode({ 
  node, 
  level = 0, 
  onEdit, 
  onDelete, 
  onAddChild,
  t,
}: { 
  node: TreeNodeData; 
  level?: number; 
  onEdit: (node: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
  onAddChild: (parentId: number, type: string, sectionId?: number) => void;
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  const getIcon = () => {
    if (node.type === 'article') return FileText;
    return isOpen ? FolderOpen : Folder;
  };

  const Icon = getIcon();

  const getBgColor = () => {
    switch (node.type) {
      case 'section': return 'bg-primary-50 border-primary-200';
      case 'chapter': return 'bg-green-50 border-green-200';
      case 'article': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = () => {
    switch (node.type) {
      case 'section': return 'text-primary-600';
      case 'chapter': return 'text-green-600';
      case 'article': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded-lg border ${getBgColor()} mb-1 group hover:shadow-sm transition-shadow`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Drag handle */}
        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-white/50 rounded"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Icon */}
        <Icon className={`w-5 h-5 ${getIconColor()}`} />

        {/* Label */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-900">
            {node.type === 'section' && `${node.number}-${t.section}: `}
            {node.type === 'chapter' && `${node.number}-${t.chapter}: `}
            {node.type === 'article' && `${node.number}-${t.article}: `}
            {node.name}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.type === 'section' && (
            <button
              onClick={() => onAddChild(node.id, 'chapter', node.id)}
              className="p-1.5 text-green-600 hover:bg-green-100 rounded"
              title={t.addChapter}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {node.type !== 'article' && (
            <>
              <button
                onClick={() => onEdit(node)}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                title={t.edit}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(node)}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                title={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div>
          {node.children!.map((child: TreeNodeData) => (
            <TreeNode
              key={`${child.type}-${child.id}`}
              node={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StructurePage({ params: { locale } }: StructurePageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'section' | 'chapter'>('section');
  const [editingItem, setEditingItem] = useState<TreeNodeData | null>(null);
  const [parentSectionId, setParentSectionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    number: '', 
    name: '',
    description: '' 
  });

  // Load sections from API
  const loadSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetSections(locale as Locale);
      setSections(data);
    } catch (err) {
      setError(t.error);
      console.error('Error loading sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, [locale]);

  // Transform API data to tree structure
  const treeData: TreeNodeData[] = sections.map(section => ({
    id: section.id,
    type: 'section' as const,
    number: section.order_number?.toString() || 'I',
    name: section.title,
    description: section.description,
    children: (section.chapters || []).map((chapter: any) => ({
      id: chapter.id,
      type: 'chapter' as const,
      number: chapter.order_number?.toString() || '1',
      name: chapter.title,
      description: chapter.description,
      sectionId: section.id,
      children: (chapter.articles || []).map((article: any) => ({
        id: article.id,
        type: 'article' as const,
        number: article.article_number || article.id.toString(),
        name: article.title,
      })),
    })),
  }));

  // Count totals
  const totalSections = sections.length;
  const totalChapters = sections.reduce((acc, s) => acc + (s.chapters?.length || 0), 0);
  const totalArticles = sections.reduce((acc, s) => 
    acc + (s.chapters?.reduce((acc2: number, c: any) => acc2 + (c.articles?.length || 0), 0) || 0), 0
  );

  const handleAddSection = () => {
    setEditingItem(null);
    setModalType('section');
    setParentSectionId(null);
    setFormData({ number: '', name: '', description: '' });
    setModalOpen(true);
  };

  const handleEdit = (node: TreeNodeData) => {
    setEditingItem(node);
    setModalType(node.type as 'section' | 'chapter');
    setParentSectionId(node.sectionId || null);
    setFormData({ 
      number: node.number, 
      name: node.name,
      description: node.description || '' 
    });
    setModalOpen(true);
  };

  const handleDelete = async (node: TreeNodeData) => {
    if (!confirm(t.confirmDelete)) return;
    
    setSaving(true);
    try {
      let result;
      if (node.type === 'section') {
        result = await adminDeleteSection(node.id, locale as Locale);
      } else if (node.type === 'chapter') {
        result = await adminDeleteChapter(node.id, locale as Locale);
      }
      
      if (result?.success) {
        await loadSections();
      } else {
        alert(result?.error || t.error);
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddChild = (parentId: number, type: string, sectionId?: number) => {
    setEditingItem(null);
    setModalType(type as 'section' | 'chapter');
    setParentSectionId(sectionId || parentId);
    setFormData({ number: '', name: '', description: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let result;
      
      if (modalType === 'section') {
        if (editingItem) {
          result = await adminUpdateSection(editingItem.id, {
            order_number: parseInt(formData.number) || 1,
            title: formData.name,
            description: formData.description,
          }, locale as Locale);
        } else {
          result = await adminCreateSection({
            order_number: parseInt(formData.number) || sections.length + 1,
            title: formData.name,
            description: formData.description,
          }, locale as Locale);
        }
      } else if (modalType === 'chapter') {
        if (editingItem) {
          result = await adminUpdateChapter(editingItem.id, {
            order_number: parseInt(formData.number) || 1,
            title: formData.name,
            description: formData.description,
          }, locale as Locale);
        } else if (parentSectionId) {
          result = await adminCreateChapter({
            section_id: parentSectionId,
            order_number: parseInt(formData.number) || 1,
            title: formData.name,
            description: formData.description,
          }, locale as Locale);
        }
      }
      
      if (result?.success) {
        setModalOpen(false);
        await loadSections();
      } else {
        alert(result?.error || t.error);
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(sections, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kodeks-structure.json';
    a.click();
    URL.revokeObjectURL(url);
  };

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

  if (error) {
    return (
      <RoleGuard allowedRoles={['admin', 'ishchi_guruh']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={loadSections}
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
    <RoleGuard allowedRoles={['admin', 'ishchi_guruh']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAddSection}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.addSection}
            </button>
            <button 
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              {t.exportJson}
            </button>
            <button
              onClick={loadSections}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary-700">{totalSections}</div>
            <div className="text-sm text-primary-600">{t.sectionsCount}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{totalChapters}</div>
            <div className="text-sm text-green-600">{t.chaptersCount}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">{totalArticles}</div>
            <div className="text-sm text-gray-600">{t.articlesCount}</div>
          </div>
        </div>

        {/* Tree View */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {treeData.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t.noData}</p>
              <button
                onClick={handleAddSection}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4" />
                {t.addSection}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {treeData.map(section => (
                <TreeNode
                  key={`section-${section.id}`}
                  node={section}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddChild={handleAddChild}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !saving && setModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem 
                  ? (modalType === 'section' ? t.editSection : t.editChapter)
                  : (modalType === 'section' ? t.createSection : t.createChapter)
                }
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.number}
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.description}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    disabled={saving}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    disabled={saving}
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? t.saving : t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
