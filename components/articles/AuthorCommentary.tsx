'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, User, Calendar, Quote, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/date-utils';

interface AuthorCommentaryProps {
  locale: string;
  hasCommentary: boolean;
}

// Mock author data
const authorData = {
  name: {
    uz: "Aziz Karimov",
    ru: "Азиз Каримов",
    en: "Aziz Karimov"
  },
  title: {
    uz: "Huquqshunoslik fanlari doktori, professor",
    ru: "Доктор юридических наук, профессор",
    en: "Doctor of Law, Professor"
  },
  organization: {
    uz: "O'zbekiston Milliy Universiteti",
    ru: "Национальный Университет Узбекистана",
    en: "National University of Uzbekistan"
  },
  avatar: "/images/author-placeholder.jpg",
  date: "2024-01-15"
};

const commentaryContent: Record<string, string> = {
  uz: `Ushbu moddaning amaliy ahamiyati shundaki, u mehnat huquqining asosiy tamoyillarini belgilab beradi va ish beruvchi hamda xodim o'rtasidagi munosabatlarning huquqiy asosini yaratadi.

Amaliyotda bu modda quyidagi hollarda qo'llaniladi:

**Birinchidan**, mehnat shartnomasi tuzilayotganda taraflarning huquq va majburiyatlarini aniqlashda asosiy mezon sifatida xizmat qiladi.

**Ikkinchidan**, mehnat nizolari yuzaga kelganda sud va boshqa vakolatli organlar tomonidan huquqiy asos sifatida qo'llaniladi.

**Uchinchidan**, ish beruvchilarning ichki mehnat tartibini ishlab chiqishda yo'naltiruvchi hujjat bo'lib xizmat qiladi.

Xalqaro tajribaga nazar tashlaydigan bo'lsak, bu tamoyillar Xalqaro Mehnat Tashkilotining konventsiyalariga mos keladi va jahon standartlariga javob beradi.`,
  ru: `Практическое значение данной статьи заключается в том, что она определяет основные принципы трудового права и создает правовую основу отношений между работодателем и работником.

На практике эта статья применяется в следующих случаях:

**Во-первых**, при заключении трудового договора она служит основным критерием для определения прав и обязанностей сторон.

**Во-вторых**, при возникновении трудовых споров она используется судами и другими уполномоченными органами в качестве правовой основы.

**В-третьих**, она служит руководящим документом при разработке работодателями внутреннего трудового распорядка.

Обращаясь к международному опыту, эти принципы соответствуют конвенциям Международной организации труда и отвечают мировым стандартам.`,
  en: `The practical significance of this article is that it defines the basic principles of labor law and creates the legal basis for relations between the employer and the employee.

In practice, this article is applied in the following cases:

**First**, when concluding an employment contract, it serves as the main criterion for determining the rights and obligations of the parties.

**Second**, when labor disputes arise, it is used by courts and other authorized bodies as a legal basis.

**Third**, it serves as a guiding document for employers when developing internal labor regulations.

Looking at international experience, these principles comply with the conventions of the International Labour Organization and meet world standards.`
};

export function AuthorCommentary({ locale, hasCommentary }: AuthorCommentaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!hasCommentary) {
    return (
      <motion.section
        id="author"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-gov-surface border border-gov-border rounded-xl p-6 text-center">
          <User className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">
            Ushbu moddaga muallif sharhi hali qo'shilmagan
          </p>
        </div>
      </motion.section>
    );
  }

  const name = authorData.name[locale as keyof typeof authorData.name] || authorData.name.uz;
  const title = authorData.title[locale as keyof typeof authorData.title] || authorData.title.uz;
  const organization = authorData.organization[locale as keyof typeof authorData.organization] || authorData.organization.uz;
  const commentary = commentaryContent[locale] || commentaryContent.uz;

  // Process content to highlight bold text
  const formatCommentary = (text: string) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      const processedText = paragraph.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-primary-700 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <p key={index} className="text-text-primary leading-relaxed mb-4 last:mb-0">
          {processedText}
        </p>
      );
    });
  };

  return (
    <motion.section
      id="author"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-primary-100 text-primary-800 rounded-t-xl border border-b-0 border-primary-200"
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5" />
          <h2 className="font-heading text-lg font-semibold">
            Muallif sharhi
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
          'bg-gov-surface border border-primary-200 rounded-b-xl',
          'border-l-4 border-l-primary-500'
        )}>
          {/* Author Info */}
          <div className="p-6 border-b border-gov-border bg-primary-50/50">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-text-primary text-lg">
                  {name}
                </h3>
                <p className="text-text-secondary text-sm mb-1">
                  {title}
                </p>
                <p className="text-text-muted text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {organization}
                </p>
              </div>

              {/* Date - using suppressHydrationWarning to avoid mismatch */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-text-muted">
                <Calendar className="w-4 h-4" />
                <span suppressHydrationWarning>
                  {formatDate(authorData.date)}
                </span>
              </div>
            </div>
          </div>

          {/* Commentary Text */}
          <div className="p-6">
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary-200 transform rotate-180" />
              <div className="pl-6">
                {formatCommentary(commentary)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default AuthorCommentary;





