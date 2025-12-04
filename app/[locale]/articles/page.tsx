'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, Shield } from 'lucide-react';
import { ArticleFilters, ArticleListCard, ArticlesPagination } from '@/components/articles';
import { GovVerifiedBadge } from '@/components/ui';
import { articles, filterArticles, sections, chapters } from '@/lib/mock-data';

interface ArticlesPageProps {
  params: { locale: string };
}

export default function ArticlesPage({ params: { locale } }: ArticlesPageProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  
  // State
  const [view, setView] = useState<'grid' | 'list'>('list');
  
  // Parse URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '20');
  const searchQuery = searchParams.get('search') || '';
  const sectionId = searchParams.get('section') ? parseInt(searchParams.get('section')!) : undefined;
  const chapterId = searchParams.get('chapter') ? parseInt(searchParams.get('chapter')!) : undefined;
  const hasAuthorComment = searchParams.get('authorComment') === 'true' ? true : undefined;
  const hasExpertComment = searchParams.get('expertComment') === 'true' ? true : undefined;
  const translation = searchParams.get('translation') || undefined;

  // Restore view from URL
  useEffect(() => {
    const urlView = searchParams.get('view');
    if (urlView === 'grid' || urlView === 'list') {
      setView(urlView);
    }
  }, [searchParams]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return filterArticles(articles, {
      search: searchQuery,
      sectionId,
      chapterId,
      hasAuthorComment,
      hasExpertComment,
      translation,
    });
  }, [searchQuery, sectionId, chapterId, hasAuthorComment, hasExpertComment, translation]);

  // Paginate
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredArticles.slice(start, end);
  }, [filteredArticles, currentPage, itemsPerPage]);

  return (
    <div className="py-8 md:py-12 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-text-secondary mb-6"
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}`} className="hover:text-primary-600 transition-colors">
            {t('common.home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">
            {t('common.articles')}
          </span>
        </motion.nav>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary-700" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                    {t('article.title')}
                  </h1>
                  <p className="text-text-secondary text-sm md:text-base">
                    {t('article.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            <GovVerifiedBadge size="md">
              <Shield className="w-4 h-4" />
              {t('common.verifiedByGov')}
            </GovVerifiedBadge>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ArticleFilters
            locale={locale}
            totalResults={filteredArticles.length}
            view={view}
            onViewChange={setView}
          />
        </motion.div>

        {/* Articles List/Grid */}
        <AnimatePresence mode="wait">
          {paginatedArticles.length > 0 ? (
            <motion.div
              key={`articles-${currentPage}-${view}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={
                view === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                  : 'space-y-4'
              }
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-gov-border mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                Natija topilmadi
              </h3>
              <p className="text-text-secondary">
                Qidiruv so'rovingizga mos modda topilmadi. Filterlarni o'zgartirib ko'ring.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredArticles.length > 0 && (
          <ArticlesPagination
            locale={locale}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredArticles.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </div>
  );
}
