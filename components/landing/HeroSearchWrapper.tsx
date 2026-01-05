'use client';

import { HeroSearch } from '@/components/search';

interface HeroSearchWrapperProps {
  locale: string;
}

// Client wrapper for search functionality
export function HeroSearchWrapper({ locale }: HeroSearchWrapperProps) {
  return <HeroSearch locale={locale} />;
}

export default HeroSearchWrapper;




