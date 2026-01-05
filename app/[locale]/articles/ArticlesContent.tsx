'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileText, ChevronRight, Loader2 } from 'lucide-react';
import { ArticleFilters, ArticleListCard, ArticlesPagination } from '@/components/articles';
import { getArticles } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Article, Locale } from '@/types';

interface ArticlesContentProps {
  locale: string;
}

// Initial values to ensure consistent SSR/CSR rendering
const INITIAL_PAGE = 1;
const INITIAL_ITEMS_PER_PAGE = 20;

export default function ArticlesContent({ locale }: ArticlesContentProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  
  // State
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [isHydrated, setIsHydrated] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Parse URL params only after hydration for consistency
  const currentPage = isHydrated ? parseInt(searchParams.get('page') || '1') : INITIAL_PAGE;
  const itemsPerPage = isHydrated ? parseInt(searchParams.get('limit') || '20') : INITIAL_ITEMS_PER_PAGE;
  const searchQuery = isHydrated ? (searchParams.get('search') || '') : '';
  const sectionId = isHydrated && searchParams.get('section') ? parseInt(searchParams.get('section')!) : undefined;
  const chapterId = isHydrated && searchParams.get('chapter') ? parseInt(searchParams.get('chapter')!) : undefined;
  const hasAuthorComment = isHydrated && searchParams.get('authorComment') === 'true' ? true : undefined;
  const hasExpertComment = isHydrated && searchParams.get('expertComment') === 'true' ? true : undefined;
  const translation = isHydrated ? (searchParams.get('translation') || undefined) : undefined;

  // Mark as hydrated on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Restore view from URL
  useEffect(() => {
    const urlView = searchParams.get('view');
    if (urlView === 'grid' || urlView === 'list') {
      setView(urlView);
    }
  }, [searchParams]);

  // Fetch articles from API
  const fetchArticles = useCallback(async () => {
    if (!isHydrated) return;
    
    setIsLoading(true);
    try {
      const result = await getArticles({
        page: currentPage,
        limit: itemsPerPage,
        chapterId,
        sectionId,
        search: searchQuery,
        hasAuthorComment,
        hasExpertComment,
        language: translation as Locale | undefined,
      }, locale as Locale);
      
      setArticles(result.data);
      setTotalItems(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setArticles([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [isHydrated, currentPage, itemsPerPage, chapterId, sectionId, searchQuery, hasAuthorComment, hasExpertComment, translation, locale]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Use fetched articles
  const paginatedArticles = articles;

  return (
    <div className="py-8 md:py-12 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-text-secondary mb-6 animate-fadeIn"
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}`} className="hover:text-primary-600 transition-colors">
            {t('common.home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">
            {t('common.articles')}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8 animate-fadeIn">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-primary-700" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                {t('article.title')}
              </h1>
              <p className="text-text-secondary text-xs sm:text-sm md:text-base mt-1">
                {t('article.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <ArticleFilters
            locale={locale}
            totalResults={totalItems}
            view={view}
            onViewChange={setView}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Articles List/Grid */}
        {!isLoading && paginatedArticles.length > 0 ? (
          <div
            className={cn(
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-3 sm:space-y-4'
            )}
          >
            {paginatedArticles.map((article, index) => (
              <ArticleListCard
                key={article.id}
                article={article}
                locale={locale}
                view={view}
                index={index}
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-gov-border mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
              {t('article.noResults')}
            </h3>
            <p className="text-text-secondary">
              {t('article.noResultsDescription')}
            </p>
          </div>
        ) : null}

        {/* Pagination */}
        {!isLoading && totalItems > 0 && (
          <ArticlesPagination
            locale={locale}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </div>
  );
}
