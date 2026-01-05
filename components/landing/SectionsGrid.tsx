import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
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
import { getSections, getLocalizedText } from '@/lib/api';
import type { Section, Locale } from '@/types';

interface SectionsGridProps {
  locale: string;
  showHeader?: boolean;
  maxItems?: number;
}

// Fallback sections data for when API is unavailable
const fallbackSectionsData = [
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

// Convert API section to display format
function sectionToDisplayFormat(section: Section, index: number) {
  const colors = ['blue', 'indigo', 'emerald', 'amber', 'green', 'red', 'purple', 'rose', 'cyan'];
  const icons = ['BookOpen', 'FileText', 'Clock', 'Coffee', 'Wallet', 'Shield', 'Scale', 'Heart', 'Users'];
  
  return {
    id: section.id,
    number: section.number,
    title: section.title,
    description: section.description,
    chaptersCount: section.chaptersCount,
    articlesCount: section.articlesCount,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  };
}

// Server component - fetches data from API
export async function SectionsGrid({ locale, showHeader = true, maxItems }: SectionsGridProps) {
  const t = await getTranslations();
  
  // Try to fetch from API, fallback to static data
  let sectionsData: any[] = [];
  try {
    const apiSections = await getSections(locale as Locale);
    if (apiSections && apiSections.length > 0) {
      sectionsData = apiSections.map((s, i) => sectionToDisplayFormat(s, i));
    } else {
      sectionsData = fallbackSectionsData;
    }
  } catch (error) {
    console.error('Failed to fetch sections from API:', error);
    sectionsData = fallbackSectionsData;
  }
  
  const displayedSections = maxItems ? sectionsData.slice(0, maxItems) : sectionsData;

  // Get localized title
  const getLocalizedTitle = (section: any) => {
    // Handle both API format (LocalizedString) and fallback format
    if (section.title && typeof section.title === 'object') {
      return getLocalizedText(section.title, locale);
    }
    switch (locale) {
      case 'ru': return section.title_ru;
      case 'en': return section.title_en;
      default: return section.title_uz;
    }
  };

  // Get localized description
  const getLocalizedDescription = (section: any) => {
    // Handle both API format (LocalizedString) and fallback format
    if (section.description && typeof section.description === 'object') {
      return getLocalizedText(section.description, locale);
    }
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

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-gov-light">
      <div className="section-container">
        {/* Section Header */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-10 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary-100 flex items-center justify-center">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-text-primary">
                    {t('sections.title')}
                  </h2>
                  <p className="text-text-secondary text-xs sm:text-sm">
                    {locale === 'ru' ? 'Структура Трудового кодекса' : 
                     locale === 'en' ? 'Labor Code Structure' : 
                     'Mehnat kodeksi tuzilishi'}
                  </p>
                </div>
              </div>
            </div>
            
            <Link 
              href={`/${locale}/sections`}
              className="group inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base transition-colors"
            >
              {t('common.viewAll')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Sections Grid - CSS animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {displayedSections.map((section, index) => {
            const Icon = iconMap[section.icon] || BookOpen;
            const colors = colorMap[section.color] || colorMap.blue;

            return (
              <div 
                key={section.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link href={`/${locale}/sections/${section.id}`}>
                  <article
                    className={cn(
                      'group relative bg-gov-surface rounded-lg sm:rounded-xl overflow-hidden',
                      'border border-gov-border border-l-4',
                      colors.border,
                      'h-full cursor-pointer',
                      'card-interactive' // CSS-only hover animation
                    )}
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        {/* Roman Numeral */}
                        <span className="text-2xl sm:text-4xl font-heading font-bold text-gov-border select-none">
                          {section.number}
                        </span>
                        
                        {/* Icon */}
                        <div
                          className={cn(
                            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center',
                            'transition-transform duration-200 group-hover:scale-110',
                            colors.bg
                          )}
                        >
                          <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', colors.text)} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-text-primary mb-1.5 sm:mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {getLocalizedTitle(section)}
                      </h3>

                      {/* Description */}
                      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                        {getLocalizedDescription(section)}
                      </p>

                      {/* Stats & Arrow */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gov-border">
                        <span className="text-xs sm:text-sm text-text-muted">
                          {getCountLabel(section.chaptersCount, section.articlesCount)}
                        </span>
                        <div className="text-primary-600 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </article>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Button - Mobile */}
        {showHeader && (
          <div className="mt-6 text-center sm:hidden animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <Link href={`/${locale}/sections`}>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-lg font-medium text-sm hover:bg-primary-100 transition-colors active:bg-primary-100">
                {t('common.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default SectionsGrid;
