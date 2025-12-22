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
  RefreshCw
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
      errors.name = "Ism kiritish shart";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Ism kamida 2 ta belgidan iborat bo'lishi kerak";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email kiritish shart";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Noto'g'ri email formati";
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = "Noto'g'ri telefon raqam formati";
    }
    
    if (!formData.question.trim()) {
      errors.question = "Savol kiritish shart";
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
      content: "Rahmat savolingiz uchun! Mehnat Kodeksining tegishli moddasini ko'rib chiqaman va sizga aniq ma'lumot beraman.",
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
  const isFormValid = formData.name.trim().length >= 2 && 
    validateEmail(formData.email) && 
    (!formData.phone || validatePhone(formData.phone)) &&
    formData.question.trim().length >= 10;

  return (
    <>
      {/* Floating Button - Collapsed State */}
      <AnimatePresence>
        {chatState === 'collapsed' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          >
            {/* Tooltip - Hidden on small mobile */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  className={cn(
                    'absolute right-full mr-3 top-1/2 -translate-y-1/2',
                    'bg-gov-surface px-3 py-2 rounded-lg shadow-lg',
                    'border border-gov-border whitespace-nowrap',
                    'text-xs sm:text-sm text-text-primary font-medium',
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
                'relative w-12 h-12 sm:w-14 sm:h-14 rounded-full',
                'bg-gradient-to-br from-primary-600 to-primary-800',
                'text-white shadow-lg shadow-primary-500/30',
                'flex items-center justify-center',
                'hover:shadow-xl hover:shadow-primary-500/40',
                'transition-shadow duration-300'
              )}
              aria-label={t('title')}
            >
              {/* Pulse Animation */}
              <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20" />
              <span className="absolute inset-0 rounded-full bg-primary-600 animate-pulse opacity-30" />
              
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              
              {/* Pending Badge */}
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold text-white text-xs rounded-full flex items-center justify-center font-medium z-20">
                  {pendingCount}
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatState !== 'collapsed' && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'fixed z-50',
                // Mobile: Almost full screen with safe areas
                'inset-2 sm:inset-4 md:inset-auto',
                // Desktop: Bottom right
                'md:bottom-6 md:right-6',
                'md:w-[380px] md:h-[520px]',
                'max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[520px]',
                'bg-gov-surface rounded-xl sm:rounded-2xl shadow-2xl',
                'border border-gov-border',
                'flex flex-col overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-700 to-primary-800 text-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  {chatState === 'chat' && (
                    <button
                      onClick={handleReset}
                      className="p-1.5 -ml-1 hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm">
                      {t('title')}
                    </h3>
                    <p className="text-xs text-primary-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {t('online')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Form Mode */}
                {chatState === 'form' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 overflow-y-auto p-4"
                  >
                    <p className="text-sm text-text-secondary mb-4">
                      Savolingizni yuboring, biz 24 soat ichida javob beramiz.
                    </p>
                    
                    <div className="space-y-4">
                      {/* Name */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          {t('name')} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Ismingizni kiriting"
                            className={cn(
                              'w-full h-11 pl-10 pr-4 rounded-lg',
                              'bg-gov-light border',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.name && formErrors.name
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        {touched.name && formErrors.name && (
                          <p className="text-xs text-error mt-1">{formErrors.name}</p>
                        )}
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          {t('email')} <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="email@example.com"
                            className={cn(
                              'w-full h-11 pl-10 pr-4 rounded-lg',
                              'bg-gov-light border',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.email && formErrors.email
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        {touched.email && formErrors.email && (
                          <p className="text-xs text-error mt-1">{formErrors.email}</p>
                        )}
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          {t('phone')} <span className="text-text-muted">(ixtiyoriy)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+998 XX XXX XX XX"
                            className={cn(
                              'w-full h-11 pl-10 pr-4 rounded-lg',
                              'bg-gov-light border',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.phone && formErrors.phone
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        {touched.phone && formErrors.phone && (
                          <p className="text-xs text-error mt-1">{formErrors.phone}</p>
                        )}
                      </motion.div>

                      {/* Question */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          Savolingiz <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                          <textarea
                            ref={inputRef}
                            value={formData.question}
                            onChange={(e) => handleInputChange('question', e.target.value)}
                            placeholder="Savolingizni batafsil yozing..."
                            rows={4}
                            className={cn(
                              'w-full pl-10 pr-4 py-3 rounded-lg resize-none',
                              'bg-gov-light border',
                              'text-text-primary placeholder:text-text-muted',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                              touched.question && formErrors.question
                                ? 'border-error focus:border-error'
                                : 'border-gov-border focus:border-primary-500'
                            )}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
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
                        <Send className="w-4 h-4 mr-2" />
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
                    className="flex-1 flex flex-col items-center justify-center p-6"
                  >
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                    <p className="text-text-secondary text-center">
                      Savolingiz yuborilmoqda...
                    </p>
                  </motion.div>
                )}

                {/* Chat Mode */}
                {chatState === 'chat' && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gov-light">
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
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            message.role === 'user' 
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-primary-600 text-white'
                          )}>
                            {message.role === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          
                          {/* Message Bubble */}
                          <div className={cn(
                            'max-w-[75%] px-4 py-3 rounded-2xl',
                            message.role === 'user'
                              ? 'bg-primary-600 text-white rounded-tr-md'
                              : 'bg-gov-surface border border-gov-border text-text-primary rounded-tl-md'
                          )}>
                            <p className="text-sm leading-relaxed">
                              {message.content}
                            </p>
                            <p className={cn(
                              'text-xs mt-1',
                              message.role === 'user' ? 'text-primary-200' : 'text-text-muted'
                            )}>
                              {message.timestamp.toLocaleTimeString('uz-UZ', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
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
                          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-gov-surface border border-gov-border px-4 py-3 rounded-2xl rounded-tl-md">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gov-border bg-gov-surface flex-shrink-0">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder={t('placeholder')}
                          disabled={isTyping}
                          className={cn(
                            'flex-1 px-4 py-2.5 rounded-xl',
                            'bg-gov-light border border-gov-border',
                            'text-sm text-text-primary placeholder:text-text-muted',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                        />
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleSendMessage}
                          disabled={!currentInput.trim() || isTyping}
                          className="px-4"
                        >
                          <Send className="w-4 h-4" />
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
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-success" />
                    </motion.div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                      {t('success')}
                    </h3>
                    <p className="text-text-secondary text-sm mb-6">
                      Biz 24 soat ichida javob beramiz. Sizning email manzilingizga xabar yuboramiz.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                      Yana savol berish
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingChatWidget;





