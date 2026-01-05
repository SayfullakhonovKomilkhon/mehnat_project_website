'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Scale, BookOpen, FileText, Shield } from 'lucide-react';
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-gold/10 blur-3xl" />

        {/* Static Decorative Icons */}
        <div className="absolute right-[15%] top-20 opacity-10">
          <Scale className="h-24 w-24 text-primary-800" />
        </div>
        <div className="absolute bottom-32 left-[10%] opacity-10">
          <BookOpen className="h-20 w-20 text-primary-800" />
        </div>
      </div>

      <div className="section-container relative z-10">
        <div className="py-16 md:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-6">
                <GovVerifiedBadge size="md" className="inline-flex">
                  {t('common.verifiedByGov')}
                </GovVerifiedBadge>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-balance font-heading text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
                <span className="text-gradient">{t('hero.title')}</span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mb-4 max-w-xl text-lg text-text-secondary md:text-xl lg:mx-0">
                {t('hero.subtitle')}
              </p>

              {/* Description */}
              <p className="mx-auto mb-8 max-w-lg text-base text-text-muted lg:mx-0">
                {t('hero.description')}
              </p>

              {/* Search Bar */}
              <div className="mx-auto mb-6 max-w-xl lg:mx-0">
                <form action={`/${locale}/search`} method="get" className="relative">
                  <Input
                    name="q"
                    variant="search"
                    placeholder={t('header.searchPlaceholder')}
                    className="h-14 w-full border-gov-border text-base shadow-lg"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {t('hero.searchBtn')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* CTAs */}
              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href={`/${locale}/sections`}>
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    {t('hero.cta')}
                  </Button>
                </Link>
                <Link href={`/${locale}/articles`}>
                  <Button variant="outline" size="lg" leftIcon={<FileText className="h-5 w-5" />}>
                    {t('hero.exploreBtn')}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 border-t border-gov-border pt-8">
                <p className="mb-3 text-xs uppercase tracking-wider text-text-muted">
                  {t('header.subtitle')}
                </p>
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <GovEmblem size="md" variant="default" />
                  <div className="h-8 w-px bg-gov-border" />
                  <div className="flex -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
                      UZ
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold/20 text-xs font-bold text-accent-amber">
                      RU
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                      EN
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative hidden lg:block">
              {/* Main Card */}
              <div className="relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 rotate-3 scale-105 transform rounded-3xl bg-gradient-to-br from-primary-800 to-primary-600 opacity-10" />

                {/* Main Content Card */}
                <div className="relative rounded-2xl border border-gov-border bg-gov-surface p-8 shadow-card-hover">
                  {/* Header */}
                  <div className="mb-6 flex items-center gap-4 border-b border-gov-border pb-6">
                    <GovEmblem size="lg" />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-text-primary">
                        {t('header.title')}
                      </h3>
                      <p className="text-sm text-text-secondary">{t('common.officialPortal')}</p>
                    </div>
                  </div>

                  {/* Sample Article Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800">
                        {t('article.chapter')} 1
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="rounded bg-accent-gold/10 px-2 py-1 text-xs font-medium text-accent-amber">
                        {t('article.articleNumber')} 1
                      </span>
                    </div>
                    <h4 className="font-heading font-semibold text-text-primary">
                      Mehnat qonunchiligi va uning vazifalari
                    </h4>
                    <p className="line-clamp-3 text-sm text-text-secondary">
                      O'zbekiston Respublikasining mehnat qonunchiligi fuqarolarning mehnat qilish
                      huquqini ta'minlash...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Shield className="h-3 w-3 text-success" />
                      <span>{t('common.verifiedByGov')}</span>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 border-t border-gov-border pt-4">
                    <Link
                      href={`/${locale}/articles/1`}
                      className="group flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                        {t('common.readMore')}
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Static Floating Elements */}
                <div className="absolute -right-4 -top-4 rounded-xl bg-accent-gold p-3 text-white shadow-lg">
                  <Scale className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-primary-800 p-3 text-white shadow-lg">
                  <BookOpen className="h-6 w-6" />
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
