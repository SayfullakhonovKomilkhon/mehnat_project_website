'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Layers, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { Card, Badge, GovVerifiedBadge } from '@/components/ui';

interface SectionsPageProps {
  params: { locale: string };
}

// Mock sections data - in production, fetch from API
const sectionsData = [
  {
    id: 1,
    title: "Umumiy qoidalar",
    titleRu: "Общие положения",
    titleEn: "General Provisions",
    chapters: 3,
    articles: 15,
    description: "Mehnat qonunchiligining asosiy tamoyillari va maqsadlari",
  },
  {
    id: 2,
    title: "Mehnat shartnomasi",
    titleRu: "Трудовой договор",
    titleEn: "Employment Contract",
    chapters: 5,
    articles: 45,
    description: "Mehnat shartnomasini tuzish, o'zgartirish va bekor qilish tartibi",
  },
  {
    id: 3,
    title: "Ish vaqti",
    titleRu: "Рабочее время",
    titleEn: "Working Hours",
    chapters: 4,
    articles: 28,
    description: "Ish vaqti normalari, ish tartibi va qo'shimcha ish vaqti",
  },
  {
    id: 4,
    title: "Dam olish vaqti",
    titleRu: "Время отдыха",
    titleEn: "Rest Time",
    chapters: 3,
    articles: 22,
    description: "Tanaffuslar, dam olish kunlari va mehnat ta'tillari",
  },
  {
    id: 5,
    title: "Mehnat haqi",
    titleRu: "Оплата труда",
    titleEn: "Remuneration",
    chapters: 4,
    articles: 35,
    description: "Ish haqi tizimi, minimal ish haqi va mukofotlar",
  },
  {
    id: 6,
    title: "Mehnat intizomi",
    titleRu: "Трудовая дисциплина",
    titleEn: "Labor Discipline",
    chapters: 2,
    articles: 18,
    description: "Intizomiy javobgarlik va rag'batlantirish choralari",
  },
];

export default function SectionsPage({ params: { locale } }: SectionsPageProps) {
  const t = useTranslations();

  return (
    <main id="main-content" className="py-12 md:py-16 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
              <Layers className="w-8 h-8 text-primary-700" />
            </div>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-3">
            {t('sections.title')}
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-4">
            Mehnat kodeksining barcha bo'limlari va boblariga kirish
          </p>
          <GovVerifiedBadge>
            {t('common.verifiedByGov')}
          </GovVerifiedBadge>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsData.map((section) => (
            <Link 
              key={section.id} 
              href={`/${locale}/articles?section=${section.id}`}
              className="block"
            >
              <Card hover className="h-full group">
                {/* Section Number */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="primary" size="lg">
                    {section.id}-bo'lim
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors duration-150" />
                </div>

                {/* Title */}
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-2 group-hover:text-primary-700 transition-colors duration-150">
                  {section.title}
                </h2>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {section.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-gov-border">
                  <div className="flex items-center gap-1.5 text-sm text-text-muted">
                    <BookOpen className="w-4 h-4" />
                    <span>{section.chapters} bob</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-text-muted">
                    <FileText className="w-4 h-4" />
                    <span>{section.articles} modda</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}


