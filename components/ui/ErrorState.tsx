'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileQuestion, 
  ServerCrash, 
  SearchX, 
  Database, 
  RefreshCw, 
  Home,
  Search,
  ArrowLeft,
  MessageCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { GovEmblem } from '@/components/layout';

type ErrorType = '404' | '500' | 'empty' | 'no-results' | 'offline' | 'permission';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  /** Show retry button */
  onRetry?: () => void;
  /** Custom action buttons */
  actions?: React.ReactNode;
  /** Search query for no-results type */
  searchQuery?: string;
  className?: string;
  locale?: string;
}

const errorConfig: Record<ErrorType, {
  icon: typeof FileQuestion;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}> = {
  '404': {
    icon: FileQuestion,
    title: 'Sahifa topilmadi',
    description: 'Siz qidirayotgan sahifa mavjud emas yoki ko\'chirilgan bo\'lishi mumkin.',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  '500': {
    icon: ServerCrash,
    title: 'Xatolik yuz berdi',
    description: 'Serverda kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.',
    iconBg: 'bg-error-light',
    iconColor: 'text-error',
  },
  'empty': {
    icon: Database,
    title: "Ma'lumot topilmadi",
    description: "Bu bo'limda hozircha ma'lumot mavjud emas.",
    iconBg: 'bg-gov-border',
    iconColor: 'text-text-muted',
  },
  'no-results': {
    icon: SearchX,
    title: 'Qidiruv natijalari topilmadi',
    description: "Siz kiritgan so'rov bo'yicha hech qanday natija topilmadi.",
    iconBg: 'bg-accent-light',
    iconColor: 'text-accent-amber',
  },
  'offline': {
    icon: ServerCrash,
    title: 'Internet aloqasi yo\'q',
    description: 'Iltimos, internet ulanishingizni tekshiring va qayta urinib ko\'ring.',
    iconBg: 'bg-error-light',
    iconColor: 'text-error',
  },
  'permission': {
    icon: FileQuestion,
    title: 'Ruxsat berilmagan',
    description: 'Siz ushbu sahifani ko\'rish uchun ruxsatga ega emassiz.',
    iconBg: 'bg-accent-light',
    iconColor: 'text-accent-amber',
  },
};

export function ErrorState({
  type = 'empty',
  title,
  description,
  onRetry,
  actions,
  searchQuery,
  className,
  locale = 'uz',
}: ErrorStateProps) {
  const config = errorConfig[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'w-24 h-24 rounded-2xl flex items-center justify-center mb-6',
          config.iconBg
        )}
      >
        <IconComponent className={cn('w-12 h-12', config.iconColor)} />
      </motion.div>

      {/* Government Emblem for 404/500 */}
      {(type === '404' || type === '500') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.2 }}
          className="absolute opacity-[0.03] pointer-events-none"
        >
          <GovEmblem size="xl" variant="mono" />
        </motion.div>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-3"
      >
        {title || config.title}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-text-secondary max-w-md mb-8"
      >
        {description || config.description}
        {type === 'no-results' && searchQuery && (
          <span className="block mt-2 font-medium text-text-primary">
            "{searchQuery}"
          </span>
        )}
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        {actions || (
          <>
            {onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Qayta urinish
              </Button>
            )}
            
            {type === '404' && (
              <>
                <Link href={`/${locale}`}>
                  <Button
                    variant="primary"
                    leftIcon={<Home className="w-4 h-4" />}
                  >
                    Bosh sahifaga qaytish
                  </Button>
                </Link>
                <Link href={`/${locale}/search`}>
                  <Button
                    variant="outline"
                    leftIcon={<Search className="w-4 h-4" />}
                  >
                    Qidirish
                  </Button>
                </Link>
              </>
            )}

            {type === '500' && (
              <>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Sahifani yangilash
                </Button>
                <Link href={`/${locale}/contact`}>
                  <Button
                    variant="outline"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                  >
                    Yordam olish
                  </Button>
                </Link>
              </>
            )}

            {type === 'no-results' && (
              <>
                <Link href={`/${locale}/articles`}>
                  <Button
                    variant="primary"
                    leftIcon={<FileText className="w-4 h-4" />}
                  >
                    Barcha moddalar
                  </Button>
                </Link>
                <Link href={`/${locale}/sections`}>
                  <Button
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Bo'limlarga qaytish
                  </Button>
                </Link>
              </>
            )}

            {type === 'empty' && (
              <Link href={`/${locale}`}>
                <Button
                  variant="outline"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Orqaga qaytish
                </Button>
              </Link>
            )}
          </>
        )}
      </motion.div>

      {/* Search Tips for no-results */}
      {type === 'no-results' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-gov-light rounded-xl max-w-md"
        >
          <h4 className="font-medium text-text-primary mb-2">Qidiruv bo'yicha maslahatlar:</h4>
          <ul className="text-sm text-text-secondary text-left space-y-1">
            <li>• Kalit so'zlarni qisqartiring</li>
            <li>• Imlo xatolarini tekshiring</li>
            <li>• Umumiy so'zlar ishlating</li>
            <li>• Modda raqami bilan qidiring (masalan: "21")</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}

// Compact inline error
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg',
      'bg-error-light border border-error/20',
      className
    )}>
      <ServerCrash className="w-5 h-5 text-error flex-shrink-0" />
      <p className="text-sm text-error flex-1">{message}</p>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3 h-3" />}
          className="text-error hover:bg-error/10"
        >
          Qayta
        </Button>
      )}
    </div>
  );
}

export default ErrorState;



