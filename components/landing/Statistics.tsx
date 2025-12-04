'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Users, Award } from 'lucide-react';

const stats = [
  { key: 'totalArticles', value: '350+', icon: FileText },
  { key: 'totalComments', value: '1,200+', icon: MessageSquare },
  { key: 'users', value: '50,000+', icon: Users },
  { key: 'experts', value: '25+', icon: Award },
];

export function Statistics() {
  const t = useTranslations('stats');

  return (
    <section className="relative py-16 md:py-20 bg-primary-800 overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Gold Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-white/10 rounded-xl"
              >
                <stat.icon className="w-7 h-7 text-accent-gold" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 100 }}
                className="text-3xl md:text-4xl font-heading font-bold text-white mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-primary-200 font-medium">
                {t(stat.key)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Statistics;
