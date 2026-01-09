'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronRight, Calendar, Printer, Share2, BookOpen } from 'lucide-react';
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
    <header className="animate-fadeIn mb-8">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-secondary"
        aria-label="Breadcrumb"
      >
        <Link href={`/${locale}`} className="transition-colors hover:text-primary-600">
          {t('home')}
        </Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <Link href={`/${locale}/articles`} className="transition-colors hover:text-primary-600">
          {t('articles')}
        </Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium text-text-primary">
          {article.number}-{t('articleNumber').toLowerCase()}
        </span>
      </nav>

      {/* Header Content */}
      <div className="rounded-2xl border border-gov-border bg-gov-surface p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Main Info */}
          <div className="flex-1">
            {/* Article Number Badge */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-lg md:h-24 md:w-24">
                <span className="font-heading text-2xl font-bold text-white md:text-3xl">
                  {article.number}
                </span>
              </div>
              <div>
                <Badge variant="primary" size="lg" className="mb-2">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {article.number}-{t('articleNumber').toLowerCase()}
                </Badge>
                <GovVerifiedBadge size="sm">{t('officialText')}</GovVerifiedBadge>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-4 font-heading text-2xl font-bold leading-tight text-text-primary md:text-3xl lg:text-4xl">
              {title}
            </h1>

            {/* Section/Chapter Path */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-text-secondary">
              <Link
                href={`/${locale}/sections/${article.section.id}`}
                className="flex items-center gap-1 transition-colors hover:text-primary-600"
              >
                <span className="font-medium">
                  {article.section.number}-{t('section').toLowerCase()}:
                </span>
                <span>{sectionTitle}</span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="flex items-center gap-1">
                <span className="font-medium">
                  {article.chapter.number}-{t('chapter').toLowerCase()}:
                </span>
                <span>{chapterTitle}</span>
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{t('lastUpdated')}:</span>
                {/* Date formatted on client to avoid hydration mismatch */}
                <span suppressHydrationWarning>
                  {formattedDate || formatDate(article.updatedAt)}
                </span>
              </span>
              {article.hasComment && (
                <Badge variant="primary" size="sm">
                  {t('hasComment')}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 lg:flex-col">
            <button
              onClick={handlePrint}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5',
                'border border-gov-border bg-gov-light',
                'text-text-secondary hover:border-primary-300 hover:text-primary-600',
                'transition-all duration-200'
              )}
              aria-label="Print article"
            >
              <Printer className="h-5 w-5" />
              <span className="hidden sm:inline">{t('print')}</span>
            </button>
            <button
              onClick={handleShare}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5',
                'border border-gov-border bg-gov-light',
                'text-text-secondary hover:border-primary-300 hover:text-primary-600',
                'transition-all duration-200'
              )}
              aria-label="Share article"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden sm:inline">{t('share')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ArticleHeader;
