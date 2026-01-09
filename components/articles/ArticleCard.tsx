'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageSquare, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import type { Article as ArticleType, LocalizedString } from '@/lib/mock-data';
import { getLocalizedText } from '@/lib/mock-data';

// Export the Article type for use elsewhere
export type { ArticleType as Article };

interface ArticleCardProps {
  article: ArticleType;
  locale: string;
  variant?: 'default' | 'compact' | 'featured';
}

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  const t = useTranslations('article');
  const title = getLocalizedText(article.title, locale);
  const excerpt = getLocalizedText(article.excerpt, locale);
  const sectionTitle = getLocalizedText(article.section.title, locale);
  const chapterTitle = getLocalizedText(article.chapter.title, locale);

  if (variant === 'compact') {
    return (
      <Link href={`/${locale}/articles/${article.id}`}>
        <article
          className={cn(
            'group rounded-lg border border-gov-border bg-gov-surface p-4',
            'transition-all duration-200 hover:border-primary-300 hover:shadow-sm'
          )}
        >
          <div className="flex items-start gap-3">
            <Badge variant="primary" size="sm" className="flex-shrink-0">
              {article.number}
            </Badge>
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-sm font-medium text-text-primary transition-colors group-hover:text-primary-700">
                {title}
              </h4>
              <div className="mt-1.5 flex items-center gap-1 text-xs text-text-muted">
                {article.hasComment && (
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/${locale}/articles/${article.id}`}>
        <article
          className={cn(
            'group rounded-xl border border-gov-border bg-gov-surface',
            'p-6 hover:border-primary-300 hover:shadow-card-hover',
            'transition-all duration-200'
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <Badge variant="primary" size="lg" className="font-heading">
              {article.number}-{t('articleNumber').toLowerCase()}
            </Badge>
          </div>

          <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
            <span>
              {article.section.number}-{t('section').toLowerCase()}
            </span>
            <ChevronRight className="h-3 w-3" />
            <span>
              {article.chapter.number}-{t('chapter').toLowerCase()}
            </span>
          </div>

          <h3 className="mb-3 font-heading text-xl font-semibold text-text-primary transition-colors group-hover:text-primary-700">
            {title}
          </h3>

          <p className="mb-4 line-clamp-3 leading-relaxed text-text-secondary">{excerpt}</p>

          <div className="flex items-center justify-between border-t border-gov-border pt-4">
            <div className="flex items-center gap-2">
              {article.hasComment && (
                <Badge variant="primary" size="sm">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {t('comment')}
                </Badge>
              )}
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
              {t('readMore')}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/${locale}/articles/${article.id}`}>
      <article
        className={cn(
          'group h-full rounded-xl border border-gov-border bg-gov-surface',
          'p-5 hover:border-primary-300 hover:shadow-card-hover',
          'flex flex-col transition-all duration-200'
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <Badge variant="primary" size="lg" className="font-heading">
            {article.number}-{t('articleNumber').toLowerCase()}
          </Badge>
        </div>

        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-1 text-xs text-text-muted">
          <span>{article.section.number}</span>
          <ChevronRight className="h-3 w-3" />
          <span>
            {article.chapter.number}-{t('chapter').toLowerCase()}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 flex-grow font-heading text-base font-semibold text-text-primary transition-colors group-hover:text-primary-700">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary">{excerpt}</p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gov-border pt-3">
          <div className="flex items-center gap-1.5">
            {article.hasComment && (
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50"
                title={t('comment')}
              >
                <MessageSquare className="h-3 w-3 text-primary-600" />
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
            {t('readMore')}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default ArticleCard;
