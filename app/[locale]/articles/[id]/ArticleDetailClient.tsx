'use client';

import { motion } from 'framer-motion';
import { 
  ArticleHeader,
  ArticleContent,
  AuthorCommentary,
  ExpertCommentary,
  ArticleSidebar,
  RelatedArticles,
  ArticleMobileNav
} from '@/components/articles';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo';
import { type Article, getLocalizedText } from '@/lib/mock-data';

interface ArticleDetailClientProps {
  article: Article;
  locale: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mehnat-kodeksi.uz';

export default function ArticleDetailClient({ article, locale }: ArticleDetailClientProps) {
  // Breadcrumb data for SEO
  const breadcrumbItems = [
    { name: 'Bosh sahifa', url: `${BASE_URL}/${locale}` },
    { name: "Bo'limlar", url: `${BASE_URL}/${locale}/sections` },
    { name: getLocalizedText(article.section.title, locale), url: `${BASE_URL}/${locale}/sections/${article.section.id}` },
    { name: `${article.number}-modda`, url: `${BASE_URL}/${locale}/articles/${article.id}` },
  ];

  return (
    <div className="min-h-screen bg-gov-light pb-20 lg:pb-8">
      {/* SEO Schemas */}
      <ArticleSchema
        article={{
          id: article.id,
          number: article.number,
          title: getLocalizedText(article.title, locale),
          content: getLocalizedText(article.content, locale),
          excerpt: getLocalizedText(article.excerpt, locale),
          lastUpdated: article.updatedAt,
          section: {
            number: article.section.number,
            title: getLocalizedText(article.section.title, locale),
          },
          chapter: {
            number: article.chapter.number,
            title: getLocalizedText(article.chapter.title, locale),
          },
          hasAuthorComment: article.hasAuthorComment,
          hasExpertComment: article.hasExpertComment,
        }}
        locale={locale}
        url={`${BASE_URL}/${locale}/articles/${article.id}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Mobile Navigation */}
      <ArticleMobileNav article={article} locale={locale} />
      
      <div className="section-container py-6 md:py-8">
        {/* Article Header */}
        <ArticleHeader article={article} locale={locale} />

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <ArticleSidebar article={article} locale={locale} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Article Text */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ArticleContent article={article} locale={locale} />
            </motion.section>

            {/* Author Commentary */}
            {/* Author Commentary */}
            <AuthorCommentary locale={locale} hasCommentary={article.hasAuthorComment} />

            {/* Expert Commentary */}
            <ExpertCommentary locale={locale} hasCommentary={article.hasExpertComment} />

            {/* Related Articles */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <RelatedArticles article={article} locale={locale} />
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}



