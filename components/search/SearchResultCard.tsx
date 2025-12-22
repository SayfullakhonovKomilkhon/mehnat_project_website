'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FileText, MessageSquare, User, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { highlightMatches, type SearchResult } from '@/lib/search-utils';

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
  index: number;
}

export function SearchResultCard({ result, query, index }: SearchResultCardProps) {
  const t = useTranslations('search');
  const tArticle = useTranslations('article');
  // Get icon based on matched content
  const getTypeIcon = () => {
    if (result.matchedIn.includes('authorComment')) {
      return <User className="w-4 h-4" />;
    }
    if (result.matchedIn.includes('expertComment')) {
      return <MessageSquare className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  // Get badge based on match type
  const getMatchBadge = () => {
    if (result.matchedIn.includes('title')) {
      return <Badge variant="primary" size="sm">{t('inTitle')}</Badge>;
    }
    if (result.matchedIn.includes('content')) {
      return <Badge variant="secondary" size="sm">{t('inContent')}</Badge>;
    }
    if (result.matchedIn.includes('authorComment')) {
      return <Badge variant="primary" size="sm">{t('inAuthorComment')}</Badge>;
    }
    if (result.matchedIn.includes('expertComment')) {
      return <Badge variant="gold" size="sm">{t('inExpertComment')}</Badge>;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={result.url}>
        <article className={cn(
          'group bg-gov-surface rounded-lg sm:rounded-xl border border-gov-border',
          'p-3 sm:p-4 md:p-5 hover:border-primary-300 hover:shadow-card-hover',
          'transition-all duration-200'
        )}>
          <div className="flex gap-3 sm:gap-4">
            {/* Icon */}
            <div className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0',
              'bg-primary-100 text-primary-600 group-hover:bg-primary-200',
              'transition-colors'
            )}>
              {getTypeIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Badge variant="gov" size="sm" className="text-[10px] sm:text-xs">
                    {tArticle('articleNumber')}
                  </Badge>
                  {getMatchBadge()}
                </div>
                {result.relevanceScore > 10 && (
                  <span className="text-[10px] sm:text-xs text-accent-amber font-medium whitespace-nowrap">
                    ★ {t('relevant')}
                  </span>
                )}
              </div>

              {/* Title with highlighting */}
              <h3 
                className="font-heading text-sm sm:text-base md:text-lg font-semibold text-text-primary mb-1.5 sm:mb-2 group-hover:text-primary-700 transition-colors line-clamp-2"
                dangerouslySetInnerHTML={{ 
                  __html: highlightMatches(result.title, query) 
                }}
              />

              {/* Excerpt with highlighting - Hidden on very small screens */}
              <p 
                className="hidden sm:block text-text-secondary text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2"
                dangerouslySetInnerHTML={{ 
                  __html: highlightMatches(result.excerpt, query) 
                }}
              />

              {/* Footer */}
              <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-text-muted truncate">
                  <span className="truncate">{result.breadcrumb}</span>
                </div>

                {/* Read more - Always visible on mobile */}
                <span className="text-xs sm:text-sm text-primary-600 group-hover:text-primary-700 font-medium flex items-center gap-0.5 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <span className="hidden sm:inline">{tArticle('readMore')}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>

              {/* Comment indicators - Hidden on very small screens */}
              {result.article && (result.article.hasAuthorComment || result.article.hasExpertComment) && (
                <div className="hidden sm:flex items-center gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gov-border">
                  {result.article.hasAuthorComment && (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-text-muted">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-500" />
                      <span className="hidden sm:inline">{tArticle('authorComment')}</span>
                    </span>
                  )}
                  {result.article.hasExpertComment && (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-text-muted">
                      <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-amber" />
                      <span className="hidden sm:inline">{tArticle('expertComment')}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default SearchResultCard;





