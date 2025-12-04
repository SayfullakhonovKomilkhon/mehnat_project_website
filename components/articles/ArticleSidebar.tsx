'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileText, 
  User, 
  Scale, 
  Link2, 
  MessageCircle,
  ChevronRight,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { Article, articles as allArticles, getLocalizedText } from '@/lib/mock-data';

interface ArticleSidebarProps {
  article: Article;
  locale: string;
}

const navItems = [
  { id: 'content', label: 'Modda mazmuni', icon: FileText },
  { id: 'author', label: 'Muallif sharhi', icon: User },
  { id: 'expert', label: 'Ekspert sharhi', icon: Scale },
  { id: 'related', label: "Bog'liq moddalar", icon: Link2 },
];

const languages = [
  { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function ArticleSidebar({ article, locale }: ArticleSidebarProps) {
  const [activeSection, setActiveSection] = useState('content');
  const pathname = usePathname();
  const router = useRouter();

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        behavior: 'smooth'
      });
    }
  };

  const handleLanguageChange = (langCode: string) => {
    const newPath = pathname.replace(`/${locale}/`, `/${langCode}/`);
    router.push(newPath);
  };

  // Get related articles (same chapter)
  const relatedArticles = allArticles
    .filter(a => a.chapter.id === article.chapter.id && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Table of Contents */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gov-surface rounded-xl border border-gov-border p-4"
      >
        <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-600" />
          Mundarija
        </h3>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-text-secondary hover:bg-gov-light hover:text-text-primary'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Language Switcher */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gov-surface rounded-xl border border-gov-border p-4"
      >
        <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary-600" />
          Tilni o'zgartirish
        </h3>
        <div className="space-y-2">
          {languages.map((lang) => {
            const isAvailable = article.translations.includes(lang.code as 'uz' | 'ru' | 'en');
            const isActive = locale === lang.code;
            
            return (
              <button
                key={lang.code}
                onClick={() => isAvailable && handleLanguageChange(lang.code)}
                disabled={!isAvailable}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : isAvailable
                      ? 'text-text-secondary hover:bg-gov-light hover:text-text-primary'
                      : 'text-text-muted cursor-not-allowed opacity-50'
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
                {!isAvailable && (
                  <Badge variant="default" size="sm" className="ml-auto">
                    Mavjud emas
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Links */}
      {relatedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gov-surface rounded-xl border border-gov-border p-4"
        >
          <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary-600" />
            Tezkor havolalar
          </h3>
          <div className="space-y-2">
            {relatedArticles.map((relArticle) => (
              <Link
                key={relArticle.id}
                href={`/${locale}/articles/${relArticle.id}`}
                className="block p-3 rounded-lg bg-gov-light hover:bg-primary-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <Badge variant="primary" size="sm" className="flex-shrink-0">
                    {relArticle.number}
                  </Badge>
                  <span className="text-sm text-text-secondary group-hover:text-primary-700 line-clamp-2">
                    {getLocalizedText(relArticle.title, locale)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Ask Question CTA */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-4 text-white"
      >
        <MessageCircle className="w-8 h-8 mb-3 opacity-80" />
        <h3 className="font-heading font-semibold mb-2">
          Savolingiz bormi?
        </h3>
        <p className="text-sm text-white/80 mb-4">
          Ushbu modda bo'yicha savolingiz bo'lsa, AI yordamchimizdan so'rang
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          Savol berish
        </Button>
      </motion.div>
    </div>
  );
}

export default ArticleSidebar;




