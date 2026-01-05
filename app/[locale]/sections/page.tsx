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
    <main id="main-content" className="py-8 sm:py-12 md:py-16 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary-100 flex items-center justify-center">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-primary-700" />
            </div>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2 sm:mb-3 px-4">
            {t('sections.title')}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto mb-3 sm:mb-4 px-4">
            {locale === 'ru' ? 'Доступ ко всем разделам и главам Трудового кодекса' :
             locale === 'en' ? 'Access to all sections and chapters of the Labor Code' :
             "Mehnat kodeksining barcha bo'limlari va boblariga kirish"}
          </p>
          <GovVerifiedBadge>
            {t('common.verifiedByGov')}
          </GovVerifiedBadge>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section) => {
            const title = getLocalizedText(section.title, locale);
            const description = section.description ? getLocalizedText(section.description, locale) : '';
            
            return (
              <Link 
                key={section.id} 
                href={`/${locale}/sections/${section.id}`}
                className="block"
              >
                <Card hover className="h-full group">
                  {/* Section Number */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Badge variant="primary" size="md" className="text-xs sm:text-sm">
                      {section.number}-{locale === 'ru' ? 'раздел' : locale === 'en' ? 'section' : "bo'lim"}
                    </Badge>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted group-hover:text-primary-600 transition-colors duration-150" />
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-base sm:text-lg md:text-xl font-semibold text-text-primary mb-2 group-hover:text-primary-700 transition-colors duration-150">
                    {title}
                  </h2>

                  {/* Description */}
                  {description && (
                    <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gov-border">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-text-muted">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>
                        {section.chaptersCount} {locale === 'ru' ? 'глав' : locale === 'en' ? 'chapters' : 'bob'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-text-muted">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>
                        {section.articlesCount} {locale === 'ru' ? 'статей' : locale === 'en' ? 'articles' : 'modda'}
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
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gov-border mx-auto mb-4 flex items-center justify-center">
              <Layers className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
              {locale === 'ru' ? 'Разделы не найдены' : 
               locale === 'en' ? 'No sections found' : 
               "Bo'limlar topilmadi"}
            </h3>
            <p className="text-text-secondary">
              {locale === 'ru' ? 'Пожалуйста, попробуйте позже' : 
               locale === 'en' ? 'Please try again later' : 
               "Iltimos, keyinroq urinib ko'ring"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
