'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare, User, ChevronRight } from 'lucide-react';
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
      <div
        className="animate-fadeIn"
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        <Link href={`/${locale}/articles/${article.id}`}>
          <article
            className={cn(
              'group bg-gov-surface rounded-lg sm:rounded-xl border border-gov-border',
              'p-3 sm:p-4 md:p-6 hover:border-primary-300 hover:shadow-card-hover',
              'transition-all duration-200'
            )}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Article Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-primary-50 flex items-center justify-center">
                  <span className="text-lg sm:text-xl font-heading font-bold text-primary-700">
                    {article.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-text-muted mb-1 sm:mb-2">
                  <span>{article.section.number}-{t('breadcrumb.section')}</span>
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{article.chapter.number}-{t('breadcrumb.chapter')}</span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-sm sm:text-base md:text-lg font-semibold text-text-primary mb-1 sm:mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {title}
                </h3>

                {/* Excerpt - Hidden on very small mobile */}
                <p className="hidden sm:block text-text-secondary text-sm leading-relaxed line-clamp-2 mb-2 sm:mb-3">
                  {excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {article.hasAuthorComment && (
                    <Badge variant="primary" size="sm" className="text-[10px] sm:text-xs">
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                      <span className="hidden sm:inline">{t('article.authorComment')}</span>
                      <span className="sm:hidden">Sharh</span>
                    </Badge>
                  )}
                  {article.hasExpertComment && (
                    <Badge variant="gold" size="sm" className="text-[10px] sm:text-xs">
                      <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                      <span className="hidden sm:inline">{t('article.expertComment')}</span>
                      <span className="sm:hidden">Ekspert</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Arrow - Hidden on mobile */}
              <div className="hidden md:flex items-center">
                <div className="w-10 h-10 rounded-full bg-gov-light group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors" />
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
    <div
      className="animate-fadeIn"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <Link href={`/${locale}/articles/${article.id}`}>
        <article
          className={cn(
            'group bg-gov-surface rounded-lg sm:rounded-xl border border-gov-border h-full',
            'p-3 sm:p-4 md:p-5 hover:border-primary-300 hover:shadow-card-hover',
            'transition-all duration-200 flex flex-col'
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <Badge variant="primary" size="md" className="font-heading text-xs sm:text-sm">
              {article.number}-{t('badges.article')}
            </Badge>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-text-muted mb-1.5 sm:mb-2">
            <span>{article.section.number}</span>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{article.chapter.number}-{t('breadcrumb.chapter')}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-sm sm:text-base font-semibold text-text-primary mb-1.5 sm:mb-2 group-hover:text-primary-700 transition-colors line-clamp-2 flex-grow">
            {title}
          </h3>

          {/* Excerpt - Hidden on very small mobile */}
          <p className="hidden sm:block text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gov-border mt-auto">
            <div className="flex items-center gap-1">
              {article.hasAuthorComment && (
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-50 flex items-center justify-center" title={t('article.authorComment')}>
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-600" />
                </span>
              )}
              {article.hasExpertComment && (
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent-gold/10 flex items-center justify-center" title={t('article.expertComment')}>
                  <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent-amber" />
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-0.5 sm:gap-1">
              {t('badges.readMore')}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default ArticleListCard;
