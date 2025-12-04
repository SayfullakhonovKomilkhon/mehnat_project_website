'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { ChatMessage, Message } from './ChatMessage';
import { cn } from '@/lib/utils';

export function ChatBox() {
  const t = useTranslations('chat');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Assalomu alaykum! Men Mehnat Kodeksi bo'yicha AI yordamchiman. Savollaringizga javob berishga tayyorman.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response - In production, call your API
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Rahmat savolingiz uchun! Mehnat Kodeksining tegishli moddasini ko'rib chiqaman va sizga aniq ma'lumot beraman. Iltimos, biroz kuting...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40',
          'w-14 h-14 rounded-full',
          'bg-primary-800 text-white shadow-lg',
          'flex items-center justify-center',
          'hover:bg-primary-700 transition-colors',
          isOpen && 'hidden'
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50',
              'w-full max-w-sm',
              'bg-gov-surface rounded-2xl shadow-2xl',
              'border border-gov-border',
              'flex flex-col overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm">{t('aiTitle')}</h3>
                  <p className="text-xs text-primary-200 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {t('online')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gov-light">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>{t('thinking')}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gov-border bg-gov-surface">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('placeholder')}
                      className={cn(
                        'flex-1 px-4 py-2.5 rounded-xl',
                        'bg-gov-light border border-gov-border',
                        'text-sm text-text-primary placeholder:text-text-muted',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
                      )}
                    />
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatBox;
