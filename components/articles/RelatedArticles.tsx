'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, Link2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { getRelatedArticles, getLocalizedText } from '@/lib/api';
import type { Article, Locale } from '@/types';

interface RelatedArticlesProps {
  article: Article;
  locale: string;
}

export function RelatedArticles({ article, locale }: RelatedArticlesProps) {
  const t = useTranslations('article');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch related articles from API
  useEffect(() => {
    let isMounted = true;

    async function fetchRelatedArticles() {
      setLoading(true);
      try {
        const articles = await getRelatedArticles(article, locale as Locale, 4);
        if (isMounted) {
          setRelatedArticles(articles);
        }
      } catch (error) {
        console.error('Failed to fetch related articles:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRelatedArticles();

    return () => {
      isMounted = false;
    };
  }, [article.id, article.chapterId, article.sectionId, locale]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <motion.section
        id="related"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-text-primary">
            <Link2 className="h-5 w-5 text-primary-600" />
            {t('relatedArticles')}
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
        </div>
      </motion.section>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="related"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-text-primary">
          <Link2 className="h-5 w-5 text-primary-600" />
          {t('relatedArticles')}
        </h2>

        {/* Scroll Controls - Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => scroll('left')}
            className="rounded-lg bg-gov-light p-2 text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-600"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="rounded-lg bg-gov-light p-2 text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-600"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        className={cn(
          '-mx-4 flex gap-4 overflow-x-auto px-4 pb-4',
          'scrollbar-hide',
          'md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4'
        )}
      >
        {relatedArticles.map((relArticle, index) => (
          <motion.div
            key={relArticle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="w-[280px] flex-shrink-0 md:w-auto"
          >
            <Link href={`/${locale}/articles/${relArticle.id}`}>
              <article
                className={cn(
                  'h-full rounded-xl border border-gov-border bg-gov-surface p-4',
                  'hover:border-primary-300 hover:shadow-card-hover',
                  'group transition-all duration-200'
                )}
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Badge variant="primary" size="lg" className="font-heading">
                    {relArticle.number}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 font-medium text-text-primary transition-colors group-hover:text-primary-700">
                  {getLocalizedText(relArticle.title, locale)}
                </h3>

                {/* Section/Chapter */}
                <p className="mb-3 text-xs text-text-muted">
                  {relArticle.section?.number || '1'}-{t('section').toLowerCase()} →{' '}
                  {relArticle.chapter?.number || '1'}-{t('chapter').toLowerCase()}
                </p>

                {/* Comment Indicators */}
                <div className="flex items-center gap-2">
                  {relArticle.hasAuthorComment && (
                    <Badge variant="secondary" size="sm">
                      {t('authorComment')}
                    </Badge>
                  )}
                  {relArticle.hasExpertComment && (
                    <Badge variant="gold" size="sm">
                      {t('expertComment')}
                    </Badge>
                  )}
                </div>

                {/* Read More */}
                <div className="mt-4 border-t border-gov-border pt-3">
                  <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                    {t('readMore')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <Link
          href={`/${locale}/articles?chapter=${article.chapterId}`}
          className="inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700"
        >
          {t('viewAllChapter', { chapter: article.chapter?.number || '1' })}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.section>
  );
}

export default RelatedArticles;
