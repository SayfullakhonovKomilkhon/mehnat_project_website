'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp, FileText, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getSearchSuggestions, 
  getRecentSearches, 
  clearRecentSearches,
  saveRecentSearch,
  popularSearches,
  type SearchSuggestion 
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
  className
}: SearchAutocompleteProps) {
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
              const item = selectedIndex < recentSearches.length
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
  }, [isOpen, selectedIndex, suggestions, recentSearches, query, locale, router, onClose, onSelect]);

  const handleClearRecent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        ref={listRef}
        className={cn(
          'absolute top-full left-0 right-0 mt-2',
          'bg-gov-surface rounded-xl shadow-2xl',
          'border border-gov-border',
          'overflow-hidden z-50',
          className
        )}
      >
        {hasQuery ? (
          // Search suggestions
          <div className="py-2">
            {suggestions.length > 0 ? (
              <>
                <p className="px-4 py-2 text-xs text-text-muted font-medium uppercase tracking-wider">
                  Moddalar
                </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    onClick={() => onSelect(suggestion)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left',
                      'hover:bg-primary-50 transition-colors',
                      selectedIndex === index && 'bg-primary-50'
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {suggestion.text}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </button>
                ))}
                
                {/* See all results */}
                <div className="px-4 py-3 border-t border-gov-border mt-2">
                  <Link
                    href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                    onClick={() => {
                      saveRecentSearch(query);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Barcha natijalarni ko'rish
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="w-10 h-10 text-text-muted mx-auto mb-2" />
                <p className="text-text-secondary text-sm">
                  "{query}" bo'yicha natija topilmadi
                </p>
                <p className="text-text-muted text-xs mt-1">
                  Boshqa so'zlar bilan qidirib ko'ring
                </p>
              </div>
            )}
          </div>
        ) : (
          // Recent + Popular searches
          <div className="py-2">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
                    So'nggi qidiruvlar
                  </p>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Tozalash
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
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                      'hover:bg-primary-50 transition-colors',
                      selectedIndex === index && 'bg-primary-50'
                    )}
                  >
                    <Clock className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-primary">{text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <p className="px-4 py-2 text-xs text-text-muted font-medium uppercase tracking-wider">
                Mashhur qidiruvlar
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
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                      'hover:bg-primary-50 transition-colors',
                      selectedIndex === itemIndex && 'bg-primary-50'
                    )}
                  >
                    <TrendingUp className="w-4 h-4 text-accent-amber" />
                    <span className="text-sm text-text-primary">{text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default SearchAutocomplete;



