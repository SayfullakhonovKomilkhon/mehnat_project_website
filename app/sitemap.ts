import { MetadataRoute } from 'next';
import { articles, sections, chapters } from '@/lib/mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mehnat-kodeksi.uz';
const locales = ['uz', 'ru'];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages for each locale
  const staticPages = ['', '/articles', '/sections', '/search'];

  locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemap.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            uz: `${BASE_URL}/uz${page}`,
            ru: `${BASE_URL}/ru${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      });
    });
  });

  // Section pages
  sections.forEach(section => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${BASE_URL}/${locale}/sections/${section.id}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            uz: `${BASE_URL}/uz/sections/${section.id}`,
            ru: `${BASE_URL}/ru/sections/${section.id}`,
            en: `${BASE_URL}/en/sections/${section.id}`,
          },
        },
      });
    });
  });

  // Article pages
  articles.forEach(article => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${BASE_URL}/${locale}/articles/${article.id}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: {
            uz: `${BASE_URL}/uz/articles/${article.id}`,
            ru: `${BASE_URL}/ru/articles/${article.id}`,
            en: `${BASE_URL}/en/articles/${article.id}`,
          },
        },
      });
    });
  });

  return sitemap;
}
