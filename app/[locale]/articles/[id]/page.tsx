import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles, getLocalizedText } from '@/lib/mock-data';
import ArticleDetailClient from './ArticleDetailClient';

interface ArticleDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mehnat-kodeksi.uz';

// Generate static params for all articles
export async function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}

// Generate metadata for each article
export async function generateMetadata({ 
  params 
}: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, id } = params;
  const articleId = parseInt(id);
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return {
      title: 'Modda topilmadi',
      description: 'Bu modda mavjud emas',
    };
  }

  const title = getLocalizedText(article.title, locale);
  const excerpt = getLocalizedText(article.excerpt, locale);
  const sectionTitle = getLocalizedText(article.section.title, locale);

  const fullTitle = `${article.number}-modda. ${title}`;
  const description = excerpt || `${sectionTitle} - ${title}. O'zbekiston Respublikasi Mehnat kodeksi.`;

  return {
    title: fullTitle,
    description,
    keywords: [
      `${article.number}-modda`,
      title,
      sectionTitle,
      'mehnat kodeksi',
      'labor code',
      'uzbekistan',
    ],
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      locale: locale === 'uz' ? 'uz_UZ' : locale === 'ru' ? 'ru_RU' : 'en_US',
      url: `${BASE_URL}/${locale}/articles/${article.id}`,
      siteName: 'Mehnat Kodeksiga Sharh',
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
      section: sectionTitle,
      tags: [title, sectionTitle, 'mehnat kodeksi'],
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/articles/${article.id}`,
      languages: {
        'uz-UZ': `${BASE_URL}/uz/articles/${article.id}`,
        'ru-RU': `${BASE_URL}/ru/articles/${article.id}`,
        'en-US': `${BASE_URL}/en/articles/${article.id}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { locale, id } = params;
  const articleId = parseInt(id);
  
  // Find the article
  const article = articles.find(a => a.id === articleId);
  
  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} locale={locale} />;
}
