'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, FileText, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal, ModalHeader, ModalTitle, ModalBody } from './Modal';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  maxLines?: number;
  title?: string;
  className?: string;
  showExpandButton?: boolean;
  locale?: string;
}

const translations = {
  uz: {
    readMore: "Batafsil ko'rish",
    close: 'Yopish',
    fullText: "To'liq matn",
  },
  ru: {
    readMore: 'Подробнее',
    close: 'Закрыть',
    fullText: 'Полный текст',
  },
  en: {
    readMore: 'Read more',
    close: 'Close',
    fullText: 'Full text',
  },
};

export function TruncatedText({
  text,
  maxLength = 500,
  maxLines,
  title,
  className,
  showExpandButton = true,
  locale = 'uz',
}: TruncatedTextProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = translations[locale as keyof typeof translations] || translations.uz;

  if (!text) {
    return null;
  }

  const isLongText = text.length > maxLength;
  const truncatedText = isLongText ? text.slice(0, maxLength) + '...' : text;

  // Format content to highlight key terms and format properly
  const formatContent = (content: string) => {
    if (!content) {
      return <p className="italic text-gray-500">—</p>;
    }

    // Split into paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    if (paragraphs.length === 0) {
      // If no double newlines, try single newlines
      const lines = content.split('\n').filter(l => l.trim());
      return lines.map((line, index) => (
        <p key={index} className="mb-3 text-justify leading-relaxed text-gray-700 last:mb-0">
          {processText(line)}
        </p>
      ));
    }

    return paragraphs.map((paragraph, index) => {
      // Check if it's a numbered point
      const isNumberedPoint = /^\d+\./.test(paragraph.trim());

      if (isNumberedPoint) {
        const numberMatch = paragraph.match(/^\d+/);
        return (
          <div key={index} className="relative mb-4 pl-8">
            <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
              {numberMatch?.[0]}
            </span>
            <p className="leading-relaxed text-gray-700">{processText(paragraph)}</p>
          </div>
        );
      }

      return (
        <p key={index} className="mb-4 text-justify leading-relaxed text-gray-700 last:mb-0">
          {processText(paragraph)}
        </p>
      );
    });
  };

  // Process bold text and other formatting
  const processText = (content: string) => {
    return content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-primary-800">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      <div className={cn('relative', className)}>
        {/* Truncated text with line clamp */}
        <div
          className={cn(
            'leading-relaxed text-gray-700',
            maxLines && `line-clamp-${maxLines}`,
            !maxLines && isLongText && 'line-clamp-6'
          )}
        >
          {isLongText ? (
            <span className="whitespace-pre-wrap">{truncatedText}</span>
          ) : (
            <span className="whitespace-pre-wrap">{text}</span>
          )}
        </div>

        {/* Read more button */}
        {isLongText && showExpandButton && (
          <div className="mt-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2',
                'bg-primary-50 text-primary-700 hover:bg-primary-100',
                'text-sm font-medium transition-all duration-200',
                'border border-primary-200 hover:border-primary-300',
                'shadow-sm hover:shadow-md',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
            >
              <Maximize2 className="h-4 w-4" />
              {t.readMore}
            </button>
          </div>
        )}
      </div>

      {/* Full text modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        title={title || t.fullText}
      >
        <ModalHeader>
          <ModalTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <FileText className="h-5 w-5 text-primary-700" />
              </div>
              <span>{title || t.fullText}</span>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <div className="prose prose-lg max-w-none font-serif text-[1.0625rem] leading-[1.85] tracking-[0.01em]">
            {formatContent(text)}
          </div>
        </ModalBody>
        <div className="border-t border-gov-border bg-gray-50 px-6 py-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3',
              'bg-primary-600 text-white hover:bg-primary-700',
              'font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            )}
          >
            <X className="h-4 w-4" />
            {t.close}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default TruncatedText;
