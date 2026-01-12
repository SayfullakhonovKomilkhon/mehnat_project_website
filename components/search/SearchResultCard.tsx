'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FileText, MessageSquare, ArrowRight } from 'lucide-react';
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
    if (result.matchedIn.includes('comment')) {
      return <MessageSquare className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  // Get badge based on match type
  const getMatchBadge = () => {
    if (result.matchedIn.includes('title')) {
      return (
        <Badge variant="primary" size="sm">
          {t('inTitle')}
        </Badge>
      );
    }
    if (result.matchedIn.includes('content')) {
      return (
        <Badge variant="secondary" size="sm">
          {t('inContent')}
        </Badge>
      );
    }
    if (result.matchedIn.includes('comment')) {
      return (
        <Badge variant="primary" size="sm">
          {t('inComment')}
        </Badge>
      );
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
        <article
          className={cn(
            'group rounded-lg border border-gov-border bg-gov-surface sm:rounded-xl',
            'p-3 hover:border-primary-300 hover:shadow-card-hover sm:p-4 md:p-5',
            'transition-all duration-200'
          )}
        >
          <div className="flex gap-3 sm:gap-4">
            {/* Icon */}
            <div
              className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
                'bg-primary-100 text-primary-600 group-hover:bg-primary-200',
                'transition-colors'
              )}
            >
              {getTypeIcon()}
            </div>

            {/* Content - Fixed height structure */}
            <div className="min-w-0 flex-1">
              {/* Header */}
              <div className="mb-1.5 flex items-start justify-between gap-2 sm:mb-2 sm:gap-3">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge variant="gov" size="sm" className="text-[10px] sm:text-xs">
                    {tArticle('articleNumber')}
                  </Badge>
                  {getMatchBadge()}
                </div>
                {result.relevanceScore > 10 && (
                  <span className="whitespace-nowrap text-[10px] font-medium text-accent-amber sm:text-xs">
                    ★ {t('relevant')}
                  </span>
                )}
              </div>

              {/* Title with highlighting - Fixed to 1 line */}
              <h3
                className="mb-1.5 line-clamp-1 font-heading text-sm font-semibold text-text-primary transition-colors group-hover:text-primary-700 sm:mb-2 sm:text-base md:text-lg"
                dangerouslySetInnerHTML={{
                  __html: highlightMatches(result.title, query),
                }}
              />

              {/* Excerpt with highlighting - Fixed to 2 lines */}
              <p
                className="mb-2 line-clamp-2 text-xs leading-relaxed text-text-secondary sm:mb-3 sm:text-sm"
                dangerouslySetInnerHTML={{
                  __html: highlightMatches(result.excerpt, query),
                }}
              />

              {/* Footer */}
              <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 truncate text-[10px] text-text-muted sm:text-xs">
                  <span className="truncate">{result.breadcrumb}</span>
                </div>

                {/* Read more - Always visible on mobile */}
                <span className="flex flex-shrink-0 items-center gap-0.5 text-xs font-medium text-primary-600 transition-opacity group-hover:text-primary-700 sm:gap-1 sm:text-sm sm:opacity-0 sm:group-hover:opacity-100">
                  <span className="hidden sm:inline">{tArticle('readMore')}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default SearchResultCard;
