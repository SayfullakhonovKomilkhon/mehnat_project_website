'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Search, Bell } from 'lucide-react';
import { Card } from '@/components/ui';

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

export function Features() {
  const t = useTranslations('features');

  return (
    <section className="py-20 md:py-28 bg-gov-light">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary-100 text-primary-800 text-sm font-medium rounded-full mb-4"
          >
            {t('subtitle')}
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4 text-balance">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-accent-gold mx-auto rounded-full" />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const colors = colorStyles[feature.color];
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.key}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Card
                  hover
                  className={`h-full group transition-all duration-300 ${colors.borderHover}`}
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}
                  >
                    <Icon className={`w-7 h-7 ${colors.iconColor}`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-3 group-hover:text-primary-700 transition-colors">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>

                  {/* Decorative Element */}
                  <div className="mt-5 pt-4 border-t border-gov-border">
                    <div className={`w-8 h-1 rounded-full ${colors.iconBg} group-hover:w-full transition-all duration-500`} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;




