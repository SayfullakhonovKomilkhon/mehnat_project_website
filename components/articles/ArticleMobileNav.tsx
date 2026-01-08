'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  FileText,
  User,
  Scale,
  Link2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Article, articles as allArticles } from '@/lib/mock-data';

interface ArticleMobileNavProps {
  article: Article;
  locale: string;
}

const tabKeys = [
  { id: 'content', labelKey: 'content', icon: FileText },
  { id: 'author', labelKey: 'authorComment', icon: User },
  { id: 'expert', labelKey: 'expertComment', icon: Scale },
  { id: 'related', labelKey: 'relatedArticles', icon: Link2 },
];

export function ArticleMobileNav({ article, locale }: ArticleMobileNavProps) {
  const t = useTranslations('article');
  const [activeTab, setActiveTab] = useState('content');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Get prev/next articles
  const currentIndex = allArticles.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Track scroll for back to top button - properly using useEffect
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Tabs - Mobile Only - Using CSS variable for header height */}
      <div className="sticky top-[64px] z-30 -mx-4 border-b border-gov-border bg-gov-surface px-2 shadow-sm sm:top-[72px] sm:px-4 lg:hidden">
        <div className="scrollbar-hide -mx-2 flex gap-0.5 overflow-x-auto px-2 py-1.5 sm:-mx-4 sm:gap-1 sm:px-4 sm:py-2">
          {tabKeys.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  'flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs transition-colors sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm',
                  isActive
                    ? 'bg-primary-100 font-medium text-primary-700'
                    : 'text-text-secondary hover:bg-gov-light'
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="xs:inline hidden">{t(tab.labelKey)}</span>
                <span className="xs:hidden">{t(tab.labelKey).slice(0, 6)}...</span>
              </button>
            );
          })}
        </div>
      </div>

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

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={cn(
              'fixed bottom-20 right-4 z-40 lg:bottom-8',
              'h-12 w-12 rounded-full shadow-lg',
              'bg-primary-600 text-white',
              'flex items-center justify-center',
              'transition-colors hover:bg-primary-700'
            )}
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default ArticleMobileNav;
