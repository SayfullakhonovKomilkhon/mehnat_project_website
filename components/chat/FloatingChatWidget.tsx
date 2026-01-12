'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  question: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  question?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ChatState = 'collapsed' | 'form' | 'chat' | 'success' | 'loading';

export function FloatingChatWidget() {
  const t = useTranslations('chat');

  // State
  const [chatState, setChatState] = useState<ChatState>('collapsed');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    question: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Validation
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Uzbek phone format: +998 XX XXX XX XX
    const regex = /^(\+998|998)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    return !phone || regex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = useCallback(() => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Ism kiritish shart';
    } else if (formData.name.trim().length < 2) {
      errors.name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
    }

    if (!formData.email.trim()) {
      errors.email = 'Email kiritish shart';
    } else if (!validateEmail(formData.email)) {
      errors.email = "Noto'g'ri email formati";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = "Noto'g'ri telefon raqam formati";
    }

    if (!formData.question.trim()) {
      errors.question = 'Savol kiritish shart';
    } else if (formData.question.trim().length < 10) {
      errors.question = "Savol kamida 10 ta belgidan iborat bo'lishi kerak";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Update validation when form data changes
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched, validateForm]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show tooltip periodically
  useEffect(() => {
    if (chatState === 'collapsed') {
      const interval = setInterval(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }, 10000);

      // Show initially after 2 seconds
      const timeout = setTimeout(() => setShowTooltip(true), 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [chatState]);

  // Handle input change
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    setTouched({ name: true, email: true, phone: true, question: true });

    if (!validateForm()) return;

    setChatState('loading');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add initial messages
    const userQuestion: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: formData.question,
      timestamp: new Date(),
    };

    setMessages([userQuestion]);
    setChatState('chat');

    // Simulate AI response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Assalomu alaykum, ${formData.name}! Savolingiz qabul qilindi. Mehnat Kodeksining tegishli moddasini ko'rib chiqyapman...`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  // Handle chat message send
  const handleSendMessage = async () => {
    if (!currentInput.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content:
        "Rahmat savolingiz uchun! Mehnat Kodeksining tegishli moddasini ko'rib chiqaman va sizga aniq ma'lumot beraman.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatState === 'chat') {
        handleSendMessage();
      }
    }
  };

  // Reset chat
  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', question: '' });
    setFormErrors({});
    setTouched({});
    setMessages([]);
    setCurrentInput('');
    setChatState('form');
  };

  // Close chat
  const handleClose = () => {
    setChatState('collapsed');
  };

  // Check if form is valid
  const isFormValid =
    formData.name.trim().length >= 2 &&
    validateEmail(formData.email) &&
    (!formData.phone || validatePhone(formData.phone)) &&
    formData.question.trim().length >= 10;

  return (
    <>
      {/* Floating Button - Collapsed State - Hidden on mobile */}
      <AnimatePresence>
        {chatState === 'collapsed' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50 hidden sm:bottom-6 sm:right-6 lg:block"
          >
            {/* Tooltip - Hidden on small mobile */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  className={cn(
                    'absolute right-full top-1/2 mr-3 -translate-y-1/2',
                    'rounded-lg bg-gov-surface px-3 py-2 shadow-lg',
                    'whitespace-nowrap border border-gov-border',
                    'text-xs font-medium text-text-primary sm:text-sm',
                    'hidden sm:block' // Hide on very small screens
                  )}
                >
                  {t('title')}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                    <div className="border-8 border-transparent border-l-gov-surface" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChatState('form')}
              className={cn(
                'relative h-12 w-12 rounded-full sm:h-14 sm:w-14',
                'bg-gradient-to-br from-primary-600 to-primary-800',
                'text-white shadow-lg shadow-primary-500/30',
                'flex items-center justify-center',
                'hover:shadow-xl hover:shadow-primary-500/40',
                'transition-shadow duration-300'
              )}
              aria-label={t('title')}
            >
              {/* Pulse Animation */}
              <span className="absolute inset-0 animate-ping rounded-full bg-primary-500 opacity-20" />
              <span className="absolute inset-0 animate-pulse rounded-full bg-primary-600 opacity-30" />

              <MessageCircle className="relative z-10 h-5 w-5 sm:h-6 sm:w-6" />

              {/* Pending Badge */}
              {pendingCount > 0 && (
                <span className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-xs font-medium text-white">
                  {pendingCount}
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      {/* Chat Panel - Hidden on mobile */}
      <AnimatePresence>
        {chatState !== 'collapsed' && (
          <div className="hidden lg:block">
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'fixed z-50',
                // Desktop: Bottom right
                'bottom-6 right-6',
                'h-[520px] w-[380px]',
                'max-h-[520px]',
                'rounded-2xl bg-gov-surface shadow-2xl',
                'border border-gov-border',
                'flex flex-col overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex flex-shrink-0 items-center justify-between bg-gradient-to-r from-primary-700 to-primary-800 px-4 py-3 text-white">
                <div className="flex items-center gap-3">
                  {chatState === 'chat' && (
                    <button
                      onClick={handleReset}
                      className="-ml-1 rounded-lg p-1.5 transition-colors hover:bg-white/10"
                      aria-label="Back"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold">{t('title')}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-primary-200">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                      {t('online')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 transition-colors hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Form Mode */}
                {chatState === 'form' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 overflow-y-auto p-4"
                  >
                    <p className="mb-4 text-sm text-text-secondary">
                      Savolingizni yuboring, biz 24 soat ichida javob beramiz.
                    </p>

                    <div className="space-y-4">
                      {/* Name */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">
                          {t('name')} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={e => handleInputChange('name', e.target.value)}
                            placeholder="Ismingizni kiriting"
                            className={cn(
                              'h-11 w-full rounded-lg pl-10 pr-4',
                              'border bg-gov-light',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.name && formErrors.name
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        {touched.name && formErrors.name && (
                          <p className="mt-1 text-xs text-error">{formErrors.name}</p>
                        )}
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">
                          {t('email')} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                            placeholder="email@example.com"
                            className={cn(
                              'h-11 w-full rounded-lg pl-10 pr-4',
                              'border bg-gov-light',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.email && formErrors.email
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        {touched.email && formErrors.email && (
                          <p className="mt-1 text-xs text-error">{formErrors.email}</p>
                        )}
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">
                          {t('phone')} <span className="text-text-muted">(ixtiyoriy)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => handleInputChange('phone', e.target.value)}
                            placeholder="+998 XX XXX XX XX"
                            className={cn(
                              'h-11 w-full rounded-lg pl-10 pr-4',
                              'border bg-gov-light',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.phone && formErrors.phone
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        {touched.phone && formErrors.phone && (
                          <p className="mt-1 text-xs text-error">{formErrors.phone}</p>
                        )}
                      </motion.div>

                      {/* Question */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <label className="mb-1.5 block text-sm font-medium text-text-primary">
                          Savolingiz <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                          <textarea
                            ref={inputRef}
                            value={formData.question}
                            onChange={e => handleInputChange('question', e.target.value)}
                            placeholder="Savolingizni batafsil yozing..."
                            rows={4}
                            className={cn(
                              'w-full resize-none rounded-lg py-3 pl-10 pr-4',
                              'border bg-gov-light',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.question && formErrors.question
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        <div className="mt-1 flex justify-between">
                          {touched.question && formErrors.question ? (
                            <p className="text-xs text-error">{formErrors.question}</p>
                          ) : (
                            <span />
                          )}
                          <p className="text-xs text-text-muted">
                            {formData.question.length}/10 min
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleFormSubmit}
                        disabled={!isFormValid}
                        className="w-full"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {t('send')}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Loading State */}
                {chatState === 'loading' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-1 flex-col items-center justify-center p-6"
                  >
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary-600" />
                    <p className="text-center text-text-secondary">Savolingiz yuborilmoqda...</p>
                  </motion.div>
                )}

                {/* Chat Mode */}
                {chatState === 'chat' && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-gov-light p-4">
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            'flex gap-3',
                            message.role === 'user' ? 'flex-row-reverse' : ''
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className={cn(
                              'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                              message.role === 'user'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-primary-600 text-white'
                            )}
                          >
                            {message.role === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={cn(
                              'max-w-[75%] rounded-2xl px-4 py-3',
                              message.role === 'user'
                                ? 'rounded-tr-md bg-primary-600 text-white'
                                : 'rounded-tl-md border border-gov-border bg-gov-surface text-text-primary'
                            )}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p
                              className={cn(
                                'mt-1 text-xs',
                                message.role === 'user' ? 'text-primary-200' : 'text-text-muted'
                              )}
                            >
                              {message.timestamp.toLocaleTimeString('uz-UZ', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="rounded-2xl rounded-tl-md border border-gov-border bg-gov-surface px-4 py-3">
                            <div className="flex gap-1">
                              <span
                                className="h-2 w-2 animate-bounce rounded-full bg-text-muted"
                                style={{ animationDelay: '0ms' }}
                              />
                              <span
                                className="h-2 w-2 animate-bounce rounded-full bg-text-muted"
                                style={{ animationDelay: '150ms' }}
                              />
                              <span
                                className="h-2 w-2 animate-bounce rounded-full bg-text-muted"
                                style={{ animationDelay: '300ms' }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="flex-shrink-0 border-t border-gov-border bg-gov-surface p-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentInput}
                          onChange={e => setCurrentInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={t('placeholder')}
                          disabled={isTyping}
                          className={cn(
                            'flex-1 rounded-xl px-4 py-2.5',
                            'border border-gov-border bg-gov-light',
                            'text-sm text-text-primary placeholder:text-text-muted',
                            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                            'disabled:cursor-not-allowed disabled:opacity-50'
                          )}
                        />
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleSendMessage}
                          disabled={!currentInput.trim() || isTyping}
                          className="px-4"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Success State */}
                {chatState === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-1 flex-col items-center justify-center p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
                    >
                      <CheckCircle className="h-8 w-8 text-success" />
                    </motion.div>
                    <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                      {t('success')}
                    </h3>
                    <p className="mb-6 text-sm text-text-secondary">
                      Biz 24 soat ichida javob beramiz. Sizning email manzilingizga xabar yuboramiz.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      leftIcon={<RefreshCw className="h-4 w-4" />}
                    >
                      Yana savol berish
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingChatWidget;
