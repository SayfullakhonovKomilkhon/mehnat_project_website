'use client';

import { cn } from '@/lib/utils';

interface GovEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'light' | 'gold' | 'mono';
  className?: string;
}

const sizeStyles = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

export function GovEmblem({ size = 'md', variant = 'default', className }: GovEmblemProps) {
  const colorMap = {
    default: {
      primary: '#1E3A8A',
      secondary: '#F59E0B',
      accent: '#3B82F6',
      fill: '#1E3A8A',
    },
    light: {
      primary: '#FFFFFF',
      secondary: '#F59E0B',
      accent: '#93C5FD',
      fill: '#FFFFFF',
    },
    gold: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FEF3C7',
      fill: '#F59E0B',
    },
    mono: {
      primary: '#64748B',
      secondary: '#94A3B8',
      accent: '#CBD5E1',
      fill: '#64748B',
    },
  };

  const colors = colorMap[variant];

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeStyles[size], className)}
      aria-label="O'zbekiston Davlat Gerbi"
      role="img"
    >
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="2"
      />
      
      {/* Inner Circle */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Shield Shape - Main Body */}
      <path
        d="M50 10 
           C70 10 85 25 85 45 
           C85 65 70 85 50 95 
           C30 85 15 65 15 45 
           C15 25 30 10 50 10Z"
        fill={colors.primary}
        opacity="0.1"
      />
      <path
        d="M50 10 
           C70 10 85 25 85 45 
           C85 65 70 85 50 95 
           C30 85 15 65 15 45 
           C15 25 30 10 50 10Z"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
      />

      {/* Central Star - 12 Points */}
      <g transform="translate(50, 38)">
        <polygon
          points="0,-18 4,-6 18,-6 7,3 11,15 0,8 -11,15 -7,3 -18,-6 -4,-6"
          fill={colors.secondary}
        />
        {/* Inner Star Detail */}
        <circle cx="0" cy="0" r="5" fill={colors.primary} />
      </g>

      {/* Book Symbol - Representing Law/Code */}
      <g transform="translate(50, 68)">
        {/* Book Base */}
        <rect
          x="-15"
          y="-8"
          width="30"
          height="16"
          rx="2"
          fill={colors.primary}
        />
        {/* Book Spine */}
        <line
          x1="0"
          y1="-8"
          x2="0"
          y2="8"
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        {/* Page Lines - Left */}
        <line x1="-12" y1="-4" x2="-3" y2="-4" stroke={colors.accent} strokeWidth="1" opacity="0.7" />
        <line x1="-12" y1="0" x2="-3" y2="0" stroke={colors.accent} strokeWidth="1" opacity="0.7" />
        <line x1="-12" y1="4" x2="-3" y2="4" stroke={colors.accent} strokeWidth="1" opacity="0.7" />
        {/* Page Lines - Right */}
        <line x1="3" y1="-4" x2="12" y2="-4" stroke={colors.accent} strokeWidth="1" opacity="0.7" />
        <line x1="3" y1="0" x2="12" y2="0" stroke={colors.accent} strokeWidth="1" opacity="0.7" />
        <line x1="3" y1="4" x2="12" y2="4" stroke={colors.accent} strokeWidth="1" opacity="0.7" />
      </g>

      {/* Decorative Laurel/Cotton Branches */}
      {/* Left Branch */}
      <path
        d="M20 70 Q10 55 15 40 Q20 50 22 45 Q18 55 25 60"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="42" r="3" fill={colors.secondary} opacity="0.8" />
      <circle cx="22" cy="48" r="2.5" fill={colors.secondary} opacity="0.8" />
      <circle cx="20" cy="55" r="2" fill={colors.secondary} opacity="0.8" />
      
      {/* Right Branch */}
      <path
        d="M80 70 Q90 55 85 40 Q80 50 78 45 Q82 55 75 60"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="82" cy="42" r="3" fill={colors.secondary} opacity="0.8" />
      <circle cx="78" cy="48" r="2.5" fill={colors.secondary} opacity="0.8" />
      <circle cx="80" cy="55" r="2" fill={colors.secondary} opacity="0.8" />

      {/* Crescent and Star at Top */}
      <g transform="translate(50, 22)">
        {/* Crescent */}
        <path
          d="M-8,-5 A8,8 0 1,1 -8,5 A6,6 0 1,0 -8,-5"
          fill={colors.secondary}
        />
        {/* Small Star */}
        <polygon
          points="4,0 5,-1.5 7,0 5,1.5"
          fill={colors.secondary}
        />
      </g>
    </svg>
  );
}

export default GovEmblem;
