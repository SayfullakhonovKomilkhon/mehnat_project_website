'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Layers, 
  FileText, 
  MessageSquare, 
  Users, 
  Award,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, GovVerifiedBadge } from '@/components/ui';
import { GovEmblem } from '@/components/layout';
import { HeroSearch } from '@/components/search';
import Link from 'next/link';

interface HeroSectionProps {
  locale: string;
}

// Stats data
const statsData = [
  { key: 'totalArticles', value: 350, suffix: '+', icon: FileText },
  { key: 'totalComments', value: 1200, suffix: '+', icon: MessageSquare },
  { key: 'users', value: 50000, suffix: '+', icon: Users },
  { key: 'experts', value: 25, suffix: '+', icon: Award },
];

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations();
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[85vh] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500" />
      
      {/* Geometric Pattern Overlay */}
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

      {/* Subtle Map/Labor Imagery Overlay */}
      <div className="absolute inset-0 bg-[url('/images/uzbekistan-map.svg')] bg-no-repeat bg-center bg-contain opacity-[0.03]" />

      {/* Gradient Orbs */}
      <motion.div
        variants={floatVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px]"
      />
      <motion.div
        variants={floatVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-primary-400/30 rounded-full blur-[100px]"
      />

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, 10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] right-[8%] hidden lg:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <FileText className="w-10 h-10 text-accent-gold" />
        </div>
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0], 
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[25%] right-[15%] hidden lg:block"
      >
        <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <Shield className="w-8 h-8 text-white/80" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 12, 0], 
          x: [0, -5, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[30%] left-[5%] hidden lg:block"
      >
        <div className="w-14 h-14 rounded-lg bg-accent-gold/20 backdrop-blur-sm flex items-center justify-center border border-accent-gold/30">
          <Sparkles className="w-7 h-7 text-accent-gold" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 section-container">
        <div className="pt-16 pb-8 lg:pt-24 lg:pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Verified Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <GovVerifiedBadge size="md" className="inline-flex bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="w-4 h-4" />
                {t('common.verifiedByGov')}
              </GovVerifiedBadge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-primary-100 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base text-primary-200 mb-10 max-w-2xl mx-auto"
            >
              {t('hero.description')}
            </motion.p>

            {/* Hero Search */}
            <motion.div variants={itemVariants} className="mb-10">
              <HeroSearch locale={locale} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href={`/${locale}/articles`}>
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full sm:w-auto text-primary-900 font-semibold shadow-lg shadow-accent-gold/30"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/sections`}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                  leftIcon={<Layers className="w-5 h-5" />}
                >
                  {t('hero.exploreBtn')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Strip */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {statsData.map((stat, index) => (
                <StatItem
                  key={stat.key}
                  stat={stat}
                  index={index}
                  isInView={isStatsInView}
                  label={t(`stats.${stat.key}`)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-24 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// Animated Stat Item Component
function StatItem({ 
  stat, 
  index, 
  isInView, 
  label 
}: { 
  stat: typeof statsData[0]; 
  index: number; 
  isInView: boolean;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const Icon = stat.icon;

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = stat.value / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.min(Math.round(increment * currentStep), stat.value));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent-gold" />
        </div>
      </div>
      <div className="text-3xl lg:text-4xl font-heading font-bold text-white mb-1">
        {formatNumber(count)}{stat.suffix}
      </div>
      <div className="text-sm text-primary-200 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

export default HeroSection;

