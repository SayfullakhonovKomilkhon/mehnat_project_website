'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  ChevronDown,
  ChevronRight,
  Search,
  Home,
  Layers,
  FileText,
  Info,
  HelpCircle,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, GovVerifiedBadge } from '@/components/ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GovEmblem } from './GovEmblem';
import { sections, getLocalizedText } from '@/lib/mock-data';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { href: string; label: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  navItems: NavItem[];
}

// Social icons
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

export function MobileMenu({ isOpen, onClose, locale, navItems }: MobileMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // For swipe gesture
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0], [0, 1]);

  // Build nav items with sections submenu
  const enhancedNavItems: NavItem[] = [
    { href: `/${locale}`, label: t('nav.home'), icon: Home },
    {
      href: `/${locale}/sections`,
      label: t('sections.title'),
      icon: Layers,
      children: sections.map(section => ({
        href: `/${locale}/sections/${section.id}`,
        label: `${section.number}. ${getLocalizedText(section.title, locale)}`,
      })),
    },
    { href: `/${locale}/articles`, label: t('nav.articles'), icon: FileText },
    { href: `/${locale}/about`, label: t('nav.about'), icon: Info },
    { href: `/${locale}/faq`, label: t('nav.faq'), icon: HelpCircle },
  ];

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Toggle submenu
  const toggleSubmenu = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    );
  };

  // Handle language switch with seamless transition
  const handleLanguageSwitch = (newLocale: string) => {
    if (newLocale === locale) return;

    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }

    // Create seamless transition overlay
    let overlay = document.getElementById('language-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'language-transition-overlay';
      // Use the same background as the page for seamless transition
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 200ms ease-out;
      `;
      document.body.appendChild(overlay);
    }

    // Trigger instant fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay!.style.opacity = '1';
        overlay!.style.pointerEvents = 'auto';
      });
    });

    // Wait for overlay to fully appear, then navigate
    setTimeout(() => {
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      window.location.href = newPath;
    }, 200);
  };

  // Handle pan gesture for swipe to close
  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100 || info.velocity.x < -500) {
      onClose();
    }
  };

  // Check if current page (supports nested routes)
  const isCurrentPage = (href: string) => {
    // For home page, exact match
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    // For other pages, check if pathname starts with href
    return pathname.startsWith(href);
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onClose();
      window.location.href = `/${locale}/articles?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-primary-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel - Slide from Left */}
          <motion.div
            ref={menuRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: -400, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handlePanEnd}
            style={{ x }}
            className="fixed bottom-0 left-0 top-0 z-[90] flex w-[85vw] max-w-[400px] flex-col bg-gov-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Top Stripe */}
            <div className="h-1 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-gold" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gov-border px-3 py-2.5 sm:px-4 sm:py-3">
              {/* Logo & Title */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <GovEmblem size="sm" className="h-7 w-7 flex-shrink-0 sm:h-8 sm:w-8" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-[11px] font-bold leading-tight text-primary-800 sm:text-xs">
                    {t('header.title')}
                  </p>
                  <p className="truncate text-[9px] leading-tight text-text-secondary sm:text-[10px]">
                    {t('common.officialPortal')}
                  </p>
                </div>
              </div>

              {/* Close button only */}
              <button
                onClick={onClose}
                className="ml-2 flex-shrink-0 rounded-lg p-1.5 text-text-primary transition-colors hover:bg-gov-light sm:p-2"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="border-b border-gov-border px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted sm:left-3 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={t('header.searchPlaceholder')}
                  className={cn(
                    'h-10 w-full rounded-lg pl-9 pr-3 sm:h-11 sm:pl-10 sm:pr-4',
                    'border border-gov-border bg-gov-light',
                    'text-sm text-text-primary placeholder:text-text-muted',
                    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
                  )}
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-1.5 sm:py-2" role="navigation">
              <ul className="space-y-0.5 px-2 sm:px-3">
                {enhancedNavItems.map((item, index) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedItems.includes(item.href);
                  const isCurrent = isCurrentPage(item.href);

                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {hasChildren ? (
                        // Item with submenu
                        <div>
                          <button
                            onClick={() => toggleSubmenu(item.href)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-xl px-4 py-3',
                              'transition-colors duration-200',
                              isCurrent
                                ? 'bg-primary-100 font-bold text-primary-800'
                                : 'text-text-primary hover:bg-primary-50 hover:text-primary-800',
                              isExpanded && !isCurrent && 'bg-primary-50 text-primary-800'
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                                isCurrent
                                  ? 'bg-primary-200'
                                  : isExpanded
                                    ? 'bg-primary-100'
                                    : 'bg-gov-light'
                              )}
                            >
                              <item.icon
                                className={cn(
                                  'h-5 w-5',
                                  isCurrent ? 'text-primary-700' : 'text-primary-600'
                                )}
                              />
                            </span>
                            <span
                              className={cn(
                                'flex-1 text-left',
                                isCurrent ? 'font-bold' : 'font-medium'
                              )}
                            >
                              {item.label}
                            </span>
                            {isCurrent && (
                              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary-600" />
                            )}
                            <ChevronDown
                              className={cn(
                                'h-5 w-5 text-text-muted transition-transform duration-200',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          </button>

                          {/* Submenu */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-6 overflow-hidden border-l-2 border-primary-100 pl-6"
                              >
                                {item.children?.map((child, childIndex) => (
                                  <motion.li
                                    key={child.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: childIndex * 0.03 }}
                                  >
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className={cn(
                                        'block rounded-lg px-3 py-2.5 text-sm',
                                        'text-text-secondary hover:bg-primary-50 hover:text-primary-700',
                                        'transition-colors duration-200'
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        // Regular nav item
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3',
                            'transition-colors duration-200',
                            isCurrent
                              ? 'bg-primary-100 font-bold text-primary-800'
                              : 'text-text-primary hover:bg-primary-50 hover:text-primary-800'
                          )}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          <span
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                              isCurrent ? 'bg-primary-200' : 'bg-gov-light'
                            )}
                          >
                            <item.icon
                              className={cn(
                                'h-5 w-5',
                                isCurrent ? 'text-primary-700' : 'text-primary-600'
                              )}
                            />
                          </span>
                          <span className={cn('flex-1', isCurrent ? 'font-bold' : 'font-medium')}>
                            {item.label}
                          </span>
                          {isCurrent && (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-600" />
                          )}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Contact Info */}
            <div className="border-t border-gov-border px-3 py-3 sm:px-4 sm:py-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-muted sm:mb-3 sm:text-xs">
                {t('header.hotline')}
              </p>
              <a
                href="tel:1172"
                className="flex items-center gap-2 text-base font-bold text-primary-800 transition-colors hover:text-primary-600 sm:gap-3 sm:text-lg"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 sm:h-10 sm:w-10 sm:rounded-xl">
                  <Phone className="h-4 w-4 text-primary-600 sm:h-5 sm:w-5" />
                </div>
                1172
              </a>
            </div>

            {/* Language & Social */}
            <div className="bg-primary-800 px-3 py-3 text-white sm:px-4 sm:py-4">
              {/* Language Switcher Row */}
              <div className="mb-3 sm:mb-4">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-primary-300 sm:text-xs">
                  {t('common.language')}
                </p>
                {/* Fixed inline buttons - will never wrap */}
                <div className="inline-flex items-center rounded-lg bg-primary-900/50 p-0.5">
                  <button
                    onClick={() => handleLanguageSwitch('uz')}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm',
                      locale === 'uz'
                        ? 'bg-white text-primary-800'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    UZ
                  </button>
                  <button
                    onClick={() => handleLanguageSwitch('ru')}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm',
                      locale === 'ru'
                        ? 'bg-white text-primary-800'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    RU
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-primary-700 pt-2.5 sm:pt-3">
                <span className="mb-2 block text-[10px] text-primary-300 sm:text-xs">
                  Bizni kuzating:
                </span>
                <div className="flex gap-1.5 sm:gap-2">
                  <a
                    href="https://t.me/mehaboruz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-primary-700 p-1.5 transition-colors hover:bg-primary-600 sm:p-2"
                    aria-label="Telegram"
                  >
                    <TelegramIcon />
                  </a>
                  <a
                    href="https://facebook.com/mehnat.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-primary-700 p-1.5 transition-colors hover:bg-primary-600 sm:p-2"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://instagram.com/mehnat.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-primary-700 p-1.5 transition-colors hover:bg-primary-600 sm:p-2"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
