'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { SearchAutocomplete } from './SearchAutocomplete';
import { saveRecentSearch, type SearchSuggestion } from '@/lib/search-utils';

interface HeroSearchProps {
  locale: string;
  className?: string;
}

export function HeroSearch({ locale, className }: HeroSearchProps) {
  const t = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
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

  return (
    <div ref={containerRef} className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          'relative flex items-center',
          'bg-white rounded-xl sm:rounded-2xl',
          'shadow-xl shadow-primary-900/10',
          'border-2 transition-colors duration-200',
          isFocused ? 'border-primary-500' : 'border-transparent'
        )}>
          {/* Search Icon */}
          <div className="pl-3 sm:pl-5">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={t('header.searchPlaceholder')}
            className={cn(
              'flex-1 h-12 sm:h-14 md:h-16 px-3 sm:px-4',
              'bg-transparent border-0',
              'text-base sm:text-lg text-text-primary placeholder:text-text-muted',
              'focus:outline-none'
            )}
          />

          {/* Submit Button */}
          <div className="pr-1.5 sm:pr-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!query.trim()}
              className="rounded-lg sm:rounded-xl px-3 sm:px-6 h-9 sm:h-11"
            >
              <span className="hidden sm:inline mr-2">{t('common.search')}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        <SearchAutocomplete
          query={query}
          locale={locale}
          isOpen={isFocused}
          onClose={() => setIsFocused(false)}
          onSelect={handleSuggestionSelect}
          className="mt-3"
        />
      </form>
    </div>
  );
}

export default HeroSearch;
