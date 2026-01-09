import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, FileText, BookOpen, ArrowLeft } from 'lucide-react';
import { Card, Badge, Button, GovVerifiedBadge } from '@/components/ui';
import { getSectionWithChapters, getChapterWithArticles, getLocalizedText } from '@/lib/api';
import type { Locale } from '@/types';

interface SectionDetailPageProps {
  params: { locale: string; id: string };
}

export default async function SectionDetailPage({
  params: { locale, id },
}: SectionDetailPageProps) {
  const t = await getTranslations();

  // Fetch section with chapters from API
  const sectionData = await getSectionWithChapters(parseInt(id), locale as Locale);

  if (!sectionData) {
    notFound();
  }

  const { section, chapters } = sectionData;
  const sectionTitle = getLocalizedText(section.title, locale);
  const sectionDescription = section.description
    ? getLocalizedText(section.description, locale)
    : '';

  // Fetch articles for each chapter
  const chaptersWithArticles = await Promise.all(
    chapters.map(async chapter => {
      const chapterData = await getChapterWithArticles(chapter.id, locale as Locale);
      return {
        ...chapter,
        articles: chapterData?.articles || [],
      };
    })
  );

  return (
    <div className="min-h-screen bg-gov-light py-8 md:py-12">
      <div className="section-container">
        {/* Breadcrumb */}
        <div className="animate-fadeIn mb-6 flex items-center gap-2 text-sm text-text-secondary">
          <Link href={`/${locale}`} className="transition-colors hover:text-primary-600">
            {t('common.home')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${locale}/sections`} className="transition-colors hover:text-primary-600">
            {t('sections.title')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text-primary">
            {section.number}-{locale === 'ru' ? 'раздел' : "bo'lim"}
          </span>
        </div>

        {/* Section Header */}
        <div className="animate-fadeIn mb-8">
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-100">
              <span className="font-heading text-2xl font-bold text-primary-700">
                {section.number}
              </span>
            </div>
            <div>
              <Badge variant="primary" size="sm" className="mb-2">
                {section.number}-{locale === 'ru' ? 'раздел' : "bo'lim"}
              </Badge>
              <h1 className="font-heading text-2xl font-bold text-text-primary md:text-3xl">
                {sectionTitle}
              </h1>
              {sectionDescription && (
                <p className="mt-2 text-text-secondary">{sectionDescription}</p>
              )}
            </div>
          </div>
          <GovVerifiedBadge size="sm">{t('common.verifiedByGov')}</GovVerifiedBadge>
        </div>

        {/* Chapters List */}
        <div className="space-y-6">
          {chaptersWithArticles.map((chapter, index) => {
            const chapterTitle = getLocalizedText(chapter.title, locale);

            return (
              <div
                key={chapter.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="overflow-hidden">
                  {/* Chapter Header */}
                  <div className="flex items-center justify-between border-b border-gov-border bg-gov-light p-4 md:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                        <BookOpen className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <Badge variant="secondary" size="sm" className="mb-1">
                          {chapter.number}-{locale === 'ru' ? 'глава' : 'bob'}
                        </Badge>
                        <h2 className="font-heading font-semibold text-text-primary">
                          {chapterTitle}
                        </h2>
                      </div>
                    </div>
                    <span className="text-sm text-text-muted">
                      {chapter.articlesCount} {locale === 'ru' ? 'статей' : 'modda'}
                    </span>
                  </div>

                  {/* Articles List */}
                  {chapter.articles.length > 0 && (
                    <div className="divide-y divide-gov-border">
                      {chapter.articles.slice(0, 5).map(article => {
                        const articleTitle = getLocalizedText(article.title, locale);

                        return (
                          <Link
                            key={article.id}
                            href={`/${locale}/articles/${article.id}`}
                            className="group flex items-center gap-4 p-4 transition-colors hover:bg-primary-50"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-gold/10">
                              <FileText className="h-4 w-4 text-accent-amber" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs text-text-muted">
                                {article.number}-{locale === 'ru' ? 'статья' : 'modda'}
                              </span>
                              <p className="truncate text-sm text-text-primary group-hover:text-primary-700">
                                {articleTitle}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 flex-shrink-0 text-text-muted group-hover:text-primary-600" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* View All Articles */}
                  <div className="border-t border-gov-border p-4">
                    <Link href={`/${locale}/articles?chapter=${chapter.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        {locale === 'ru' ? 'Посмотреть все статьи' : "Barcha moddalarni ko'rish"}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {chapters.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gov-border">
              <BookOpen className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
              {locale === 'ru' ? 'Главы не найдены' : 'Boblar topilmadi'}
            </h3>
          </div>
        )}

        {/* Back Button */}
        <div className="animate-fadeIn mt-8" style={{ animationDelay: '0.3s' }}>
          <Link href={`/${locale}/sections`}>
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              {locale === 'ru' ? 'Назад к разделам' : "Bo'limlarga qaytish"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
