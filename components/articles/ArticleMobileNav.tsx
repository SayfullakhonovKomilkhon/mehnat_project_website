'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  User, 
  Scale, 
  Link2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Article, articles as allArticles } from '@/lib/mock-data';

interface ArticleMobileNavProps {
  article: Article;
  locale: string;
}

const tabs = [
  { id: 'content', label: 'Mazmun', icon: FileText },
  { id: 'author', label: 'Muallif', icon: User },
  { id: 'expert', label: 'Ekspert', icon: Scale },
  { id: 'related', label: "Bog'liq", icon: Link2 },
];

export function ArticleMobileNav({ article, locale }: ArticleMobileNavProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Get prev/next articles
  const currentIndex = allArticles.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Track scroll for back to top button
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowBackToTop(window.scrollY > 500);
    });
  }

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
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Tabs - Mobile Only */}
      <div className="lg:hidden sticky top-16 z-30 bg-gov-surface border-b border-gov-border -mx-4 px-4">
        <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 py-2 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-text-secondary hover:bg-gov-light'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gov-surface border-t border-gov-border safe-area-inset-bottom">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Prev Article */}
          {prevArticle ? (
            <Link
              href={`/${locale}/articles/${prevArticle.id}`}
              className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">
                {prevArticle.number}-modda
              </span>
            </Link>
          ) : (
            <div className="w-24" />
          )}

          {/* Center - Article Number */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {article.number}-modda
            </span>
          </div>

          {/* Next Article */}
          {nextArticle ? (
            <Link
              href={`/${locale}/articles/${nextArticle.id}`}
              className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors"
            >
              <span className="text-sm">
                {nextArticle.number}-modda
              </span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="w-24" />
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
              'fixed bottom-20 right-4 lg:bottom-8 z-40',
              'w-12 h-12 rounded-full shadow-lg',
              'bg-primary-600 text-white',
              'flex items-center justify-center',
              'hover:bg-primary-700 transition-colors'
            )}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default ArticleMobileNav;



