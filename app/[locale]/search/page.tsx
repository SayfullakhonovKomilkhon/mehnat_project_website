'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Search, ChevronRight, FileText, ArrowLeft } from 'lucide-react';
import { SearchResultCard, SearchFiltersPanel } from '@/components/search';
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
    { label: t('common.search'), href: `/${locale}/search` },
    ...(query ? [{ label: `"${query}"` }] : []),
  ];

  return (
    <div className="min-h-screen bg-gov-light py-6 sm:py-8">
      <div className="section-container">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 animate-fadeIn">
          <Breadcrumb items={breadcrumbItems} locale={locale} />
        </div>

        {query ? (
          // Search Results View
          <>
            {/* Header */}
            <div className="mb-6 sm:mb-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-1 sm:mb-2">
                    <span className="text-text-secondary font-normal">{t('search.resultsFor')} </span>
                    &quot;{query}&quot;
                  </h1>
                  <p className="text-text-secondary text-sm sm:text-base">
                    {isLoading ? (
                      <span className="inline-block w-24 h-4 bg-gov-border rounded animate-pulse" />
                    ) : (
                      t('search.resultsFound', { count: results.length })
                    )}
                  </p>
                </div>
                
                <Link href={`/${locale}/articles`} className="self-start md:self-auto">
                  <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    {t('search.articlesList')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar */}
              <aside
                className="lg:w-80 flex-shrink-0 animate-fadeIn"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="lg:sticky lg:top-24">
                  <SearchFiltersPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    locale={locale}
                    resultCount={results.length}
                  />
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1 min-w-0">
                {isLoading ? (
                  // Loading skeletons
                  <div className="space-y-4 animate-fadeIn">
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
                  </div>
                ) : results.length > 0 ? (
                  // Results list
                  <div className="space-y-4 animate-fadeIn">
                    {results.map((result, index) => (
                      <SearchResultCard
                        key={result.id}
                        result={result}
                        query={query}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  // No results
                  <div className="text-center py-16 animate-fadeIn">
                    <div className="w-20 h-20 rounded-full bg-gov-border mx-auto mb-4 flex items-center justify-center">
                      <Search className="w-10 h-10 text-text-muted" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
                      {t('search.noResults')}
                    </h3>
                    <p className="text-text-secondary max-w-md mx-auto mb-6">
                      {t('search.noResultsFor', { query })}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href={`/${locale}/articles`}>
                        <Button variant="primary">
                          {t('errors.allArticles')}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/sections`}>
                        <Button variant="outline">
                          {t('search.viewSections')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Empty Search View
          <div className="py-8 sm:py-12 animate-fadeIn">
            <div className="text-center mb-8 sm:mb-12">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-primary-100 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Search className="w-7 h-7 sm:w-10 sm:h-10 text-primary-600" />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 sm:mb-4 px-4">
                {t('search.title')}
              </h1>
              <p className="text-text-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                {t('search.subtitle')}
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gov-surface rounded-xl sm:rounded-2xl border border-gov-border p-4 sm:p-6 md:p-8 shadow-card">
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
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-text-muted" />
                    <input
                      type="text"
                      name="q"
                      placeholder={t('search.placeholder')}
                      className={cn(
                        'w-full h-11 sm:h-14 pl-10 sm:pl-12 pr-4 rounded-lg sm:rounded-xl',
                        'bg-gov-light border border-gov-border',
                        'text-base sm:text-lg text-text-primary placeholder:text-text-muted',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                      )}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" className="w-full mt-3 sm:mt-4 text-sm sm:text-base">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t('search.searchButton')}
                  </Button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {[
                { href: `/${locale}/sections`, label: t('sections.title'), desc: t('search.sectionsCount', { count: 6 }), icon: FileText },
                { href: `/${locale}/articles`, label: t('common.articles'), desc: t('search.articlesCount', { count: 50 }), icon: FileText },
                { href: `/${locale}/articles?authorComment=true`, label: t('article.authorComment'), desc: t('search.professionalComments'), icon: FileText },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    'p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gov-border bg-gov-surface',
                    'hover:border-primary-300 hover:shadow-card-hover',
                    'transition-all duration-200 group'
                  )}>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base text-text-primary group-hover:text-primary-700 truncate">
                          {item.label}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted flex-shrink-0 group-hover:text-primary-600" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
