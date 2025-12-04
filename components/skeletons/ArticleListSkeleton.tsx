'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

interface ArticleListSkeletonProps {
  /** Number of items to show */
  count?: number;
  /** Card variant */
  variant?: 'default' | 'compact';
  className?: string;
}

export function ArticleListSkeleton({ 
  count = 6, 
  variant = 'default',
  className 
}: ArticleListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {variant === 'compact' ? (
            <CompactArticleSkeleton />
          ) : (
            <DefaultArticleSkeleton />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function DefaultArticleSkeleton() {
  return (
    <div className="bg-gov-surface rounded-xl border border-gov-border p-5">
      <div className="flex gap-4">
        {/* Icon placeholder */}
        <Skeleton variant="rounded" width={48} height={48} />
        
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="rounded" width={60} height={22} />
            <Skeleton variant="rounded" width={80} height={22} />
          </div>
          
          {/* Title */}
          <Skeleton variant="text" width="75%" height={22} className="mb-2" />
          
          {/* Excerpt */}
          <Skeleton variant="text" lines={2} className="mb-3" />
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gov-border">
            <div className="flex items-center gap-3">
              <Skeleton variant="text" width={120} height={14} />
              <Skeleton variant="text" width={80} height={14} />
            </div>
            <Skeleton variant="text" width={60} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactArticleSkeleton() {
  return (
    <div className="bg-gov-surface rounded-lg border border-gov-border p-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="rounded" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={18} className="mb-1" />
          <Skeleton variant="text" width="40%" height={14} />
        </div>
        <Skeleton variant="rounded" width={24} height={24} />
      </div>
    </div>
  );
}

// Grid variant
interface ArticleGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ArticleGridSkeleton({ 
  count = 6, 
  columns = 3,
  className 
}: ArticleGridSkeletonProps) {
  const colClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', colClasses[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <ArticleCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="bg-gov-surface rounded-xl border border-gov-border p-5 h-full">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-3">
        <Skeleton variant="rounded" width={50} height={20} />
        <Skeleton variant="rounded" width={70} height={20} />
      </div>
      
      {/* Title */}
      <Skeleton variant="text" width="90%" height={20} className="mb-2" />
      <Skeleton variant="text" width="70%" height={20} className="mb-4" />
      
      {/* Content */}
      <Skeleton variant="text" lines={3} className="mb-4" />
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gov-border">
        <Skeleton variant="text" width={100} height={14} />
        <Skeleton variant="rounded" width={80} height={28} />
      </div>
    </div>
  );
}

export default ArticleListSkeleton;




