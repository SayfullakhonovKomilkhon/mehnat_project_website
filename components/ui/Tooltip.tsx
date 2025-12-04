'use client';

import { useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipTrigger = 'hover' | 'click' | 'focus';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: TooltipPosition;
  trigger?: TooltipTrigger | TooltipTrigger[];
  delay?: number;
  offset?: number;
  /** Show arrow pointer */
  arrow?: boolean;
  /** Max width of tooltip */
  maxWidth?: number;
  className?: string;
  /** Controlled visibility */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  offset = 8,
  arrow = true,
  maxWidth = 250,
  className,
  open: controlledOpen,
  onOpenChange,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  const triggers = Array.isArray(trigger) ? trigger : [trigger];

  // Calculate position
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top + scrollY - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + scrollY + offset;
        break;
      case 'left':
        x = triggerRect.left + scrollX - tooltipRect.width - offset;
        y = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = triggerRect.right + scrollX + offset;
        y = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep tooltip within viewport
    const padding = 10;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding + scrollY));

    setCoords({ x, y });
  };

  // Update position on open
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure tooltip is rendered
      requestAnimationFrame(updatePosition);
    }
  }, [isOpen, position]);

  // Handle hover
  const handleMouseEnter = () => {
    if (!triggers.includes('hover')) return;
    timeoutRef.current = setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    if (!triggers.includes('hover')) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  // Handle click
  const handleClick = () => {
    if (!triggers.includes('click')) return;
    setIsOpen(!isOpen);
  };

  // Handle focus
  const handleFocus = () => {
    if (!triggers.includes('focus')) return;
    setIsOpen(true);
  };

  const handleBlur = () => {
    if (!triggers.includes('focus')) return;
    setIsOpen(false);
  };

  // Clean up timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Clone child with ref and event handlers
  const childElement = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleClick,
        onFocus: handleFocus,
        onBlur: handleBlur,
        'aria-describedby': isOpen ? 'tooltip' : undefined,
      })
    : children;

  // Arrow position styles
  const arrowStyles: Record<TooltipPosition, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800 border-x-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-800 border-x-transparent border-t-transparent',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-gray-800 border-y-transparent border-r-transparent',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-gray-800 border-y-transparent border-l-transparent',
  };

  // Animation direction
  const animationVariants = {
    top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } },
  };

  if (typeof window === 'undefined') return <>{children}</>;

  return (
    <>
      {childElement}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={tooltipRef}
              id="tooltip"
              role="tooltip"
              initial={animationVariants[position].initial}
              animate={animationVariants[position].animate}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                left: coords.x,
                top: coords.y,
                maxWidth,
                zIndex: 9999,
              }}
              className={cn(
                'px-3 py-2 rounded-lg',
                'bg-gray-800 text-white text-sm',
                'shadow-lg',
                className
              )}
            >
              {content}
              {arrow && (
                <span
                  className={cn(
                    'absolute w-0 h-0',
                    'border-4',
                    arrowStyles[position]
                  )}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default Tooltip;




