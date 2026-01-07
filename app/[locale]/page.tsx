import { Suspense } from 'react';
import { HeroSection, SectionsGrid, StatisticsSection, Features } from '@/components/landing';
import { SectionsSkeleton } from '@/components/skeletons';

// Enable ISR - revalidate page every 5 minutes
// This makes the page static and fast, while still updating periodically
export const revalidate = 300;

// Force static generation for faster initial load
export const dynamic = 'force-static';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  return (
    <>
      <HeroSection locale={locale} />
      <Suspense fallback={<SectionsSkeleton />}>
        <SectionsGrid locale={locale} maxItems={6} />
      </Suspense>
      <StatisticsSection variant="cards" showTrends={true} />
      <Features />
    </>
  );
}
