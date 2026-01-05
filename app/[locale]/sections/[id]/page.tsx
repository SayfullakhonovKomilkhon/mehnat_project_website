import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronRight, 
  FileText, 
  BookOpen, 
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Card, Badge, Button, GovVerifiedBadge } from '@/components/ui';
import { getSectionWithChapters, getChapterWithArticles, getLocalizedText } from '@/lib/api';
import type { Locale } from '@/types';

interface SectionDetailPageProps {
  params: { locale: string; id: string };
}

export default async function SectionDetailPage({ params: { locale, id } }: SectionDetailPageProps) {
  const t = await getTranslations();
  
  // Fetch section with chapters from API
  const sectionData = await getSectionWithChapters(parseInt(id), locale as Locale);
  
  if (!sectionData) {
    notFound();
  }
  
  const { section, chapters } = sectionData;
  const sectionTitle = getLocalizedText(section.title, locale);
  const sectionDescription = section.description ? getLocalizedText(section.description, locale) : '';

  // Fetch articles for each chapter
  const chaptersWithArticles = await Promise.all(
    chapters.map(async (chapter) => {
      const chapterData = await getChapterWithArticles(chapter.id, locale as Locale);
      return {
        ...chapter,
        articles: chapterData?.articles || [],
      };
    })
  );

  return (
    <div className="py-8 md:py-12 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6 animate-fadeIn">
          <Link href={`/${locale}`} className="hover:text-primary-600 transition-colors">
            {t('common.home')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${locale}/sections`} className="hover:text-primary-600 transition-colors">
            {t('sections.title')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">
            {section.number}-{locale === 'ru' ? 'раздел' : locale === 'en' ? 'section' : "bo'lim"}
          </span>
        </div>

        {/* Section Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-heading font-bold text-primary-700">{section.number}</span>
            </div>
            <div>
              <Badge variant="primary" size="sm" className="mb-2">
                {section.number}-{locale === 'ru' ? 'раздел' : locale === 'en' ? 'section' : "bo'lim"}
              </Badge>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                {sectionTitle}
              </h1>
              {sectionDescription && (
                <p className="text-text-secondary mt-2">{sectionDescription}</p>
              )}
            </div>
          </div>
          <GovVerifiedBadge size="sm">
            <Shield className="w-3.5 h-3.5" />
            {t('common.verifiedByGov')}
          </GovVerifiedBadge>
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
                  <div className="flex items-center justify-between p-4 md:p-6 bg-gov-light border-b border-gov-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <Badge variant="secondary" size="sm" className="mb-1">
                          {chapter.number}-{locale === 'ru' ? 'глава' : locale === 'en' ? 'chapter' : 'bob'}
                        </Badge>
                        <h2 className="font-heading font-semibold text-text-primary">
                          {chapterTitle}
                        </h2>
                      </div>
                    </div>
                    <span className="text-sm text-text-muted">
                      {chapter.articlesCount} {locale === 'ru' ? 'статей' : locale === 'en' ? 'articles' : 'modda'}
                    </span>
                  </div>

                  {/* Articles List */}
                  {chapter.articles.length > 0 && (
                    <div className="divide-y divide-gov-border">
                      {chapter.articles.slice(0, 5).map((article) => {
                        const articleTitle = getLocalizedText(article.title, locale);
                        
                        return (
                          <Link
                            key={article.id}
                            href={`/${locale}/articles/${article.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-primary-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-accent-amber" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-text-muted">
                                {article.number}-{locale === 'ru' ? 'статья' : locale === 'en' ? 'article' : 'modda'}
                              </span>
                              <p className="text-sm text-text-primary group-hover:text-primary-700 truncate">
                                {articleTitle}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-600 flex-shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* View All Articles */}
                  <div className="p-4 border-t border-gov-border">
                    <Link href={`/${locale}/articles?chapter=${chapter.id}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        {locale === 'ru' ? 'Посмотреть все статьи' : 
                         locale === 'en' ? 'View all articles' : 
                         "Barcha moddalarni ko'rish"}
                        <ChevronRight className="w-4 h-4 ml-1" />
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
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gov-border mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
              {locale === 'ru' ? 'Главы не найдены' : 
               locale === 'en' ? 'No chapters found' : 
               "Boblar topilmadi"}
            </h3>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <Link href={`/${locale}/sections`}>
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {locale === 'ru' ? 'Назад к разделам' : 
               locale === 'en' ? 'Back to sections' : 
               "Bo'limlarga qaytish"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
