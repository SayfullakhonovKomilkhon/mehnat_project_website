'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Shield, 
  Share2, 
  Bookmark, 
  ChevronRight,
  FileText,
  User,
  Award
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { GovEmblem } from '@/components/layout';
import { formatDate } from '@/lib/utils';

interface ArticleDetailProps {
  params: { locale: string; id: string };
}

// Mock article data - In production, fetch from API
const getArticle = (id: string) => ({
  id,
  articleNumber: parseInt(id),
  chapterNumber: 1,
  sectionNumber: 1,
  title: "Mehnat qonunchiligi va uning vazifalari",
  titleRu: "Трудовое законодательство и его задачи",
  titleEn: "Labor Legislation and Its Tasks",
  content: `
O'zbekiston Respublikasining mehnat qonunchiligi fuqarolarning mehnat qilish huquqini ta'minlash, mehnat munosabatlarini tartibga solish, ish beruvchi va xodimlarning huquqlari hamda manfaatlarini himoya qilish vazifalarini bajaradi.

Mehnat qonunchiligi quyidagi vazifalarga xizmat qiladi:

1. **Fuqarolarning mehnat qilish huquqini ta'minlash** - har bir fuqaro o'z qobiliyati va malakasiga mos ish tanlash huquqiga ega.

2. **Adolatli mehnat sharoitlarini yaratish** - xavfsiz va sog'lom mehnat sharoitlari, oqilona ish vaqti va dam olish vaqti.

3. **Mehnat munosabatlarini tartibga solish** - ish beruvchi va xodim o'rtasidagi huquq va majburiyatlarni belgilash.

4. **Ijtimoiy sheriklikni rivojlantirish** - kasaba uyushmalari, ish beruvchilar birlashmalari va davlat o'rtasida hamkorlik.
  `,
  authorComment: `
Ushbu modda mehnat qonunchiligining asosiy maqsadlarini belgilaydi. Bu modda O'zbekiston Respublikasi Konstitutsiyasining 37-moddasiga asoslanadi, unda har bir fuqaroning mehnat qilish huquqi kafolatlangan.
  `,
  expertComment: `
Amaliyotda bu modda ish beruvchi va xodim o'rtasidagi nizolarni hal qilishda muhim ahamiyat kasb etadi. Sud amaliyotida ushbu moddaga ko'pincha murojaat qilinadi.
  `,
  lastUpdated: '2024-01-15',
  isVerified: true,
  relatedArticles: [2, 3, 4],
});

export function ArticleDetail({ params: { locale, id } }: ArticleDetailProps) {
  const t = useTranslations();
  const tArticle = useTranslations('article');
  const tCommon = useTranslations('common');
  const article = getArticle(id);

  return (
    <div className="py-6 sm:py-8 md:py-12 bg-gov-light min-h-screen">
      <div className="section-container">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6 flex-wrap"
        >
          <Link href={`/${locale}`} className="hover:text-primary-600 transition-colors">
            {t('nav.home')}
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <Link href={`/${locale}/articles`} className="hover:text-primary-600 transition-colors">
            {t('nav.articles')}
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-text-primary font-medium">
            {tArticle('articleNumber')} {article.articleNumber}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Main Article Card */}
            <Card padding="lg" className="p-4 sm:p-6">
              {/* Header */}
              <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gov-border">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Badge variant="secondary" size="sm" className="text-xs">
                    {tArticle('section')} {article.sectionNumber}
                  </Badge>
                  <Badge variant="primary" size="sm" className="text-xs">
                    {tArticle('chapter')} {article.chapterNumber}
                  </Badge>
                  <Badge variant="gold" size="sm" className="text-xs">
                    {tArticle('articleNumber')} {article.articleNumber}
                  </Badge>
                  {article.isVerified && (
                    <Badge variant="success" size="sm" icon="shield" className="text-xs">
                      <span className="hidden sm:inline">{tCommon('verifiedByGov')}</span>
                      <span className="sm:hidden">✓</span>
                    </Badge>
                  )}
                </div>
                <h1 className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-text-secondary">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{tArticle('lastUpdated')}: {formatDate(article.lastUpdated, locale)}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="mb-4 sm:mb-6">
                <h2 className="font-heading font-semibold text-base sm:text-lg text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  {tArticle('content')}
                </h2>
                <div className="prose prose-slate max-w-none text-sm sm:text-base">
                  {article.content.split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-text-primary leading-relaxed mb-3 sm:mb-4"
                      dangerouslySetInnerHTML={{ 
                        __html: paragraph
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/^\d+\.\s/, '<span class="text-primary-700 font-medium">$&</span>')
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 sm:pt-6 border-t border-gov-border flex flex-wrap gap-2 sm:gap-3">
                <Button variant="outline" size="sm" leftIcon={<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} className="text-xs sm:text-sm">
                  Share
                </Button>
                <Button variant="outline" size="sm" leftIcon={<Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} className="text-xs sm:text-sm">
                  Save
                </Button>
              </div>
            </Card>

            {/* Author Commentary */}
            <Card padding="lg" className="p-4 sm:p-6">
              <h2 className="font-heading font-semibold text-base sm:text-lg text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                {tArticle('authorComment')}
              </h2>
              <div className="bg-primary-50 rounded-lg p-3 sm:p-4 border-l-4 border-primary-500">
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  {article.authorComment}
                </p>
              </div>
            </Card>

            {/* Expert Commentary */}
            <Card padding="lg" className="p-4 sm:p-6">
              <h2 className="font-heading font-semibold text-base sm:text-lg text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent-gold" />
                {tArticle('expertComment')}
              </h2>
              <div className="bg-accent-light rounded-lg p-3 sm:p-4 border-l-4 border-accent-gold">
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  {article.expertComment}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Official Source Badge */}
            <Card className="p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <GovEmblem size="md" />
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-sm sm:text-base text-text-primary">
                    {tCommon('officialPortal')}
                  </p>
                  <p className="text-xs sm:text-sm text-text-secondary truncate">
                    {t('header.subtitle')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Related Articles */}
            <Card className="p-4">
              <h3 className="font-heading font-semibold text-sm sm:text-base text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                {tArticle('relatedArticles')}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {article.relatedArticles.map((relatedId) => (
                  <Link
                    key={relatedId}
                    href={`/${locale}/articles/${relatedId}`}
                    className="block p-2.5 sm:p-3 rounded-lg bg-gov-light hover:bg-primary-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-text-primary group-hover:text-primary-700">
                        {tArticle('articleNumber')} {relatedId}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted group-hover:text-primary-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Back Button */}
            <Link href={`/${locale}/articles`}>
              <Button variant="ghost" size="sm" className="w-full text-sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                {tCommon('backToHome')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
