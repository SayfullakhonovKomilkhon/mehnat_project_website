'use client';

import { useEffect } from 'react';

/**
 * Hook to report accessibility violations in development
 * Uses axe-core for automated accessibility testing
 */
export function useReportAccessibility() {
  useEffect(() => {
    // Only run in development and on client side
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return;
    }

    const runAxe = async () => {
      try {
        const axe = await import('@axe-core/react');
        const React = await import('react');
        const ReactDOM = await import('react-dom');
        
        axe.default(React.default, ReactDOM.default, 1000, {
          rules: [
            // Ensure proper heading hierarchy
            { id: 'heading-order', enabled: true },
            // Ensure color contrast
            { id: 'color-contrast', enabled: true },
            // Ensure images have alt text
            { id: 'image-alt', enabled: true },
            // Ensure links have discernible text
            { id: 'link-name', enabled: true },
            // Ensure form inputs have labels
            { id: 'label', enabled: true },
            // Ensure buttons have accessible names
            { id: 'button-name', enabled: true },
            // Ensure landmarks are properly used
            { id: 'landmark-one-main', enabled: true },
            { id: 'region', enabled: true },
          ],
        });
      } catch (error) {
        // axe-core is optional dev dependency
        console.log('Accessibility testing not available');
      }
    };

    runAxe();
  }, []);
}

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return;

    const id = `announce-${priority}`;
    let element = document.getElementById(id);

    if (!element) {
      element = document.createElement('div');
      element.id = id;
      element.setAttribute('role', 'status');
      element.setAttribute('aria-live', priority);
      element.setAttribute('aria-atomic', 'true');
      element.className = 'sr-only';
      document.body.appendChild(element);
    }

    // Clear and set message
    element.textContent = '';
    setTimeout(() => {
      element!.textContent = message;
    }, 100);
  };

  return { announce };
}

/**
 * Hook to trap focus within a container
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element when trap activates
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, isActive]);
}

/**
 * Hook to handle escape key press
 */
export function useEscapeKey(callback: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callback, isActive]);
}

/**
 * Hook to manage skip links
 */
export function useSkipLink(targetId: string) {
  const skipToTarget = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { skipToTarget };
}

/**
 * Hook for prefers-reduced-motion
 */
export function usePrefersReducedMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // You could use this to disable animations globally
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
}

export default useReportAccessibility;




