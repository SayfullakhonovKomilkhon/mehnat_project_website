'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronDown, ChevronUp, Maximize2, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui';

interface ArticleCommentaryProps {
  locale: string;
  articleId: number;
  hasComment?: boolean;
  commentData?: {
    id: number;
    comment?: string;
    comment_uz?: string;
    comment_ru?: string;
    comment_en?: string;
    author_name?: string;
    author_title?: string;
    organization?: string;
  } | null;
}

const labels = {
  uz: {
    comment: 'Sharh',
    noComment: "Ushbu moddaga sharh hali qo'shilmagan",
  },
  ru: {
    comment: 'Комментарий',
    noComment: 'Комментарий к этой статье ещё не добавлен',
  },
  en: {
    comment: 'Commentary',
    noComment: 'Commentary for this article has not been added yet',
  },
};

export function ArticleCommentary({
  locale,
  articleId,
  hasComment,
  commentData,
}: ArticleCommentaryProps) {
  const [expanded, setExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = labels[locale as keyof typeof labels] || labels.uz;

  const MAX_PREVIEW_LENGTH = 1000;

  // Get comment text based on locale
  const getCommentText = () => {
    if (!commentData) return null;
    if (commentData.comment) return commentData.comment;
    const field = `comment_${locale}` as keyof typeof commentData;
    return (commentData[field] as string) || commentData.comment_uz || null;
  };

  const commentText = getCommentText();

  // No comment state
  if (!hasComment || !commentData || !commentText) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">{t.noComment}</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      {/* Header - styled like ArticleContent */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-t-xl bg-primary-800 p-4 text-white"
      >
        <div className="flex items-center gap-3">
          <User className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">{t.comment}</h2>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="rounded-b-xl border border-t-0 border-gov-border bg-gov-surface p-6">
          {/* Author info */}
          {(commentData.author_name || commentData.organization) && (
            <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                {commentData.author_name && (
                  <p className="font-medium text-gray-900">
                    {commentData.author_name}
                    {commentData.author_title && (
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        {commentData.author_title}
                      </span>
                    )}
                  </p>
                )}
                {commentData.organization && (
                  <p className="text-sm text-gray-500">{commentData.organization}</p>
                )}
              </div>
            </div>
          )}

          {/* Comment text */}
          {(() => {
            const isLongComment = commentText.length > MAX_PREVIEW_LENGTH;
            const displayText = isLongComment
              ? commentText.slice(0, MAX_PREVIEW_LENGTH) + '...'
              : commentText;

            // Format text with proper paragraphs
            const formatCommentText = (text: string) => {
              return text
                .split(/\n/)
                .filter(p => p.trim())
                .map(p => `<p class="mb-4 leading-[2] indent-4">${p}</p>`)
                .join('');
            };

            return (
              <>
                <div
                  className="prose prose-base max-w-none font-serif text-[1.05rem] tracking-wide text-gray-800"
                  dangerouslySetInnerHTML={{ __html: formatCommentText(displayText) }}
                />

                {isLongComment && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-lg px-5 py-2.5',
                        'bg-primary-600 text-white hover:bg-primary-700',
                        'text-sm font-medium transition-all duration-200',
                        'shadow-md hover:shadow-lg',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                      )}
                    >
                      <Maximize2 className="h-4 w-4" />
                      {locale === 'uz'
                        ? "To'liq sharhni ko'rish"
                        : locale === 'ru'
                          ? 'Просмотреть полный комментарий'
                          : 'View full commentary'}
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </motion.div>

      {/* Full Comment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl" title={t.comment}>
        <ModalHeader className="bg-primary-800 text-white">
          <ModalTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-white">{t.comment}</span>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto bg-amber-50/30">
          {/* Author info in modal */}
          {(commentData.author_name || commentData.organization) && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border-l-4 border-primary-500 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                {commentData.author_name && (
                  <p className="font-semibold text-gray-900">
                    {commentData.author_name}
                    {commentData.author_title && (
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        {commentData.author_title}
                      </span>
                    )}
                  </p>
                )}
                {commentData.organization && (
                  <p className="text-sm text-gray-500">{commentData.organization}</p>
                )}
              </div>
            </div>
          )}

          {/* Comment content with improved typography */}
          <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
            <div
              className="prose prose-lg max-w-none font-serif text-[1.05rem] leading-[2] tracking-wide text-gray-800"
              dangerouslySetInnerHTML={{
                __html: commentText
                  .split(/\n/)
                  .filter(p => p.trim())
                  .map(
                    (p, i) =>
                      `<p class="mb-5 ${i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:text-4xl first-letter:font-bold first-letter:text-primary-600' : 'indent-6'}">${p}</p>`
                  )
                  .join(''),
              }}
            />
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

export default ArticleCommentary;
