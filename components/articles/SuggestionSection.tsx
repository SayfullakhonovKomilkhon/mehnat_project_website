'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SuggestionSectionProps {
  articleId: number;
  articleNumber: string;
  locale: string;
}

const translations = {
  uz: {
    title: 'Taklifingiz bormi?',
    description:
      "Ushbu modda bo'yicha taklif yoki tuzatishlaringiz bo'lsa, bizga yuboring. Sizning fikringiz muhim!",
    button: 'Taklif yuborish',
    modalTitle: 'Taklif yuborish',
    modalSubtitle: "modda bo'yicha",
    nameLabel: 'Ismingiz',
    namePlaceholder: 'Ismingizni kiriting',
    suggestionLabel: 'Taklifingiz',
    suggestionPlaceholder: 'Taklif yoki tuzatishlaringizni batafsil yozing...',
    cancel: 'Bekor qilish',
    send: 'Yuborish',
    sending: 'Yuborilmoqda...',
    success: "Taklifingiz muvaffaqiyatli yuborildi! Tez orada ko'rib chiqamiz.",
    error: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
    required: "Bu maydon to'ldirilishi shart",
  },
  ru: {
    title: 'Есть предложения?',
    description:
      'Если у вас есть предложения или исправления по данной статье, отправьте нам. Ваше мнение важно!',
    button: 'Отправить предложение',
    modalTitle: 'Отправить предложение',
    modalSubtitle: 'по статье',
    nameLabel: 'Ваше имя',
    namePlaceholder: 'Введите ваше имя',
    suggestionLabel: 'Ваше предложение',
    suggestionPlaceholder: 'Подробно опишите ваше предложение или исправление...',
    cancel: 'Отмена',
    send: 'Отправить',
    sending: 'Отправка...',
    success: 'Ваше предложение успешно отправлено! Мы рассмотрим его в ближайшее время.',
    error: 'Произошла ошибка. Попробуйте еще раз.',
    required: 'Это поле обязательно',
  },
  en: {
    title: 'Have suggestions?',
    description:
      'If you have suggestions or corrections for this article, send them to us. Your opinion matters!',
    button: 'Submit suggestion',
    modalTitle: 'Submit suggestion',
    modalSubtitle: 'for article',
    nameLabel: 'Your name',
    namePlaceholder: 'Enter your name',
    suggestionLabel: 'Your suggestion',
    suggestionPlaceholder: 'Describe your suggestion or correction in detail...',
    cancel: 'Cancel',
    send: 'Submit',
    sending: 'Sending...',
    success: 'Your suggestion was sent successfully! We will review it soon.',
    error: 'An error occurred. Please try again.',
    required: 'This field is required',
  },
};

export function SuggestionSection({ articleId, articleNumber, locale }: SuggestionSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    suggestion: '',
  });
  const [errors, setErrors] = useState<{ name?: string; suggestion?: string }>({});

  const t = translations[locale as keyof typeof translations] || translations.uz;

  const validateForm = () => {
    const newErrors: { name?: string; suggestion?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }
    if (!formData.suggestion.trim()) {
      newErrors.suggestion = t.required;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1'}/suggestions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
          },
          body: JSON.stringify({
            article_id: articleId,
            article_number: articleNumber,
            name: formData.name,
            suggestion: formData.suggestion,
          }),
        }
      );

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', suggestion: '' });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setSubmitStatus('idle');
      setErrors({});
    }
  };

  return (
    <>
      {/* Suggestion Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 to-blue-50 p-4 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary-100 p-2">
              <MessageSquarePlus className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{t.description}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Send className="h-4 w-4" />
            {t.button}
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-x-auto"
            >
              {/* Header */}
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{t.modalTitle}</h2>
                    <p className="text-sm text-gray-500">
                      {articleNumber}-modda {t.modalSubtitle}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {submitStatus === 'success' ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="mb-4 rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-gray-700">{t.success}</p>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{t.error}</p>
                  </div>
                ) : null}

                {submitStatus !== 'success' && (
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        {t.nameLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder={t.namePlaceholder}
                        disabled={isSubmitting}
                        className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Suggestion */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        {t.suggestionLabel} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={formData.suggestion}
                        onChange={e => {
                          setFormData({ ...formData, suggestion: e.target.value });
                          if (errors.suggestion) setErrors({ ...errors, suggestion: undefined });
                        }}
                        placeholder={t.suggestionPlaceholder}
                        disabled={isSubmitting}
                        className={`w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 ${
                          errors.suggestion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.suggestion && (
                        <p className="mt-1 text-sm text-red-500">{errors.suggestion}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={isSubmitting}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t.sending}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            {t.send}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
