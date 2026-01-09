'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
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
  hasComment: string;
  translation: string;
}

// Initial empty state to avoid hydration mismatch
const initialFilters: FilterState = {
  search: '',
  sectionId: '',
  chapterId: '',
  hasComment: '',
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
      hasComment: searchParams.get('comment') || '',
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
    if (filters.hasComment) params.set('comment', filters.hasComment);
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
      hasComment: '',
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
    <div className="mb-4 rounded-xl border border-gov-border bg-gov-surface shadow-card sm:mb-6">
      {/* Main Filter Bar */}
      <div className="p-3 sm:p-4">
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted sm:h-5 sm:w-5" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('header.searchPlaceholder')}
            className={cn(
              'h-10 w-full rounded-lg pl-9 pr-4 text-sm sm:h-11 sm:pl-11 sm:text-base',
              'border border-gov-border bg-gov-light',
              'text-text-primary placeholder:text-text-muted',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Quick Actions - Responsive */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Filter Toggle */}
          <Button
            variant={isExpanded ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            className="relative h-9 px-2.5 text-xs sm:h-10 sm:px-3 sm:text-sm"
          >
            <span className="xs:inline hidden">{t('article.filters')}</span>
            <span className="xs:hidden">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-gold text-[10px] text-white sm:h-5 sm:w-5 sm:text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Toggle */}
            <div className="flex items-center overflow-hidden rounded-lg border border-gov-border">
              <button
                onClick={() => onViewChange('grid')}
                className={cn(
                  'p-1.5 transition-colors sm:p-2.5',
                  view === 'grid'
                    ? 'bg-primary-800 text-white'
                    : 'bg-gov-surface text-text-secondary hover:bg-gov-light'
                )}
                aria-label={t('article.gridView')}
              >
                <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={cn(
                  'p-1.5 transition-colors sm:p-2.5',
                  view === 'list'
                    ? 'bg-primary-800 text-white'
                    : 'bg-gov-surface text-text-secondary hover:bg-gov-light'
                )}
                aria-label={t('article.listView')}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Search Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={applyFilters}
              className="h-9 px-2.5 text-xs sm:h-10 sm:px-4 sm:text-sm"
            >
              <Search className="h-3.5 w-3.5 sm:hidden" />
              <span className="hidden sm:inline">{t('common.search')}</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 flex items-center justify-between border-t border-gov-border pt-3">
          <p className="text-xs text-text-secondary sm:text-sm">
            {t('article.resultsFound', { count: totalResults })}
          </p>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 sm:text-sm"
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
          <div className="mt-0 border-t border-gov-border p-4 pt-0">
            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Section Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  {t('article.section')}
                </label>
                <select
                  value={filters.sectionId}
                  onChange={e =>
                    setFilters({ ...filters, sectionId: e.target.value, chapterId: '' })
                  }
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
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
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  {t('article.chapter')}
                </label>
                <select
                  value={filters.chapterId}
                  onChange={e => setFilters({ ...filters, chapterId: e.target.value })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  <option value="">{t('article.allChapters')}</option>
                  {availableChapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.number}-{t('article.chapter').toLowerCase()}.{' '}
                      {getLocalizedText(chapter.title, locale)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  {t('article.commentType')}
                </label>
                <select
                  value={filters.hasComment}
                  onChange={e => setFilters({ ...filters, hasComment: e.target.value })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  <option value="">{t('article.allArticles')}</option>
                  <option value="true">{t('article.hasComment')}</option>
                </select>
              </div>

              {/* Translation Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  {t('article.translation')}
                </label>
                <select
                  value={filters.translation}
                  onChange={e => setFilters({ ...filters, translation: e.target.value })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
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
            {filters.hasComment && (
              <FilterChip
                label={t('article.hasComment')}
                onRemove={() => removeFilter('hasComment')}
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-primary-100"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export default ArticleFilters;
