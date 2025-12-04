'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sections, chapters, getLocalizedText } from '@/lib/mock-data';

interface SectionsMegaMenuProps {
  locale: string;
}

export function SectionsMegaMenu({ locale }: SectionsMegaMenuProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle menu on click
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      // Auto-select first section when opening
      setHoveredSection(sections[0]?.id || null);
    }
  }, [isOpen]);

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredSection(null);
    }, 300);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredSection(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setHoveredSection(null);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Get chapters for hovered section
  const sectionChapters = hoveredSection 
    ? chapters.filter(c => c.sectionId === hoveredSection)
    : [];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants for the menu
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <div 
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium',
          'text-text-secondary hover:text-primary-800 hover:bg-primary-50',
          'transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          isOpen && 'text-primary-800 bg-primary-50'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Layers className={cn(
          'w-4 h-4 transition-transform duration-300',
          isOpen && 'rotate-12'
        )} />
        {t('sections.title')}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute top-full left-0 mt-2',
              'w-[800px] max-w-[90vw]',
              'bg-gov-surface rounded-xl shadow-2xl',
              'border border-gov-border',
              'overflow-hidden z-50'
            )}
          >
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-primary-800 text-white px-6 py-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-lg">
                    Mehnat kodeksi bo'limlari
                  </h3>
                  <p className="text-primary-200 text-sm">
                    {sections.length} ta bo'lim, {chapters.length} ta bob
                  </p>
                </div>
                <Link
                  href={`/${locale}/sections`}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg',
                    'bg-white/10 hover:bg-white/20 text-sm font-medium',
                    'transition-all duration-300',
                    'hover:gap-3'
                  )}
                >
                  Barchasini ko'rish
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Content Grid */}
            <div className="flex min-h-[400px] max-h-[70vh]">
              {/* Sections List */}
              <div className="w-1/2 border-r border-gov-border overflow-y-auto">
                <div className="p-4">
                  <motion.p 
                    variants={itemVariants}
                    className="text-xs text-text-muted font-medium uppercase tracking-wider mb-3 px-3"
                  >
                    Bo'limlar
                  </motion.p>
                  <ul className="space-y-1">
                    {sections.map((section, index) => (
                      <motion.li 
                        key={section.id}
                        variants={itemVariants}
                        custom={index}
                      >
                        <button
                          onMouseEnter={() => setHoveredSection(section.id)}
                          onClick={() => setHoveredSection(section.id)}
                          onDoubleClick={() => {
                            setIsOpen(false);
                            window.location.href = `/${locale}/sections/${section.id}`;
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left',
                            'transition-all duration-300 ease-out',
                            hoveredSection === section.id
                              ? 'bg-primary-100 text-primary-800 shadow-sm translate-x-1'
                              : 'hover:bg-gov-light text-text-primary hover:translate-x-0.5'
                          )}
                        >
                          <span className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                            'transition-all duration-300',
                            hoveredSection === section.id
                              ? 'bg-primary-600 text-white scale-110'
                              : 'bg-gov-light text-primary-600'
                          )}>
                            {section.number}
                          </span>
                          <span className="text-sm font-medium line-clamp-1 flex-1">
                            {getLocalizedText(section.title, locale)}
                          </span>
                          <motion.div
                            animate={{ 
                              x: hoveredSection === section.id ? 4 : 0,
                              opacity: hoveredSection === section.id ? 1 : 0.5
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className={cn(
                              'w-4 h-4 -rotate-90 transition-colors duration-300',
                              hoveredSection === section.id ? 'text-primary-600' : 'text-text-muted'
                            )} />
                          </motion.div>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Chapters Panel */}
              <div className="w-1/2 bg-gov-light/50 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {hoveredSection ? (
                    <motion.div
                      key={hoveredSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0, 0, 0.2, 1]
                      }}
                      className="p-4"
                    >
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="text-xs text-text-muted font-medium uppercase tracking-wider mb-3 px-3"
                      >
                        {sections.find(s => s.id === hoveredSection)?.number}-bo'lim boblari
                      </motion.p>
                      {sectionChapters.length > 0 ? (
                        <ul className="space-y-1">
                          {sectionChapters.map((chapter, index) => (
                            <motion.li 
                              key={chapter.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: 0.15 + (index * 0.05),
                                duration: 0.3,
                                ease: 'easeOut'
                              }}
                            >
                              <Link
                                href={`/${locale}/sections/${hoveredSection}#chapter-${chapter.id}`}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                  'text-text-secondary hover:text-primary-800',
                                  'hover:bg-white hover:shadow-sm',
                                  'transition-all duration-300 ease-out',
                                  'hover:translate-x-1'
                                )}
                              >
                                <BookOpen className="w-4 h-4 text-primary-500 transition-transform duration-300 group-hover:scale-110" />
                                <span className="text-sm">
                                  {chapter.number}-bob. {getLocalizedText(chapter.title, locale)}
                                </span>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-sm text-text-muted px-3"
                        >
                          Bu bo'limda boblar mavjud emas
                        </motion.p>
                      )}
                      
                      {/* Go to section button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gov-border"
                      >
                        <Link
                          href={`/${locale}/sections/${hoveredSection}`}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg',
                            'bg-primary-600 text-white text-sm font-medium',
                            'hover:bg-primary-700 transition-all duration-300',
                            'hover:shadow-md hover:translate-y-[-1px]'
                          )}
                        >
                          <ArrowRight className="w-4 h-4" />
                          {sections.find(s => s.id === hoveredSection)?.number}-bo'limga o'tish
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="h-full flex items-center justify-center p-8 text-center"
                    >
                      <div>
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            repeatDelay: 3
                          }}
                        >
                          <Layers className="w-12 h-12 text-text-muted mx-auto mb-3" />
                        </motion.div>
                        <p className="text-text-secondary text-sm">
                          Boblarni ko'rish uchun bo'limni tanlang
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="px-6 py-3 bg-gov-light border-t border-gov-border"
            >
              <Link
                href={`/${locale}/articles`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium',
                  'transition-all duration-300 hover:gap-3'
                )}
              >
                <ArrowRight className="w-4 h-4" />
                Barcha moddalarni ko'rish
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SectionsMegaMenu;


