'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  X, 
  Type, 
  Sun, 
  Moon, 
  Contrast,
  Space,
  MousePointer2,
  Link2,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility, fontSizeMap, type AccessibilitySettings } from '@/lib/accessibility-context';
import { Button } from './Button';

interface AccessibilityPanelProps {
  className?: string;
}

export function AccessibilityPanel({ className }: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const { 
    settings, 
    updateSetting, 
    resetSettings,
    increaseFontSize,
    decreaseFontSize
  } = useAccessibility();

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Check if any settings are non-default
  const hasCustomSettings = 
    settings.fontSize !== 'normal' ||
    settings.contrast !== 'normal' ||
    settings.textSpacing !== 'increased' ||
    settings.dyslexicFont ||
    settings.reducedMotion ||
    settings.highlightLinks;

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 p-1.5 rounded-lg',
          'hover:bg-primary-700 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold',
          isOpen && 'bg-primary-700'
        )}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Maxsus imkoniyatlar sozlamalari"
      >
        <Accessibility className="w-4 h-4" />
        {hasCustomSettings && (
          <span className="w-2 h-2 rounded-full bg-accent-gold" />
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full right-0 mt-2',
              'w-80 sm:w-96',
              'bg-gov-surface rounded-xl shadow-2xl',
              'border border-gov-border',
              'z-50 overflow-hidden'
            )}
            role="dialog"
            aria-label="Maxsus imkoniyatlar"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary-800 text-white">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                <h2 className="font-heading font-semibold">
                  Maxsus imkoniyatlar
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
              
              {/* Font Size */}
              <SettingSection
                icon={Type}
                title="Shrift o'lchami"
                description="Matn o'lchamini sozlang"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize === 'small'}
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      'bg-gov-light border border-gov-border',
                      'hover:bg-primary-50 hover:border-primary-300',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-colors'
                    )}
                    aria-label="Shriftni kichiklashtirish"
                  >
                    <span className="text-sm font-bold">A-</span>
                  </button>
                  
                  <div className="flex-1 mx-3">
                    <div className="text-center">
                      <span className="text-sm font-medium text-text-primary">
                        {fontSizeMap[settings.fontSize].label}
                      </span>
                      <span className="text-xs text-text-muted ml-1">
                        ({fontSizeMap[settings.fontSize].base}px)
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2 justify-center">
                      {(['small', 'normal', 'large', 'xlarge'] as const).map((size) => (
                        <span
                          key={size}
                          className={cn(
                            'w-2 h-2 rounded-full transition-colors',
                            settings.fontSize === size 
                              ? 'bg-primary-600' 
                              : 'bg-gov-border'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={increaseFontSize}
                    disabled={settings.fontSize === 'xlarge'}
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      'bg-gov-light border border-gov-border',
                      'hover:bg-primary-50 hover:border-primary-300',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-colors'
                    )}
                    aria-label="Shriftni kattalashtirish"
                  >
                    <span className="text-lg font-bold">A+</span>
                  </button>
                </div>
              </SettingSection>

              {/* Contrast Mode */}
              <SettingSection
                icon={Contrast}
                title="Kontrast rejimi"
                description="Ranglar kontrastini o'zgartiring"
              >
                <div className="grid grid-cols-3 gap-2">
                  <ContrastButton
                    label="Oddiy"
                    value="normal"
                    current={settings.contrast}
                    onClick={() => updateSetting('contrast', 'normal')}
                    preview={
                      <div className="w-full h-6 rounded bg-white border border-gray-200 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary-600" />
                      </div>
                    }
                  />
                  <ContrastButton
                    label="Yuqori"
                    value="high"
                    current={settings.contrast}
                    onClick={() => updateSetting('contrast', 'high')}
                    preview={
                      <div className="w-full h-6 rounded bg-black flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      </div>
                    }
                  />
                  <ContrastButton
                    label="Qorong'u"
                    value="dark"
                    current={settings.contrast}
                    onClick={() => updateSetting('contrast', 'dark')}
                    preview={
                      <div className="w-full h-6 rounded bg-gray-900 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                      </div>
                    }
                  />
                </div>
              </SettingSection>

              {/* Text Spacing */}
              <SettingSection
                icon={Space}
                title="Matn oralig'i"
                description="Qatorlar va harflar orasidagi masofani oshiring"
              >
                <ToggleButtons
                  options={[
                    { value: 'normal', label: 'Oddiy' },
                    { value: 'increased', label: 'Kengaytirilgan' },
                  ]}
                  current={settings.textSpacing}
                  onChange={(value) => updateSetting('textSpacing', value as 'normal' | 'increased')}
                />
              </SettingSection>

              {/* Dyslexia-Friendly Font */}
              <SettingSection
                icon={Eye}
                title="Disleksiya uchun shrift"
                description="O'qishni osonlashtiruvchi maxsus shrift"
              >
                <ToggleSwitch
                  checked={settings.dyslexicFont}
                  onChange={(checked) => updateSetting('dyslexicFont', checked)}
                  label="OpenDyslexic shriftini yoqish"
                />
              </SettingSection>

              {/* Reduced Motion */}
              <SettingSection
                icon={MousePointer2}
                title="Animatsiyalarni kamaytirish"
                description="Barcha animatsiyalarni o'chirish"
              >
                <ToggleSwitch
                  checked={settings.reducedMotion}
                  onChange={(checked) => updateSetting('reducedMotion', checked)}
                  label="Animatsiyalarni o'chirish"
                />
              </SettingSection>

              {/* Highlight Links */}
              <SettingSection
                icon={Link2}
                title="Havolalarni ajratish"
                description="Barcha havolalarni chiziq bilan belgilash"
              >
                <ToggleSwitch
                  checked={settings.highlightLinks}
                  onChange={(checked) => updateSetting('highlightLinks', checked)}
                  label="Havolalarni tagiga chizish"
                />
              </SettingSection>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gov-light border-t border-gov-border">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSettings}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="w-full"
              >
                Asl holatga qaytarish
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Setting Section Component
function SettingSection({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h3 className="font-medium text-text-primary text-sm">{title}</h3>
          <p className="text-xs text-text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// Contrast Button Component
function ContrastButton({
  label,
  value,
  current,
  onClick,
  preview
}: {
  label: string;
  value: string;
  current: string;
  onClick: () => void;
  preview: React.ReactNode;
}) {
  const isActive = current === value;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg border-2 transition-all',
        isActive 
          ? 'border-primary-600 bg-primary-50' 
          : 'border-gov-border hover:border-primary-300'
      )}
      aria-pressed={isActive}
    >
      {preview}
      <span className={cn(
        'text-xs mt-1.5 block',
        isActive ? 'text-primary-700 font-medium' : 'text-text-secondary'
      )}>
        {label}
      </span>
      {isActive && (
        <Check className="w-3 h-3 text-primary-600 mx-auto mt-1" />
      )}
    </button>
  );
}

// Toggle Buttons Component
function ToggleButtons({
  options,
  current,
  onChange
}: {
  options: { value: string; label: string }[];
  current: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
            current === option.value
              ? 'bg-primary-600 text-white'
              : 'bg-gov-light text-text-secondary hover:bg-primary-50 hover:text-primary-700'
          )}
          aria-pressed={current === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          checked ? 'bg-primary-600' : 'bg-gov-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </label>
  );
}

export default AccessibilityPanel;



