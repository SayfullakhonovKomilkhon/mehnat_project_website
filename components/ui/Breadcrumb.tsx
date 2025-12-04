'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, locale, className, showHome = true }: BreadcrumbProps) {
  const t = useTranslations();
  
  // Build full breadcrumb list with home
  const allItems: BreadcrumbItem[] = showHome 
    ? [{ label: t('common.home'), href: `/${locale}` }, ...items]
    : items;

  // Truncate long labels for mobile
  const truncateLabel = (label: string, maxLength: number = 25) => {
    if (label.length <= maxLength) return label;
    return `${label.slice(0, maxLength)}...`;
  };

  return (
    <>
      {/* Schema.org Breadcrumb Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": allItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.label,
              "item": item.href ? `${typeof window !== 'undefined' ? window.location.origin : ''}${item.href}` : undefined
            }))
          })
        }}
      />
      
      {/* Visual Breadcrumb */}
      <nav 
        aria-label="Breadcrumb" 
        className={cn('flex items-center flex-wrap gap-1 sm:gap-2', className)}
      >
        <ol className="flex items-center flex-wrap gap-1 sm:gap-2" role="list">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isFirst = index === 0;
            
            return (
              <li 
                key={index} 
                className="flex items-center gap-1 sm:gap-2"
              >
                {/* Separator */}
                {index > 0 && (
                  <ChevronRight 
                    className="w-4 h-4 text-text-muted flex-shrink-0" 
                    aria-hidden="true"
                  />
                )}
                
                {/* Breadcrumb Item */}
                {isLast || !item.href ? (
                  // Current page (not clickable)
                  <span 
                    className={cn(
                      'text-sm font-medium',
                      isLast ? 'text-text-primary' : 'text-text-secondary'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {isFirst && showHome ? (
                      <span className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </span>
                    ) : (
                      <>
                        <span className="sm:hidden">{truncateLabel(item.label, 20)}</span>
                        <span className="hidden sm:inline">{item.label}</span>
                      </>
                    )}
                  </span>
                ) : (
                  // Clickable link
                  <Link
                    href={item.href}
                    className={cn(
                      'text-sm text-text-secondary hover:text-primary-600',
                      'transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded'
                    )}
                  >
                    {isFirst && showHome ? (
                      <span className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </span>
                    ) : (
                      <>
                        <span className="sm:hidden">{truncateLabel(item.label, 20)}</span>
                        <span className="hidden sm:inline">{item.label}</span>
                      </>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;



