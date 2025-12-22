# Design System: Government Official Portal

## Color Palette

### Primary Colors
```css
--color-primary-blue: #1E3A8A;      /* Deep official blue - headers, primary buttons */
--color-secondary-blue: #3B82F6;    /* Bright cyan-blue - links, accents */
--color-accent-gold: #F59E0B;       /* Government gold/amber - highlights, badges */
```

### Neutral Colors
```css
--color-background: #F8FAFC;        /* Light gray-white - page background */
--color-surface: #FFFFFF;           /* White - cards, panels */
--color-border: #E2E8F0;            /* Light border - dividers, outlines */
```

### Text Colors
```css
--color-text-primary: #0F172A;      /* Near black - headings, body text */
--color-text-secondary: #64748B;    /* Muted gray - captions, hints */
```

### Semantic Colors
```css
--color-success: #10B981;           /* Green - confirmations, success states */
--color-error: #EF4444;             /* Red - errors, warnings */
--color-warning: #F59E0B;           /* Amber - warnings (shares with gold) */
--color-info: #3B82F6;              /* Blue - informational (shares with secondary) */
```

## Typography

### Font Families
```css
/* Headings - Strong, official presence */
--font-heading: 'Plus Jakarta Sans', 'Manrope', system-ui, sans-serif;

/* Body - Readable, professional */
--font-body: 'Inter', 'Source Sans 3', system-ui, sans-serif;
```

### Font Weights
- Headings: 600 (Semi-bold) to 700 (Bold)
- Body: 400 (Regular) to 500 (Medium)

### Type Scale (1.25 ratio, base 16px)
```css
--text-xs: 0.64rem;     /* 10.24px */
--text-sm: 0.8rem;      /* 12.8px */
--text-base: 1rem;      /* 16px - Base */
--text-lg: 1.25rem;     /* 20px */
--text-xl: 1.563rem;    /* 25px */
--text-2xl: 1.953rem;   /* 31.25px */
--text-3xl: 2.441rem;   /* 39px */
--text-4xl: 3.052rem;   /* 48.8px */
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

## Spacing Scale
```css
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
```

## Border Radius
```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards, modals */
```

## Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
```

## Government UI Elements

### State Emblem
- Position: Header, centered or left-aligned
- Size: 40-48px height in header
- Color: Gold (#F59E0B) on dark backgrounds, or full color on light

### Verification Badges
- Style: Pill-shaped with icon
- Colors: Primary blue background, white text
- Icon: Checkmark or shield symbol
- Text: "Verified by Government" / "Давлат томонидан тасдиқланган"

### Official Seals
- Circular design
- Gold (#F59E0B) primary
- Primary Blue (#1E3A8A) accents

## Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary-blue);
  color: white;
  font-weight: 500;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-primary-blue);
  border: 1px solid var(--color-primary-blue);
}

/* Gold Accent Button */
.btn-accent {
  background: var(--color-accent-gold);
  color: white;
}
```

### Cards
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
}
```

### Form Inputs
```css
.input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.input:focus {
  border-color: var(--color-secondary-blue);
  outline: 2px solid rgb(59 130 246 / 0.2);
}
```

## Responsive Breakpoints
```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

## Cyrillic Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Plus+Jakarta+Sans:wght@600;700&display=swap&subset=cyrillic,latin" rel="stylesheet">
```

## Accessibility Requirements
- Minimum contrast ratio: 4.5:1 for body text
- Focus states visible on all interactive elements
- Touch targets minimum 44x44px
- Semantic HTML structure
- ARIA labels where needed





