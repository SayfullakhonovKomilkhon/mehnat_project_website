import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Layers, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { Card, Badge, GovVerifiedBadge } from '@/components/ui';
import { getSections, getLocalizedText } from '@/lib/api';
import type { Locale } from '@/types';

interface SectionsPageProps {
  params: { locale: string };
}

export default async function SectionsPage({ params: { locale } }: SectionsPageProps) {
  const t = await getTranslations();

  // Fetch sections from API
  const sections = await getSections(locale as Locale);

  return (
    <main id="main-content" className="min-h-screen bg-gov-light py-8 sm:py-12 md:py-16">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-3 flex justify-center sm:mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 sm:h-16 sm:w-16 sm:rounded-2xl">
              <Layers className="h-6 w-6 text-primary-700 sm:h-8 sm:w-8" />
            </div>
          </div>
          <h1 className="mb-2 px-4 font-heading text-xl font-bold text-text-primary sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
            {t('sections.title')}
          </h1>
          <p className="mx-auto mb-3 max-w-2xl px-4 text-sm text-text-secondary sm:mb-4 sm:text-base">
            {locale === 'ru'
              ? 'Доступ ко всем разделам и главам Трудового кодекса'
              : "Mehnat kodeksining barcha bo'limlari va boblariga kirish"}
          </p>
          <GovVerifiedBadge>{t('common.verifiedByGov')}</GovVerifiedBadge>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sections.map(section => {
            const title = getLocalizedText(section.title, locale);
            const description = section.description
              ? getLocalizedText(section.description, locale)
              : '';

            return (
              <Link
                key={section.id}
                href={`/${locale}/sections/${section.id}`}
                className="block h-full"
              >
                <Card hover className="group flex h-full flex-col">
                  {/* Section Number */}
                  <div className="mb-3 flex items-center justify-between sm:mb-4">
                    <Badge variant="primary" size="md" className="text-xs sm:text-sm">
                      {section.number}-{locale === 'ru' ? 'раздел' : "bo'lim"}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-text-muted transition-colors duration-150 group-hover:text-primary-600 sm:h-5 sm:w-5" />
                  </div>

                  {/* Title */}
                  <h2 className="mb-2 font-heading text-base font-semibold text-text-primary transition-colors duration-150 group-hover:text-primary-700 sm:text-lg md:text-xl">
                    {title}
                  </h2>

                  {/* Description - grows to fill space */}
                  <p className="line-clamp-2 flex-grow text-xs text-text-secondary sm:text-sm">
                    {description || '\u00A0'}
                  </p>

                  {/* Stats - Always at bottom */}
                  <div className="mt-3 flex items-center gap-3 border-t border-gov-border pt-3 sm:mt-4 sm:gap-4 sm:pt-4">
                    <div className="flex items-center gap-1 text-xs text-text-muted sm:gap-1.5 sm:text-sm">
                      <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>
                        {section.chaptersCount} {locale === 'ru' ? 'глав' : 'bob'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted sm:gap-1.5 sm:text-sm">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>
                        {section.articlesCount} {locale === 'ru' ? 'статей' : 'modda'}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {sections.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gov-border">
              <Layers className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
              {locale === 'ru' ? 'Разделы не найдены' : "Bo'limlar topilmadi"}
            </h3>
            <p className="text-text-secondary">
              {locale === 'ru'
                ? 'Пожалуйста, попробуйте позже'
                : "Iltimos, keyinroq urinib ko'ring"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
