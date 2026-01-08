'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLocalizedText } from '@/lib/api';
import type { Article } from '@/types';

interface ArticleContentProps {
  article: Article;
  locale: string;
}

export function ArticleContent({ article, locale }: ArticleContentProps) {
  const t = useTranslations('article');
  const [isExpanded, setIsExpanded] = useState(true);

  // Get actual content from article data
  const content = getLocalizedText(article.content, locale) || '';

  // Process content to highlight key terms and format properly
  const formatContent = (text: string) => {
    if (!text) {
      return <p className="italic text-gray-500">Контент отсутствует</p>;
    }

    // Split into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      // Check if it's a numbered point
      const isNumberedPoint = /^\d+\./.test(paragraph.trim());

      // Process bold text
      const processedText = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-primary-800">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isNumberedPoint) {
        const numberMatch = paragraph.match(/^\d+/);
        return (
          <div key={index} className="relative mb-4 pl-6">
            <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
              {numberMatch?.[0]}
            </span>
            <p className="pl-4 leading-[1.8] text-text-primary">{processedText}</p>
          </div>
        );
      }

      return (
        <p key={index} className="mb-4 text-justify leading-[1.8] text-text-primary">
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
              'font-serif',
              'text-[1.0625rem]',
              'selection:bg-primary-100 selection:text-primary-900'
            )}
          >
            {formatContent(content)}
          </div>

          {/* Article Reference */}
          <div className="mt-8 border-t border-gov-border pt-6">
            <p className="text-sm italic text-text-muted">
              * {article.number}-modda. {getLocalizedText(article.title, locale)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ArticleContent;
