'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchAutocomplete } from './SearchAutocomplete';
import { saveRecentSearch, type SearchSuggestion } from '@/lib/search-utils';

interface HeaderSearchProps {
  locale: string;
  className?: string;
}

export function HeaderSearch({ locale, className }: HeaderSearchProps) {
  const t = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        if (!query) setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.url) {
      router.push(suggestion.url);
    } else {
      setQuery(suggestion.text);
      saveRecentSearch(suggestion.text);
      router.push(`/${locale}/search?q=${encodeURIComponent(suggestion.text)}`);
    }
    setIsFocused(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Compact button
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleExpand}
            className={cn(
              'p-2.5 rounded-lg',
              'text-text-secondary hover:text-primary-800 hover:bg-primary-50',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label={t('common.search')}
          >
            <Search className="w-5 h-5" />
          </motion.button>
        ) : (
          // Expanded search input
          <motion.form
            key="form"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder={t('header.searchPlaceholder')}
                className={cn(
                  'w-full h-10 pl-9 pr-8 rounded-lg',
                  'bg-gov-light border border-gov-border',
                  'text-sm text-text-primary placeholder:text-text-muted',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                  'transition-all duration-200'
                )}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gov-border rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-text-muted" />
                </button>
              )}
            </div>

            {/* Hint */}
            {isFocused && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-5 left-0 text-xs text-text-muted"
              >
                Enter tugmasini bosing
              </motion.p>
            )}

            {/* Autocomplete */}
            <SearchAutocomplete
              query={query}
              locale={locale}
              isOpen={isFocused}
              onClose={() => setIsFocused(false)}
              onSelect={handleSuggestionSelect}
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeaderSearch;





