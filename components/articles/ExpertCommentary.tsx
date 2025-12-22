'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  Calendar, 
  Quote, 
  BadgeCheck,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/date-utils';

interface ExpertCommentaryProps {
  locale: string;
  hasCommentary: boolean;
}

// Mock expert data
const expertData = {
  name: {
    uz: "Nodira Xolmatova",
    ru: "Нодира Холматова",
    en: "Nodira Kholmatova"
  },
  title: {
    uz: "Mehnat huquqi bo'yicha ekspert, Yuridik fanlar nomzodi",
    ru: "Эксперт по трудовому праву, кандидат юридических наук",
    en: "Labor Law Expert, PhD in Legal Sciences"
  },
  experience: {
    uz: "15 yillik amaliy tajriba",
    ru: "15 лет практического опыта",
    en: "15 years of practical experience"
  },
  date: "2024-02-20"
};

const expertContent: Record<string, string> = {
  uz: `**Sud amaliyoti tahlili:**

Oliy sudning 2023-yildagi ko'rsatmalariga ko'ra, ushbu moddaning qo'llanilishi quyidagi muhim jihatlarni o'z ichiga oladi:

1. Mehnat shartnomasini bekor qilishda ish beruvchi ushbu moddada belgilangan tamoyillarga rioya qilishi shart. Aks holda, sud xodimni ishga tiklashi mumkin.

2. Ish vaqtini belgilashda "adolatli mehnat sharoitlari" tamoyili asosiy mezon hisoblanadi. Haftalik 40 soatdan ortiq ish vaqti belgilash qonunga zid.

**Amaliy tavsiyalar:**

- Mehnat nizolarida bu moddaga havola qilish da'voni kuchaytirishga yordam beradi
- Ish beruvchilar ichki nizomlarini ushbu tamoyillarga moslashtirishlari lozim
- Kasaba uyushmalari bu moddani xodimlar huquqlarini himoya qilishda asosiy hujjat sifatida qo'llashlari mumkin

**Diqqat:** 2024-yildan boshlab bu moddaga qo'shimcha o'zgartirishlar kiritilishi kutilmoqda.`,
  ru: `**Анализ судебной практики:**

Согласно указаниям Верховного суда за 2023 год, применение данной статьи включает следующие важные аспекты:

1. При расторжении трудового договора работодатель обязан соблюдать принципы, установленные в данной статье. В противном случае суд может восстановить работника на работе.

2. При установлении рабочего времени принцип "справедливых условий труда" является основным критерием. Установление рабочего времени более 40 часов в неделю противоречит закону.

**Практические рекомендации:**

- Ссылка на эту статью в трудовых спорах помогает усилить иск
- Работодателям необходимо привести внутренние положения в соответствие с этими принципами
- Профсоюзы могут использовать эту статью как основной документ для защиты прав работников

**Внимание:** Начиная с 2024 года ожидаются дополнительные изменения в данную статью.`,
  en: `**Analysis of court practice:**

According to the Supreme Court guidelines for 2023, the application of this article includes the following important aspects:

1. When terminating an employment contract, the employer must comply with the principles established in this article. Otherwise, the court may reinstate the employee.

2. When setting working hours, the principle of "fair working conditions" is the main criterion. Setting working hours of more than 40 hours per week is contrary to law.

**Practical recommendations:**

- Referring to this article in labor disputes helps strengthen the claim
- Employers need to align their internal regulations with these principles
- Trade unions can use this article as the main document to protect workers' rights

**Attention:** Starting from 2024, additional amendments to this article are expected.`
};

export function ExpertCommentary({ locale, hasCommentary }: ExpertCommentaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!hasCommentary) {
    return (
      <motion.section
        id="expert"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-gov-surface border border-gov-border rounded-xl p-6 text-center">
          <Scale className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">
            Ushbu moddaga ekspert sharhi hali qo'shilmagan
          </p>
        </div>
      </motion.section>
    );
  }

  const name = expertData.name[locale as keyof typeof expertData.name] || expertData.name.uz;
  const title = expertData.title[locale as keyof typeof expertData.title] || expertData.title.uz;
  const experience = expertData.experience[locale as keyof typeof expertData.experience] || expertData.experience.uz;
  const commentary = expertContent[locale] || expertContent.uz;

  // Process content to highlight bold text
  const formatCommentary = (text: string) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a numbered point
      const isNumberedPoint = /^\d+\./.test(paragraph.trim());
      const isBulletPoint = /^-/.test(paragraph.trim());
      
      const processedText = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-accent-amber font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isNumberedPoint) {
        return (
          <div key={index} className="pl-6 mb-3 relative">
            <span className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-accent-gold/20 text-accent-amber text-xs font-medium flex items-center justify-center">
              {paragraph.match(/^\d+/)?.[0]}
            </span>
            <p className="text-text-primary leading-relaxed pl-2">
              {processedText}
            </p>
          </div>
        );
      }

      if (isBulletPoint) {
        return (
          <div key={index} className="pl-4 mb-2 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-amber mt-2 flex-shrink-0" />
            <p className="text-text-primary leading-relaxed">
              {processedText}
            </p>
          </div>
        );
      }

      return (
        <p key={index} className="text-text-primary leading-relaxed mb-4 last:mb-0">
          {processedText}
        </p>
      );
    });
  };

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
        className="w-full flex items-center justify-between p-4 bg-amber-100 text-amber-800 rounded-t-xl border border-b-0 border-amber-200"
      >
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5" />
          <h2 className="font-heading text-lg font-semibold">
            Ekspert sharhi
          </h2>
          <Badge variant="gold" size="sm">
            Amaliyotga asoslangan
          </Badge>
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
          'bg-gov-surface border border-amber-200 rounded-b-xl',
          'border-l-4 border-l-accent-gold'
        )}>
          {/* Expert Info */}
          <div className="p-6 border-b border-gov-border bg-amber-50/50">
            <div className="flex items-start gap-4">
              {/* Avatar with Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden">
                  <Scale className="w-8 h-8 text-amber-700" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-gold flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-text-primary text-lg">
                    {name}
                  </h3>
                  <Badge variant="gold" size="sm">
                    Ekspert
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm mb-1">
                  {title}
                </p>
                <p className="text-text-muted text-sm flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {experience}
                </p>
              </div>

              {/* Date - using suppressHydrationWarning to avoid mismatch */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-text-muted">
                <Calendar className="w-4 h-4" />
                <span suppressHydrationWarning>
                  {formatDate(expertData.date)}
                </span>
              </div>
            </div>
          </div>

          {/* Commentary Text */}
          <div className="p-6">
            {formatCommentary(commentary)}

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Eslatma:</strong> Ushbu sharh huquqiy maslahat hisoblanmaydi. 
                  Muayyan holat uchun malakali huquqshunos bilan maslahatlashing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ExpertCommentary;





