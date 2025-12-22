'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
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

// Create seamless transition overlay for language switch
function createTransitionOverlay() {
  if (typeof document === 'undefined') return;
  
  // Check if overlay already exists
  let overlay = document.getElementById('language-transition-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'language-transition-overlay';
    // Use the same background as the page for seamless transition
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 200ms ease-out;
    `;
    document.body.appendChild(overlay);
  }
  
  // Trigger instant fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay!.style.opacity = '1';
      overlay!.style.pointerEvents = 'auto';
    });
  });
  
  return overlay;
}

// Remove transition overlay with fade
function removeTransitionOverlay() {
  if (typeof document === 'undefined') return;
  
  const overlay = document.getElementById('language-transition-overlay');
  if (overlay) {
    // Small delay to ensure content is rendered
    setTimeout(() => {
      overlay.style.transition = 'opacity 300ms ease-in';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }, 50);
  }
}

export function LanguageSwitcher({ locale, variant = 'default' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locale as Locale;

  // Remove overlay on mount (in case it was left over from navigation)
  useEffect(() => {
    removeTransitionOverlay();
    setIsTransitioning(false);
  }, []);

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

  const switchLocale = useCallback((newLocale: Locale) => {
    if (newLocale === currentLocale || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
    
    // Create seamless transition overlay
    createTransitionOverlay();
    
    // Wait for overlay to fully appear, then navigate
    setTimeout(() => {
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      // Use window.location for full page reload to ensure all translations are updated
      window.location.href = newPath;
      setIsOpen(false);
    }, 200);
  }, [currentLocale, isTransitioning, pathname, locale]);

  // Buttons variant - horizontal UZ RU EN buttons (like screenshot)
  if (variant === 'buttons') {
    return (
      <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => switchLocale('uz')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
            currentLocale === 'uz'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          UZ
        </button>
        <button
          onClick={() => switchLocale('ru')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
            currentLocale === 'ru'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          RU
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
            currentLocale === 'en'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          EN
        </button>
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

  // Minimal variant - same as buttons but for header (white background)
  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => switchLocale('uz')}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
            currentLocale === 'uz'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          UZ
        </button>
        <button
          onClick={() => switchLocale('ru')}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
            currentLocale === 'ru'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          RU
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
            currentLocale === 'en'
              ? 'bg-primary-700 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          EN
        </button>
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
