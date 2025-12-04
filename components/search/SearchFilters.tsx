'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { sections, chapters, getLocalizedText } from '@/lib/mock-data';
import type { SearchFilters as SearchFiltersType } from '@/lib/search-utils';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  locale: string;
  resultCount: number;
}

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  locale,
  resultCount
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get chapters for selected section
  const availableChapters = filters.section
    ? chapters.filter(c => c.sectionId === filters.section)
    : chapters;

  // Count active filters
  const activeFilterCount = [
    filters.type !== 'all',
    filters.section,
    filters.chapter,
    filters.language,
  ].filter(Boolean).length;

  const handleTypeChange = (type: SearchFiltersType['type']) => {
    onFiltersChange({ ...filters, type });
  };

  const handleSectionChange = (sectionId: string) => {
    const section = sectionId ? parseInt(sectionId) : undefined;
    onFiltersChange({ ...filters, section, chapter: undefined });
  };

  const handleChapterChange = (chapterId: string) => {
    const chapter = chapterId ? parseInt(chapterId) : undefined;
    onFiltersChange({ ...filters, chapter });
  };

  const handleLanguageChange = (language: string) => {
    const lang = language as SearchFiltersType['language'] | '';
    onFiltersChange({ ...filters, language: lang || undefined });
  };

  const handleClearFilters = () => {
    onFiltersChange({ type: 'all' });
  };

  return (
    <div className="bg-gov-surface rounded-xl border border-gov-border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <span className="font-medium text-text-primary">Filterlar</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            {resultCount} natija
          </span>
          <ChevronDown className={cn(
            'w-5 h-5 text-text-muted transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>
      </button>

      {/* Filters Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-gov-border pt-4">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Kontent turi
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Hammasi' },
                    { value: 'article', label: 'Modda matni' },
                    { value: 'authorComment', label: 'Muallif sharhi' },
                    { value: 'expertComment', label: 'Ekspert sharhi' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={filters.type === option.value}
                        onChange={() => handleTypeChange(option.value as SearchFiltersType['type'])}
                        className="w-4 h-4 text-primary-600 border-gov-border focus:ring-primary-500"
                      />
                      <span className="text-sm text-text-secondary">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section Filter */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Bo'lim
                </label>
                <select
                  value={filters.section || ''}
                  onChange={(e) => handleSectionChange(e.target.value)}
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
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Bob
                </label>
                <select
                  value={filters.chapter || ''}
                  onChange={(e) => handleChapterChange(e.target.value)}
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

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tarjima tili
                </label>
                <select
                  value={filters.language || ''}
                  onChange={(e) => handleLanguageChange(e.target.value)}
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

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  leftIcon={<X className="w-4 h-4" />}
                  className="w-full"
                >
                  Filterlarni tozalash
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchFiltersPanel;



