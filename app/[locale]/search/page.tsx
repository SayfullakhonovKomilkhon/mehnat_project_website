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
  type SearchResult,
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
    const type = (searchParams.get('type') as SearchFilters['type']) || 'all';
    const section = searchParams.get('section')
      ? parseInt(searchParams.get('section')!)
      : undefined;
    const chapter = searchParams.get('chapter')
      ? parseInt(searchParams.get('chapter')!)
      : undefined;
    const language = (searchParams.get('language') as SearchFilters['language']) || undefined;

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
        <div className="animate-fadeIn mb-4 sm:mb-6">
          <Breadcrumb items={breadcrumbItems} locale={locale} />
        </div>

        {query ? (
          // Search Results View
          <>
            {/* Header */}
            <div className="animate-fadeIn mb-6 sm:mb-8">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="mb-1 font-heading text-xl font-bold text-text-primary sm:mb-2 sm:text-2xl md:text-3xl">
                    <span className="font-normal text-text-secondary">
                      {t('search.resultsFor')}{' '}
                    </span>
                    &quot;{query}&quot;
                  </h1>
                  <p className="text-sm text-text-secondary sm:text-base">
                    {isLoading ? (
                      <span className="inline-block h-4 w-24 animate-pulse rounded bg-gov-border" />
                    ) : (
                      t('search.resultsFound', { count: results.length })
                    )}
                  </p>
                </div>

                <Link href={`/${locale}/articles`} className="self-start md:self-auto">
                  <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                    {t('search.articlesList')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Filters Sidebar */}
              <aside
                className="animate-fadeIn flex-shrink-0 lg:w-80"
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
              <div className="min-w-0 flex-1">
                {isLoading ? (
                  // Loading skeletons
                  <div className="animate-fadeIn space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="rounded-xl border border-gov-border bg-gov-surface p-5"
                      >
                        <div className="flex gap-4">
                          <div className="h-12 w-12 animate-pulse rounded-xl bg-gov-border" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-24 animate-pulse rounded bg-gov-border" />
                            <div className="h-5 w-3/4 animate-pulse rounded bg-gov-border" />
                            <div className="h-4 w-full animate-pulse rounded bg-gov-border" />
                            <div className="h-4 w-1/2 animate-pulse rounded bg-gov-border" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  // Results list
                  <div className="animate-fadeIn space-y-4">
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
                  <div className="animate-fadeIn py-16 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gov-border">
                      <Search className="h-10 w-10 text-text-muted" />
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-text-primary">
                      {t('search.noResults')}
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-text-secondary">
                      {t('search.noResultsFor', { query })}
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                      <Link href={`/${locale}/articles`}>
                        <Button variant="primary">{t('errors.allArticles')}</Button>
                      </Link>
                      <Link href={`/${locale}/sections`}>
                        <Button variant="outline">{t('search.viewSections')}</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Empty Search View
          <div className="animate-fadeIn py-8 sm:py-12">
            <div className="mb-8 text-center sm:mb-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 sm:mb-6 sm:h-20 sm:w-20 sm:rounded-2xl">
                <Search className="h-7 w-7 text-primary-600 sm:h-10 sm:w-10" />
              </div>
              <h1 className="mb-3 px-4 font-heading text-2xl font-bold text-text-primary sm:mb-4 sm:text-3xl md:text-4xl">
                {t('search.title')}
              </h1>
              <p className="mx-auto max-w-2xl px-4 text-sm text-text-secondary sm:text-base lg:text-lg">
                {t('search.subtitle')}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <div className="rounded-xl border border-gov-border bg-gov-surface p-4 shadow-card sm:rounded-2xl sm:p-6 md:p-8">
                <form
                  onSubmit={e => {
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
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted sm:left-4 sm:h-6 sm:w-6" />
                    <input
                      type="text"
                      name="q"
                      placeholder={t('search.placeholder')}
                      className={cn(
                        'h-11 w-full rounded-lg pl-10 pr-4 sm:h-14 sm:rounded-xl sm:pl-12',
                        'border border-gov-border bg-gov-light',
                        'text-base text-text-primary placeholder:text-text-muted sm:text-lg',
                        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                      )}
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="mt-3 w-full text-sm sm:mt-4 sm:text-base"
                  >
                    <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {t('search.searchButton')}
                  </Button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {[
                {
                  href: `/${locale}/sections`,
                  label: t('sections.title'),
                  desc: t('search.sectionsCount', { count: 6 }),
                  icon: FileText,
                },
                {
                  href: `/${locale}/articles`,
                  label: t('common.articles'),
                  desc: t('search.articlesCount', { count: 50 }),
                  icon: FileText,
                },
                {
                  href: `/${locale}/articles?comment=true`,
                  label: t('article.comment'),
                  desc: t('search.professionalComments'),
                  icon: FileText,
                },
              ].map(item => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'rounded-lg border border-gov-border bg-gov-surface p-3 sm:rounded-xl sm:p-4',
                      'hover:border-primary-300 hover:shadow-card-hover',
                      'group transition-all duration-200'
                    )}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 sm:h-10 sm:w-10">
                        <item.icon className="h-4 w-4 text-primary-600 sm:h-5 sm:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary group-hover:text-primary-700 sm:text-base">
                          {item.label}
                        </p>
                        <p className="truncate text-xs text-text-muted sm:text-sm">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-text-muted group-hover:text-primary-600 sm:h-5 sm:w-5" />
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
