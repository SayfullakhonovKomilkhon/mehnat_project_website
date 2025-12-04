'use client';

import Script from 'next/script';
import { type Article } from '@/lib/mock-data';

interface ArticleSchemaProps {
  article: {
    id: number;
    number: string;
    title: string;
    content: string;
    excerpt?: string;
    lastUpdated?: string;
    section: { number: string; title: string };
    chapter: { number: string; title: string };
    hasAuthorComment?: boolean;
    hasExpertComment?: boolean;
  };
  locale: string;
  url: string;
}

export function ArticleSchema({ article, locale, url }: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${article.number}-modda. ${article.title}`,
    description: article.excerpt || article.content.substring(0, 160),
    dateModified: article.lastUpdated || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: "O'zbekiston Respublikasi Bandlik va mehnat munosabatlari vazirligi",
      url: 'https://mehnat.uz',
    },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: "O'zbekiston Respublikasi Bandlik va mehnat munosabatlari vazirligi",
      logo: {
        '@type': 'ImageObject',
        url: `${url}/images/gov-emblem.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.section.title,
    inLanguage: locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
    isPartOf: {
      '@type': 'Legislation',
      name: "O'zbekiston Respublikasi Mehnat kodeksi",
      legislationType: 'Code',
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Organization Schema
interface OrganizationSchemaProps {
  baseUrl: string;
}

export function OrganizationSchema({ baseUrl }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: "O'zbekiston Respublikasi Bandlik va mehnat munosabatlari vazirligi",
    alternateName: ['Ministry of Employment and Labor Relations', 'Министерство занятости и трудовых отношений'],
    url: 'https://mehnat.uz',
    logo: `${baseUrl}/images/gov-emblem.svg`,
    sameAs: [
      'https://t.me/mehaboruz',
      'https://facebook.com/mehaboruz',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Mustaqillik ko'chasi, 5",
      addressLocality: 'Toshkent',
      addressCountry: 'UZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+998-71-200-15-15',
      contactType: 'customer service',
      availableLanguage: ['uz', 'ru', 'en'],
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema
interface WebsiteSchemaProps {
  baseUrl: string;
  locale: string;
}

export function WebsiteSchema({ baseUrl, locale }: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mehnat Kodeksiga Sharh',
    alternateName: ['Labor Code Commentary', 'Комментарии к Трудовому кодексу'],
    url: baseUrl,
    inLanguage: locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: "O'zbekiston Respublikasi Bandlik va mehnat munosabatlari vazirligi",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Legal Document Schema
interface LegalDocumentSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  jurisdiction: string;
  locale: string;
}

export function LegalDocumentSchema({
  title,
  description,
  datePublished,
  dateModified,
  jurisdiction,
  locale,
}: LegalDocumentSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    name: title,
    description,
    legislationType: 'Code',
    datePublished,
    dateModified,
    jurisdiction: {
      '@type': 'AdministrativeArea',
      name: jurisdiction,
    },
    inLanguage: locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
    legislationPassedBy: {
      '@type': 'GovernmentOrganization',
      name: "O'zbekiston Respublikasi Oliy Majlisi",
    },
  };

  return (
    <Script
      id="legal-document-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ArticleSchema;




