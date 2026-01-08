'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Clock, TrendingUp, FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getSearchSuggestions,
  getRecentSearches,
  clearRecentSearches,
  saveRecentSearch,
  popularSearches,
  type SearchSuggestion,
} from '@/lib/search-utils';

interface SearchAutocompleteProps {
  query: string;
  locale: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  className?: string;
}

export function SearchAutocomplete({
  query,
  locale,
  isOpen,
  onClose,
  onSelect,
  className,
}: SearchAutocompleteProps) {
  const t = useTranslations();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  // Load suggestions
  useEffect(() => {
    if (isOpen) {
      const results = getSearchSuggestions(query, locale);
      setSuggestions(results);
      setRecentSearches(getRecentSearches());
      setSelectedIndex(-1);
    }
  }, [query, locale, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const totalItems = query.trim()
        ? suggestions.length
        : recentSearches.length + Math.min(4, popularSearches.length);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % totalItems);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            if (query.trim() && suggestions[selectedIndex]) {
              onSelect(suggestions[selectedIndex]);
            } else {
              // Handle recent or popular search
              const item =
                selectedIndex < recentSearches.length
                  ? recentSearches[selectedIndex]
                  : popularSearches[selectedIndex - recentSearches.length];
              if (item) {
                saveRecentSearch(item);
                router.push(`/${locale}/search?q=${encodeURIComponent(item)}`);
                onClose();
              }
            }
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    selectedIndex,
    suggestions,
    recentSearches,
    query,
    locale,
    router,
    onClose,
    onSelect,
  ]);

  const handleClearRecent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div
      ref={listRef}
      className={cn(
        'absolute left-0 right-0 top-full mt-1 sm:mt-2',
        'rounded-lg bg-gov-surface shadow-2xl sm:rounded-xl',
        'border border-gov-border',
        'z-50 max-h-[60vh] overflow-hidden overflow-y-auto',
        'transition-all duration-150 ease-out',
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0',
        className
      )}
    >
      {hasQuery ? (
        // Search suggestions
        <div className="py-1.5 sm:py-2">
          {suggestions.length > 0 ? (
            <>
              <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted sm:px-4 sm:py-2 sm:text-xs">
                {t('search.articles')}
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => onSelect(suggestion)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2.5 text-left sm:gap-3 sm:px-4 sm:py-3',
                    'transition-colors hover:bg-primary-50',
                    selectedIndex === index && 'bg-primary-50'
                  )}
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary-100 sm:h-8 sm:w-8 sm:rounded-lg">
                    <FileText className="h-3.5 w-3.5 text-primary-600 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-text-primary sm:text-sm">
                      {suggestion.text}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-text-muted sm:h-4 sm:w-4" />
                </button>
              ))}

              {/* See all results */}
              <div className="mt-1.5 border-t border-gov-border px-3 py-2.5 sm:mt-2 sm:px-4 sm:py-3">
                <Link
                  href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    saveRecentSearch(query);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 sm:gap-2 sm:text-sm"
                >
                  {t('search.viewAllResults')}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="px-3 py-6 text-center sm:px-4 sm:py-8">
              <Search className="mx-auto mb-2 h-8 w-8 text-text-muted sm:h-10 sm:w-10" />
              <p className="text-xs text-text-secondary sm:text-sm">
                {t('search.noResultsFound', { query })}
              </p>
              <p className="mt-1 text-[10px] text-text-muted sm:text-xs">
                {t('search.tryDifferentWords')}
              </p>
            </div>
          )}
        </div>
      ) : (
        // Recent + Popular searches
        <div className="py-1.5 sm:py-2">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-1.5 sm:mb-2">
              <div className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted sm:text-xs">
                  {t('search.recentSearches')}
                </p>
                <button
                  onClick={handleClearRecent}
                  className="text-[10px] text-primary-600 hover:text-primary-700 sm:text-xs"
                >
                  {t('search.clear')}
                </button>
              </div>
              {recentSearches.map((text, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => {
                    saveRecentSearch(text);
                    router.push(`/${locale}/search?q=${encodeURIComponent(text)}`);
                    onClose();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left sm:gap-3 sm:px-4 sm:py-2.5',
                    'transition-colors hover:bg-primary-50',
                    selectedIndex === index && 'bg-primary-50'
                  )}
                >
                  <Clock className="h-3.5 w-3.5 flex-shrink-0 text-text-muted sm:h-4 sm:w-4" />
                  <span className="truncate text-xs text-text-primary sm:text-sm">{text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted sm:px-4 sm:py-2 sm:text-xs">
              {t('search.popularSearches')}
            </p>
            {popularSearches.slice(0, 4).map((text, index) => {
              const itemIndex = recentSearches.length + index;
              return (
                <button
                  key={`popular-${index}`}
                  onClick={() => {
                    saveRecentSearch(text);
                    router.push(`/${locale}/search?q=${encodeURIComponent(text)}`);
                    onClose();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left sm:gap-3 sm:px-4 sm:py-2.5',
                    'transition-colors hover:bg-primary-50',
                    selectedIndex === itemIndex && 'bg-primary-50'
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5 flex-shrink-0 text-accent-amber sm:h-4 sm:w-4" />
                  <span className="truncate text-xs text-text-primary sm:text-sm">{text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;
