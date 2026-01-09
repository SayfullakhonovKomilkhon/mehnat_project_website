'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { sections, chapters, getLocalizedText } from '@/lib/mock-data';

interface SearchFiltersProps {
  locale: string;
  className?: string;
}

interface ActiveFilters {
  search: string;
  section: string;
  chapter: string;
  commentType: string;
  language: string;
}

export function SearchFilters({ locale, className }: SearchFiltersProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    search: searchParams.get('search') || '',
    section: searchParams.get('section') || '',
    chapter: searchParams.get('chapter') || '',
    commentType: searchParams.get('comment') || '',
    language: searchParams.get('lang') || '',
  });

  // Build URL with filters
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.section) params.set('section', filters.section);
    if (filters.chapter) params.set('chapter', filters.chapter);
    if (filters.commentType) params.set('comment', filters.commentType);
    if (filters.language) params.set('lang', filters.language);
    params.set('page', '1');

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    setIsOpen(false);
  }, [filters, pathname, router]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      section: '',
      chapter: '',
      commentType: '',
      language: '',
    });
    router.push(pathname);
  }, [pathname, router]);

  // Get chapters for selected section
  const filteredChapters = filters.section
    ? chapters.filter(c => c.sectionId === parseInt(filters.section))
    : chapters;

  // Count active filters
  const activeCount = Object.values(filters).filter(v => v).length;

  return (
    <div className={cn('rounded-xl border border-gov-border bg-gov-surface', className)}>
      {/* Main Search Bar */}
      <div className="p-4">
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              placeholder={t('header.searchPlaceholder')}
              className={cn(
                'h-12 w-full rounded-lg pl-11 pr-4',
                'border border-gov-border bg-gov-light',
                'text-text-primary placeholder:text-text-muted',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                'transition-all duration-200'
              )}
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant={isOpen ? 'primary' : 'outline'}
            onClick={() => setIsOpen(!isOpen)}
            className="relative"
          >
            <Filter className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Filterlar</span>
            {activeCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-xs text-white">
                {activeCount}
              </span>
            )}
          </Button>

          {/* Search Button */}
          <Button variant="primary" onClick={applyFilters}>
            <Search className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">{t('common.search')}</span>
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gov-border"
          >
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Section Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Bo'lim</label>
                <select
                  value={filters.section}
                  onChange={e => setFilters({ ...filters, section: e.target.value, chapter: '' })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  <option value="">Barchasi</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.number}. {getLocalizedText(s.title, locale)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">Bob</label>
                <select
                  value={filters.chapter}
                  onChange={e => setFilters({ ...filters, chapter: e.target.value })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  <option value="">Barchasi</option>
                  {filteredChapters.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.number}-bob. {getLocalizedText(c.title, locale)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment Type Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Sharh turi
                </label>
                <select
                  value={filters.commentType}
                  onChange={e => setFilters({ ...filters, commentType: e.target.value })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  <option value="">Barchasi</option>
                  <option value="has_comment">Sharhi bor</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Tarjima tili
                </label>
                <select
                  value={filters.language}
                  onChange={e => setFilters({ ...filters, language: e.target.value })}
                  className={cn(
                    'h-10 w-full rounded-lg px-3',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                >
                  <option value="">Barchasi</option>
                  <option value="uz">🇺🇿 O'zbekcha</option>
                  <option value="ru">🇷🇺 Русский</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between px-4 pb-4">
              <button
                onClick={clearFilters}
                className="text-sm text-text-secondary transition-colors hover:text-primary-600"
              >
                Filterlarni tozalash
              </button>
              <Button variant="primary" size="sm" onClick={applyFilters}>
                Qo'llash
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Tags */}
      {activeCount > 0 && !isOpen && (
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          {filters.search && (
            <FilterTag
              label={`"${filters.search}"`}
              onRemove={() => setFilters({ ...filters, search: '' })}
            />
          )}
          {filters.section && (
            <FilterTag
              label={`Bo'lim: ${sections.find(s => s.id === parseInt(filters.section))?.number}`}
              onRemove={() => setFilters({ ...filters, section: '', chapter: '' })}
            />
          )}
          {filters.chapter && (
            <FilterTag
              label={`Bob: ${chapters.find(c => c.id === parseInt(filters.chapter))?.number}`}
              onRemove={() => setFilters({ ...filters, chapter: '' })}
            />
          )}
          {filters.commentType && (
            <FilterTag
              label="Sharhi bor"
              onRemove={() => setFilters({ ...filters, commentType: '' })}
            />
          )}
          {filters.language && (
            <FilterTag
              label={filters.language.toUpperCase()}
              onRemove={() => setFilters({ ...filters, language: '' })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-sm text-primary-700">
      {label}
      <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-primary-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export default SearchFilters;
