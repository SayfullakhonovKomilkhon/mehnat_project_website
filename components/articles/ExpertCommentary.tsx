'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Scale,
  Calendar,
  Quote,
  BadgeCheck,
  Briefcase,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/date-utils';
import { getArticleExpertisePublic } from '@/lib/api';
import type { Locale } from '@/types';

interface ExpertCommentaryProps {
  locale: string;
  hasCommentary: boolean;
  articleId?: number;
  expertiseData?: {
    expert_comment: string;
    legal_references?: Array<{ name: string; url: string }>;
    court_practice?: string;
    recommendations?: string;
    expert_name?: string;
    created_at?: string;
  } | null;
}

const translations = {
  uz: {
    title: 'Ekspert sharhi',
    badge: 'Amaliyotga asoslangan',
    expert: 'Ekspert',
    noCommentary: "Ushbu moddaga ekspert sharhi hali qo'shilmagan",
    disclaimer:
      'Eslatma: Ushbu sharh huquqiy maslahat hisoblanmaydi. Muayyan holat uchun malakali huquqshunos bilan maslahatlashing.',
    courtPractice: 'Sud amaliyoti',
    recommendations: 'Tavsiyalar',
    legalReferences: 'Qonuniy havolalar',
    loading: 'Yuklanmoqda...',
  },
  ru: {
    title: 'Экспертное заключение',
    badge: 'На основе практики',
    expert: 'Эксперт',
    noCommentary: 'Экспертный комментарий к этой статье ещё не добавлен',
    disclaimer:
      'Примечание: Данный комментарий не является юридической консультацией. Для конкретной ситуации обратитесь к квалифицированному юристу.',
    courtPractice: 'Судебная практика',
    recommendations: 'Рекомендации',
    legalReferences: 'Правовые ссылки',
    loading: 'Загрузка...',
  },
  en: {
    title: 'Expert Commentary',
    badge: 'Practice-based',
    expert: 'Expert',
    noCommentary: 'Expert commentary for this article has not been added yet',
    disclaimer:
      'Note: This commentary is not legal advice. For specific situations, consult a qualified lawyer.',
    courtPractice: 'Court Practice',
    recommendations: 'Recommendations',
    legalReferences: 'Legal References',
    loading: 'Loading...',
  },
};

export function ExpertCommentary({
  locale,
  hasCommentary,
  articleId,
  expertiseData: initialData,
}: ExpertCommentaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expertiseData, setExpertiseData] = useState(initialData);

  const t = translations[locale as keyof typeof translations] || translations.uz;

  // Fetch expertise data if articleId is provided and no initial data
  useEffect(() => {
    if (articleId && !initialData && hasCommentary) {
      setLoading(true);
      getArticleExpertisePublic(articleId, locale as Locale)
        .then(result => {
          if (result.hasExpertise && result.expertise) {
            setExpertiseData(result.expertise);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [articleId, locale, initialData, hasCommentary]);

  if (!hasCommentary || (!expertiseData && !loading)) {
    return (
      <motion.section
        id="expert"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="rounded-xl border border-gov-border bg-gov-surface p-6 text-center">
          <Scale className="mx-auto mb-3 h-12 w-12 text-text-muted" />
          <p className="text-text-secondary">{t.noCommentary}</p>
        </div>
      </motion.section>
    );
  }

  if (loading) {
    return (
      <motion.section
        id="expert"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="rounded-xl border border-gov-border bg-gov-surface p-6 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-amber-600" />
          <p className="text-text-secondary">{t.loading}</p>
        </div>
      </motion.section>
    );
  }

  const data = expertiseData!;

  return (
    <motion.section
      id="expert"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-t-xl border border-b-0 border-amber-200 bg-amber-100 p-4 text-amber-800"
      >
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">{t.title}</h2>
          <Badge variant="gold" size="sm">
            {t.badge}
          </Badge>
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
            'rounded-b-xl border border-amber-200 bg-gov-surface',
            'border-l-4 border-l-accent-gold'
          )}
        >
          {/* Expert Info */}
          {data.expert_name && (
            <div className="border-b border-gov-border bg-amber-50/50 p-6">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-amber-200">
                    <Scale className="h-8 w-8 text-amber-700" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold">
                    <BadgeCheck className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold text-text-primary">
                      {data.expert_name}
                    </h3>
                    <Badge variant="gold" size="sm">
                      {t.expert}
                    </Badge>
                  </div>
                </div>

                {data.created_at && (
                  <div className="hidden items-center gap-1.5 text-sm text-text-muted sm:flex">
                    <Calendar className="h-4 w-4" />
                    <span suppressHydrationWarning>{formatDate(data.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expert Comment */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none text-text-primary">
              {data.expert_comment.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Court Practice */}
            {data.court_practice && (
              <div className="mt-6">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                  <Briefcase className="h-4 w-4" />
                  {t.courtPractice}
                </h4>
                <div className="rounded-lg bg-amber-50 p-4 text-text-primary">
                  {data.court_practice.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && (
              <div className="mt-6">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                  <Quote className="h-4 w-4" />
                  {t.recommendations}
                </h4>
                <div className="rounded-lg bg-amber-50 p-4 text-text-primary">
                  {data.recommendations.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Legal References */}
            {data.legal_references && data.legal_references.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                  <Scale className="h-4 w-4" />
                  {t.legalReferences}
                </h4>
                <div className="space-y-2">
                  {data.legal_references.map((ref, index) => (
                    <a
                      key={index}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {ref.name || ref.url}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">{t.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ExpertCommentary;
