'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Grid3X3, 
  List,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge, Input } from '@/components/ui';
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

export function ArticleFilters({ locale, totalResults, view, onViewChange }: ArticleFiltersProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    sectionId: searchParams.get('section') || '',
    chapterId: searchParams.get('chapter') || '',
    hasAuthorComment: searchParams.get('authorComment') || '',
    hasExpertComment: searchParams.get('expertComment') || '',
    translation: searchParams.get('translation') || '',
  });

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
    <div className="bg-gov-surface rounded-xl border border-gov-border shadow-card mb-6">
      {/* Main Filter Bar */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={handleSearchKeyDown}
              placeholder={t('header.searchPlaceholder')}
              className={cn(
                'w-full h-11 pl-11 pr-4 rounded-lg',
                'bg-gov-light border border-gov-border',
                'text-text-primary placeholder:text-text-muted',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                'transition-all duration-200'
              )}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <Button
              variant={isExpanded ? 'primary' : 'outline'}
              size="md"
              onClick={() => setIsExpanded(!isExpanded)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="relative"
            >
              Filterlar
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* View Toggle */}
            <div className="flex items-center border border-gov-border rounded-lg overflow-hidden">
              <button
                onClick={() => onViewChange('grid')}
                className={cn(
                  'p-2.5 transition-colors',
                  view === 'grid' 
                    ? 'bg-primary-800 text-white' 
                    : 'bg-gov-surface text-text-secondary hover:bg-gov-light'
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={cn(
                  'p-2.5 transition-colors',
                  view === 'list' 
                    ? 'bg-primary-800 text-white' 
                    : 'bg-gov-surface text-text-secondary hover:bg-gov-light'
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Search Button */}
            <Button variant="primary" size="md" onClick={applyFilters}>
              {t('common.search')}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gov-border">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{totalResults}</span> natija topildi
          </p>
          
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Barchasini tozalash
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gov-border mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {/* Section Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Bo'lim
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
                    <option value="">Barcha bo'limlar</option>
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
                    Bob
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
                    <option value="">Barcha boblar</option>
                    {availableChapters.map(chapter => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.number}-bob. {getLocalizedText(chapter.title, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Sharh turi
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
                    <option value="">Barcha moddalar</option>
                    <option value="author">Muallif sharhi bor</option>
                    <option value="expert">Ekspert sharhi bor</option>
                  </select>
                </div>

                {/* Translation Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Tarjima tili
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
                    <option value="">Barcha tillar</option>
                    <option value="uz">🇺🇿 O'zbekcha</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-4 flex justify-end">
                <Button variant="primary" onClick={applyFilters}>
                  Qo'llash
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Chips */}
      {activeFilterCount > 0 && !isExpanded && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <FilterChip
                label={`Qidiruv: "${filters.search}"`}
                onRemove={() => removeFilter('search')}
              />
            )}
            {filters.sectionId && (
              <FilterChip
                label={`Bo'lim: ${sections.find(s => s.id === parseInt(filters.sectionId))?.number}`}
                onRemove={() => removeFilter('sectionId')}
              />
            )}
            {filters.chapterId && (
              <FilterChip
                label={`Bob: ${chapters.find(c => c.id === parseInt(filters.chapterId))?.number}`}
                onRemove={() => removeFilter('chapterId')}
              />
            )}
            {filters.hasAuthorComment && (
              <FilterChip
                label="Muallif sharhi"
                onRemove={() => removeFilter('hasAuthorComment')}
              />
            )}
            {filters.hasExpertComment && (
              <FilterChip
                label="Ekspert sharhi"
                onRemove={() => removeFilter('hasExpertComment')}
              />
            )}
            {filters.translation && (
              <FilterChip
                label={`Til: ${filters.translation.toUpperCase()}`}
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



