'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, FileText, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLocalizedText } from '@/lib/api';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui';
import type { Article } from '@/types';

interface ArticleContentProps {
  article: Article;
  locale: string;
}

export function ArticleContent({ article, locale }: ArticleContentProps) {
  const t = useTranslations('article');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get actual content from article data
  const content = getLocalizedText(article.content, locale) || '';
  const title = getLocalizedText(article.title, locale) || '';

  // Check if content is long (more than 800 characters)
  const isLongContent = content.length > 800;
  const MAX_PREVIEW_LENGTH = 600;

  // Process content to highlight key terms and format properly
  const formatContent = (text: string, isModal: boolean = false) => {
    if (!text) {
      return <p className="italic text-gray-500">Контент отсутствует</p>;
    }

    // Split by sentences for better formatting in modal
    const sentences = text.split(/(?<=[.;:])\s+/);

    // Group sentences into paragraphs (every 2-3 sentences)
    const paragraphs: string[] = [];
    let currentParagraph = '';

    sentences.forEach((sentence, i) => {
      currentParagraph += sentence + ' ';
      // Create new paragraph every 2-3 sentences or at natural breaks
      if ((i + 1) % 3 === 0 || sentence.endsWith(':') || sentence.endsWith(';')) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    });
    if (currentParagraph.trim()) {
      paragraphs.push(currentParagraph.trim());
    }

    return paragraphs.map((paragraph, index) => {
      // Check if it's a numbered point
      const isNumberedPoint = /^\d+[\.\)]/.test(paragraph.trim());

      // Process bold text
      const processedText = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-primary-700">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isNumberedPoint) {
        const numberMatch = paragraph.match(/^\d+/);
        const textWithoutNumber = paragraph.replace(/^\d+[\.\)]\s*/, '');
        return (
          <div key={index} className="relative mb-5 pl-10">
            <span className="absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {numberMatch?.[0]}
            </span>
            <p className={cn('leading-[2] text-gray-800', isModal && 'text-[1.05rem]')}>
              {processedText}
            </p>
          </div>
        );
      }

      // First paragraph styling (drop cap effect for modal)
      if (index === 0 && isModal) {
        return (
          <p
            key={index}
            className="mb-6 text-[1.1rem] font-medium leading-[2] text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:text-primary-600"
          >
            {processedText}
          </p>
        );
      }

      return (
        <p
          key={index}
          className={cn('mb-5 leading-[2] text-gray-800', isModal && 'indent-6 text-[1.05rem]')}
        >
          {processedText}
        </p>
      );
    });
  };

  return (
    <motion.section
      id="content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-t-xl bg-primary-800 p-4 text-white"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">{t('content')}</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div
          className={cn(
            'rounded-b-xl border border-t-0 border-gov-border bg-gov-surface',
            'p-6 md:p-8'
          )}
        >
          {/* Legal Text Container */}
          <div
            className={cn(
              'prose prose-lg max-w-none',
              'font-serif tracking-wide',
              'selection:bg-primary-100 selection:text-primary-900'
            )}
          >
            {isLongContent
              ? formatContent(content.slice(0, MAX_PREVIEW_LENGTH) + '...', false)
              : formatContent(content, false)}
          </div>

          {/* Read More Button for long content */}
          {isLongContent && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-6 py-3',
                  'bg-primary-600 text-white hover:bg-primary-700',
                  'text-sm font-medium transition-all duration-200',
                  'shadow-lg hover:shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                )}
              >
                <Maximize2 className="h-4 w-4" />
                {locale === 'uz'
                  ? "To'liq matnni ko'rish"
                  : locale === 'ru'
                    ? 'Просмотреть полный текст'
                    : 'View full text'}
              </button>
            </div>
          )}

          {/* Article Reference */}
          <div className="mt-8 border-t border-gov-border pt-6">
            <p className="text-sm italic text-text-muted">
              * {article.number}-modda. {getLocalizedText(article.title, locale)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Full Content Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl" title={title}>
        <ModalHeader className="bg-primary-800 text-white">
          <ModalTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-white">{article.number}-modda</span>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto bg-amber-50/30">
          {/* Article title */}
          <div className="mb-6 rounded-lg border-l-4 border-primary-500 bg-white p-4 shadow-sm">
            <p className="text-base font-medium text-gray-700">{title}</p>
          </div>

          {/* Article content with improved typography */}
          <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
            <div className="max-w-none font-serif tracking-wide">
              {formatContent(content, true)}
            </div>
          </div>
        </ModalBody>
        <div className="border-t border-gov-border bg-gray-50 px-6 py-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3',
              'bg-primary-700 text-white hover:bg-primary-800',
              'font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            )}
          >
            <X className="h-4 w-4" />
            {locale === 'uz' ? 'Yopish' : locale === 'ru' ? 'Закрыть' : 'Close'}
          </button>
        </div>
      </Modal>
    </motion.section>
  );
}

export default ArticleContent;
