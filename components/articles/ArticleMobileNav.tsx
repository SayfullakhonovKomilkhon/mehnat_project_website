'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article, articles as allArticles } from '@/lib/mock-data';

interface ArticleMobileNavProps {
  article: Article;
  locale: string;
}

export function ArticleMobileNav({ article, locale }: ArticleMobileNavProps) {
  // Get prev/next articles
  const currentIndex = allArticles.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-gov-border bg-gov-surface shadow-lg lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
          {/* Prev Article */}
          {prevArticle ? (
            <Link
              href={`/${locale}/articles/${prevArticle.id}`}
              className="flex min-w-0 items-center gap-1 text-text-secondary transition-colors hover:text-primary-600 sm:gap-2"
            >
              <ChevronLeft className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
              <span className="max-w-[60px] truncate text-xs sm:max-w-none sm:text-sm">
                {prevArticle.number}-modda
              </span>
            </Link>
          ) : (
            <div className="w-16 sm:w-24" />
          )}

          {/* Center - Article Number */}
          <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-primary-50 px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
            <span className="text-xs font-medium text-primary-700 sm:text-sm">
              {article.number}-modda
            </span>
          </div>

          {/* Next Article */}
          {nextArticle ? (
            <Link
              href={`/${locale}/articles/${nextArticle.id}`}
              className="flex min-w-0 items-center gap-1 text-text-secondary transition-colors hover:text-primary-600 sm:gap-2"
            >
              <span className="max-w-[60px] truncate text-xs sm:max-w-none sm:text-sm">
                {nextArticle.number}-modda
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
            </Link>
          ) : (
            <div className="w-16 sm:w-24" />
          )}
        </div>
      </div>
    </>
  );
}

export default ArticleMobileNav;
