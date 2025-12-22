import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ArticlesContent from './ArticlesContent';
import { ArticleListSkeleton } from '@/components/skeletons';

interface ArticlesPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: ArticlesPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'article' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ArticlesPage({ params: { locale } }: ArticlesPageProps) {
  return (
    <Suspense fallback={<ArticlesPageFallback />}>
      <ArticlesContent locale={locale} />
    </Suspense>
  );
}

// Skeleton fallback while loading
function ArticlesPageFallback() {
  return (
    <div className="py-8 md:py-12 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-gov-border rounded animate-pulse mb-4" />
          <div className="h-10 w-64 bg-gov-border rounded animate-pulse mb-2" />
          <div className="h-5 w-48 bg-gov-border rounded animate-pulse" />
        </div>
        
        {/* Filters skeleton */}
        <div className="h-16 bg-gov-surface rounded-xl border border-gov-border animate-pulse mb-6" />
        
        {/* Articles skeleton */}
        <ArticleListSkeleton count={5} />
      </div>
    </div>
  );
}
