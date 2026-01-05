import { Suspense } from 'react';
import { ArrowRight, Layers, FileText, MessageSquare, Users, Award } from 'lucide-react';
import { Button, GovVerifiedBadge } from '@/components/ui';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

// Import client search component
import { HeroSearchWrapper } from './HeroSearchWrapper';

interface HeroSectionProps {
  locale: string;
}

// Stats data - static for SSR
const statsData = [
  { key: 'totalArticles', value: '350+', icon: FileText },
  { key: 'totalComments', value: '1,200+', icon: MessageSquare },
  { key: 'users', value: '50,000+', icon: Users },
  { key: 'experts', value: '25+', icon: Award },
];

// Server component for hero section - no client JS needed for static content
export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations();

  return (
    <section className="relative min-h-[auto] overflow-hidden pb-8 md:min-h-[85vh] md:pb-0">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500" />

      {/* Geometric Pattern Overlay - Static CSS */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
        }}
      />

      {/* Main Content */}
      <div className="section-container relative z-10">
        <div className="pb-6 pt-8 sm:pb-8 sm:pt-12 lg:pb-16 lg:pt-24">
          <div className="mx-auto max-w-4xl px-2 text-center sm:px-0">
            {/* Verified Badge */}
            <div className="animate-fadeIn mb-4 sm:mb-6">
              <GovVerifiedBadge
                size="md"
                className="inline-flex border border-white/20 bg-white/10 backdrop-blur-sm"
              >
                {t('common.verifiedByGov')}
              </GovVerifiedBadge>
            </div>

            {/* Main Heading */}
            <h1 className="animate-slideUp mb-4 font-heading text-2xl font-bold leading-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              {t('hero.title')}
            </h1>

            {/* Subheading */}
            <p className="animate-slideUp-delay-1 mx-auto mb-3 max-w-3xl text-base leading-relaxed text-primary-100 sm:mb-4 sm:text-lg md:text-xl lg:text-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Description */}
            <p className="animate-slideUp-delay-2 mx-auto mb-6 max-w-2xl text-sm text-primary-200 sm:mb-10 sm:text-base">
              {t('hero.description')}
            </p>

            {/* Hero Search - Client Component */}
            <div className="animate-slideUp-delay-2 mb-6 sm:mb-10">
              <Suspense fallback={<SearchFallback />}>
                <HeroSearchWrapper locale={locale} />
              </Suspense>
            </div>

            {/* CTA Buttons */}
            <div className="animate-slideUp-delay-3 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-4">
              <Link href={`/${locale}/articles`} className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  className="h-12 w-full px-6 text-base font-semibold text-primary-900 shadow-lg shadow-accent-gold/30 sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
                  rightIcon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                >
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/sections`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full border-white/30 px-6 text-base text-white hover:bg-white/10 sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
                  leftIcon={<Layers className="h-4 w-4 sm:h-5 sm:w-5" />}
                >
                  {t('hero.exploreBtn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Strip - Static render, no animated counters */}
        <div
          className="animate-fadeIn relative z-10 mt-6 pb-6 sm:mt-8 sm:pb-8 lg:mt-0"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="rounded-xl border border-white/20 bg-primary-700/80 p-5 shadow-xl backdrop-blur-md sm:rounded-2xl sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
              {statsData.map((stat, index) => (
                <StatItem key={stat.key} stat={stat} index={index} label={t(`stats.${stat.key}`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Static Stat Item - No animated counter
function StatItem({
  stat,
  index,
  label,
}: {
  stat: (typeof statsData)[0];
  index: number;
  label: string;
}) {
  const Icon = stat.icon;

  return (
    <div className="animate-fadeIn text-center" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
      <div className="mb-2 flex items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 sm:h-11 sm:w-11">
          <Icon className="sm:w-5.5 sm:h-5.5 h-5 w-5 text-accent-gold" />
        </div>
      </div>
      <div className="mb-1 font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        {stat.value}
      </div>
      <div className="text-sm font-semibold text-white sm:text-base">{label}</div>
    </div>
  );
}

// Search fallback for Suspense
function SearchFallback() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="h-14 animate-pulse rounded-xl bg-white/10" />
    </div>
  );
}

export default HeroSection;
