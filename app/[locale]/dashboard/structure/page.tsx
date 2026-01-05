'use client';

import { useState, useEffect, useCallback } from 'react';
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
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  useDroppable,
  rectIntersection,
  pointerWithin,
  getFirstCollision,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    subtitle: "Bo'limlar, boblar va moddalar tuzilmasini boshqarish",
    addSection: "Yangi bo'lim",
    addChapter: 'Yangi bob',
    addArticle: 'Yangi modda',
    exportJson: 'JSON eksport',
    importJson: 'JSON import',
    section: "Bo'lim",
    chapter: 'Bob',
    article: 'Modda',
    edit: 'Tahrirlash',
    delete: "O'chirish",
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    name: 'Nomi',
    number: 'Raqami',
    description: 'Tavsif',
    order: 'Tartib raqami',
    createSection: "Yangi bo'lim yaratish",
    createChapter: 'Yangi bob yaratish',
    editSection: "Bo'limni tahrirlash",
    editChapter: 'Bobni tahrirlash',
    confirmDelete: "Rostdan ham o'chirmoqchimisiz?",
    sectionsCount: "bo'lim",
    chaptersCount: 'bob',
    articlesCount: 'modda',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    noData: "Ma'lumot topilmadi",
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

// Sortable Chapter Item with Articles
function SortableChapter({
  node,
  level,
  onEdit,
  onDelete,
  onAddArticle,
  locale,
  t,
}: {
  node: TreeNodeData;
  level: number;
  onEdit: (node: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
  onAddArticle: (chapterId: number, sectionId: number) => void;
  locale: string;
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState<TreeNodeData[]>(node.children || []);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const hasArticles = articles.length > 0;

  // Load articles when chapter is expanded
  const handleToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Load articles from API if not already loaded and chapter is being opened
    if (newIsOpen && articles.length === 0 && !loadingArticles) {
      setLoadingArticles(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1'}/chapters/${node.id}/articles`,
          { headers: { 'Accept-Language': locale } }
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const loadedArticles = data.data.map((article: any) => ({
            id: article.id,
            type: 'article' as const,
            number: article.article_number || String(article.id),
            name: article.title || '',
          }));
          setArticles(loadedArticles);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `chapter-${node.id}`,
    data: {
      type: 'chapter',
      node,
      sectionId: node.sectionId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${level * 24}px`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div className="select-none" ref={setNodeRef} style={style}>
      <div
        className={`group mb-1 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2 transition-shadow hover:shadow-sm ${isDragging ? 'shadow-lg ring-2 ring-green-400' : ''}`}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-1 hover:bg-white/50 active:cursor-grabbing"
          title="Drag to reorder or move to another section"
        >
          <GripVertical className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600" />
        </button>

        {/* Expand/Collapse for articles */}
        <button onClick={handleToggle} className="rounded p-1 hover:bg-white/50">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Icon */}
        {isOpen ? (
          <FolderOpen className="h-5 w-5 text-green-600" />
        ) : (
          <Folder className="h-5 w-5 text-green-600" />
        )}

        {/* Label */}
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-gray-900">
            {node.number}-{t.chapter}: {node.name}
          </span>
          {(hasArticles || node.children?.length) && (
            <span className="ml-2 text-xs text-gray-500">
              ({articles.length || node.children?.length || 0} {t.articlesCount})
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onAddArticle(node.id, node.sectionId || 0)}
            className="rounded p-1.5 text-blue-600 hover:bg-blue-100"
            title={t.addArticle}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(node)}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title={t.edit}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(node)}
            className="rounded p-1.5 text-red-600 hover:bg-red-100"
            title={t.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Articles list */}
      {isOpen && (
        <div className="ml-12 mt-1 space-y-1">
          {loadingArticles ? (
            <div className="p-3 text-center text-sm text-gray-400">
              <Loader2 className="mr-1 inline-block h-4 w-4 animate-spin" />
              {t.loading}
            </div>
          ) : hasArticles ? (
            <>
              {articles.map(article => (
                <a
                  key={`article-${article.id}`}
                  href={`/${locale}/dashboard/articles?edit=${article.id}`}
                  className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <FileText className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-700">
                    {article.number}-{t.article}: {article.name}
                  </span>
                </a>
              ))}
              {/* Add more articles button */}
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-2 text-center text-sm text-gray-400 transition-colors hover:border-blue-300 hover:text-blue-500"
                onClick={() => onAddArticle(node.id, node.sectionId || 0)}
              >
                <Plus className="mr-1 inline-block h-4 w-4" />
                {t.addArticle}
              </div>
            </>
          ) : (
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-3 text-center text-sm text-gray-400 transition-colors hover:border-blue-300 hover:text-blue-500"
              onClick={() => onAddArticle(node.id, node.sectionId || 0)}
            >
              <Plus className="mr-1 inline-block h-4 w-4" />
              {t.addArticle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Droppable Section Container
function DroppableSection({
  section,
  chapters,
  onEdit,
  onDelete,
  onAddChild,
  onAddArticle,
  locale,
  t,
  isOver,
}: {
  section: TreeNodeData;
  chapters: TreeNodeData[];
  onEdit: (node: TreeNodeData) => void;
  onDelete: (node: TreeNodeData) => void;
  onAddChild: (parentId: number, type: string, sectionId?: number) => void;
  onAddArticle: (chapterId: number, sectionId: number) => void;
  locale: string;
  t: any;
  isOver: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = chapters.length > 0;

  const { setNodeRef } = useDroppable({
    id: `section-drop-${section.id}`,
    data: {
      type: 'section',
      sectionId: section.id,
    },
  });

  return (
    <div className="select-none">
      <div
        className={`group mb-1 flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 p-2 transition-shadow hover:shadow-sm`}
      >
        {/* Drag handle for sections */}
        <div className="p-1">
          <GripVertical className="h-4 w-4 text-gray-300" />
        </div>

        {/* Expand/Collapse */}
        <button onClick={() => setIsOpen(!isOpen)} className="rounded p-1 hover:bg-white/50">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Icon */}
        {isOpen ? (
          <FolderOpen className="h-5 w-5 text-primary-600" />
        ) : (
          <Folder className="h-5 w-5 text-primary-600" />
        )}

        {/* Label */}
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-gray-900">
            {section.number}-{t.section}: {section.name}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onAddChild(section.id, 'chapter', section.id)}
            className="rounded p-1.5 text-green-600 hover:bg-green-100"
            title={t.addChapter}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(section)}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title={t.edit}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(section)}
            className="rounded p-1.5 text-red-600 hover:bg-red-100"
            title={t.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Droppable area for chapters */}
      {isOpen && (
        <div
          ref={setNodeRef}
          className={`min-h-[40px] transition-all duration-200 ${
            isOver ? 'ml-6 rounded-lg border-2 border-dashed border-green-400 bg-green-100 p-2' : ''
          }`}
        >
          <SortableContext
            items={chapters.map(c => `chapter-${c.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map(chapter => (
              <SortableChapter
                key={`chapter-${chapter.id}`}
                node={chapter}
                level={1}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddArticle={onAddArticle}
                locale={locale}
                t={t}
              />
            ))}
          </SortableContext>
          {!hasChildren && !isOver && (
            <div className="ml-6 rounded-lg border-2 border-dashed border-gray-200 p-3 text-center text-sm text-gray-400">
              {t.addChapter}
            </div>
          )}
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
    description: '',
  });

  // Load sections from API
  const loadSections = useCallback(async () => {
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
  }, [locale, t.error]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

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
  const totalArticles = sections.reduce(
    (acc, s) =>
      acc +
      (s.chapters?.reduce((acc2: number, c: any) => acc2 + (c.articles?.length || 0), 0) || 0),
    0
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
      description: node.description || '',
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

  // Handle adding article - redirect to create article page with pre-filled chapter
  const handleAddArticle = (chapterId: number, sectionId: number) => {
    window.location.href = `/${locale}/dashboard/articles/create?chapter=${chapterId}&section=${sectionId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result;

      if (modalType === 'section') {
        if (editingItem) {
          result = await adminUpdateSection(
            editingItem.id,
            {
              order_number: parseInt(formData.number) || 1,
              title: formData.name,
              description: formData.description,
            },
            locale as Locale
          );
        } else {
          result = await adminCreateSection(
            {
              order_number: parseInt(formData.number) || sections.length + 1,
              title: formData.name,
              description: formData.description,
            },
            locale as Locale
          );
        }
      } else if (modalType === 'chapter') {
        if (editingItem) {
          result = await adminUpdateChapter(
            editingItem.id,
            {
              order_number: parseInt(formData.number) || 1,
              title: formData.name,
              description: formData.description,
            },
            locale as Locale
          );
        } else if (parentSectionId) {
          result = await adminCreateChapter(
            {
              section_id: parentSectionId,
              order_number: parseInt(formData.number) || 1,
              title: formData.name,
              description: formData.description,
            },
            locale as Locale
          );
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

  // State for tracking active drag and drop target
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get all chapter IDs for sortable context
  const allChapterIds = sections.flatMap(s =>
    (s.chapters || []).map((c: any) => `chapter-${c.id}`)
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag over - track which section we're hovering
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setOverId(over.id as string);
    } else {
      setOverId(null);
    }
  };

  // Handle drag end - reorder or move between sections
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeData = active.data.current;
    const overId = over.id as string;

    // Check if we're dropping on a section (moving chapter to new section)
    if (overId.startsWith('section-drop-')) {
      const targetSectionId = parseInt(overId.replace('section-drop-', ''));
      const chapterId = parseInt((active.id as string).replace('chapter-', ''));
      const sourceSectionId = activeData?.sectionId;

      if (sourceSectionId !== targetSectionId) {
        // Move chapter to different section
        await moveChapterToSection(chapterId, sourceSectionId, targetSectionId);
      }
      return;
    }

    // Check if we're reordering within the same section
    if (active.id !== over.id && overId.startsWith('chapter-')) {
      const activeChapterId = parseInt((active.id as string).replace('chapter-', ''));
      const overChapterId = parseInt(overId.replace('chapter-', ''));

      // Find sections containing these chapters
      const activeSectionId = activeData?.sectionId;
      let overSectionId: number | null = null;

      for (const section of sections) {
        if (section.chapters?.some((c: any) => c.id === overChapterId)) {
          overSectionId = section.id;
          break;
        }
      }

      if (activeSectionId === overSectionId && overSectionId) {
        // Reorder within same section
        await reorderChaptersInSection(overSectionId, activeChapterId, overChapterId);
      } else if (overSectionId && activeSectionId !== overSectionId) {
        // Move to different section at specific position
        await moveChapterToSection(activeChapterId, activeSectionId, overSectionId, overChapterId);
      }
    }
  };

  // Move chapter to a different section
  const moveChapterToSection = async (
    chapterId: number,
    fromSectionId: number,
    toSectionId: number,
    beforeChapterId?: number
  ) => {
    setSaving(true);

    try {
      // Get the target section's chapters to determine order
      const targetSection = sections.find(s => s.id === toSectionId);
      let newOrder = (targetSection?.chapters?.length || 0) + 1;

      if (beforeChapterId) {
        const beforeIndex =
          targetSection?.chapters?.findIndex((c: any) => c.id === beforeChapterId) || 0;
        newOrder = beforeIndex + 1;
      }

      // Update chapter with new section_id and order
      const result = await adminUpdateChapter(
        chapterId,
        {
          section_id: toSectionId,
          order_number: newOrder,
        },
        locale as Locale
      );

      if (result.success) {
        // Reload to get fresh data
        await loadSections();
      } else {
        alert(result.error || t.error);
      }
    } catch (err) {
      console.error('Error moving chapter:', err);
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  // Reorder chapters within the same section
  const reorderChaptersInSection = async (
    sectionId: number,
    activeChapterId: number,
    overChapterId: number
  ) => {
    const newSections = [...sections];
    const sectionIndex = newSections.findIndex(s => s.id === sectionId);

    if (sectionIndex === -1) return;

    const chapters = [...(newSections[sectionIndex].chapters || [])];
    const oldIndex = chapters.findIndex((c: any) => c.id === activeChapterId);
    const newIndex = chapters.findIndex((c: any) => c.id === overChapterId);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedChapters = arrayMove(chapters, oldIndex, newIndex);
    newSections[sectionIndex].chapters = reorderedChapters;
    setSections(newSections);

    // Update order_number for all chapters in section
    setSaving(true);
    try {
      for (let i = 0; i < reorderedChapters.length; i++) {
        await adminUpdateChapter(
          reorderedChapters[i].id,
          {
            order_number: i + 1,
          },
          locale as Locale
        );
      }
    } catch (err) {
      console.error('Error updating order:', err);
      loadSections();
    } finally {
      setSaving(false);
    }
  };

  // Get the currently dragged chapter for overlay
  const getActiveChapter = () => {
    if (!activeId) return null;
    const chapterId = parseInt(activeId.replace('chapter-', ''));
    for (const section of sections) {
      const chapter = section.chapters?.find((c: any) => c.id === chapterId);
      if (chapter) {
        return {
          id: chapter.id,
          type: 'chapter' as const,
          number: chapter.order_number?.toString() || '1',
          name: chapter.title,
          sectionId: section.id,
        };
      }
    }
    return null;
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'ishchi_guruh']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary-600" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['admin', 'ishchi_guruh']}>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-500" />
            <p className="mb-4 text-gray-700">{error}</p>
            <button
              onClick={loadSections}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              <RefreshCw className="h-4 w-4" />
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="mt-1 text-gray-500">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddSection}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-white transition-colors hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              {t.addSection}
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 transition-colors hover:bg-gray-50"
            >
              <Download className="h-5 w-5" />
              {t.exportJson}
            </button>
            <button
              onClick={loadSections}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 transition-colors hover:bg-gray-50"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-center">
            <div className="text-2xl font-bold text-primary-700">{totalSections}</div>
            <div className="text-sm text-primary-600">{t.sectionsCount}</div>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{totalChapters}</div>
            <div className="text-sm text-green-600">{t.chaptersCount}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">{totalArticles}</div>
            <div className="text-sm text-gray-600">{t.articlesCount}</div>
          </div>
        </div>

        {/* Tree View */}
        <div className="relative rounded-xl bg-white p-6 shadow-sm">
          {saving && (
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-primary-600 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.saving}
            </div>
          )}
          {treeData.length === 0 ? (
            <div className="py-12 text-center">
              <FolderTree className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">{t.noData}</p>
              <button
                onClick={handleAddSection}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                {t.addSection}
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={allChapterIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {treeData.map(section => (
                    <DroppableSection
                      key={`section-${section.id}`}
                      section={section}
                      chapters={section.children || []}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddChild={handleAddChild}
                      onAddArticle={handleAddArticle}
                      locale={locale}
                      t={t}
                      isOver={overId === `section-drop-${section.id}`}
                    />
                  ))}
                </div>
              </SortableContext>

              {/* Drag Overlay */}
              <DragOverlay>
                {activeId && getActiveChapter() && (
                  <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-100 p-2 opacity-90 shadow-xl">
                    <GripVertical className="h-4 w-4 text-gray-600" />
                    <div className="w-6" />
                    <Folder className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {getActiveChapter()?.number}-{t.chapter}: {getActiveChapter()?.name}
                    </span>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !saving && setModalOpen(false)}
            />
            <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {editingItem
                  ? modalType === 'section'
                    ? t.editSection
                    : t.editChapter
                  : modalType === 'section'
                    ? t.createSection
                    : t.createChapter}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t.number}</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t.name}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.description}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    disabled={saving}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                    disabled={saving}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                    disabled={saving}
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
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
