# Mehnat Kodeksiga Sharh

<p align="center">
  <img src="public/images/gov-emblem.svg" alt="Uzbekistan State Emblem" width="120" />
</p>

<p align="center">
  <strong>O'zbekiston Respublikasi Mehnat Kodeksiga Sharhlar Platformasi</strong><br/>
  Commentary Platform for the Labor Code of the Republic of Uzbekistan
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#development">Development</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🎯 Overview

A modern, government-grade web application providing comprehensive commentaries, explanations, and expert opinions on the Labor Code of the Republic of Uzbekistan. Built with accessibility, performance, and multi-language support as core principles.

## ✨ Features

- **📚 Complete Labor Code Coverage** - All 6 sections, 24 chapters, and 200+ articles
- **💬 Professional Commentaries** - Author and expert commentaries on articles
- **🌐 Multi-language Support** - Uzbek, Russian, and English (via next-intl)
- **🔍 Advanced Search** - Full-text search with filters and suggestions
- **♿ Accessibility** - WCAG 2.1 AA compliant with accessibility controls
- **📱 Responsive Design** - Mobile-first, works on all devices (320px - 1440px)
- **🏛️ Government Branding** - Official styling and verified badges
- **⚡ Performance** - Optimized with Next.js 14 App Router
- **🔒 SEO Optimized** - Schema.org markup, sitemap, meta tags

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mehnat-kodeksiga-sharh.git
cd mehnat-kodeksiga-sharh

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start development server     |
| `npm run build`         | Build for production         |
| `npm run start`         | Start production server      |
| `npm run lint`          | Run ESLint                   |
| `npm run type-check`    | Run TypeScript type checking |
| `npm run test`          | Run unit tests               |
| `npm run test:watch`    | Run tests in watch mode      |
| `npm run test:coverage` | Run tests with coverage      |
| `npm run analyze`       | Analyze bundle size          |

## 📁 Project Structure

```
├── app/
│   ├── [locale]/              # Locale-specific pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Landing page
│   │   ├── articles/          # Articles pages
│   │   ├── sections/          # Sections pages
│   │   └── search/            # Search page
│   ├── globals.css            # Global styles
│   ├── sitemap.ts             # Dynamic sitemap
│   └── robots.ts              # Robots.txt
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── landing/               # Landing page sections
│   ├── articles/              # Article components
│   ├── search/                # Search components
│   ├── chat/                  # Chat widget
│   ├── seo/                   # SEO schemas
│   └── skeletons/             # Loading skeletons
├── lib/
│   ├── i18n.ts                # Internationalization config
│   ├── api.ts                 # API functions (mock)
│   ├── fonts.ts               # Font configuration
│   ├── utils.ts               # Utility functions
│   └── accessibility-context.tsx
├── types/
│   └── index.ts               # TypeScript types
├── data/
│   ├── mockArticles.ts        # Mock article data
│   ├── mockSections.ts        # Mock section data
│   ├── mockChapters.ts        # Mock chapter data
│   └── mockComments.ts        # Mock commentary data
├── messages/
│   ├── uz.json                # Uzbek translations
│   ├── ru.json                # Russian translations
│   └── en.json                # English translations
├── hooks/
│   └── useA11y.ts             # Accessibility hooks
├── public/
│   ├── images/
│   ├── icons/
│   └── manifest.json          # PWA manifest
└── __tests__/                 # Test files
```

## 🌍 Internationalization (i18n)

The platform supports three languages:

- 🇺🇿 O'zbek (Uzbek) - Default
- 🇷🇺 Русский (Russian)
- 🇬🇧 English

### Adding New Translations

1. Add translations to `messages/{locale}.json`
2. Use the `useTranslations` hook in components:

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

### URL Structure

- `/uz` - Uzbek version
- `/ru` - Russian version
- `/en` - English version

## 🎨 Component Usage

### Button

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" leftIcon={<Icon />}>
  Click me
</Button>;
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `gold`, `danger`
**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="default" hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>;
```

### Modal

```tsx
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui';

<Modal isOpen={isOpen} onClose={onClose} size="md">
  <ModalHeader>
    <ModalTitle>Modal Title</ModalTitle>
  </ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={onClose}>Close</Button>
  </ModalFooter>
</Modal>;
```

### Toast

```tsx
import { useToast } from '@/components/ui';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.success('Success!', 'Operation completed');
    toast.error('Error!', 'Something went wrong');
  };
}
```

## ♿ Accessibility

The platform is built with accessibility as a core principle:

- **WCAG 2.1 AA Compliant**
- Skip to main content link
- Keyboard navigation support
- Focus indicators
- ARIA labels and roles
- Screen reader announcements
- Reduced motion support
- High contrast mode
- Adjustable font sizes
- Dyslexia-friendly font option

### Accessibility Panel

Users can customize their experience through the accessibility panel in the header.

## 📊 Performance

Target performance metrics (Lighthouse):

- **Performance:** >90
- **Accessibility:** >95
- **Best Practices:** >90
- **SEO:** >95

Optimizations include:

- Next.js Image optimization
- Font subsetting with next/font
- Code splitting and lazy loading
- Efficient caching headers
- Bundle size optimization

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

Tests are written using Vitest and React Testing Library.

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy --prod
```

### Docker

```bash
docker build -t mehnat-kodeksi .
docker run -p 3000:3000 mehnat-kodeksi
```

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_BASE_URL=https://mehnat-kodeksi.uz
GOOGLE_SITE_VERIFICATION=your-google-verification
YANDEX_SITE_VERIFICATION=your-yandex-verification
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📧 Contact

For questions or support, contact:

- Email: info@mehnat.uz
- Telegram: @mehaboruz

---

<p align="center">
  Built with ❤️ for the people of Uzbekistan
</p>

#   m e h n a t _ k o d e k s i 
 
 

#   m e h n a t * p r o j e c t * w e b s i t e 
 
 
