'use client';

import { motion } from 'framer-motion';
import {
  ArticleHeader,
  ArticleContent,
  ArticleCommentary,
  ArticleImages,
  ArticleSidebar,
  RelatedArticles,
  ArticleMobileNav,
  SuggestionSection,
} from '@/components/articles';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo';
import { getLocalizedText } from '@/lib/api';
import type { Article } from '@/types';

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
    {
      name: getLocalizedText(article.section.title, locale),
      url: `${BASE_URL}/${locale}/sections/${article.section.id}`,
    },
    { name: `${article.number}-modda`, url: `${BASE_URL}/${locale}/articles/${article.id}` },
  ];

  // Prepare comment data from article
  const commentData = article.article_comment || null;

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
          hasAuthorComment: article.hasAuthorComment || article.has_comment || !!commentData,
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
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar - Desktop */}
          <aside className="hidden flex-shrink-0 lg:block lg:w-72 xl:w-80">
            <ArticleSidebar article={article} locale={locale} />
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Article Text */}
            <motion.section
              id="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ArticleContent article={article} locale={locale} />
            </motion.section>

            {/* Commentary Section */}
            <div id="comment">
              <ArticleCommentary
                locale={locale}
                articleId={article.id}
                hasComment={article.hasAuthorComment || article.has_comment || !!commentData}
                commentData={commentData}
              />
            </div>

            {/* Images Section */}
            <div id="images">
              {article.images && article.images.length > 0 && (
                <ArticleImages images={article.images} locale={locale} />
              )}
            </div>

            {/* User Suggestions Section */}
            <SuggestionSection
              articleId={article.id}
              articleNumber={article.number}
              locale={locale}
            />

            {/* Related Articles */}
            <motion.section
              id="related"
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
