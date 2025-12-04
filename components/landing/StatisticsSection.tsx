'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Globe,
  TrendingUp,
  Award,
  BookOpen,
  Shield,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatisticsSectionProps {
  variant?: 'strip' | 'grid' | 'cards';
  showTrends?: boolean;
  showBackground?: boolean;
}

// Statistics Data
const statisticsData = [
  {
    key: 'totalArticles',
    value: 450,
    suffix: '+',
    icon: FileText,
    trend: { value: 12, label: 'bu oy' },
    color: 'blue',
    description_uz: "Rasmiy sharhlar bilan",
    description_ru: "С официальными комментариями",
    description_en: "With official commentaries",
  },
  {
    key: 'totalComments',
    value: 1200,
    suffix: '+',
    icon: MessageSquare,
    trend: { value: 8, label: 'bu oy' },
    color: 'emerald',
    description_uz: "Ekspert izohlari",
    description_ru: "Экспертные разъяснения",
    description_en: "Expert explanations",
  },
  {
    key: 'experts',
    value: 25,
    suffix: '',
    icon: Award,
    trend: { value: 3, label: 'yangi' },
    color: 'amber',
    description_uz: "Malakali huquqshunoslar",
    description_ru: "Квалифицированные юристы",
    description_en: "Qualified lawyers",
  },
  {
    key: 'translations',
    value: 3,
    suffix: ' tilda',
    icon: Globe,
    trend: null,
    color: 'purple',
    description_uz: "UZ, RU, EN tillarda",
    description_ru: "На UZ, RU, EN языках",
    description_en: "In UZ, RU, EN languages",
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

export function StatisticsSection({ 
  variant = 'cards', 
  showTrends = true,
  showBackground = true 
}: StatisticsSectionProps) {
  const t = useTranslations('stats');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={containerRef}
      className={cn(
        'relative py-16 md:py-24 overflow-hidden',
        showBackground ? 'bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50' : 'bg-gov-light'
      )}
    >
      {/* Decorative Background Elements */}
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

          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-gold/20 rounded-full blur-[80px]" />
        </>
      )}

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gov-border mb-4">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Rasmiy statistika</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3">
            Platforma ko'rsatkichlari
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            O'zbekiston Respublikasi Mehnat kodeksiga oid eng to'liq ma'lumotlar bazasi
          </p>
        </motion.div>

        {/* Statistics Grid */}
        {variant === 'cards' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statisticsData.map((stat, index) => (
              <StatCard
                key={stat.key}
                stat={stat}
                index={index}
                isInView={isInView}
                showTrend={showTrends}
                label={t(stat.key)}
              />
            ))}
          </div>
        )}

        {/* Strip Variant */}
        {variant === 'strip' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gov-border p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gov-border">
              {statisticsData.map((stat, index) => (
                <StatStrip
                  key={stat.key}
                  stat={stat}
                  index={index}
                  isInView={isInView}
                  label={t(stat.key)}
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
                isInView={isInView}
                showTrend={showTrends}
                label={t(stat.key)}
              />
            ))}
          </div>
        )}

        {/* Bottom Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 h-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent rounded-full"
        />
      </div>
    </section>
  );
}

// Animated Counter Hook
function useCountUp(end: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;

    const steps = 60;
    const stepDuration = duration / steps;
    const increment = end / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.min(Math.round(increment * currentStep), end));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return count;
}

// Format number with locale
function formatNumber(num: number): string {
  if (num >= 1000) {
    return num.toLocaleString();
  }
  return num.toString();
}

// Card Variant Component
function StatCard({ 
  stat, 
  index, 
  isInView, 
  showTrend,
  label 
}: { 
  stat: typeof statisticsData[0]; 
  index: number; 
  isInView: boolean;
  showTrend: boolean;
  label: string;
}) {
  const count = useCountUp(stat.value, 2000, isInView);
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className={cn(
        'relative bg-white rounded-2xl p-6 shadow-card border',
        colors.border,
        'group cursor-default'
      )}
    >
      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        colors.bg
      )}>
        <Icon className={cn('w-6 h-6', colors.icon)} />
      </div>

      {/* Number */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
          {formatNumber(count)}
        </span>
        {stat.suffix && (
          <span className="text-xl md:text-2xl font-heading font-bold text-text-muted">
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="font-medium text-text-primary mb-1">
        {label}
      </p>

      {/* Description */}
      <p className="text-sm text-text-muted">
        {stat.description_uz}
      </p>

      {/* Trend Indicator */}
      {showTrend && stat.trend && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-1 bg-success-light rounded-full">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-medium text-success">
              +{stat.trend.value} {stat.trend.label}
            </span>
          </div>
        </div>
      )}

      {/* Hover Gradient */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
        'bg-gradient-to-br from-white to-transparent'
      )} />
    </motion.div>
  );
}

// Strip Variant Component
function StatStrip({ 
  stat, 
  index, 
  isInView,
  label 
}: { 
  stat: typeof statisticsData[0]; 
  index: number; 
  isInView: boolean;
  label: string;
}) {
  const count = useCountUp(stat.value, 2000, isInView);
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'text-center py-4 first:pt-0 md:first:pt-4 last:pb-0 md:last:pb-4',
        'md:px-4 first:pl-0 last:pr-0'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3',
        colors.bg
      )}>
        <Icon className={cn('w-5 h-5', colors.icon)} />
      </div>
      <div className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-1">
        {formatNumber(count)}{stat.suffix}
      </div>
      <p className="text-sm text-text-secondary">
        {label}
      </p>
    </motion.div>
  );
}

// Grid Variant Component
function StatGridCard({ 
  stat, 
  index, 
  isInView, 
  showTrend,
  label 
}: { 
  stat: typeof statisticsData[0]; 
  index: number; 
  isInView: boolean;
  showTrend: boolean;
  label: string;
}) {
  const count = useCountUp(stat.value, 2000, isInView);
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'bg-white rounded-2xl p-8 shadow-lg border-2',
        colors.border,
        'text-center'
      )}
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
        {formatNumber(count)}{stat.suffix}
      </div>

      {/* Label */}
      <p className="text-lg font-medium text-text-primary mb-2">
        {label}
      </p>

      {/* Description */}
      <p className="text-sm text-text-muted">
        {stat.description_uz}
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
    </motion.div>
  );
}

export default StatisticsSection;



