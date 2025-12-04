'use client';

import { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  required?: boolean;
  className?: string;
  /** Custom render function for options */
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  hint,
  disabled = false,
  multiple = false,
  searchable = false,
  clearable = false,
  required = false,
  className,
  renderOption,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle value as array for consistency
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  
  // Filter options based on search
  const filteredOptions = searchQuery
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get display value
  const getDisplayValue = () => {
    if (selectedValues.length === 0) return null;
    if (multiple) {
      return selectedValues.length === 1
        ? options.find(o => o.value === selectedValues[0])?.label
        : `${selectedValues.length} selected`;
    }
    return options.find(o => o.value === selectedValues[0])?.label;
  };

  // Handle option select
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
    setSearchQuery('');
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        break;
    }
  };

  const displayValue = getDisplayValue();

  return (
    <div ref={ref} className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      
      <div ref={containerRef} className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full h-11 px-4 rounded-lg border text-left',
            'bg-gov-surface border-gov-border',
            'flex items-center justify-between gap-2',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isOpen && 'border-primary-500 ring-2 ring-primary-500/20',
            error && 'border-error focus:border-error focus:ring-error/20'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(
            'truncate',
            !displayValue && 'text-text-muted'
          )}>
            {displayValue || placeholder}
          </span>
          
          <div className="flex items-center gap-1">
            {clearable && selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gov-border rounded transition-colors"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            )}
            <ChevronDown className={cn(
              'w-5 h-5 text-text-muted transition-transform',
              isOpen && 'rotate-180'
            )} />
          </div>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute z-50 w-full mt-1',
                'bg-gov-surface rounded-lg border border-gov-border shadow-lg',
                'overflow-hidden'
              )}
            >
              {/* Search */}
              {searchable && (
                <div className="p-2 border-b border-gov-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className={cn(
                        'w-full h-9 pl-9 pr-3 rounded-md',
                        'bg-gov-light border border-gov-border',
                        'text-sm text-text-primary placeholder:text-text-muted',
                        'focus:outline-none focus:border-primary-500'
                      )}
                    />
                  </div>
                </div>
              )}
              
              {/* Options */}
              <ul
                role="listbox"
                aria-multiselectable={multiple}
                className="max-h-60 overflow-y-auto py-1"
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    
                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled}
                      >
                        <button
                          type="button"
                          onClick={() => !option.disabled && handleSelect(option.value)}
                          disabled={option.disabled}
                          className={cn(
                            'w-full px-4 py-2 text-left',
                            'flex items-center gap-3',
                            'transition-colors duration-100',
                            'hover:bg-primary-50',
                            isSelected && 'bg-primary-50 text-primary-700',
                            option.disabled && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {renderOption ? (
                            renderOption(option, isSelected)
                          ) : (
                            <>
                              {multiple && (
                                <div className={cn(
                                  'w-4 h-4 rounded border flex items-center justify-center',
                                  isSelected 
                                    ? 'bg-primary-600 border-primary-600' 
                                    : 'border-gov-border'
                                )}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              )}
                              {option.icon && (
                                <span className="text-text-muted">{option.icon}</span>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{option.label}</p>
                                {option.description && (
                                  <p className="text-xs text-text-muted truncate">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                              {!multiple && isSelected && (
                                <Check className="w-4 h-4 text-primary-600" />
                              )}
                            </>
                          )}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-8 text-center text-text-muted text-sm">
                    No options found
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error/Hint */}
      {error && (
        <p className="mt-1.5 text-sm text-error" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-text-secondary">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;




