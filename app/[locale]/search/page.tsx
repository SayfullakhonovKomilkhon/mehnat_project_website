'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, FileText, Filter, ArrowLeft } from 'lucide-react';
import { SearchResultCard, SearchFiltersPanel, HeroSearch } from '@/components/search';
import { Button, Breadcrumb } from '@/components/ui';
import { 
  searchArticles, 
  saveRecentSearch,
  type SearchFilters,
  type SearchResult 
} from '@/lib/search-utils';
import { cn } from '@/lib/utils';

interface SearchPageProps {
  params: { locale: string };
}

export default function SearchPage({ params: { locale } }: SearchPageProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all' });
  const [isLoading, setIsLoading] = useState(true);

  // Save search to recent
  useEffect(() => {
    if (query) {
      saveRecentSearch(query);
    }
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Parse filters from URL
  useEffect(() => {
    const type = searchParams.get('type') as SearchFilters['type'] || 'all';
    const section = searchParams.get('section') ? parseInt(searchParams.get('section')!) : undefined;
    const chapter = searchParams.get('chapter') ? parseInt(searchParams.get('chapter')!) : undefined;
    const language = searchParams.get('language') as SearchFilters['language'] || undefined;
    
    setFilters({ type, section, chapter, language });
  }, [searchParams]);

  // Search results
  const results = useMemo(() => {
    if (!query) return [];
    return searchArticles(query, filters, locale);
  }, [query, filters, locale]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Qidiruv', href: `/${locale}/search` },
    ...(query ? [{ label: `"${query}"` }] : []),
  ];

  return (
    <div className="min-h-screen bg-gov-light py-8">
      <div className="section-container">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Breadcrumb items={breadcrumbItems} locale={locale} />
        </motion.div>

        {query ? (
          // Search Results View
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    <span className="text-text-secondary font-normal">Qidiruv: </span>
                    "{query}"
                  </h1>
                  <p className="text-text-secondary">
                    {isLoading ? (
                      <span className="inline-block w-24 h-4 bg-gov-border rounded animate-pulse" />
                    ) : (
                      <>{results.length} ta natija topildi</>
                    )}
                  </p>
                </div>
                
                <Link href={`/${locale}/articles`}>
                  <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Moddalar ro'yxati
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:w-80 flex-shrink-0"
              >
                <div className="lg:sticky lg:top-24">
                  <SearchFiltersPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    locale={locale}
                    resultCount={results.length}
                  />
                </div>
              </motion.aside>

              {/* Results */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    // Loading skeletons
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="bg-gov-surface rounded-xl border border-gov-border p-5"
                        >
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gov-border animate-pulse" />
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gov-border rounded w-24 animate-pulse" />
                              <div className="h-5 bg-gov-border rounded w-3/4 animate-pulse" />
                              <div className="h-4 bg-gov-border rounded w-full animate-pulse" />
                              <div className="h-4 bg-gov-border rounded w-1/2 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : results.length > 0 ? (
                    // Results list
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {results.map((result, index) => (
                        <SearchResultCard
                          key={result.id}
                          result={result}
                          query={query}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    // No results
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-16"
                    >
                      <div className="w-20 h-20 rounded-full bg-gov-border mx-auto mb-4 flex items-center justify-center">
                        <Search className="w-10 h-10 text-text-muted" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
                        Natija topilmadi
                      </h3>
                      <p className="text-text-secondary max-w-md mx-auto mb-6">
                        "{query}" bo'yicha hech qanday modda topilmadi. 
                        Boshqa so'zlar bilan qidirib ko'ring yoki filterlarni o'zgartiring.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href={`/${locale}/articles`}>
                          <Button variant="primary">
                            Barcha moddalar
                          </Button>
                        </Link>
                        <Link href={`/${locale}/sections`}>
                          <Button variant="outline">
                            Bo'limlarni ko'rish
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          // Empty Search View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12"
          >
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-2xl bg-primary-100 mx-auto mb-6 flex items-center justify-center">
                <Search className="w-10 h-10 text-primary-600" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Mehnat Kodeksidan qidiring
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Modda raqami, sarlavha yoki kalit so'zlar bo'yicha qidiring
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gov-surface rounded-2xl border border-gov-border p-8 shadow-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const q = formData.get('q') as string;
                    if (q.trim()) {
                      saveRecentSearch(q.trim());
                      window.location.href = `/${locale}/search?q=${encodeURIComponent(q.trim())}`;
                    }
                  }}
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Qidiruv so'zini kiriting..."
                      className={cn(
                        'w-full h-14 pl-12 pr-4 rounded-xl',
                        'bg-gov-light border border-gov-border',
                        'text-lg text-text-primary placeholder:text-text-muted',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                      )}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
                    <Search className="w-5 h-5 mr-2" />
                    Qidirish
                  </Button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { href: `/${locale}/sections`, label: "Bo'limlar", desc: '6 ta bo\'lim', icon: FileText },
                { href: `/${locale}/articles`, label: 'Moddalar', desc: '50+ modda', icon: FileText },
                { href: `/${locale}/articles?authorComment=true`, label: 'Muallif sharhlari', desc: 'Professional sharhlar', icon: FileText },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    'p-4 rounded-xl border border-gov-border bg-gov-surface',
                    'hover:border-primary-300 hover:shadow-card-hover',
                    'transition-all duration-200 group'
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary group-hover:text-primary-700">
                          {item.label}
                        </p>
                        <p className="text-sm text-text-muted">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted ml-auto group-hover:text-primary-600" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}



