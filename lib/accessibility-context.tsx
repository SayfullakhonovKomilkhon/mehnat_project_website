'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

// Types
export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  contrast: 'normal' | 'dark';
  textSpacing: 'normal' | 'increased';
  dyslexicFont: boolean;
  reducedMotion: boolean;
  highlightLinks: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

// Default settings
const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  textSpacing: 'normal',
  dyslexicFont: false,
  reducedMotion: false,
  highlightLinks: false,
};

// Font size values
const fontSizeMap = {
  small: { base: 14, label: 'Kichik' },
  normal: { base: 16, label: 'Oddiy' },
  large: { base: 18, label: 'Katta' },
  xlarge: { base: 20, label: 'Juda katta' },
};

const fontSizeOrder: AccessibilitySettings['fontSize'][] = ['small', 'normal', 'large', 'xlarge'];

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'mehnat-accessibility-settings';

// Provider component
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
      setIsInitialized(true);
    };

    loadSettings();
  }, []);

  // Apply settings to document
  useEffect(() => {
    if (!isInitialized) return;

    const html = document.documentElement;
    const body = document.body;

    // Remove all accessibility classes first
    html.classList.remove(
      'font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge',
      'contrast-normal', 'contrast-dark',
      'text-spacing-normal', 'text-spacing-increased',
      'dyslexic-font',
      'reduced-motion',
      'highlight-links'
    );

    // Apply font size
    html.classList.add(`font-size-${settings.fontSize}`);
    html.style.setProperty('--base-font-size', `${fontSizeMap[settings.fontSize].base}px`);

    // Apply contrast mode
    html.classList.add(`contrast-${settings.contrast}`);

    // Apply text spacing
    html.classList.add(`text-spacing-${settings.textSpacing}`);

    // Apply dyslexic font
    if (settings.dyslexicFont) {
      html.classList.add('dyslexic-font');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      html.classList.add('reduced-motion');
    }

    // Apply highlight links
    if (settings.highlightLinks) {
      html.classList.add('highlight-links');
    }

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // Also set a cookie for SSR
      document.cookie = `${STORAGE_KEY}=${JSON.stringify(settings)};path=/;max-age=31536000`;
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }

    // Announce change to screen readers
    const announcement = document.getElementById('a11y-announcement');
    if (announcement) {
      announcement.textContent = 'Sozlamalar o\'zgartirildi';
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  }, [settings, isInitialized]);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Reset all settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Increase font size
  const increaseFontSize = useCallback(() => {
    setSettings(prev => {
      const currentIndex = fontSizeOrder.indexOf(prev.fontSize);
      if (currentIndex < fontSizeOrder.length - 1) {
        return { ...prev, fontSize: fontSizeOrder[currentIndex + 1] };
      }
      return prev;
    });
  }, []);

  // Decrease font size
  const decreaseFontSize = useCallback(() => {
    setSettings(prev => {
      const currentIndex = fontSizeOrder.indexOf(prev.fontSize);
      if (currentIndex > 0) {
        return { ...prev, fontSize: fontSizeOrder[currentIndex - 1] };
      }
      return prev;
    });
  }, []);

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      increaseFontSize,
      decreaseFontSize,
    }}>
      {/* Screen reader announcement region */}
      <div
        id="a11y-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      {children}
    </AccessibilityContext.Provider>
  );
}

// Hook to use accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Export font size map for use in components
export { fontSizeMap };





