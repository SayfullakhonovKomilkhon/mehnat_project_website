'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Scale, BookOpen, FileText, ChevronDown, ChevronUp } from 'lucide-react';

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
    legal_references?: any;
    court_practice?: string;
    recommendations?: string;
    has_expert_content?: boolean;
  } | null;
}

const labels = {
  uz: {
    authorComment: 'Sharh',
    expertSection: 'Ekspert sharhi',
    legalReferences: 'Huquqiy asoslar',
    courtPractice: 'Sud amaliyoti',
    recommendations: 'Tavsiyalar',
    noComment: "Ushbu moddaga sharh hali qo'shilmagan",
    author: 'Muallif',
    basedOn: 'Amaliyotga asoslangan',
    showMore: "Ko'proq ko'rsatish",
    showLess: 'Kamroq',
  },
  ru: {
    authorComment: 'Комментарий',
    expertSection: 'Экспертный комментарий',
    legalReferences: 'Правовые основы',
    courtPractice: 'Судебная практика',
    recommendations: 'Рекомендации',
    noComment: 'Комментарий к этой статье ещё не добавлен',
    author: 'Автор',
    basedOn: 'Основано на практике',
    showMore: 'Показать больше',
    showLess: 'Свернуть',
  },
  en: {
    authorComment: 'Commentary',
    expertSection: 'Expert Commentary',
    legalReferences: 'Legal References',
    courtPractice: 'Court Practice',
    recommendations: 'Recommendations',
    noComment: 'Commentary for this article has not been added yet',
    author: 'Author',
    basedOn: 'Based on practice',
    showMore: 'Show more',
    showLess: 'Show less',
  },
};

export function ArticleCommentary({
  locale,
  articleId,
  hasComment,
  commentData,
}: ArticleCommentaryProps) {
  const [expanded, setExpanded] = useState(true);
  const [expertExpanded, setExpertExpanded] = useState(false);
  const t = labels[locale as keyof typeof labels] || labels.uz;

  // Get comment text based on locale
  const getCommentText = () => {
    if (!commentData) return null;
    if (commentData.comment) return commentData.comment;
    const field = `comment_${locale}` as keyof typeof commentData;
    return (commentData[field] as string) || commentData.comment_uz || null;
  };

  const commentText = getCommentText();
  const hasExpertContent =
    commentData?.has_expert_content ||
    commentData?.legal_references ||
    commentData?.court_practice ||
    commentData?.recommendations;

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
      className="space-y-4"
    >
      {/* Author Commentary Card */}
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
              <h3 className="text-gov-dark font-semibold">{t.authorComment}</h3>
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

      {/* Expert Content Card (if available) */}
      {hasExpertContent && (
        <div className="border-gov-gold/30 overflow-hidden rounded-xl border bg-white shadow-sm">
          {/* Header */}
          <button
            onClick={() => setExpertExpanded(!expertExpanded)}
            className="bg-gov-gold/10 hover:bg-gov-gold/20 flex w-full items-center justify-between px-6 py-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gov-gold/20 rounded-full p-2">
                <Scale className="text-gov-gold h-5 w-5" />
              </div>
              <h3 className="text-gov-dark font-semibold">{t.expertSection}</h3>
              <span className="bg-gov-gold/20 text-gov-gold rounded-full px-2 py-0.5 text-xs">
                {t.basedOn}
              </span>
            </div>
            {expertExpanded ? (
              <ChevronUp className="text-gov-gold h-5 w-5" />
            ) : (
              <ChevronDown className="text-gov-gold h-5 w-5" />
            )}
          </button>

          {/* Expert Content */}
          {expertExpanded && (
            <div className="space-y-4 px-6 py-4">
              {/* Legal References */}
              {commentData.legal_references && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">{t.legalReferences}</h4>
                  </div>
                  <div className="text-sm text-blue-800">
                    {typeof commentData.legal_references === 'string'
                      ? commentData.legal_references
                      : JSON.stringify(commentData.legal_references, null, 2)}
                  </div>
                </div>
              )}

              {/* Court Practice */}
              {commentData.court_practice && (
                <div className="rounded-lg bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-purple-900">{t.courtPractice}</h4>
                  </div>
                  <p className="text-sm text-purple-800">{commentData.court_practice}</p>
                </div>
              )}

              {/* Recommendations */}
              {commentData.recommendations && (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-green-900">{t.recommendations}</h4>
                  </div>
                  <p className="text-sm text-green-800">{commentData.recommendations}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

export default ArticleCommentary;
