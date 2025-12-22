'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

interface SectionsSkeletonProps {
  /** Number of section cards */
  count?: number;
  className?: string;
}

export function SectionsSkeleton({ count = 6, className }: SectionsSkeletonProps) {
  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-10">
        <Skeleton variant="text" width={200} height={32} className="mx-auto mb-3" />
        <Skeleton variant="text" width={400} height={20} className="mx-auto" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SectionCardSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SectionCardSkeleton() {
  return (
    <div className="bg-gov-surface rounded-xl border border-gov-border border-l-4 border-l-gov-border p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <Skeleton variant="rounded" width={48} height={48} />
        
        <div className="flex-1">
          {/* Section number */}
          <Skeleton variant="text" width={80} height={14} className="mb-2" />
          
          {/* Title */}
          <Skeleton variant="text" width="90%" height={20} className="mb-1" />
          <Skeleton variant="text" width="70%" height={20} className="mb-4" />
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <Skeleton variant="text" width={70} height={14} />
            <Skeleton variant="text" width={80} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Detail Skeleton
interface SectionDetailSkeletonProps {
  className?: string;
}

export function SectionDetailSkeleton({ className }: SectionDetailSkeletonProps) {
  return (
    <div className={cn('min-h-screen bg-gov-light', className)}>
      {/* Breadcrumb */}
      <div className="bg-gov-surface border-b border-gov-border py-4">
        <div className="section-container">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={60} height={14} />
            <Skeleton variant="text" width={10} height={14} />
            <Skeleton variant="text" width={120} height={14} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-800 to-primary-900 py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Skeleton variant="text" width={100} height={24} className="mb-4 bg-white/20" />
            <Skeleton variant="text" width="60%" height={36} className="mb-6 bg-white/20" />
            <div className="flex items-center gap-4">
              <Skeleton variant="text" width={100} height={16} className="bg-white/20" />
              <Skeleton variant="text" width={120} height={16} className="bg-white/20" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gov-surface rounded-xl border border-gov-border p-4 sticky top-24">
              <Skeleton variant="text" width={80} height={18} className="mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="text" width="100%" height={36} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gov-surface rounded-xl border border-gov-border p-5"
              >
                <div className="flex gap-4">
                  <Skeleton variant="rounded" width={40} height={40} />
                  <div className="flex-1">
                    <Skeleton variant="text" width="70%" height={20} className="mb-2" />
                    <Skeleton variant="text" lines={2} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gov-surface rounded-xl border border-gov-border p-5"
        >
          <div className="flex gap-4">
            <Skeleton variant="rounded" width={48} height={48} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton variant="rounded" width={50} height={20} />
                <Skeleton variant="rounded" width={70} height={20} />
              </div>
              <Skeleton variant="text" width="80%" height={20} className="mb-2" />
              <Skeleton variant="text" lines={2} className="mb-3" />
              <Skeleton variant="text" width={150} height={14} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default SectionsSkeleton;





