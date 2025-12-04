'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

interface ArticleDetailSkeletonProps {
  className?: string;
}

export function ArticleDetailSkeleton({ className }: ArticleDetailSkeletonProps) {
  return (
    <div className={cn('min-h-screen bg-gov-light', className)}>
      {/* Breadcrumb */}
      <div className="bg-gov-surface border-b border-gov-border py-4">
        <div className="section-container">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={60} height={14} />
            <Skeleton variant="text" width={10} height={14} />
            <Skeleton variant="text" width={100} height={14} />
            <Skeleton variant="text" width={10} height={14} />
            <Skeleton variant="text" width={80} height={14} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-white py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <Skeleton 
              variant="rounded" 
              width={80} 
              height={28} 
              className="mb-4 bg-white/20" 
            />
            
            {/* Title */}
            <Skeleton 
              variant="text" 
              width="80%" 
              height={36} 
              className="mb-3 bg-white/20" 
            />
            <Skeleton 
              variant="text" 
              width="60%" 
              height={36} 
              className="mb-6 bg-white/20" 
            />
            
            {/* Meta */}
            <div className="flex items-center gap-4">
              <Skeleton variant="text" width={120} height={16} className="bg-white/20" />
              <Skeleton variant="text" width={100} height={16} className="bg-white/20" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Article Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gov-surface rounded-xl border border-gov-border p-6 mb-6"
            >
              <Skeleton variant="text" width={120} height={24} className="mb-4" />
              <Skeleton variant="text" lines={4} className="mb-4" />
              <Skeleton variant="text" lines={3} className="mb-4" />
              <Skeleton variant="text" lines={5} />
            </motion.div>

            {/* Author Commentary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-50 rounded-xl border border-primary-200 p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="circle" width={48} height={48} />
                <div>
                  <Skeleton variant="text" width={150} height={18} className="mb-1" />
                  <Skeleton variant="text" width={100} height={14} />
                </div>
              </div>
              <Skeleton variant="text" lines={4} />
            </motion.div>

            {/* Expert Commentary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-accent-light rounded-xl border border-accent-amber/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton variant="circle" width={48} height={48} />
                <div>
                  <Skeleton variant="text" width={140} height={18} className="mb-1" />
                  <Skeleton variant="text" width={120} height={14} />
                </div>
              </div>
              <Skeleton variant="text" lines={3} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Table of Contents */}
              <div className="bg-gov-surface rounded-xl border border-gov-border p-4">
                <Skeleton variant="text" width={100} height={18} className="mb-4" />
                <div className="space-y-2">
                  <Skeleton variant="text" width="90%" height={14} />
                  <Skeleton variant="text" width="80%" height={14} />
                  <Skeleton variant="text" width="85%" height={14} />
                  <Skeleton variant="text" width="75%" height={14} />
                </div>
              </div>

              {/* Related Articles */}
              <div className="bg-gov-surface rounded-xl border border-gov-border p-4">
                <Skeleton variant="text" width={130} height={18} className="mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton variant="rounded" width={32} height={32} />
                      <div className="flex-1">
                        <Skeleton variant="text" width="90%" height={14} className="mb-1" />
                        <Skeleton variant="text" width="60%" height={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ask Question Button */}
              <Skeleton variant="rounded" width="100%" height={44} />
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailSkeleton;



