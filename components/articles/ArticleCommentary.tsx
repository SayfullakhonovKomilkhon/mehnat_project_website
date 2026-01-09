'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronDown, ChevronUp } from 'lucide-react';

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
  const t = labels[locale as keyof typeof labels] || labels.uz;

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
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: commentText.replace(/\n/g, '<br/>') }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ArticleCommentary;
