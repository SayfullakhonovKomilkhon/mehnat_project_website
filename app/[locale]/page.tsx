import { HeroSection, SectionsGrid, StatisticsSection, Features } from '@/components/landing';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  return (
    <>
      <HeroSection locale={locale} />
      <SectionsGrid locale={locale} maxItems={6} />
      <StatisticsSection variant="cards" showTrends={true} />
      <Features />
    </>
  );
}
