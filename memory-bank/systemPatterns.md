# System Patterns: Mehnat Kodeksiga Sharh

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Layout    │  │   Pages     │  │    Components       │  │
│  │  (Server)   │  │ (Server/    │  │  (UI/Layout/        │  │
│  │             │  │  Client)    │  │   Feature)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   next-intl │  │  Tailwind   │  │   Framer Motion     │  │
│  │    (i18n)   │  │    CSS      │  │   (Animations)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy
```
components/
├── ui/           # Atomic, reusable UI primitives
│   └── Button, Card, Badge, Input
├── layout/       # App-wide layout components
│   └── Header, Footer, LanguageSwitcher
├── landing/      # Landing page specific
│   └── Hero, Statistics, Features
├── articles/     # Article feature components
│   └── ArticleCard, SearchFilters
└── chat/         # Chat feature components
    └── ChatBox, ChatMessage
```

### Component Pattern
```typescript
// Standard component structure
'use client'; // Only if needed

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComponentProps {
  variant?: 'default' | 'primary';
  // ... props
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

Component.displayName = 'Component';
```

## Routing Pattern

### i18n Routes
```
/[locale]/                    → Landing page
/[locale]/articles           → Articles listing
/[locale]/articles/[id]      → Article detail
/[locale]/about              → About page
/[locale]/contact            → Contact page
```

### Middleware
```typescript
// middleware.ts handles locale detection and redirection
export default createMiddleware({
  locales: ['uz', 'ru', 'en'],
  defaultLocale: 'uz',
  localePrefix: 'always',
});
```

## State Management

### Current Approach
- **Server State**: React Server Components
- **UI State**: useState/useRef for local state
- **Form State**: Controlled components
- **No global state library** (add Zustand if needed)

### Data Flow
```
Server Component (fetch) → Props → Client Component (display)
                                 → useState (interactivity)
```

## Styling Patterns

### Tailwind + cn() Utility
```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  'base-styles',
  variant === 'primary' && 'primary-styles',
  className
)} />
```

### Design Tokens
```typescript
// Access via Tailwind classes
text-primary-800    // Government blue
bg-accent-gold      // Gold accent
bg-gov-light        // Light background
border-gov-border   // Standard border
```

## Animation Patterns

### Page Transitions
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

### Hover Effects
```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
/>
```

### Scroll Animations
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-50px' }}
/>
```

## i18n Patterns

### Message Structure
```json
{
  "namespace": {
    "key": "Translation value",
    "nested": {
      "key": "Nested value"
    }
  }
}
```

### Usage
```typescript
// Server component
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('namespace');

// Client component
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');

// Access
t('key')           // "Translation value"
t('nested.key')    // "Nested value"
```

## API Integration Pattern (Future)

### Recommended Structure
```typescript
// lib/api/articles.ts
export async function getArticles(locale: string) {
  const response = await fetch(`/api/articles?locale=${locale}`);
  return response.json();
}

// app/[locale]/articles/page.tsx
const articles = await getArticles(locale);
```

## Error Handling

### Not Found
```typescript
// app/[locale]/not-found.tsx
export default function NotFound() {
  return <Custom404Component />;
}
```

### Error Boundary
```typescript
// app/[locale]/error.tsx (to be added)
'use client';
export default function Error({ error, reset }) {
  return <ErrorComponent error={error} onReset={reset} />;
}
```

## Performance Patterns

### Image Optimization
```typescript
import Image from 'next/image';
<Image
  src="/images/emblem.png"
  alt="Government Emblem"
  width={48}
  height={48}
  priority // For above-fold images
/>
```

### Font Loading
```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

### Code Splitting
- Automatic with Next.js App Router
- Dynamic imports for heavy components
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```




