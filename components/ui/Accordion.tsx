'use client';

import { useState, createContext, useContext, useId, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type AccordionType = 'single' | 'multiple';
type AccordionIconType = 'chevron' | 'plus-minus' | 'none';

interface AccordionContextValue {
  type: AccordionType;
  expandedItems: string[];
  toggleItem: (value: string) => void;
  iconType: AccordionIconType;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within an Accordion provider');
  return context;
}

// Main Accordion Container
interface AccordionProps {
  children: React.ReactNode;
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  iconType?: AccordionIconType;
  className?: string;
}

export function Accordion({
  children,
  type = 'single',
  defaultValue,
  value,
  onChange,
  iconType = 'chevron',
  className,
}: AccordionProps) {
  const getInitialValue = () => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  };

  const [internalValue, setInternalValue] = useState<string[]>(getInitialValue);
  
  const expandedItems = value 
    ? (Array.isArray(value) ? value : [value])
    : internalValue;

  const toggleItem = useCallback((itemValue: string) => {
    const newExpanded = type === 'single'
      ? expandedItems.includes(itemValue) ? [] : [itemValue]
      : expandedItems.includes(itemValue)
        ? expandedItems.filter(v => v !== itemValue)
        : [...expandedItems, itemValue];
    
    setInternalValue(newExpanded);
    onChange?.(type === 'single' ? newExpanded[0] || '' : newExpanded);
  }, [expandedItems, type, onChange]);

  return (
    <AccordionContext.Provider value={{ type, expandedItems, toggleItem, iconType }}>
      <div className={cn('divide-y divide-gov-border', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Accordion Item
interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface AccordionItemContextValue {
  value: string;
  isExpanded: boolean;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error('AccordionTrigger/Content must be used within an AccordionItem');
  return context;
}

export function AccordionItem({ value, children, disabled = false, className }: AccordionItemProps) {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isExpanded, disabled }}>
      <div 
        className={cn(
          'py-0',
          disabled && 'opacity-50',
          className
        )}
        data-state={isExpanded ? 'open' : 'closed'}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// Accordion Trigger
interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { toggleItem, iconType } = useAccordionContext();
  const { value, isExpanded, disabled } = useAccordionItemContext();
  const triggerId = useId();
  const contentId = useId();

  const renderIcon = () => {
    if (iconType === 'none') return null;

    if (iconType === 'plus-minus') {
      return isExpanded ? (
        <Minus className="w-5 h-5 text-primary-600" />
      ) : (
        <Plus className="w-5 h-5 text-text-muted group-hover:text-primary-600" />
      );
    }

    return (
      <ChevronDown 
        className={cn(
          'w-5 h-5 text-text-muted transition-transform duration-200',
          'group-hover:text-primary-600',
          isExpanded && 'rotate-180 text-primary-600'
        )} 
      />
    );
  };

  return (
    <button
      id={triggerId}
      type="button"
      aria-expanded={isExpanded}
      aria-controls={contentId}
      disabled={disabled}
      onClick={() => !disabled && toggleItem(value)}
      className={cn(
        'group w-full flex items-center justify-between gap-4',
        'py-4 text-left',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md',
        !disabled && 'hover:text-primary-700',
        className
      )}
    >
      <span className="font-medium text-text-primary">{children}</span>
      {renderIcon()}
    </button>
  );
}

// Accordion Content
interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { isExpanded } = useAccordionItemContext();

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 text-text-secondary', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Accordion;





