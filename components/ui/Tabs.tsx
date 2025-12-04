'use client';

import { useState, createContext, useContext, useId, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type TabsVariant = 'underline' | 'pills' | 'enclosed';
type TabsOrientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: TabsVariant;
  orientation: TabsOrientation;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within a Tabs provider');
  return context;
}

// Main Tabs Container
interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  className?: string;
}

export function Tabs({
  children,
  defaultValue,
  value,
  onChange,
  variant = 'underline',
  orientation = 'horizontal',
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();
  
  const activeTab = value ?? internalValue;
  const setActiveTab = useCallback((newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, orientation, baseId }}>
      <div 
        className={cn(
          orientation === 'vertical' && 'flex gap-4',
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Tab List
interface TabListProps {
  children: React.ReactNode;
  className?: string;
  /** Aria label for the tab list */
  ariaLabel?: string;
}

export function TabList({ children, className, ariaLabel }: TabListProps) {
  const { variant, orientation } = useTabsContext();

  const baseStyles = cn(
    'flex',
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
  );

  const variantStyles = {
    underline: cn(
      orientation === 'horizontal' 
        ? 'border-b border-gov-border gap-0' 
        : 'border-r border-gov-border pr-4'
    ),
    pills: 'gap-2 p-1 bg-gov-light rounded-lg',
    enclosed: cn(
      'gap-0',
      orientation === 'horizontal' && 'border-b border-gov-border'
    ),
  };

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </div>
  );
}

// Tab Trigger
interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function TabTrigger({ value, children, disabled = false, icon, className }: TabTriggerProps) {
  const { activeTab, setActiveTab, variant, orientation, baseId } = useTabsContext();
  const isActive = activeTab === value;

  const baseStyles = cn(
    'relative flex items-center gap-2 font-medium',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    disabled && 'opacity-50 cursor-not-allowed',
    !disabled && 'cursor-pointer',
  );

  const variantStyles = {
    underline: cn(
      'px-4 py-3',
      orientation === 'horizontal' ? '-mb-px' : '-mr-px',
      isActive ? 'text-primary-700' : 'text-text-secondary hover:text-text-primary',
    ),
    pills: cn(
      'px-4 py-2 rounded-md',
      isActive 
        ? 'bg-white text-primary-700 shadow-sm' 
        : 'text-text-secondary hover:text-text-primary hover:bg-white/50',
    ),
    enclosed: cn(
      'px-4 py-3 border',
      orientation === 'horizontal' ? '-mb-px' : '-mr-px',
      isActive 
        ? 'bg-gov-surface border-gov-border border-b-white text-primary-700 rounded-t-lg' 
        : 'border-transparent text-text-secondary hover:text-text-primary',
    ),
  };

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      
      {/* Underline indicator */}
      {variant === 'underline' && isActive && (
        <motion.div
          layoutId={`${baseId}-indicator`}
          className={cn(
            'absolute bg-primary-600',
            orientation === 'horizontal' 
              ? 'left-0 right-0 bottom-0 h-0.5' 
              : 'top-0 bottom-0 right-0 w-0.5'
          )}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

// Tab Content/Panel
interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  /** Whether to keep content mounted when not active */
  forceMount?: boolean;
}

export function TabContent({ value, children, className, forceMount = false }: TabContentProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive && !forceMount) return null;

  return (
    <motion.div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={!isActive}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex-1 focus-visible:outline-none',
        !isActive && 'hidden',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default Tabs;



