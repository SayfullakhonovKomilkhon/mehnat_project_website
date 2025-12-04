import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

// Body font - Inter with Cyrillic subset
export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

// Heading font - Plus Jakarta Sans
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
});

// Combined font class names
export const fontVariables = `${inter.variable} ${plusJakartaSans.variable}`;



