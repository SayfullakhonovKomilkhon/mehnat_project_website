'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales, localeNames, type Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  locale: string;
  variant?: 'default' | 'minimal' | 'full' | 'buttons';
}

const localeFlags: Record<Locale, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
};

const localeShort: Record<Locale, string> = {
  uz: 'UZ',
  ru: 'RU',
  en: 'EN',
};

export function LanguageSwitcher({ locale, variant = 'default' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locale as Locale;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
    
    // Replace the current locale in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  // Buttons variant - horizontal UZ | RU | EN buttons
  if (variant === 'buttons') {
    return (
      <div className="flex items-center border border-gov-border rounded-lg overflow-hidden">
        {locales.map((loc, index) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={cn(
              'px-3 py-1.5 text-sm font-semibold transition-colors',
              loc === currentLocale
                ? 'bg-primary-800 text-white'
                : 'bg-gov-surface text-text-secondary hover:bg-primary-50 hover:text-primary-800',
              index !== locales.length - 1 && 'border-r border-gov-border'
            )}
          >
            {localeShort[loc]}
          </button>
        ))}
      </div>
    );
  }

  // Full variant - horizontal buttons with flags for mobile
  if (variant === 'full') {
    return (
      <div className="flex gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              loc === currentLocale
                ? 'bg-primary-800 text-white'
                : 'bg-primary-50 text-primary-800 hover:bg-primary-100'
            )}
          >
            <span>{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </button>
        ))}
      </div>
    );
  }

  // Minimal variant - just text for top bar (UZ | RU | EN)
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-0 text-sm">
        {locales.map((loc, index) => (
          <span key={loc} className="flex items-center">
            <button
              onClick={() => switchLocale(loc)}
              className={cn(
                'px-2 py-1 font-medium transition-all',
                loc === currentLocale 
                  ? 'text-white' 
                  : 'text-primary-200 hover:text-white'
              )}
            >
              {localeShort[loc]}
            </button>
            {index < locales.length - 1 && (
              <span className="text-primary-400">|</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  // Default variant - dropdown
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'text-sm font-medium text-text-secondary',
          'hover:bg-primary-50 hover:text-primary-800',
          'transition-colors duration-200 border border-gov-border',
          isOpen && 'bg-primary-50 text-primary-800 border-primary-300'
        )}
      >
        <span className="text-base">{localeFlags[currentLocale]}</span>
        <span className="hidden sm:inline">{localeShort[currentLocale]}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 mt-2 w-44 py-1',
              'bg-gov-surface rounded-xl shadow-lg',
              'border border-gov-border',
              'z-50 overflow-hidden'
            )}
          >
            <div className="px-3 py-2 border-b border-gov-border">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Select Language
              </p>
            </div>
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5',
                  'text-sm text-left transition-colors',
                  loc === currentLocale
                    ? 'bg-primary-50 text-primary-800 font-medium'
                    : 'text-text-secondary hover:bg-gov-light hover:text-text-primary'
                )}
              >
                <span className="text-lg">{localeFlags[loc]}</span>
                <div className="flex-1">
                  <span className="block">{localeNames[loc]}</span>
                  <span className="text-xs text-text-muted">{localeShort[loc]}</span>
                </div>
                {loc === currentLocale && (
                  <Check className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;
