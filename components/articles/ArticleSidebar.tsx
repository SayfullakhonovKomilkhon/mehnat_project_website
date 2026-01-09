'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FileText, User, Scale, Link2, MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { getQuickLinkArticles, getLocalizedText } from '@/lib/api';
import type { Article, Locale } from '@/types';

interface ArticleSidebarProps {
  article: Article;
  locale: string;
}

const navItemKeys = [
  { id: 'content', labelKey: 'content', icon: FileText },
  { id: 'author', labelKey: 'authorComment', icon: User },
  { id: 'expert', labelKey: 'expertComment', icon: Scale },
  { id: 'related', labelKey: 'relatedArticles', icon: Link2 },
];

export function ArticleSidebar({ article, locale }: ArticleSidebarProps) {
  const t = useTranslations('article');
  const [activeSection, setActiveSection] = useState('content');
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItemKeys.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItemKeys[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch related articles from API
  useEffect(() => {
    let isMounted = true;

    async function fetchQuickLinks() {
      setLoading(true);
      try {
        const articles = await getQuickLinkArticles(article, locale as Locale, 3);
        if (isMounted) {
          setRelatedArticles(articles);
        }
      } catch (error) {
        console.error('Failed to fetch quick link articles:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchQuickLinks();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.id, article.chapterId, locale]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
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

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Table of Contents */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gov-border bg-gov-surface p-4"
      >
        <h3 className="mb-4 flex items-center gap-2 font-heading font-semibold text-text-primary">
          <FileText className="h-4 w-4 text-primary-600" />
          {t('tableOfContents')}
        </h3>
        <nav className="space-y-1">
          {navItemKeys.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary-100 font-medium text-primary-700'
                    : 'text-text-secondary hover:bg-gov-light hover:text-text-primary'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-gov-border bg-gov-surface p-4"
      >
        <h3 className="mb-4 flex items-center gap-2 font-heading font-semibold text-text-primary">
          <Link2 className="h-4 w-4 text-primary-600" />
          {t('quickLinks')}
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
          </div>
        ) : relatedArticles.length > 0 ? (
          <div className="space-y-2">
            {relatedArticles.map(relArticle => (
              <Link
                key={relArticle.id}
                href={`/${locale}/articles/${relArticle.id}`}
                className="group block rounded-lg bg-gov-light p-3 transition-colors hover:bg-primary-50"
              >
                <div className="flex items-start gap-3">
                  <Badge variant="primary" size="sm" className="flex-shrink-0">
                    {relArticle.number}
                  </Badge>
                  <span className="line-clamp-2 text-sm text-text-secondary group-hover:text-primary-700">
                    {getLocalizedText(relArticle.title, locale)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-2 text-sm text-text-muted">
            {t('noRelatedArticles') || "Bog'liq moddalar topilmadi"}
          </p>
        )}
      </motion.div>

      {/* Ask Question CTA */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 text-white"
      >
        <MessageCircle className="mb-3 h-8 w-8 opacity-80" />
        <h3 className="mb-2 font-heading font-semibold">{t('haveQuestion')}</h3>
        <p className="mb-4 text-sm text-white/80">{t('askAIDescription')}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
        >
          {t('askQuestion')}
        </Button>
      </motion.div>
    </div>
  );
}

export default ArticleSidebar;
