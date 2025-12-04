'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Article, getLocalizedText } from '@/lib/mock-data';

interface ArticleContentProps {
  article: Article;
  locale: string;
}

// Extended mock content for demonstration
const mockLegalText: Record<string, string> = {
  uz: `O'zbekiston Respublikasining mehnat qonunchiligi fuqarolarning mehnat qilish huquqini ta'minlash, mehnat munosabatlarini tartibga solish vazifalarini bajaradi.

Mehnat qonunchiligi quyidagi asosiy tamoyillarga asoslanadi:

1. **Mehnat erkinligi** - har bir fuqaroning o'z mehnat qobiliyatlarini erkin tasarruf etish, kasb va faoliyat turini erkin tanlash huquqi;

2. **Majburiy mehnatning taqiqlanishi** - har qanday majburiy mehnatga jalb etishning taqiqlanishi, qonunda belgilangan hollar bundan mustasno;

3. **Mehnat sharoitlarining adolatli bo'lishi** - xavfsiz va sog'lom mehnat sharoitlari, adolatli ish haqi, to'liq bandlik;

4. **Kasbiy o'sish imkoniyatlari** - malaka oshirish, qayta tayyorlash va professional rivojlanish huquqi;

5. **Kasaba uyushmalariga birlashish** - xodimlarning o'z huquqlarini himoya qilish uchun kasaba uyushmalariga birlashish huquqi.

Ushbu modda O'zbekiston Respublikasi Konstitutsiyasining 37-moddasiga muvofiq ishlab chiqilgan bo'lib, fuqarolarning mehnat qilish huquqini kafolatlaydi.`,
  ru: `Трудовое законодательство Республики Узбекистан обеспечивает право граждан на труд, регулирует трудовые отношения.

Трудовое законодательство основывается на следующих принципах:

1. **Свобода труда** - право каждого гражданина свободно распоряжаться своими способностями к труду, выбирать профессию и род деятельности;

2. **Запрет принудительного труда** - запрещение привлечения к принудительному труду, за исключением случаев, установленных законом;

3. **Справедливые условия труда** - безопасные и здоровые условия труда, справедливая оплата труда, полная занятость;

4. **Возможности профессионального роста** - право на повышение квалификации, переподготовку и профессиональное развитие;

5. **Объединение в профсоюзы** - право работников объединяться в профсоюзы для защиты своих прав.

Данная статья разработана в соответствии со статьей 37 Конституции Республики Узбекистан и гарантирует право граждан на труд.`,
  en: `The labor legislation of the Republic of Uzbekistan ensures the right of citizens to work and regulates labor relations.

Labor legislation is based on the following principles:

1. **Freedom of labor** - the right of every citizen to freely dispose of their abilities to work, to choose a profession and type of activity;

2. **Prohibition of forced labor** - prohibition of involvement in forced labor, except in cases established by law;

3. **Fair working conditions** - safe and healthy working conditions, fair wages, full employment;

4. **Opportunities for professional growth** - the right to advanced training, retraining and professional development;

5. **Trade union membership** - the right of employees to join trade unions to protect their rights.

This article was developed in accordance with Article 37 of the Constitution of the Republic of Uzbekistan and guarantees the right of citizens to work.`
};

export function ArticleContent({ article, locale }: ArticleContentProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Use mock legal text for demonstration
  const content = mockLegalText[locale] || mockLegalText.uz;

  // Process content to highlight key terms and format properly
  const formatContent = (text: string) => {
    // Split into paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a numbered point
      const isNumberedPoint = /^\d+\./.test(paragraph.trim());
      
      // Process bold text
      const processedText = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-primary-800 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isNumberedPoint) {
        return (
          <div key={index} className="pl-6 mb-4 relative">
            <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium flex items-center justify-center">
              {paragraph.match(/^\d+/)?.[0]}
            </span>
            <p className="text-text-primary leading-[1.8] pl-4">
              {processedText}
            </p>
          </div>
        );
      }

      return (
        <p key={index} className="text-text-primary leading-[1.8] mb-4 text-justify">
          {processedText}
        </p>
      );
    });
  };

  return (
    <motion.section
      id="content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-primary-800 text-white rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" />
          <h2 className="font-heading text-lg font-semibold">
            Modda mazmuni
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className={cn(
          'bg-gov-surface border border-t-0 border-gov-border rounded-b-xl',
          'p-6 md:p-8'
        )}>
          {/* Legal Text Container */}
          <div className={cn(
            'prose prose-lg max-w-none',
            'font-serif', // Serif font for legal text
            'text-[1.0625rem]', // Slightly larger text
            'selection:bg-primary-100 selection:text-primary-900'
          )}>
            {formatContent(content)}
          </div>

          {/* Article Reference */}
          <div className="mt-8 pt-6 border-t border-gov-border">
            <p className="text-sm text-text-muted italic">
              * Ushbu modda O'zbekiston Respublikasining 1995-yil 21-dekabrdagi 
              Mehnat kodeksining asl nusxasidan olingan.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ArticleContent;



