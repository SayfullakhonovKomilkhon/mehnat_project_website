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
    >
      {/* Commentary Card */}
      <div className="border-gov-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-gov-primary/5 hover:bg-gov-primary/10 flex w-full items-center justify-between px-6 py-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gov-primary/10 rounded-full p-2">
              <User className="text-gov-primary h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="text-gov-dark font-semibold">{t.comment}</h3>
              {commentData.author_name && (
                <p className="text-sm text-gray-500">
                  {commentData.author_name}
                  {commentData.author_title && ` • ${commentData.author_title}`}
                </p>
              )}
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-gov-primary h-5 w-5" />
          ) : (
            <ChevronDown className="text-gov-primary h-5 w-5" />
          )}
        </button>

        {/* Content */}
        {expanded && (
          <div className="px-6 py-4">
            {commentData.organization && (
              <p className="mb-3 text-sm text-gray-500">{commentData.organization}</p>
            )}
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: commentText.replace(/\n/g, '<br/>') }}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default ArticleCommentary;
