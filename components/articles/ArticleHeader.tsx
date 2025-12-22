'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  ChevronRight, 
  Calendar, 
  Printer, 
  Share2, 
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, GovVerifiedBadge } from '@/components/ui';
import { Article, getLocalizedText } from '@/lib/mock-data';
import { formatDate } from '@/lib/date-utils';

interface ArticleHeaderProps {
  article: Article;
  locale: string;
}

export function ArticleHeader({ article, locale }: ArticleHeaderProps) {
  const t = useTranslations('article');
  const title = getLocalizedText(article.title, locale);
  const sectionTitle = getLocalizedText(article.section.title, locale);
  const chapterTitle = getLocalizedText(article.chapter.title, locale);
  
  // State for client-side date formatting to avoid hydration mismatch
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  // Format date only on client side for consistent rendering
  useEffect(() => {
    if (article.updatedAt) {
      setFormattedDate(formatDate(article.updatedAt));
    }
  }, [article.updatedAt]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${article.number}-modda: ${title}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      if (typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <header className="mb-8 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link 
          href={`/${locale}`} 
          className="hover:text-primary-600 transition-colors"
        >
          {t('home')}
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <Link 
          href={`/${locale}/articles`}
          className="hover:text-primary-600 transition-colors"
        >
          {t('articles')}
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-text-primary font-medium">
          {article.number}-{t('articleNumber').toLowerCase()}
        </span>
      </nav>

      {/* Header Content */}
      <div className="bg-gov-surface rounded-2xl border border-gov-border p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Main Info */}
          <div className="flex-1">
            {/* Article Number Badge */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg">
                <span className="text-2xl md:text-3xl font-heading font-bold text-white">
                  {article.number}
                </span>
              </div>
              <div>
                <Badge variant="primary" size="lg" className="mb-2">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {article.number}-{t('articleNumber').toLowerCase()}
                </Badge>
                <GovVerifiedBadge size="sm">
                  {t('officialText')}
                </GovVerifiedBadge>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-4 leading-tight">
              {title}
            </h1>

            {/* Section/Chapter Path */}
            <div className="flex items-center gap-2 text-text-secondary mb-4 flex-wrap">
              <Link 
                href={`/${locale}/sections/${article.section.id}`}
                className="flex items-center gap-1 hover:text-primary-600 transition-colors"
              >
                <span className="font-medium">{article.section.number}-{t('section').toLowerCase()}:</span>
                <span>{sectionTitle}</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="flex items-center gap-1">
                <span className="font-medium">{article.chapter.number}-{t('chapter').toLowerCase()}:</span>
                <span>{chapterTitle}</span>
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{t('lastUpdated')}:</span>
                {/* Date formatted on client to avoid hydration mismatch */}
                <span suppressHydrationWarning>
                  {formattedDate || formatDate(article.updatedAt)}
                </span>
              </span>
              {article.hasAuthorComment && (
                <Badge variant="primary" size="sm">
                  {t('hasAuthorComment')}
                </Badge>
              )}
              {article.hasExpertComment && (
                <Badge variant="gold" size="sm">
                  {t('hasExpertComment')}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-3">
            <button
              onClick={handlePrint}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                'bg-gov-light border border-gov-border',
                'text-text-secondary hover:text-primary-600 hover:border-primary-300',
                'transition-all duration-200'
              )}
              aria-label="Print article"
            >
              <Printer className="w-5 h-5" />
              <span className="hidden sm:inline">{t('print')}</span>
            </button>
            <button
              onClick={handleShare}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                'bg-gov-light border border-gov-border',
                'text-text-secondary hover:text-primary-600 hover:border-primary-300',
                'transition-all duration-200'
              )}
              aria-label="Share article"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">{t('share')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ArticleHeader;
