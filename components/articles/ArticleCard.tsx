'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, User, ChevronRight } from 'lucide-react';
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

// Translation flags
const translationFlags: Record<string, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
};

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  const title = getLocalizedText(article.title, locale);
  const excerpt = getLocalizedText(article.excerpt, locale);
  const sectionTitle = getLocalizedText(article.section.title, locale);
  const chapterTitle = getLocalizedText(article.chapter.title, locale);

  if (variant === 'compact') {
    return (
      <Link href={`/${locale}/articles/${article.id}`}>
        <article
          className={cn(
            'group p-4 rounded-lg border border-gov-border bg-gov-surface',
            'hover:border-primary-300 hover:shadow-sm transition-all duration-200'
          )}
        >
          <div className="flex items-start gap-3">
            <Badge variant="primary" size="sm" className="flex-shrink-0">
              {article.number}
            </Badge>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm text-text-primary group-hover:text-primary-700 line-clamp-2 transition-colors">
                {title}
              </h4>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-text-muted">
                {article.hasAuthorComment && (
                  <span className="flex items-center gap-0.5">
                    <User className="w-3 h-3" />
                  </span>
                )}
                {article.hasExpertComment && (
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="w-3 h-3" />
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
            'group bg-gov-surface rounded-xl border border-gov-border',
            'p-6 hover:border-primary-300 hover:shadow-card-hover',
            'transition-all duration-200'
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <Badge variant="primary" size="lg" className="font-heading">
              {article.number}-modda
            </Badge>
            <div className="flex items-center gap-1">
              {article.translations.map(lang => (
                <span 
                  key={lang} 
                  className="text-sm"
                  title={lang.toUpperCase()}
                >
                  {translationFlags[lang]}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
            <span>{article.section.number}-bo'lim</span>
            <ChevronRight className="w-3 h-3" />
            <span>{article.chapter.number}-bob</span>
          </div>

          <h3 className="font-heading text-xl font-semibold text-text-primary mb-3 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>

          <p className="text-text-secondary leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gov-border">
            <div className="flex items-center gap-2">
              {article.hasAuthorComment && (
                <Badge variant="primary" size="sm">
                  <User className="w-3 h-3 mr-1" />
                  Muallif sharhi
                </Badge>
              )}
              {article.hasExpertComment && (
                <Badge variant="gold" size="sm">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Ekspert sharhi
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
              Batafsil
              <ArrowRight className="w-4 h-4" />
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
          'group bg-gov-surface rounded-xl border border-gov-border h-full',
          'p-5 hover:border-primary-300 hover:shadow-card-hover',
          'transition-all duration-200 flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant="primary" size="lg" className="font-heading">
            {article.number}-modda
          </Badge>
          <div className="flex items-center gap-0.5">
            {article.translations.map(lang => (
              <span 
                key={lang} 
                className="text-xs"
                title={lang.toUpperCase()}
              >
                {translationFlags[lang]}
              </span>
            ))}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
          <span>{article.section.number}</span>
          <ChevronRight className="w-3 h-3" />
          <span>{article.chapter.number}-bob</span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-base font-semibold text-text-primary mb-2 group-hover:text-primary-700 transition-colors line-clamp-2 flex-grow">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gov-border mt-auto">
          <div className="flex items-center gap-1.5">
            {article.hasAuthorComment && (
              <span className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center" title="Muallif sharhi">
                <User className="w-3 h-3 text-primary-600" />
              </span>
            )}
            {article.hasExpertComment && (
              <span className="w-6 h-6 rounded-full bg-accent-gold/10 flex items-center justify-center" title="Ekspert sharhi">
                <MessageSquare className="w-3 h-3 text-accent-amber" />
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
            Batafsil
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default ArticleCard;
