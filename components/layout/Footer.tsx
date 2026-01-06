'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowUp,
  Clock,
  ChevronDown,
  Send,
  FileText,
  Scale,
  Building2,
  Shield,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { GovEmblem } from './GovEmblem';
import { GovVerifiedBadge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Social media icons as SVG components
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

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface FooterProps {
  locale: string;
}

// Mobile accordion section component - CSS-only animation
function MobileAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-primary-700/50 md:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 md:hidden"
        aria-expanded={isOpen}
      >
        <h4 className="font-heading text-base font-semibold text-white">{title}</h4>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-primary-300 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Desktop title */}
      <h4 className="mb-4 hidden items-center gap-2 font-heading text-base font-semibold text-white md:flex">
        <span className="h-0.5 w-8 rounded-full bg-accent-gold" />
        {title}
      </h4>

      {/* Desktop: always visible */}
      <div className="hidden md:block">
        <div className="pb-4 md:pb-0">{children}</div>
      </div>

      {/* Mobile: CSS-only accordion animation */}
      <div
        ref={contentRef}
        className={cn(
          'overflow-hidden transition-all duration-200 ease-out md:hidden',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Quick links
  const quickLinks = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/sections`, label: t('sections.title') },
    { href: `/${locale}/articles`, label: t('nav.articles') },
    { href: `/${locale}/faq`, label: t('nav.faq') },
    { href: `/${locale}/about`, label: t('nav.about') },
  ];

  // Legal resources - using translation keys
  const legalResources = [
    {
      href: '/documents/mehnat-kodeksi.pdf',
      labelKey: 'footer.laborCodePdf',
      icon: FileText,
      external: false,
    },
    { href: 'https://lex.uz', labelKey: 'footer.lexUz', icon: Scale, external: true },
    { href: 'https://my.gov.uz', label: 'my.gov.uz', icon: Building2, external: true },
    { href: 'https://gov.uz', labelKey: 'footer.govPortal', icon: Globe, external: true },
  ];

  // Social links
  const socialLinks = [
    { href: 'https://t.me/mehaboruz', label: 'Telegram', icon: TelegramIcon },
    { href: 'https://facebook.com/mehnat.uz', label: 'Facebook', icon: FacebookIcon },
    { href: 'https://instagram.com/mehnat.uz', label: 'Instagram', icon: InstagramIcon },
    { href: 'https://youtube.com/@mehnat.uz', label: 'YouTube', icon: YouTubeIcon },
  ];

  // Bottom links
  const bottomLinks = [
    { href: `/${locale}/privacy`, label: t('footer.privacy') },
    { href: `/${locale}/terms`, label: t('footer.terms') },
    { href: `/${locale}/accessibility`, label: t('footer.accessibility') },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsSubscribing(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-primary-800 text-white">
      {/* Background Watermark */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-20 -right-20 h-96 w-96 opacity-[0.03]">
          <GovEmblem size="xl" variant="light" />
        </div>
      </div>

      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-accent-gold via-primary-500 to-accent-gold" />

      {/* Newsletter Section */}
      <div className="border-b border-primary-700/50">
        <div className="section-container py-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="mb-1 font-heading text-lg font-semibold">{t('footer.newsletter')}</h3>
              <p className="text-sm text-primary-200">{t('footer.newsletterDesc')}</p>
            </div>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex w-full gap-2 md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('footer.email')}
                    required
                    className={cn(
                      'h-11 w-full rounded-lg pl-10 pr-4',
                      'border border-primary-600 bg-primary-700/50',
                      'text-white placeholder:text-primary-400',
                      'focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/50'
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubscribing}
                  className="bg-accent-gold px-6 text-primary-900 hover:bg-accent-amber"
                >
                  {isSubscribing ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-900/30 border-t-primary-900" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">{t('footer.subscribe')}</span>
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span>{t('footer.subscribeSuccess')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="section-container relative z-10 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Column 1 - About */}
          <div className="border-b border-primary-700/50 py-4 md:border-0 md:py-0">
            <div className="mb-4 flex items-center gap-3">
              <GovEmblem size="lg" variant="light" />
              <div>
                <h3 className="font-heading text-lg font-bold leading-tight">
                  {t('header.title')}
                </h3>
                <p className="text-xs text-primary-300">{t('common.officialPortal')}</p>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-primary-200">{t('footer.aboutText')}</p>

            {/* Social Links */}
            <div className="mb-4 flex items-center gap-3">
              {socialLinks.map(social => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'h-10 w-10 rounded-lg',
                      'bg-primary-700/50 hover:bg-accent-gold',
                      'flex items-center justify-center',
                      'text-primary-300 hover:text-primary-900',
                      'transition-all duration-200'
                    )}
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>

            <GovVerifiedBadge size="sm">{t('common.verifiedByGov')}</GovVerifiedBadge>
          </div>

          {/* Column 2 - Quick Links */}
          <MobileAccordion title={t('footer.quickLinks')}>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-primary-200 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-0.5 w-0 bg-accent-gold transition-all duration-200 group-hover:w-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </MobileAccordion>

          {/* Column 3 - Legal Resources */}
          <MobileAccordion title={t('footer.legalResources')}>
            <ul className="space-y-2.5">
              {legalResources.map(link => {
                const Icon = link.icon;
                const label = 'labelKey' in link ? t(link.labelKey as string) : link.label;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="group inline-flex items-center gap-2 text-sm text-primary-200 transition-colors duration-200 hover:text-white"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 text-accent-gold" />
                      <span>{label}</span>
                      {link.external && <ExternalLink className="h-3 w-3 opacity-50" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </MobileAccordion>

          {/* Column 4 - Contact */}
          <MobileAccordion title={t('footer.contact')}>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-gold" />
                <div>
                  <span className="block text-primary-200">{t('footer.address')}</span>
                  <a
                    href="https://maps.google.com/?q=Tashkent,+Mirabad,+Nukus+street,+8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-accent-gold transition-colors hover:text-accent-amber"
                  >
                    {t('footer.viewOnMap')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-gold" />
                <div className="space-y-1">
                  <a
                    href="tel:1172"
                    className="block text-primary-200 transition-colors hover:text-white"
                  >
                    <span className="font-semibold text-accent-gold">1172</span> -{' '}
                    {t('footer.hotline')}
                  </a>
                  <a
                    href="tel:+998712030140"
                    className="block text-primary-200 transition-colors hover:text-white"
                  >
                    +998 71 203 01 40
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent-gold" />
                <a
                  href="mailto:info@bv.gov.uz"
                  className="text-primary-200 transition-colors hover:text-white"
                >
                  info@bv.gov.uz
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-gold" />
                <span className="text-primary-200">{t('footer.workHours')}</span>
              </li>
            </ul>
          </MobileAccordion>
        </div>

        {/* Ministry Name */}
        <div className="mt-10 border-t border-primary-700/50 pt-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row">
            <Shield className="h-5 w-5 text-accent-gold" />
            <p className="text-sm text-primary-200">{t('footer.ministry')}</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary-900/50">
        <div className="section-container py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="order-2 text-center text-sm text-primary-400 md:order-1 md:text-left">
              © {currentYear} {t('header.title')}. {t('footer.copyright')}
            </p>

            {/* Bottom Links */}
            <div className="order-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:order-2">
              {bottomLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {/* Separator */}
              <span className="hidden text-primary-600 md:inline">|</span>

              {/* Government Links */}
              <a
                href="https://mehnat.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary-400 transition-colors duration-200 hover:text-white"
              >
                mehnat.uz
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className={cn(
                  'rounded-lg p-2',
                  'bg-primary-700 hover:bg-primary-600',
                  'transition-all duration-200',
                  'hover:-translate-y-0.5 active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-accent-gold/50'
                )}
                aria-label={t('footer.backToTop')}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
