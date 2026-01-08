'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

// Mock recent searches - in production, use localStorage or API
const recentSearches = ['Mehnat shartnomasi', 'Ish haqi', 'Dam olish', 'Kasaba uyushmasi'];

// Mock quick results - in production, fetch from API
const quickResults = [
  { id: '1', title: 'Modda 1. Mehnat qonunchiligi', chapter: 1 },
  { id: '7', title: 'Modda 7. Mehnat shartnomasi tushunchasi', chapter: 3 },
  { id: '15', title: 'Modda 15. Ish vaqti', chapter: 5 },
];

export function SearchOverlay({ isOpen, onClose, locale }: SearchOverlayProps) {
  const t = useTranslations();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Navigate to search results
    router.push(`/${locale}/articles?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleQuickSelect = (articleId: string) => {
    router.push(`/${locale}/articles/${articleId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-primary-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            className="fixed left-0 right-0 top-0 z-[70] bg-gov-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Top Stripe */}
            <div className="h-1 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-gold" />

            <div className="section-container py-4 sm:py-6">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative">
                {/* Mobile: Close button on top right */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute -top-2 right-0 z-10 rounded-xl p-2 text-text-secondary transition-colors hover:bg-gov-light hover:text-text-primary sm:hidden"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted sm:left-4 sm:h-6 sm:w-6" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={t('header.searchPlaceholder')}
                      className={cn(
                        'h-12 w-full rounded-xl pl-11 pr-4 sm:h-14 sm:pl-14',
                        'border-2 border-gov-border bg-gov-light',
                        'text-base text-text-primary placeholder:text-text-muted sm:text-lg',
                        'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20',
                        'transition-all duration-200'
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={!query.trim()}
                      className="h-12 flex-1 px-6 sm:h-14 sm:flex-none sm:px-8"
                    >
                      {t('common.search')}
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    {/* Desktop: Close button inline */}
                    <button
                      type="button"
                      onClick={onClose}
                      className="hidden rounded-xl p-3 text-text-secondary transition-colors hover:bg-gov-light hover:text-text-primary sm:block"
                      aria-label="Close search"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Search Suggestions */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2">
                {/* Recent Searches */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-secondary sm:mb-3 sm:text-sm">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    So'nggi qidiruvlar
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className={cn(
                          'rounded-lg px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
                          'bg-gov-light text-text-secondary',
                          'hover:bg-primary-50 hover:text-primary-800',
                          'transition-colors duration-200'
                        )}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Results */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-secondary sm:mb-3 sm:text-sm">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Tez havolalar
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {quickResults.map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleQuickSelect(result.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left sm:gap-3 sm:px-3 sm:py-2',
                          'group hover:bg-primary-50',
                          'transition-colors duration-200'
                        )}
                      >
                        <span className="flex-shrink-0 rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium text-primary-800 sm:px-2 sm:text-xs">
                          Bob {result.chapter}
                        </span>
                        <span className="min-w-0 truncate text-xs text-text-primary group-hover:text-primary-800 sm:text-sm">
                          {result.title}
                        </span>
                        <ArrowRight className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-text-muted group-hover:text-primary-600 sm:h-4 sm:w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcut Hint - Hidden on mobile */}
              <div className="mt-6 hidden items-center justify-center gap-2 border-t border-gov-border pt-4 text-xs text-text-muted sm:flex">
                <kbd className="rounded border border-gov-border bg-gov-light px-2 py-1 font-mono">
                  ESC
                </kbd>
                <span>yopish uchun</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
