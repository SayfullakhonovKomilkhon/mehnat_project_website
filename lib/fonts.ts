import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

// Body font - Inter with Cyrillic subset
// Only load essential weights to reduce bundle size
export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  weight: ['400', '500', '600'], // Only essential weights
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

// Heading font - Plus Jakarta Sans
// Only load essential weights
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['600', '700'], // Only bold weights for headings
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

// Combined font class names
export const fontVariables = `${inter.variable} ${plusJakartaSans.variable}`;





