'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  Coffee, 
  Wallet, 
  Shield,
  ChevronRight,
  Layers,
  ArrowRight,
  Scale,
  Users,
  Briefcase,
  Heart,
  Award,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionsGridProps {
  locale: string;
  showHeader?: boolean;
  maxItems?: number;
}

// Labor Code Sections Data
const sectionsData = [
  {
    id: 1,
    number: 'I',
    title_uz: "Umumiy qoidalar",
    title_ru: "Общие положения",
    title_en: "General Provisions",
    description_uz: "Mehnat qonunchiligining asosiy tamoyillari, maqsadlari va qo'llanilish doirasi",
    description_ru: "Основные принципы, цели и сфера применения трудового законодательства",
    description_en: "Basic principles, objectives and scope of labor legislation",
    chaptersCount: 5,
    articlesCount: 28,
    icon: 'BookOpen',
    color: 'blue',
  },
  {
    id: 2,
    number: 'II',
    title_uz: "Mehnat shartnomasi",
    title_ru: "Трудовой договор",
    title_en: "Employment Contract",
    description_uz: "Mehnat shartnomasini tuzish, o'zgartirish va bekor qilish tartibi",
    description_ru: "Порядок заключения, изменения и расторжения трудового договора",
    description_en: "Procedure for concluding, amending and terminating employment contract",
    chaptersCount: 8,
    articlesCount: 45,
    icon: 'FileText',
    color: 'indigo',
  },
  {
    id: 3,
    number: 'III',
    title_uz: "Ish vaqti",
    title_ru: "Рабочее время",
    title_en: "Working Hours",
    description_uz: "Ish vaqti normalari, ish tartibi va qo'shimcha ish vaqti tartibga solish",
    description_ru: "Нормы рабочего времени, режим работы и регулирование сверхурочной работы",
    description_en: "Working time standards, work schedules and overtime regulation",
    chaptersCount: 4,
    articlesCount: 22,
    icon: 'Clock',
    color: 'emerald',
  },
  {
    id: 4,
    number: 'IV',
    title_uz: "Dam olish vaqti",
    title_ru: "Время отдыха",
    title_en: "Rest Time",
    description_uz: "Tanaffuslar, dam olish kunlari, bayram kunlari va mehnat ta'tillari",
    description_ru: "Перерывы, выходные дни, праздничные дни и трудовые отпуска",
    description_en: "Breaks, days off, holidays and labor vacations",
    chaptersCount: 6,
    articlesCount: 35,
    icon: 'Coffee',
    color: 'amber',
  },
  {
    id: 5,
    number: 'V',
    title_uz: "Mehnat haqi",
    title_ru: "Оплата труда",
    title_en: "Wages",
    description_uz: "Ish haqi tizimi, minimal ish haqi, mukofotlar va qo'shimcha to'lovlar",
    description_ru: "Система оплаты труда, минимальная заработная плата, премии и надбавки",
    description_en: "Wage system, minimum wage, bonuses and additional payments",
    chaptersCount: 4,
    articlesCount: 30,
    icon: 'Wallet',
    color: 'green',
  },
  {
    id: 6,
    number: 'VI',
    title_uz: "Mehnat intizomi",
    title_ru: "Трудовая дисциплина",
    title_en: "Labor Discipline",
    description_uz: "Intizomiy javobgarlik, rag'batlantirish va jazolash choralari",
    description_ru: "Дисциплинарная ответственность, меры поощрения и взыскания",
    description_en: "Disciplinary responsibility, incentives and penalties",
    chaptersCount: 3,
    articlesCount: 18,
    icon: 'Shield',
    color: 'red',
  },
  {
    id: 7,
    number: 'VII',
    title_uz: "Moddiy javobgarlik",
    title_ru: "Материальная ответственность",
    title_en: "Material Liability",
    description_uz: "Xodim va ish beruvchining moddiy javobgarligi",
    description_ru: "Материальная ответственность работника и работодателя",
    description_en: "Material liability of employee and employer",
    chaptersCount: 3,
    articlesCount: 15,
    icon: 'Scale',
    color: 'purple',
  },
  {
    id: 8,
    number: 'VIII',
    title_uz: "Mehnat muhofazasi",
    title_ru: "Охрана труда",
    title_en: "Labor Protection",
    description_uz: "Mehnat xavfsizligi va sog'lom mehnat sharoitlarini ta'minlash",
    description_ru: "Обеспечение безопасности труда и здоровых условий труда",
    description_en: "Ensuring occupational safety and healthy working conditions",
    chaptersCount: 5,
    articlesCount: 32,
    icon: 'Heart',
    color: 'rose',
  },
  {
    id: 9,
    number: 'IX',
    title_uz: "Ayrim toifadagi xodimlar mehnati",
    title_ru: "Труд отдельных категорий работников",
    title_en: "Labor of Certain Categories of Workers",
    description_uz: "Ayollar, yoshlar va boshqa maxsus toifadagi xodimlar mehnati",
    description_ru: "Труд женщин, молодежи и других особых категорий работников",
    description_en: "Labor of women, youth and other special categories of workers",
    chaptersCount: 6,
    articlesCount: 40,
    icon: 'Users',
    color: 'cyan',
  },
];

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FileText,
  Clock,
  Coffee,
  Wallet,
  Shield,
  Scale,
  Heart,
  Users,
  Briefcase,
  Award,
  AlertTriangle,
};

// Color mapping for accent borders
const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: 'border-l-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
  indigo: { border: 'border-l-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  emerald: { border: 'border-l-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { border: 'border-l-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  green: { border: 'border-l-green-600', bg: 'bg-green-50', text: 'text-green-600' },
  red: { border: 'border-l-red-600', bg: 'bg-red-50', text: 'text-red-600' },
  purple: { border: 'border-l-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
  rose: { border: 'border-l-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
  cyan: { border: 'border-l-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-600' },
};

export function SectionsGrid({ locale, showHeader = true, maxItems }: SectionsGridProps) {
  const t = useTranslations();
  
  const displayedSections = maxItems ? sectionsData.slice(0, maxItems) : sectionsData;

  // Get localized title
  const getLocalizedTitle = (section: typeof sectionsData[0]) => {
    switch (locale) {
      case 'ru': return section.title_ru;
      case 'en': return section.title_en;
      default: return section.title_uz;
    }
  };

  // Get localized description
  const getLocalizedDescription = (section: typeof sectionsData[0]) => {
    switch (locale) {
      case 'ru': return section.description_ru;
      case 'en': return section.description_en;
      default: return section.description_uz;
    }
  };

  // Get chapter/article label based on locale
  const getCountLabel = (chapters: number, articles: number) => {
    switch (locale) {
      case 'ru':
        return `${chapters} глав, ${articles} статей`;
      case 'en':
        return `${chapters} chapters, ${articles} articles`;
      default:
        return `${chapters} bob, ${articles} modda`;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gov-light">
      <div className="section-container">
        {/* Section Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                    {t('sections.title')}
                  </h2>
                  <p className="text-text-secondary text-sm">
                    {locale === 'ru' ? 'Структура Трудового кодекса' : 
                     locale === 'en' ? 'Labor Code Structure' : 
                     'Mehnat kodeksi tuzilishi'}
                  </p>
                </div>
              </div>
            </div>
            
            <Link 
              href={`/${locale}/sections`}
              className="group inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}

        {/* Sections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedSections.map((section) => {
            const Icon = iconMap[section.icon] || BookOpen;
            const colors = colorMap[section.color] || colorMap.blue;

            return (
              <motion.div key={section.id} variants={cardVariants}>
                <Link href={`/${locale}/sections/${section.id}`}>
                  <motion.article
                    whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn(
                      'group relative bg-gov-surface rounded-xl overflow-hidden',
                      'border border-gov-border border-l-4',
                      colors.border,
                      'h-full cursor-pointer'
                    )}
                  >
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Roman Numeral */}
                        <span className="text-4xl font-heading font-bold text-gov-border select-none">
                          {section.number}
                        </span>
                        
                        {/* Icon */}
                        <motion.div
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            colors.bg
                          )}
                        >
                          <Icon className={cn('w-6 h-6', colors.text)} />
                        </motion.div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {getLocalizedTitle(section)}
                      </h3>

                      {/* Description */}
                      <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                        {getLocalizedDescription(section)}
                      </p>

                      {/* Stats & Arrow */}
                      <div className="flex items-center justify-between pt-4 border-t border-gov-border">
                        <span className="text-sm text-text-muted">
                          {getCountLabel(section.chaptersCount, section.articlesCount)}
                        </span>
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.article>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Button - Mobile */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center sm:hidden"
          >
            <Link href={`/${locale}/sections`}>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-colors">
                {t('common.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default SectionsGrid;




