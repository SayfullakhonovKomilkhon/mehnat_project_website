# Contributing to Mehnat Kodeksiga Sharh

Thank you for your interest in contributing to the Mehnat Kodeksiga Sharh platform! This document provides guidelines and best practices for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Component Guidelines](#component-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Internationalization](#internationalization)
- [Accessibility](#accessibility)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative
- Accept constructive criticism gracefully
- Focus on what is best for the community

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/mehnat-kodeksiga-sharh.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Before committing:**
   ```bash
   npm run lint          # Check for linting errors
   npm run type-check    # Check TypeScript types
   npm run test          # Run unit tests
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Define explicit types for function parameters and return values
- Use interfaces for objects, types for unions
- Avoid `any` type - use `unknown` if type is truly unknown

```typescript
// Good
interface ArticleProps {
  article: Article;
  locale: string;
}

function ArticleCard({ article, locale }: ArticleProps): JSX.Element {
  // ...
}

// Bad
function ArticleCard(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Use named exports for components
- Keep components small and focused
- Extract complex logic into custom hooks

```typescript
// Good
export function ArticleCard({ article, locale }: ArticleCardProps) {
  const t = useTranslations('articles');
  
  return (
    <article className="...">
      {/* ... */}
    </article>
  );
}

// Bad
export default function(props) {
  // ...
}
```

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use CSS variables for theming
- Group related classes logically

```tsx
// Good
<div className={cn(
  // Base styles
  'flex items-center gap-4 p-4',
  // Responsive
  'md:gap-6 md:p-6',
  // Variants
  variant === 'primary' && 'bg-primary-800 text-white',
  // States
  'hover:bg-primary-700 transition-colors',
  // Custom
  className
)}>

// Bad
<div className="flex items-center gap-4 p-4 md:gap-6 md:p-6 bg-primary-800 text-white hover:bg-primary-700 transition-colors">
```

### File Naming

- Components: PascalCase (`ArticleCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE for values, camelCase for files
- Test files: `ComponentName.test.tsx`

## 🧩 Component Guidelines

### Structure

```
components/
├── ui/               # Base, reusable UI components
│   ├── Button.tsx
│   └── index.ts      # Export all components
├── layout/           # Layout-specific components
├── features/         # Feature-specific components
└── [feature]/        # Feature folders with index.ts
```

### Creating New Components

1. **Create the component file:**
   ```tsx
   // components/ui/NewComponent.tsx
   'use client';
   
   import { cn } from '@/lib/utils';
   
   interface NewComponentProps {
     children: React.ReactNode;
     variant?: 'default' | 'primary';
     className?: string;
   }
   
   export function NewComponent({
     children,
     variant = 'default',
     className,
   }: NewComponentProps) {
     return (
       <div className={cn(
         'base-styles',
         variant === 'primary' && 'primary-styles',
         className
       )}>
         {children}
       </div>
     );
   }
   ```

2. **Export from index:**
   ```ts
   // components/ui/index.ts
   export { NewComponent } from './NewComponent';
   ```

3. **Add tests:**
   ```tsx
   // __tests__/components/NewComponent.test.tsx
   describe('NewComponent', () => {
     it('renders correctly', () => {
       // ...
     });
   });
   ```

### Component Checklist

- [ ] TypeScript types defined
- [ ] Props documented with JSDoc if complex
- [ ] Responsive design (mobile-first)
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Translations used (no hardcoded text)
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Tests written

## 🧪 Testing Guidelines

### Writing Tests

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '@/components/ui';

describe('ComponentName', () => {
  it('renders children correctly', () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick}>Click</ComponentName>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<ComponentName variant="primary">Primary</ComponentName>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary-800');
  });
});
```

### Test Coverage

Aim for at least 80% coverage on:
- UI components
- Utility functions
- Custom hooks

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(search): add autocomplete suggestions
fix(header): mobile menu not closing on navigation
docs(readme): update installation instructions
style(button): improve hover state transitions
refactor(api): simplify article fetching logic
perf(images): add lazy loading for article images
test(input): add validation tests
chore(deps): update next.js to 14.2.15
```

## 🔀 Pull Request Process

1. **Before creating PR:**
   - Ensure all tests pass
   - Run linting and type checking
   - Update documentation if needed
   - Rebase on latest main

2. **PR Title:** Follow commit message format
   ```
   feat(articles): add print functionality
   ```

3. **PR Description:**
   - Describe what changes were made
   - Link related issues
   - Add screenshots for UI changes
   - List any breaking changes

4. **Review Process:**
   - At least 1 approval required
   - All CI checks must pass
   - No unresolved conversations

## 🌍 Internationalization

### Adding Translations

1. Add keys to all language files:
   ```json
   // messages/uz.json
   {
     "namespace": {
       "key": "O'zbek matni"
     }
   }
   
   // messages/ru.json
   {
     "namespace": {
       "key": "Русский текст"
     }
   }
   
   // messages/en.json
   {
     "namespace": {
       "key": "English text"
     }
   }
   ```

2. Use in components:
   ```tsx
   const t = useTranslations('namespace');
   return <p>{t('key')}</p>;
   ```

### Guidelines

- Never hardcode visible text
- Use meaningful key names
- Group related keys in namespaces
- Include placeholders for dynamic content: `{count} ta natija`

## ♿ Accessibility

### Requirements

All components must meet WCAG 2.1 AA standards:

- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Focus Indicators:** Visible focus states
- **Color Contrast:** Minimum 4.5:1 for text
- **ARIA Labels:** Proper labels for screen readers
- **Semantic HTML:** Use appropriate HTML elements

### Checklist

- [ ] Can navigate with Tab/Shift+Tab
- [ ] Focus is visible
- [ ] Screen reader announces correctly
- [ ] Works with reduced motion
- [ ] Color is not only indicator
- [ ] Interactive elements are large enough (44x44px touch target)

### Testing

```bash
# Run axe accessibility tests
npm run test:a11y
```

---

## Questions?

If you have questions, feel free to:
- Open an issue
- Contact the maintainers
- Join our Telegram community

Thank you for contributing! 🙏





