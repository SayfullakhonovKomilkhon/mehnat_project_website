'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticlesPaginationProps {
  locale: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
}

export function ArticlesPagination({
  locale,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: ArticlesPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/${locale}/articles?${params.toString()}`);
    onPageChange?.(page);
  };

  const handleItemsPerPageChange = (count: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(count));
    params.set('page', '1');
    router.push(`/${locale}/articles?${params.toString()}`);
    onItemsPerPageChange?.(count);
  };

  // Calculate displayed items range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gov-border"
    >
      {/* Results Info */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">{startItem}-{endItem}</span>
          {' '}dan {' '}
          <span className="font-medium text-text-primary">{totalItems}</span>
          {' '}natija
        </p>
        
        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Ko'rsatish:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className={cn(
              'h-8 px-2 rounded-lg text-sm',
              'bg-gov-light border border-gov-border',
              'text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
            )}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            currentPage === 1
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-secondary hover:bg-primary-50 hover:text-primary-700'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-text-muted">
                <MoreHorizontal className="w-5 h-5" />
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  'min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors',
                  page === currentPage
                    ? 'bg-primary-800 text-white'
                    : 'text-text-secondary hover:bg-primary-50 hover:text-primary-700'
                )}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-colors',
            currentPage === totalPages
              ? 'text-text-muted cursor-not-allowed'
              : 'text-text-secondary hover:bg-primary-50 hover:text-primary-700'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </motion.div>
  );
}

export default ArticlesPagination;



