'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Search, Shield, Scale, BookOpen, FileText } from 'lucide-react';
import { Button, GovVerifiedBadge, Input } from '@/components/ui';
import { GovEmblem } from '@/components/layout';
import Link from 'next/link';

interface HeroProps {
  locale: string;
}

export function Hero({ locale }: HeroProps) {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gov-light via-white to-primary-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1E3A8A 1px, transparent 1px),
              linear-gradient(to bottom, #1E3A8A 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl" />
        
        {/* Static Decorative Icons */}
        <div className="absolute top-20 right-[15%] opacity-10">
          <Scale className="w-24 h-24 text-primary-800" />
        </div>
        <div className="absolute bottom-32 left-[10%] opacity-10">
          <BookOpen className="w-20 h-20 text-primary-800" />
        </div>
      </div>

      <div className="section-container relative z-10">
        <div className="py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-6">
                <GovVerifiedBadge size="md" className="inline-flex">
                  <Shield className="w-4 h-4" />
                  {t('common.verifiedByGov')}
                </GovVerifiedBadge>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6 text-balance">
                <span className="text-gradient">{t('hero.title')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-text-secondary mb-4 max-w-xl mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>

              {/* Description */}
              <p className="text-base text-text-muted mb-8 max-w-lg mx-auto lg:mx-0">
                {t('hero.description')}
              </p>

              {/* Search Bar */}
              <div className="mb-6 max-w-xl mx-auto lg:mx-0">
                <form action={`/${locale}/search`} method="get" className="relative">
                  <Input
                    name="q"
                    variant="search"
                    placeholder={t('header.searchPlaceholder')}
                    className="w-full h-14 text-base shadow-lg border-gov-border"
                  />
                  <Button 
                    type="submit"
                    variant="primary" 
                    size="md"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {t('hero.searchBtn')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={`/${locale}/sections`}>
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    {t('hero.cta')}
                  </Button>
                </Link>
                <Link href={`/${locale}/articles`}>
                  <Button variant="outline" size="lg" leftIcon={<FileText className="w-5 h-5" />}>
                    {t('hero.exploreBtn')}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-gov-border">
                <p className="text-xs text-text-muted mb-3 uppercase tracking-wider">
                  {t('header.subtitle')}
                </p>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <GovEmblem size="md" variant="default" />
                  <div className="h-8 w-px bg-gov-border" />
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-800">UZ</div>
                    <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-xs font-bold text-accent-amber">RU</div>
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-600">EN</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative hidden lg:block">
              {/* Main Card */}
              <div className="relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-600 rounded-3xl transform rotate-3 scale-105 opacity-10" />
                
                {/* Main Content Card */}
                <div className="relative bg-gov-surface rounded-2xl shadow-card-hover border border-gov-border p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gov-border">
                    <GovEmblem size="lg" />
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-text-primary">
                        {t('header.title')}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {t('common.officialPortal')}
                      </p>
                    </div>
                  </div>

                  {/* Sample Article Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                        {t('article.chapter')} 1
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="px-2 py-1 bg-accent-gold/10 text-accent-amber text-xs font-medium rounded">
                        {t('article.articleNumber')} 1
                      </span>
                    </div>
                    <h4 className="font-heading font-semibold text-text-primary">
                      Mehnat qonunchiligi va uning vazifalari
                    </h4>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      O'zbekiston Respublikasining mehnat qonunchiligi fuqarolarning mehnat qilish huquqini ta'minlash...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Shield className="w-3 h-3 text-success" />
                      <span>{t('common.verifiedByGov')}</span>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 pt-4 border-t border-gov-border">
                    <Link 
                      href={`/${locale}/articles/1`}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700">{t('common.readMore')}</span>
                      <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Static Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-accent-gold text-white p-3 rounded-xl shadow-lg">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-primary-800 text-white p-3 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
