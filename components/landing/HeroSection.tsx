import { Suspense } from 'react';
import { 
  ArrowRight, 
  Layers, 
  FileText, 
  MessageSquare, 
  Users, 
  Award,
  Shield,
} from 'lucide-react';
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
    <section className="relative min-h-[auto] md:min-h-[85vh] overflow-hidden pb-8 md:pb-0">
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
      <div className="relative z-10 section-container">
        <div className="pt-8 pb-6 sm:pt-12 sm:pb-8 lg:pt-24 lg:pb-16">
          <div className="max-w-4xl mx-auto text-center px-2 sm:px-0">
            {/* Verified Badge */}
            <div className="mb-4 sm:mb-6 animate-fadeIn">
              <GovVerifiedBadge size="md" className="inline-flex bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="w-4 h-4" />
                {t('common.verifiedByGov')}
              </GovVerifiedBadge>
            </div>

            {/* Main Heading */}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-slideUp">
              {t('hero.title')}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-100 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed animate-slideUp-delay-1">
              {t('hero.subtitle')}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-primary-200 mb-6 sm:mb-10 max-w-2xl mx-auto animate-slideUp-delay-2">
              {t('hero.description')}
            </p>

            {/* Hero Search - Client Component */}
            <div className="mb-6 sm:mb-10 animate-slideUp-delay-2">
              <Suspense fallback={<SearchFallback />}>
                <HeroSearchWrapper locale={locale} />
              </Suspense>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 animate-slideUp-delay-3">
              <Link href={`/${locale}/articles`} className="w-full sm:w-auto">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full sm:w-auto text-primary-900 font-semibold shadow-lg shadow-accent-gold/30 h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg"
                  rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/sections`} className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg"
                  leftIcon={<Layers className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  {t('hero.exploreBtn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Strip - Static render, no animated counters */}
        <div className="relative z-10 animate-fadeIn mt-6 sm:mt-8 lg:mt-0 pb-6 sm:pb-8" style={{ animationDelay: '0.4s' }}>
          <div className="bg-primary-700/80 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-5 sm:p-6 lg:p-8 shadow-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {statsData.map((stat, index) => (
                <StatItem
                  key={stat.key}
                  stat={stat}
                  index={index}
                  label={t(`stats.${stat.key}`)}
                />
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
  label 
}: { 
  stat: typeof statsData[0]; 
  index: number; 
  label: string;
}) {
  const Icon = stat.icon;

  return (
    <div 
      className="text-center animate-fadeIn"
      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
    >
      <div className="flex items-center justify-center mb-2">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/15 flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-accent-gold" />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-1">
        {stat.value}
      </div>
      <div className="text-sm sm:text-base text-white font-semibold">
        {label}
      </div>
    </div>
  );
}

// Search fallback for Suspense
function SearchFallback() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-14 bg-white/10 rounded-xl animate-pulse" />
    </div>
  );
}

export default HeroSection;
