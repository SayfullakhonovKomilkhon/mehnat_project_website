'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Calendar, 
  Printer, 
  Share2, 
  BookOpen,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, GovVerifiedBadge } from '@/components/ui';
import { Article, getLocalizedText } from '@/lib/mock-data';

interface ArticleHeaderProps {
  article: Article;
  locale: string;
}

export function ArticleHeader({ article, locale }: ArticleHeaderProps) {
  const title = getLocalizedText(article.title, locale);
  const sectionTitle = getLocalizedText(article.section.title, locale);
  const chapterTitle = getLocalizedText(article.chapter.title, locale);

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
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link 
          href={`/${locale}`} 
          className="hover:text-primary-600 transition-colors"
        >
          Bosh sahifa
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <Link 
          href={`/${locale}/articles`}
          className="hover:text-primary-600 transition-colors"
        >
          Moddalar
        </Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-text-primary font-medium">
          {article.number}-modda
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
                  {article.number}-modda
                </Badge>
                <GovVerifiedBadge size="sm">
                  Rasmiy matn
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
                <span className="font-medium">{article.section.number}-bo'lim:</span>
                <span>{sectionTitle}</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="flex items-center gap-1">
                <span className="font-medium">{article.chapter.number}-bob:</span>
                <span>{chapterTitle}</span>
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Oxirgi yangilanish: {new Date(article.updatedAt).toLocaleDateString('uz-UZ')}
              </span>
              {article.hasAuthorComment && (
                <Badge variant="primary" size="sm">
                  Muallif sharhi mavjud
                </Badge>
              )}
              {article.hasExpertComment && (
                <Badge variant="gold" size="sm">
                  Ekspert sharhi mavjud
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
              <span className="hidden sm:inline">Chop etish</span>
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
              <span className="hidden sm:inline">Ulashish</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default ArticleHeader;



