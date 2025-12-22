import { getTranslations } from 'next-intl/server';
import { Shield, BookOpen, Search, Bell } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

const features = [
  { key: 'official', icon: Shield, color: 'primary' },
  { key: 'expert', icon: BookOpen, color: 'gold' },
  { key: 'search', icon: Search, color: 'primary' },
  { key: 'updates', icon: Bell, color: 'gold' },
] as const;

const colorStyles = {
  primary: {
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-700',
    borderHover: 'group-hover:border-primary-300',
  },
  gold: {
    iconBg: 'bg-accent-light',
    iconColor: 'text-accent-amber',
    borderHover: 'group-hover:border-accent-gold/50',
  },
};

// Server component - no client JS needed
export async function Features() {
  const t = await getTranslations('features');

  return (
    <section className="py-12 sm:py-16 md:py-28 bg-gov-light">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fadeIn">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-100 text-primary-800 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            {t('subtitle')}
          </span>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4 text-balance px-4">
            {t('title')}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-600 to-accent-gold mx-auto rounded-full" />
        </div>

        {/* Features Grid - CSS animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorStyles[feature.color];
            const Icon = feature.icon;

            return (
              <div
                key={feature.key}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card
                  hover
                  className={cn(
                    'h-full group transition-all duration-300',
                    colors.borderHover
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-5',
                      'transition-transform duration-200 group-hover:scale-110',
                      colors.iconBg
                    )}
                  >
                    <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7', colors.iconColor)} />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-text-primary mb-2 sm:mb-3 group-hover:text-primary-700 transition-colors">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>

                  {/* Decorative Element */}
                  <div className="mt-3 sm:mt-4 md:mt-5 pt-3 sm:pt-4 border-t border-gov-border">
                    <div className={cn(
                      'w-6 sm:w-8 h-1 rounded-full transition-all duration-500 group-hover:w-full',
                      colors.iconBg
                    )} />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;
