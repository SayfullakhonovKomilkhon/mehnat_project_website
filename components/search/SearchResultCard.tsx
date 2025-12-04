'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
      return <Badge variant="primary" size="sm">Sarlavhada</Badge>;
    }
    if (result.matchedIn.includes('content')) {
      return <Badge variant="secondary" size="sm">Matnda</Badge>;
    }
    if (result.matchedIn.includes('authorComment')) {
      return <Badge variant="primary" size="sm">Muallif sharhida</Badge>;
    }
    if (result.matchedIn.includes('expertComment')) {
      return <Badge variant="gold" size="sm">Ekspert sharhida</Badge>;
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
          'group bg-gov-surface rounded-xl border border-gov-border',
          'p-4 md:p-5 hover:border-primary-300 hover:shadow-card-hover',
          'transition-all duration-200'
        )}>
          <div className="flex gap-4">
            {/* Icon */}
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              'bg-primary-100 text-primary-600 group-hover:bg-primary-200',
              'transition-colors'
            )}>
              {getTypeIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="gov" size="sm">
                    Modda
                  </Badge>
                  {getMatchBadge()}
                </div>
                {result.relevanceScore > 10 && (
                  <span className="text-xs text-accent-amber font-medium">
                    ★ Mos keladi
                  </span>
                )}
              </div>

              {/* Title with highlighting */}
              <h3 
                className="font-heading text-base md:text-lg font-semibold text-text-primary mb-2 group-hover:text-primary-700 transition-colors"
                dangerouslySetInnerHTML={{ 
                  __html: highlightMatches(result.title, query) 
                }}
              />

              {/* Excerpt with highlighting */}
              <p 
                className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-2"
                dangerouslySetInnerHTML={{ 
                  __html: highlightMatches(result.excerpt, query) 
                }}
              />

              {/* Footer */}
              <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <span>{result.breadcrumb}</span>
                </div>

                {/* Read more */}
                <span className="text-sm text-primary-600 group-hover:text-primary-700 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Batafsil
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              {/* Comment indicators */}
              {result.article && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gov-border">
                  {result.article.hasAuthorComment && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <User className="w-3.5 h-3.5 text-primary-500" />
                      Muallif sharhi
                    </span>
                  )}
                  {result.article.hasExpertComment && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MessageSquare className="w-3.5 h-3.5 text-accent-amber" />
                      Ekspert sharhi
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-text-muted ml-auto">
                    {result.article.translations.map(lang => (
                      <span key={lang}>
                        {lang === 'uz' ? '🇺🇿' : lang === 'ru' ? '🇷🇺' : '🇬🇧'}
                      </span>
                    ))}
                  </span>
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




