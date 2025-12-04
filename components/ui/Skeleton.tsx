'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'rounded';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  /** Number of text lines to render */
  lines?: number;
  /** Gap between lines */
  gap?: number;
  className?: string;
}

export function Skeleton({
  variant = 'rectangle',
  animation = 'pulse',
  width,
  height,
  lines = 1,
  gap = 8,
  className,
}: SkeletonProps) {
  const baseStyles = cn(
    'bg-gov-border',
    animation === 'pulse' && 'animate-pulse',
    animation === 'wave' && 'skeleton-wave',
  );

  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'rounded',
    circle: 'rounded-full',
    rectangle: '',
    rounded: 'rounded-lg',
  };

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} style={{ gap }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseStyles,
              variantStyles.text,
              // Last line is shorter for realistic text appearance
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{
              width: i === lines - 1 ? '75%' : (width || '100%'),
              height: height || 16,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{
        width: width || (variant === 'circle' ? 40 : '100%'),
        height: height || (variant === 'text' ? 16 : variant === 'circle' ? 40 : 100),
      }}
      aria-hidden="true"
    />
  );
}

// Skeleton Text - convenience component for text skeletons
interface SkeletonTextProps {
  lines?: number;
  width?: string | number;
  className?: string;
}

export function SkeletonText({ lines = 3, width, className }: SkeletonTextProps) {
  return (
    <Skeleton variant="text" lines={lines} width={width} className={className} />
  );
}

// Skeleton Avatar - convenience component for avatar placeholders
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const dim = avatarSizes[size];
  return (
    <Skeleton 
      variant="circle" 
      width={dim} 
      height={dim} 
      className={className} 
    />
  );
}

// Skeleton Card - convenience component for card placeholders
interface SkeletonCardProps {
  hasImage?: boolean;
  className?: string;
}

export function SkeletonCard({ hasImage = true, className }: SkeletonCardProps) {
  return (
    <div className={cn('bg-gov-surface rounded-xl border border-gov-border p-4', className)}>
      {hasImage && (
        <Skeleton variant="rounded" height={160} className="mb-4" />
      )}
      <Skeleton variant="text" width="60%" height={24} className="mb-3" />
      <Skeleton variant="text" lines={2} className="mb-4" />
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="sm" />
        <div className="flex-1">
          <Skeleton variant="text" width="40%" height={14} className="mb-1" />
          <Skeleton variant="text" width="25%" height={12} />
        </div>
      </div>
    </div>
  );
}

// Skeleton Table Row - convenience component for table row placeholders
interface SkeletonTableRowProps {
  columns?: number;
  className?: string;
}

export function SkeletonTableRow({ columns = 4, className }: SkeletonTableRowProps) {
  return (
    <div className={cn('flex items-center gap-4 py-4', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === 0 ? '20%' : i === columns - 1 ? '15%' : '25%'}
          height={14}
        />
      ))}
    </div>
  );
}

// Skeleton Article - convenience component for article list items
export function SkeletonArticle({ className }: { className?: string }) {
  return (
    <div className={cn('bg-gov-surface rounded-xl border border-gov-border p-5', className)}>
      <div className="flex gap-4">
        <Skeleton variant="rounded" width={48} height={48} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton variant="rounded" width={60} height={20} />
            <Skeleton variant="rounded" width={80} height={20} />
          </div>
          <Skeleton variant="text" width="80%" height={20} className="mb-2" />
          <Skeleton variant="text" lines={2} />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;




