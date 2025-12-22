import { 
  FileText, 
  MessageSquare, 
  Globe,
  TrendingUp,
  Award,
  Shield,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatisticsSectionProps {
  variant?: 'strip' | 'grid' | 'cards';
  showTrends?: boolean;
  showBackground?: boolean;
}

// Statistics Data - static values for SSR
const statisticsData = [
  {
    key: 'totalArticles',
    value: '450+',
    icon: FileText,
    trend: { value: 12, label: 'bu oy' },
    color: 'blue',
    label: "Moddalar",
    description: "Rasmiy sharhlar bilan",
  },
  {
    key: 'totalComments',
    value: '1,200+',
    icon: MessageSquare,
    trend: { value: 8, label: 'bu oy' },
    color: 'emerald',
    label: "Sharhlar",
    description: "Ekspert izohlari",
  },
  {
    key: 'experts',
    value: '25',
    icon: Award,
    trend: { value: 3, label: 'yangi' },
    color: 'amber',
    label: "Ekspertlar",
    description: "Malakali huquqshunoslar",
  },
  {
    key: 'translations',
    value: '3',
    suffix: ' tilda',
    icon: Globe,
    trend: null,
    color: 'purple',
    label: "Tillar",
    description: "UZ, RU, EN tillarda",
  },
];

// Color mappings
const colorStyles: Record<string, { icon: string; bg: string; border: string }> = {
  blue: { 
    icon: 'text-primary-600', 
    bg: 'bg-primary-50', 
    border: 'border-primary-200' 
  },
  emerald: { 
    icon: 'text-emerald-600', 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200' 
  },
  amber: { 
    icon: 'text-amber-600', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200' 
  },
  purple: { 
    icon: 'text-purple-600', 
    bg: 'bg-purple-50', 
    border: 'border-purple-200' 
  },
};

// Server Component - No client-side JS needed
export function StatisticsSection({ 
  variant = 'cards', 
  showTrends = true,
  showBackground = true 
}: StatisticsSectionProps) {

  return (
    <section 
      className={cn(
        'relative py-10 sm:py-16 md:py-24 overflow-hidden',
        showBackground ? 'bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50' : 'bg-gov-light'
      )}
    >
      {/* Decorative Background Elements - CSS only */}
      {showBackground && (
        <>
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #1E3A8A 1px, transparent 1px),
                linear-gradient(to bottom, #1E3A8A 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Decorative Scale of Justice */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
            <Scale className="w-[600px] h-[600px] text-primary-900" strokeWidth={0.5} />
          </div>

          {/* Static Gradient Orbs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-gold/20 rounded-full blur-[80px]" />
        </>
      )}

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gov-border mb-3 sm:mb-4">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
            <span className="text-xs sm:text-sm font-medium text-primary-700">Rasmiy statistika</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2 sm:mb-3">
            Platforma ko'rsatkichlari
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0">
            O'zbekiston Respublikasi Mehnat kodeksiga oid eng to'liq ma'lumotlar bazasi
          </p>
        </div>

        {/* Statistics Grid - Cards variant */}
        {variant === 'cards' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {statisticsData.map((stat, index) => (
              <StatCard
                key={stat.key}
                stat={stat}
                index={index}
                showTrend={showTrends}
              />
            ))}
          </div>
        )}

        {/* Strip Variant */}
        {variant === 'strip' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gov-border p-6 md:p-8 animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gov-border">
              {statisticsData.map((stat, index) => (
                <StatStrip
                  key={stat.key}
                  stat={stat}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid Variant */}
        {variant === 'grid' && (
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            {statisticsData.map((stat, index) => (
              <StatGridCard
                key={stat.key}
                stat={stat}
                index={index}
                showTrend={showTrends}
              />
            ))}
          </div>
        )}

        {/* Bottom Decorative Line */}
        <div className="mt-12 h-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent rounded-full" />
      </div>
    </section>
  );
}

// Card Variant Component - CSS animations only
function StatCard({ 
  stat, 
  index, 
  showTrend,
}: { 
  stat: typeof statisticsData[0]; 
  index: number; 
  showTrend: boolean;
}) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card border',
        'card-interactive', // CSS-only hover effect
        colors.border,
        'animate-fadeIn'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Icon */}
      <div className={cn(
        'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4',
        colors.bg
      )}>
        <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', colors.icon)} />
      </div>

      {/* Number */}
      <div className="flex items-baseline gap-1 mb-1.5 sm:mb-2">
        <span className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-text-primary">
          {stat.value}
        </span>
        {stat.suffix && (
          <span className="text-base sm:text-xl md:text-2xl font-heading font-bold text-text-muted">
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="font-medium text-sm sm:text-base text-text-primary mb-0.5 sm:mb-1">
        {stat.label}
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-text-muted line-clamp-2">
        {stat.description}
      </p>

      {/* Trend Indicator - Hidden on mobile */}
      {showTrend && stat.trend && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 hidden sm:block">
          <div className="flex items-center gap-1 px-2 py-1 bg-success-light rounded-full">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-medium text-success">
              +{stat.trend.value} {stat.trend.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Strip Variant Component
function StatStrip({ 
  stat, 
  index, 
}: { 
  stat: typeof statisticsData[0]; 
  index: number; 
}) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <div
      className={cn(
        'text-center py-4 first:pt-0 md:first:pt-4 last:pb-0 md:last:pb-4',
        'md:px-4 first:pl-0 last:pr-0',
        'animate-fadeIn'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3',
        colors.bg
      )}>
        <Icon className={cn('w-5 h-5', colors.icon)} />
      </div>
      <div className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-1">
        {stat.value}{stat.suffix || ''}
      </div>
      <p className="text-sm text-text-secondary">
        {stat.label}
      </p>
    </div>
  );
}

// Grid Variant Component
function StatGridCard({ 
  stat, 
  index, 
  showTrend,
}: { 
  stat: typeof statisticsData[0]; 
  index: number; 
  showTrend: boolean;
}) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-8 shadow-lg border-2',
        'card-interactive',
        colors.border,
        'text-center animate-fadeIn'
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Icon */}
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
        colors.bg
      )}>
        <Icon className={cn('w-8 h-8', colors.icon)} />
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-2">
        {stat.value}{stat.suffix || ''}
      </div>

      {/* Label */}
      <p className="text-lg font-medium text-text-primary mb-2">
        {stat.label}
      </p>

      {/* Description */}
      <p className="text-sm text-text-muted">
        {stat.description}
      </p>

      {/* Trend */}
      {showTrend && stat.trend && (
        <div className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 bg-success-light rounded-full">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">
            +{stat.trend.value} {stat.trend.label}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatisticsSection;
