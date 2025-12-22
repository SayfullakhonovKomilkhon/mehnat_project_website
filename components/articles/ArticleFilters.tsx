'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Search, 
  X, 
  Grid3X3, 
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { sections, chapters, getLocalizedText } from '@/lib/mock-data';

interface ArticleFiltersProps {
  locale: string;
  totalResults: number;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

interface FilterState {
  search: string;
  sectionId: string;
  chapterId: string;
  hasAuthorComment: string;
  hasExpertComment: string;
  translation: string;
}

// Initial empty state to avoid hydration mismatch
const initialFilters: FilterState = {
  search: '',
  sectionId: '',
  chapterId: '',
  hasAuthorComment: '',
  hasExpertComment: '',
  translation: '',
};

export function ArticleFilters({ locale, totalResults, view, onViewChange }: ArticleFiltersProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  // Initialize with empty state, sync from URL in useEffect
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync filters from URL after hydration
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      sectionId: searchParams.get('section') || '',
      chapterId: searchParams.get('chapter') || '',
      hasAuthorComment: searchParams.get('authorComment') || '',
      hasExpertComment: searchParams.get('expertComment') || '',
      translation: searchParams.get('translation') || '',
    });
    setIsHydrated(true);
  }, [searchParams]);

  // Get chapters for selected section
  const availableChapters = filters.sectionId 
    ? chapters.filter(c => c.sectionId === parseInt(filters.sectionId))
    : chapters;

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  // Update URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.sectionId) params.set('section', filters.sectionId);
    if (filters.chapterId) params.set('chapter', filters.chapterId);
    if (filters.hasAuthorComment) params.set('authorComment', filters.hasAuthorComment);
    if (filters.hasExpertComment) params.set('expertComment', filters.hasExpertComment);
    if (filters.translation) params.set('translation', filters.translation);
    params.set('page', '1');
    
    router.push(`/${locale}/articles?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      sectionId: '',
      chapterId: '',
      hasAuthorComment: '',
      hasExpertComment: '',
      translation: '',
    });
    router.push(`/${locale}/articles`);
  };

  // Remove single filter
  const removeFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: '' };
    if (key === 'sectionId') newFilters.chapterId = ''; // Reset chapter when section is removed
    setFilters(newFilters);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key === 'sectionId' ? 'section' : key === 'chapterId' ? 'chapter' : key);
    if (key === 'sectionId') params.delete('chapter');
    params.set('page', '1');
    router.push(`/${locale}/articles?${params.toString()}`);
  };

  // Handle search on enter
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  return (
    <div className="bg-gov-surface rounded-xl border border-gov-border shadow-card mb-4 sm:mb-6">
      {/* Main Filter Bar */}
      <div className="p-3 sm:p-4">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('header.searchPlaceholder')}
            className={cn(
              'w-full h-10 sm:h-11 pl-9 sm:pl-11 pr-4 rounded-lg text-sm sm:text-base',
              'bg-gov-light border border-gov-border',
              'text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Quick Actions - Responsive */}
        <div className="flex items-center justify-between gap-2">
          {/* Filter Toggle */}
          <Button
            variant={isExpanded ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            className="relative text-sm"
          >
            {t('article.filters')}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-accent-gold text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border border-gov-border rounded-lg overflow-hidden">
              <button
                onClick={() => onViewChange('grid')}
                className={cn(
                  'p-2 sm:p-2.5 transition-colors',
                  view === 'grid' 
                    ? 'bg-primary-800 text-white' 
                    : 'bg-gov-surface text-text-secondary hover:bg-gov-light'
                )}
                aria-label={t('article.gridView')}
              >
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={cn(
                  'p-2 sm:p-2.5 transition-colors',
                  view === 'list' 
                    ? 'bg-primary-800 text-white' 
                    : 'bg-gov-surface text-text-secondary hover:bg-gov-light'
                )}
                aria-label={t('article.listView')}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Search Button */}
            <Button variant="primary" size="sm" onClick={applyFilters} className="text-sm">
              {t('common.search')}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gov-border">
          <p className="text-xs sm:text-sm text-text-secondary">
            {t('article.resultsFound', { count: totalResults })}
          </p>
          
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('article.clearAll')}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters - CSS animation */}
      <div 
        className={cn(
          'overflow-hidden transition-all duration-200 ease-out',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-gov-border mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {/* Section Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('article.section')}
                  </label>
                  <select
                    value={filters.sectionId}
                    onChange={(e) => setFilters({ ...filters, sectionId: e.target.value, chapterId: '' })}
                    className={cn(
                      'w-full h-10 px-3 rounded-lg',
                      'bg-gov-light border border-gov-border',
                      'text-text-primary text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                    )}
                  >
                    <option value="">{t('article.allSections')}</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.number}. {getLocalizedText(section.title, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('article.chapter')}
                  </label>
                  <select
                    value={filters.chapterId}
                    onChange={(e) => setFilters({ ...filters, chapterId: e.target.value })}
                    className={cn(
                      'w-full h-10 px-3 rounded-lg',
                      'bg-gov-light border border-gov-border',
                      'text-text-primary text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                    )}
                  >
                    <option value="">{t('article.allChapters')}</option>
                    {availableChapters.map(chapter => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.number}-{t('article.chapter').toLowerCase()}. {getLocalizedText(chapter.title, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('article.commentType')}
                  </label>
                  <select
                    value={filters.hasAuthorComment || filters.hasExpertComment}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({
                        ...filters,
                        hasAuthorComment: value === 'author' ? 'true' : '',
                        hasExpertComment: value === 'expert' ? 'true' : '',
                      });
                    }}
                    className={cn(
                      'w-full h-10 px-3 rounded-lg',
                      'bg-gov-light border border-gov-border',
                      'text-text-primary text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                    )}
                  >
                    <option value="">{t('article.allArticles')}</option>
                    <option value="author">{t('article.hasAuthorComment')}</option>
                    <option value="expert">{t('article.hasExpertComment')}</option>
                  </select>
                </div>

                {/* Translation Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {t('article.translation')}
                  </label>
                  <select
                    value={filters.translation}
                    onChange={(e) => setFilters({ ...filters, translation: e.target.value })}
                    className={cn(
                      'w-full h-10 px-3 rounded-lg',
                      'bg-gov-light border border-gov-border',
                      'text-text-primary text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                    )}
                  >
                    <option value="">{t('article.allLanguages')}</option>
                    <option value="uz">🇺🇿 O&apos;zbekcha</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-4 flex justify-end">
                <Button variant="primary" onClick={applyFilters}>
                  {t('article.applyFilters')}
                </Button>
              </div>
            </div>
        )}
      </div>

      {/* Active Filters Chips */}
      {activeFilterCount > 0 && !isExpanded && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <FilterChip
                label={`${t('article.searchLabel')}: "${filters.search}"`}
                onRemove={() => removeFilter('search')}
              />
            )}
            {filters.sectionId && (
              <FilterChip
                label={`${t('article.sectionLabel')}: ${sections.find(s => s.id === parseInt(filters.sectionId))?.number}`}
                onRemove={() => removeFilter('sectionId')}
              />
            )}
            {filters.chapterId && (
              <FilterChip
                label={`${t('article.chapterLabel')}: ${chapters.find(c => c.id === parseInt(filters.chapterId))?.number}`}
                onRemove={() => removeFilter('chapterId')}
              />
            )}
            {filters.hasAuthorComment && (
              <FilterChip
                label={t('article.authorComment')}
                onRemove={() => removeFilter('hasAuthorComment')}
              />
            )}
            {filters.hasExpertComment && (
              <FilterChip
                label={t('article.expertComment')}
                onRemove={() => removeFilter('hasExpertComment')}
              />
            )}
            {filters.translation && (
              <FilterChip
                label={`${t('article.languageLabel')}: ${filters.translation.toUpperCase()}`}
                onRemove={() => removeFilter('translation')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Filter Chip Component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-primary-100 rounded-full transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

export default ArticleFilters;
