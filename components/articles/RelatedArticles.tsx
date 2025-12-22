'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { Article, articles as allArticles, getLocalizedText } from '@/lib/mock-data';
import { useRef } from 'react';

interface RelatedArticlesProps {
  article: Article;
  locale: string;
}

export function RelatedArticles({ article, locale }: RelatedArticlesProps) {
  const t = useTranslations('article');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get related articles from same chapter + some from same section
  const sameChapter = allArticles
    .filter(a => a.chapter.id === article.chapter.id && a.id !== article.id)
    .slice(0, 2);
  
  const sameSection = allArticles
    .filter(a => 
      a.section.id === article.section.id && 
      a.chapter.id !== article.chapter.id && 
      a.id !== article.id
    )
    .slice(0, 2);

  const relatedArticles = [...sameChapter, ...sameSection];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-text-primary flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary-600" />
          {t('relatedArticles')}
        </h2>
        
        {/* Scroll Controls - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-gov-light hover:bg-primary-50 text-text-secondary hover:text-primary-600 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-gov-light hover:bg-primary-50 text-text-secondary hover:text-primary-600 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        ref={scrollRef}
        className={cn(
          'flex gap-4 overflow-x-auto pb-4 -mx-4 px-4',
          'scrollbar-hide',
          'md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:mx-0 md:px-0'
        )}
      >
        {relatedArticles.map((relArticle, index) => (
          <motion.div
            key={relArticle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex-shrink-0 w-[280px] md:w-auto"
          >
            <Link href={`/${locale}/articles/${relArticle.id}`}>
              <article className={cn(
                'h-full bg-gov-surface rounded-xl border border-gov-border p-4',
                'hover:border-primary-300 hover:shadow-card-hover',
                'transition-all duration-200 group'
              )}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant="primary" size="lg" className="font-heading">
                    {relArticle.number}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-medium text-text-primary group-hover:text-primary-700 line-clamp-2 mb-2 transition-colors">
                  {getLocalizedText(relArticle.title, locale)}
                </h3>

                {/* Section/Chapter */}
                <p className="text-xs text-text-muted mb-3">
                  {relArticle.section.number}-{t('section').toLowerCase()} → {relArticle.chapter.number}-{t('chapter').toLowerCase()}
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
                <div className="mt-4 pt-3 border-t border-gov-border">
                  <span className="text-sm text-primary-600 group-hover:text-primary-700 font-medium flex items-center gap-1">
                    {t('readMore')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          href={`/${locale}/articles?chapter=${article.chapter.id}`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          {t('viewAllChapter', { chapter: article.chapter.number })}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.section>
  );
}

export default RelatedArticles;





