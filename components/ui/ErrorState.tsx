'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();

  const errorConfig: Record<ErrorType, {
    icon: typeof FileQuestion;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
  }> = {
    '404': {
      icon: FileQuestion,
      title: t('errors.404.title'),
      description: t('errors.404.description'),
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    '500': {
      icon: ServerCrash,
      title: t('errors.500.title'),
      description: t('errors.500.description'),
      iconBg: 'bg-error-light',
      iconColor: 'text-error',
    },
    'empty': {
      icon: Database,
      title: t('errors.empty.title'),
      description: t('errors.empty.description'),
      iconBg: 'bg-gov-border',
      iconColor: 'text-text-muted',
    },
    'no-results': {
      icon: SearchX,
      title: t('errors.noResults.title'),
      description: t('errors.noResults.description'),
      iconBg: 'bg-accent-light',
      iconColor: 'text-accent-amber',
    },
    'offline': {
      icon: ServerCrash,
      title: t('errors.offline.title'),
      description: t('errors.offline.description'),
      iconBg: 'bg-error-light',
      iconColor: 'text-error',
    },
    'permission': {
      icon: FileQuestion,
      title: t('errors.permission.title'),
      description: t('errors.permission.description'),
      iconBg: 'bg-accent-light',
      iconColor: 'text-accent-amber',
    },
  };

  const config = errorConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4 animate-fadeIn',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-24 h-24 rounded-2xl flex items-center justify-center mb-6',
          config.iconBg
        )}
      >
        <IconComponent className={cn('w-12 h-12', config.iconColor)} />
      </div>

      {/* Government Emblem for 404/500 */}
      {(type === '404' || type === '500') && (
        <div
          className="absolute opacity-[0.03] pointer-events-none"
        >
          <GovEmblem size="xl" variant="mono" />
        </div>
      )}

      {/* Title */}
      <h2
        className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-3"
      >
        {title || config.title}
      </h2>

      {/* Description */}
      <p
        className="text-text-secondary max-w-md mb-8"
      >
        {description || config.description}
        {type === 'no-results' && searchQuery && (
          <span className="block mt-2 font-medium text-text-primary">
            &quot;{searchQuery}&quot;
          </span>
        )}
      </p>

      {/* Actions */}
      <div
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
                {t('errors.retry')}
              </Button>
            )}
            
            {type === '404' && (
              <>
                <Link href={`/${locale}`}>
                  <Button
                    variant="primary"
                    leftIcon={<Home className="w-4 h-4" />}
                  >
                    {t('errors.backToHome')}
                  </Button>
                </Link>
                <Link href={`/${locale}/search`}>
                  <Button
                    variant="outline"
                    leftIcon={<Search className="w-4 h-4" />}
                  >
                    {t('errors.search')}
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
                  {t('errors.refresh')}
                </Button>
                <Link href={`/${locale}/contact`}>
                  <Button
                    variant="outline"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                  >
                    {t('errors.getHelp')}
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
                    {t('errors.allArticles')}
                  </Button>
                </Link>
                <Link href={`/${locale}/sections`}>
                  <Button
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    {t('errors.backToSections')}
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
                  {t('errors.goBack')}
                </Button>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Search Tips for no-results */}
      {type === 'no-results' && (
        <div
          className="mt-8 p-4 bg-gov-light rounded-xl max-w-md"
        >
          <h4 className="font-medium text-text-primary mb-2">{t('search.searchTips')}</h4>
          <ul className="text-sm text-text-secondary text-left space-y-1">
            <li>• {t('search.tip1')}</li>
            <li>• {t('search.tip2')}</li>
            <li>• {t('search.tip3')}</li>
            <li>• {t('search.tip4')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Compact inline error
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className }: InlineErrorProps) {
  const t = useTranslations();
  
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
          {t('errors.retry')}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
