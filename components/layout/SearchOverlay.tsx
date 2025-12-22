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
const recentSearches = [
  'Mehnat shartnomasi',
  'Ish haqi',
  'Dam olish',
  'Kasaba uyushmasi',
];

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
            className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 right-0 z-[70] bg-gov-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Top Stripe */}
            <div className="h-1 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-gold" />

            <div className="section-container py-6">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('header.searchPlaceholder')}
                      className={cn(
                        'w-full h-14 pl-14 pr-4 rounded-xl',
                        'bg-gov-light border-2 border-gov-border',
                        'text-lg text-text-primary placeholder:text-text-muted',
                        'focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20',
                        'transition-all duration-200'
                      )}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={!query.trim()}
                    className="h-14 px-8"
                  >
                    {t('common.search')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-3 rounded-xl hover:bg-gov-light text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </form>

              {/* Search Suggestions */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {/* Recent Searches */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
                    <Clock className="w-4 h-4" />
                    So'nggi qidiruvlar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm',
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
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
                    <FileText className="w-4 h-4" />
                    Tez havolalar
                  </h3>
                  <div className="space-y-2">
                    {quickResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleQuickSelect(result.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left',
                          'hover:bg-primary-50 group',
                          'transition-colors duration-200'
                        )}
                      >
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                          Bob {result.chapter}
                        </span>
                        <span className="text-sm text-text-primary group-hover:text-primary-800 truncate">
                          {result.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-600 ml-auto flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcut Hint */}
              <div className="mt-6 pt-4 border-t border-gov-border flex items-center justify-center gap-2 text-xs text-text-muted">
                <kbd className="px-2 py-1 bg-gov-light rounded border border-gov-border font-mono">ESC</kbd>
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





