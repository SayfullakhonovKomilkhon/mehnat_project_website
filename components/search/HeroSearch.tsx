'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { SearchAutocomplete } from './SearchAutocomplete';
import { 
  saveRecentSearch, 
  getRecentSearches,
  popularSearches,
  type SearchSuggestion 
} from '@/lib/search-utils';

interface HeroSearchProps {
  locale: string;
  className?: string;
}

export function HeroSearch({ locale, className }: HeroSearchProps) {
  const t = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

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

  const handleQuickSearch = (text: string) => {
    saveRecentSearch(text);
    router.push(`/${locale}/search?q=${encodeURIComponent(text)}`);
  };

  return (
    <div ref={containerRef} className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          'relative flex items-center',
          'bg-white rounded-2xl',
          'shadow-xl shadow-primary-900/10',
          'border-2 transition-colors duration-200',
          isFocused ? 'border-primary-500' : 'border-transparent'
        )}>
          {/* Search Icon */}
          <div className="pl-5">
            <Search className="w-6 h-6 text-primary-600" />
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
              'flex-1 h-14 md:h-16 px-4',
              'bg-transparent border-0',
              'text-lg text-text-primary placeholder:text-text-muted',
              'focus:outline-none'
            )}
          />

          {/* Submit Button */}
          <div className="pr-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!query.trim()}
              className="rounded-xl px-6"
            >
              <span className="hidden sm:inline mr-2">{t('common.search')}</span>
              <ArrowRight className="w-5 h-5" />
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

      {/* Quick Search Chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm text-white/70 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Mashhur:
          </span>
          {popularSearches.slice(0, 4).map((text, index) => (
            <motion.button
              key={text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => handleQuickSearch(text)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm',
                'bg-white/10 hover:bg-white/20',
                'text-white/90 hover:text-white',
                'backdrop-blur-sm border border-white/10',
                'transition-colors duration-200'
              )}
            >
              {text}
            </motion.button>
          ))}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
            <span className="text-sm text-white/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              So'nggi:
            </span>
            {recentSearches.slice(0, 3).map((text, index) => (
              <button
                key={`recent-${index}`}
                onClick={() => handleQuickSearch(text)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm',
                  'bg-white/5 hover:bg-white/15',
                  'text-white/70 hover:text-white/90',
                  'border border-white/5',
                  'transition-colors duration-200'
                )}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default HeroSearch;




