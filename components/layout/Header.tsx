'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Menu, 
  Search, 
  Phone, 
  Facebook,
  Instagram,
  Send,
  Home,
  FileText,
  Layers,
  Info,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessibilityPanel } from '@/components/ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GovEmblem } from './GovEmblem';
import { SearchOverlay } from './SearchOverlay';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check if a nav item is active
  const isActive = useCallback((href: string) => {
    // For home page, exact match
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    // For other pages, check if pathname starts with href
    return pathname.startsWith(href);
  }, [pathname, locale]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: `/${locale}`, label: t('common.home'), icon: Home },
    { href: `/${locale}/sections`, label: t('sections.title'), icon: Layers },
    { href: `/${locale}/articles`, label: t('common.articles'), icon: FileText },
    { href: `/${locale}/about`, label: t('common.about'), icon: Info },
    { href: `/${locale}/contact`, label: t('common.contact'), icon: MessageSquare },
  ];

  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <>
      {/* Skip to Main Content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-800 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Government Top Stripe */}
      <div className="h-1 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-gold" />

      {/* Top Bar - Government Info */}
      <TopBar locale={locale} />

      {/* Main Header */}
      <header
        className={cn(
          'bg-gov-surface border-b border-gov-border sticky top-0 z-50',
          'transition-all duration-300',
          isScrolled && 'shadow-lg shadow-primary-900/5'
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Logo & Branding */}
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-2 sm:gap-3 lg:gap-4 group flex-shrink-0"
              aria-label={t('header.title')}
            >
              <div className="transition-transform duration-200 group-hover:scale-105">
                <GovEmblem size="lg" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              </div>
              <div>
                <h1 className="font-heading text-sm sm:text-base lg:text-lg font-bold text-primary-800 leading-tight">
                  {t('header.title')}
                </h1>
                <p className="hidden sm:block text-[10px] lg:text-xs text-text-secondary leading-tight max-w-[200px] lg:max-w-none truncate">
                  {t('common.officialPortal')}
                </p>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      active
                        ? 'text-primary-800 font-bold bg-primary-50'
                        : 'text-text-secondary font-medium hover:text-primary-800 hover:bg-primary-50'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <item.icon className={cn('w-4 h-4', active && 'text-primary-600')} />
                    {item.label}
                    {/* Active indicator line */}
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  'p-2.5 rounded-lg',
                  'text-text-secondary hover:text-primary-800 hover:bg-primary-50',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                )}
                aria-label={t('common.search')}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language Switcher - Desktop */}
              <div className="hidden md:block">
                <LanguageSwitcher locale={locale} variant="buttons" />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  'xl:hidden p-2.5 rounded-lg',
                  'text-primary-800 hover:bg-primary-50',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                )}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={closeSearch}
        locale={locale}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        locale={locale}
        navItems={navItems}
      />
    </>
  );
}

// Top Bar Component
function TopBar({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <div className="bg-primary-800 text-white py-2 hidden lg:block">
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Left: Ministry & Hotline */}
          <div className="flex items-center gap-6">
            <span className="text-xs text-primary-200 max-w-md truncate">
              {t('header.subtitle')}
            </span>
            <div className="h-4 w-px bg-primary-600" />
            <a 
              href="tel:1172" 
              className="flex items-center gap-2 text-sm font-medium hover:text-accent-gold transition-colors group"
            >
              <Phone className="w-4 h-4 text-accent-gold" />
              <span>{t('header.hotline')}:</span>
              <span className="font-bold group-hover:underline">1172</span>
            </a>
          </div>

          {/* Right: Accessibility & Social */}
          <div className="flex items-center gap-4">
            {/* Accessibility Panel */}
            <div className="border-r border-primary-600 pr-4">
              <AccessibilityPanel />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-primary-700 rounded transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-primary-700 rounded transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://t.me/mehnatuz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-primary-700 rounded transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
