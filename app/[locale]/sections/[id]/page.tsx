'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  FileText, 
  BookOpen, 
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Card, Badge, Button, GovVerifiedBadge } from '@/components/ui';
import { GovEmblem } from '@/components/layout';

interface SectionDetailPageProps {
  params: { locale: string; id: string };
}

// Mock chapters data - in production, fetch based on section ID
const getChaptersForSection = (sectionId: string) => {
  const chapters: Record<string, Array<{
    id: number;
    number: string;
    title_uz: string;
    title_ru: string;
    title_en: string;
    articlesCount: number;
    articles: Array<{ id: number; number: number; title_uz: string; title_ru: string; title_en: string }>;
  }>> = {
    '1': [
      {
        id: 1,
        number: '1',
        title_uz: "Mehnat qonunchiligi va uning vazifalari",
        title_ru: "Трудовое законодательство и его задачи",
        title_en: "Labor Legislation and Its Tasks",
        articlesCount: 6,
        articles: [
          { id: 1, number: 1, title_uz: "Mehnat qonunchiligi", title_ru: "Трудовое законодательство", title_en: "Labor Legislation" },
          { id: 2, number: 2, title_uz: "Mehnat qonunchiligi doirasi", title_ru: "Сфера трудового законодательства", title_en: "Scope of Labor Legislation" },
          { id: 3, number: 3, title_uz: "Mehnat huquqlari", title_ru: "Трудовые права", title_en: "Labor Rights" },
        ]
      },
      {
        id: 2,
        number: '2',
        title_uz: "Mehnat munosabatlari",
        title_ru: "Трудовые отношения",
        title_en: "Labor Relations",
        articlesCount: 8,
        articles: [
          { id: 4, number: 4, title_uz: "Mehnat munosabatlari tushunchasi", title_ru: "Понятие трудовых отношений", title_en: "Concept of Labor Relations" },
          { id: 5, number: 5, title_uz: "Mehnat munosabatlarining taraflari", title_ru: "Стороны трудовых отношений", title_en: "Parties to Labor Relations" },
        ]
      },
      {
        id: 3,
        number: '3',
        title_uz: "Ijtimoiy sheriklik",
        title_ru: "Социальное партнерство",
        title_en: "Social Partnership",
        articlesCount: 5,
        articles: []
      },
    ],
    '2': [
      {
        id: 4,
        number: '4',
        title_uz: "Mehnat shartnomasi tushunchasi",
        title_ru: "Понятие трудового договора",
        title_en: "Concept of Employment Contract",
        articlesCount: 10,
        articles: []
      },
      {
        id: 5,
        number: '5',
        title_uz: "Mehnat shartnomasini tuzish",
        title_ru: "Заключение трудового договора",
        title_en: "Concluding Employment Contract",
        articlesCount: 12,
        articles: []
      },
    ],
  };
  
  return chapters[sectionId] || chapters['1'];
};

// Section info
const getSectionInfo = (id: string, locale: string) => {
  const sections: Record<string, { title_uz: string; title_ru: string; title_en: string; number: string }> = {
    '1': { number: 'I', title_uz: "Umumiy qoidalar", title_ru: "Общие положения", title_en: "General Provisions" },
    '2': { number: 'II', title_uz: "Mehnat shartnomasi", title_ru: "Трудовой договор", title_en: "Employment Contract" },
    '3': { number: 'III', title_uz: "Ish vaqti", title_ru: "Рабочее время", title_en: "Working Hours" },
  };
  
  const section = sections[id] || sections['1'];
  const title = locale === 'ru' ? section.title_ru : locale === 'en' ? section.title_en : section.title_uz;
  
  return { ...section, title };
};

export default function SectionDetailPage({ params: { locale, id } }: SectionDetailPageProps) {
  const t = useTranslations();
  const chapters = getChaptersForSection(id);
  const sectionInfo = getSectionInfo(id, locale);

  const getLocalizedTitle = (item: { title_uz: string; title_ru: string; title_en: string }) => {
    switch (locale) {
      case 'ru': return item.title_ru;
      case 'en': return item.title_en;
      default: return item.title_uz;
    }
  };

  return (
    <div className="py-8 md:py-12 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-text-secondary mb-6"
        >
          <Link href={`/${locale}`} className="hover:text-primary-600 transition-colors">
            {t('common.home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${locale}/sections`} className="hover:text-primary-600 transition-colors">
            {t('sections.title')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">
            {sectionInfo.number}-bo'lim
          </span>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-heading font-bold text-primary-700">{sectionInfo.number}</span>
            </div>
            <div>
              <Badge variant="primary" size="sm" className="mb-2">
                {sectionInfo.number}-bo'lim
              </Badge>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                {sectionInfo.title}
              </h1>
            </div>
          </div>
          <GovVerifiedBadge size="sm">
            <Shield className="w-3.5 h-3.5" />
            {t('common.verifiedByGov')}
          </GovVerifiedBadge>
        </motion.div>

        {/* Chapters List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="space-y-6"
        >
          {chapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="overflow-hidden">
                {/* Chapter Header */}
                <div className="flex items-center justify-between p-4 md:p-6 bg-gov-light border-b border-gov-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <Badge variant="secondary" size="sm" className="mb-1">
                        {chapter.number}-bob
                      </Badge>
                      <h2 className="font-heading font-semibold text-text-primary">
                        {getLocalizedTitle(chapter)}
                      </h2>
                    </div>
                  </div>
                  <span className="text-sm text-text-muted">
                    {chapter.articlesCount} modda
                  </span>
                </div>

                {/* Articles List */}
                {chapter.articles.length > 0 && (
                  <div className="divide-y divide-gov-border">
                    {chapter.articles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/${locale}/articles/${article.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-primary-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-accent-amber" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-text-muted">{article.number}-modda</span>
                          <p className="text-sm text-text-primary group-hover:text-primary-700 truncate">
                            {getLocalizedTitle(article)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-600 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* View All Articles */}
                <div className="p-4 border-t border-gov-border">
                  <Link href={`/${locale}/articles?chapter=${chapter.id}`}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Barcha moddalarni ko'rish
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Link href={`/${locale}/sections`}>
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {t('common.backToHome')}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}





