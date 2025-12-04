'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { Article, getLocalizedText } from '@/lib/mock-data';

interface ArticleListCardProps {
  article: Article;
  locale: string;
  view: 'grid' | 'list';
  index: number;
}

// Translation flags
const translationFlags: Record<string, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
};

export function ArticleListCard({ article, locale, view, index }: ArticleListCardProps) {
  const title = getLocalizedText(article.title, locale);
  const excerpt = getLocalizedText(article.excerpt, locale);
  const sectionTitle = getLocalizedText(article.section.title, locale);
  const chapterTitle = getLocalizedText(article.chapter.title, locale);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link href={`/${locale}/articles/${article.id}`}>
          <article
            className={cn(
              'group bg-gov-surface rounded-xl border border-gov-border',
              'p-4 md:p-6 hover:border-primary-300 hover:shadow-card-hover',
              'transition-all duration-200'
            )}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Article Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
                  <span className="text-xl font-heading font-bold text-primary-700">
                    {article.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                  <span>{article.section.number}-bo'lim</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{article.chapter.number}-bob</span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
                  {excerpt}
                </p>

                {/* Tags & Translations */}
                <div className="flex flex-wrap items-center gap-2">
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
                  <div className="flex items-center gap-1 text-sm">
                    {article.translations.map(lang => (
                      <span 
                        key={lang} 
                        className={cn(
                          'opacity-40',
                          article.translations.includes(lang) && 'opacity-100'
                        )}
                        title={lang.toUpperCase()}
                      >
                        {translationFlags[lang]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center">
                <div className="w-10 h-10 rounded-full bg-gov-light group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
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
    </motion.div>
  );
}

export default ArticleListCard;



