# Technical Context: Mehnat Kodeksiga Sharh

## Technology Stack

### Core Framework
- **Next.js 14.2.15** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **Framer Motion 11.11.9** - Animation library
- **Lucide React 0.454.0** - Icon library
- **clsx + tailwind-merge** - Class utilities

### Internationalization
- **next-intl 3.22.0** - Full i18n support
- **Supported locales**: uz (Uzbek), ru (Russian), en (English)
- **Default locale**: uz

## Project Structure

```
mehnat_new/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Root layout with i18n
│   │   ├── page.tsx            # Landing page
│   │   ├── not-found.tsx       # 404 page
│   │   └── articles/
│   │       ├── page.tsx        # Articles listing
│   │       └── [id]/
│   │           ├── page.tsx    # Article detail server component
│   │           └── ArticleDetail.tsx  # Client component
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── GovEmblem.tsx
│   │   └── index.ts
│   ├── landing/                # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Statistics.tsx
│   │   ├── Features.tsx
│   │   └── index.ts
│   ├── articles/               # Article components
│   │   ├── ArticleCard.tsx
│   │   ├── SearchFilters.tsx
│   │   └── index.ts
│   └── chat/                   # AI Chat components
│       ├── ChatBox.tsx
│       ├── ChatMessage.tsx
│       └── index.ts
├── lib/
│   ├── i18n.ts                 # i18n configuration
│   └── utils.ts                # Utility functions
├── messages/
│   ├── uz.json                 # Uzbek translations
│   ├── ru.json                 # Russian translations
│   └── en.json                 # English translations
├── public/
│   └── images/                 # Static images
├── memory-bank/                # Project documentation
├── middleware.ts               # i18n middleware
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Design System (Tailwind)

### Color Tokens
```typescript
primary: {
  50-900: Blue scale (#EFF6FF to #1E3A5F)
  800: '#1E3A8A' (main government blue)
}
accent: {
  gold: '#F59E0B'
  amber: '#D97706'
}
gov: {
  blue: '#1E3A8A'
  light: '#F8FAFC'
  border: '#E2E8F0'
  surface: '#FFFFFF'
}
```

### Typography
- **Headings**: Plus Jakarta Sans (600-700 weight)
- **Body**: Inter (400-500 weight)
- **Cyrillic support**: Mandatory via Google Fonts

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Environment Variables
None required for base setup. Add as needed for:
- API endpoints
- AI service keys
- Analytics

## Key Patterns

### Server vs Client Components
- Page layouts and metadata: Server components
- Interactive UI (forms, modals, animations): Client components
- Use `'use client'` directive only when needed

### i18n Pattern
- Routes: `/{locale}/...`
- Messages: `messages/{locale}.json`
- Hook: `useTranslations(namespace)`

### Animation Pattern
- Framer Motion for page transitions and micro-interactions
- Staggered reveals for lists
- Hover/tap states for buttons



