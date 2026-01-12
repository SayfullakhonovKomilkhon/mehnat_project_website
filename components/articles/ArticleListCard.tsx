'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { getLocalizedText } from '@/lib/api';
import type { Article } from '@/types';

interface ArticleListCardProps {
  article: Article;
  locale: string;
  view: 'grid' | 'list';
  index: number;
}

export function ArticleListCard({ article, locale, view, index }: ArticleListCardProps) {
  const t = useTranslations();
  const title = getLocalizedText(article.title, locale);
  const excerpt = getLocalizedText(article.excerpt, locale);

  if (view === 'list') {
    return (
      <div className="animate-fadeIn" style={{ animationDelay: `${index * 0.03}s` }}>
        <Link href={`/${locale}/articles/${article.id}`}>
          <article
            className={cn(
              'group rounded-lg border border-gov-border bg-gov-surface sm:rounded-xl',
              'p-3 hover:border-primary-300 hover:shadow-card-hover sm:p-4 md:p-6',
              'transition-all duration-200'
            )}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Article Number */}
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 sm:h-16 sm:w-16 sm:rounded-xl">
                  <span className="font-heading text-lg font-bold text-primary-700 sm:text-xl">
                    {article.number}
                  </span>
                </div>
              </div>

              {/* Content - Fixed height structure */}
              <div className="min-w-0 flex-1">
                {/* Breadcrumb */}
                <div className="mb-1 flex items-center gap-1 text-[10px] text-text-muted sm:mb-2 sm:text-xs">
                  <span>
                    {article.section.number}-{t('breadcrumb.section')}
                  </span>
                  <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>
                    {article.chapter.number}-{t('breadcrumb.chapter')}
                  </span>
                </div>

                {/* Title - Fixed to 1 line */}
                <h3 className="mb-1 line-clamp-1 font-heading text-sm font-semibold text-text-primary transition-colors group-hover:text-primary-700 sm:mb-2 sm:text-base md:text-lg">
                  {title}
                </h3>

                {/* Excerpt - Fixed to 2 lines */}
                <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
                  {excerpt}
                </p>
              </div>

              {/* Arrow - Hidden on mobile */}
              <div className="hidden items-center self-center md:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gov-light transition-colors group-hover:bg-primary-50">
                  <ArrowRight className="h-5 w-5 text-text-muted transition-colors group-hover:text-primary-600" />
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>
    );
  }

  // Grid View
  return (
    <div className="animate-fadeIn" style={{ animationDelay: `${index * 0.03}s` }}>
      <Link href={`/${locale}/articles/${article.id}`}>
        <article
          className={cn(
            'group h-full rounded-lg border border-gov-border bg-gov-surface sm:rounded-xl',
            'p-3 hover:border-primary-300 hover:shadow-card-hover sm:p-4 md:p-5',
            'flex flex-col transition-all duration-200'
          )}
        >
          {/* Header */}
          <div className="mb-2 flex items-start justify-between sm:mb-3">
            <Badge variant="primary" size="md" className="font-heading text-xs sm:text-sm">
              {article.number}-{t('badges.article')}
            </Badge>
          </div>

          {/* Breadcrumb */}
          <div className="mb-1.5 flex items-center gap-1 text-[10px] text-text-muted sm:mb-2 sm:text-xs">
            <span>{article.section.number}</span>
            <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>
              {article.chapter.number}-{t('breadcrumb.chapter')}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 line-clamp-2 flex-grow font-heading text-sm font-semibold text-text-primary transition-colors group-hover:text-primary-700 sm:mb-2 sm:text-base">
            {title}
          </h3>

          {/* Excerpt - Hidden on very small mobile */}
          <p className="mb-3 line-clamp-2 hidden text-xs leading-relaxed text-text-secondary sm:mb-4 sm:line-clamp-3 sm:block sm:text-sm">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-gov-border pt-2 sm:pt-3">
            <div className="flex items-center gap-1">
              {article.hasComment && (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 sm:h-6 sm:w-6"
                  title={t('article.comment')}
                >
                  <MessageSquare className="h-2.5 w-2.5 text-primary-600 sm:h-3 sm:w-3" />
                </span>
              )}
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-primary-600 group-hover:text-primary-700 sm:gap-1 sm:text-sm">
              {t('badges.readMore')}
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default ArticleListCard;
