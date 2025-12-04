// Mock Data Types
export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

export interface Section {
  id: number;
  number: string;
  title: LocalizedString;
}

export interface Chapter {
  id: number;
  number: string;
  title: LocalizedString;
  sectionId: number;
}

export interface Article {
  id: number;
  number: string;
  section: Section;
  chapter: Chapter;
  title: LocalizedString;
  content: LocalizedString;
  excerpt: LocalizedString;
  hasAuthorComment: boolean;
  hasExpertComment: boolean;
  translations: ('uz' | 'ru' | 'en')[];
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// Sections Data
export const sections: Section[] = [
  { id: 1, number: 'I', title: { uz: "Umumiy qoidalar", ru: "Общие положения", en: "General Provisions" } },
  { id: 2, number: 'II', title: { uz: "Mehnat shartnomasi", ru: "Трудовой договор", en: "Employment Contract" } },
  { id: 3, number: 'III', title: { uz: "Ish vaqti", ru: "Рабочее время", en: "Working Hours" } },
  { id: 4, number: 'IV', title: { uz: "Dam olish vaqti", ru: "Время отдыха", en: "Rest Time" } },
  { id: 5, number: 'V', title: { uz: "Mehnat haqi", ru: "Оплата труда", en: "Wages" } },
  { id: 6, number: 'VI', title: { uz: "Mehnat intizomi", ru: "Трудовая дисциплина", en: "Labor Discipline" } },
];

// Chapters Data
export const chapters: Chapter[] = [
  { id: 1, number: '1', title: { uz: "Mehnat qonunchiligi", ru: "Трудовое законодательство", en: "Labor Legislation" }, sectionId: 1 },
  { id: 2, number: '2', title: { uz: "Mehnat munosabatlari", ru: "Трудовые отношения", en: "Labor Relations" }, sectionId: 1 },
  { id: 3, number: '3', title: { uz: "Ijtimoiy sheriklik", ru: "Социальное партнерство", en: "Social Partnership" }, sectionId: 1 },
  { id: 4, number: '4', title: { uz: "Mehnat shartnomasi tushunchasi", ru: "Понятие трудового договора", en: "Concept of Employment Contract" }, sectionId: 2 },
  { id: 5, number: '5', title: { uz: "Mehnat shartnomasini tuzish", ru: "Заключение трудового договора", en: "Concluding Employment Contract" }, sectionId: 2 },
  { id: 6, number: '6', title: { uz: "Mehnat shartnomasini o'zgartirish", ru: "Изменение трудового договора", en: "Amending Employment Contract" }, sectionId: 2 },
  { id: 7, number: '7', title: { uz: "Ish vaqti normalari", ru: "Нормы рабочего времени", en: "Working Time Standards" }, sectionId: 3 },
  { id: 8, number: '8', title: { uz: "Ish tartibi", ru: "Режим работы", en: "Work Schedule" }, sectionId: 3 },
  { id: 9, number: '9', title: { uz: "Dam olish turlari", ru: "Виды отдыха", en: "Types of Rest" }, sectionId: 4 },
  { id: 10, number: '10', title: { uz: "Mehnat ta'tili", ru: "Трудовой отпуск", en: "Labor Vacation" }, sectionId: 4 },
];

// Generate Mock Articles
export const articles: Article[] = [
  {
    id: 1,
    number: '1',
    section: sections[0],
    chapter: chapters[0],
    title: {
      uz: "Mehnat qonunchiligi va uning vazifalari",
      ru: "Трудовое законодательство и его задачи",
      en: "Labor Legislation and Its Tasks"
    },
    content: {
      uz: "O'zbekiston Respublikasining mehnat qonunchiligi fuqarolarning mehnat qilish huquqini ta'minlash...",
      ru: "Трудовое законодательство Республики Узбекистан обеспечивает право граждан на труд...",
      en: "The labor legislation of the Republic of Uzbekistan ensures the right of citizens to work..."
    },
    excerpt: {
      uz: "O'zbekiston Respublikasining mehnat qonunchiligi fuqarolarning mehnat qilish huquqini ta'minlash, mehnat munosabatlarini tartibga solish vazifalarini bajaradi.",
      ru: "Трудовое законодательство Республики Узбекистан обеспечивает право граждан на труд, регулирует трудовые отношения.",
      en: "The labor legislation of the Republic of Uzbekistan ensures the right of citizens to work and regulates labor relations."
    },
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    number: '2',
    section: sections[0],
    chapter: chapters[0],
    title: {
      uz: "Mehnat qonunchiligi doirasi",
      ru: "Сфера трудового законодательства",
      en: "Scope of Labor Legislation"
    },
    content: {
      uz: "Ushbu Kodeks mehnat shartnomasi asosida ishlaydigan barcha xodimlarga qo'llaniladi...",
      ru: "Настоящий Кодекс применяется ко всем работникам, работающим на основании трудового договора...",
      en: "This Code applies to all employees working under an employment contract..."
    },
    excerpt: {
      uz: "Ushbu Kodeks mehnat shartnomasi asosida ishlaydigan barcha xodimlarga va ularning ish beruvchilariga nisbatan qo'llaniladi.",
      ru: "Настоящий Кодекс применяется ко всем работникам и их работодателям, работающим на основании трудового договора.",
      en: "This Code applies to all employees and their employers working under an employment contract."
    },
    hasAuthorComment: true,
    hasExpertComment: false,
    translations: ['uz', 'ru', 'en'],
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    number: '3',
    section: sections[0],
    chapter: chapters[0],
    title: {
      uz: "Mehnat to'g'risidagi qonun hujjatlari",
      ru: "Законодательные акты о труде",
      en: "Legislative Acts on Labor"
    },
    content: {
      uz: "Mehnat to'g'risidagi qonun hujjatlari ushbu Kodeks va boshqa qonun hujjatlaridan iborat...",
      ru: "Законодательные акты о труде состоят из настоящего Кодекса и других законодательных актов...",
      en: "Legislative acts on labor consist of this Code and other legislative acts..."
    },
    excerpt: {
      uz: "Mehnat to'g'risidagi qonun hujjatlari ushbu Kodeks va boshqa qonun hujjatlaridan iborat.",
      ru: "Законодательные акты о труде состоят из настоящего Кодекса и других законодательных актов.",
      en: "Legislative acts on labor consist of this Code and other legislative acts."
    },
    hasAuthorComment: false,
    hasExpertComment: true,
    translations: ['uz', 'ru'],
    status: 'published',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: 4,
    number: '4',
    section: sections[0],
    chapter: chapters[1],
    title: {
      uz: "Mehnat munosabatlari tushunchasi",
      ru: "Понятие трудовых отношений",
      en: "Concept of Labor Relations"
    },
    content: {
      uz: "Mehnat munosabatlari - xodim va ish beruvchi o'rtasidagi munosabatlar...",
      ru: "Трудовые отношения - отношения между работником и работодателем...",
      en: "Labor relations are relationships between an employee and an employer..."
    },
    excerpt: {
      uz: "Mehnat munosabatlari - xodim va ish beruvchi o'rtasidagi munosabatlar bo'lib, ular mehnat shartnomasi asosida vujudga keladi.",
      ru: "Трудовые отношения - отношения между работником и работодателем, возникающие на основании трудового договора.",
      en: "Labor relations are relationships between an employee and an employer arising on the basis of an employment contract."
    },
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    status: 'published',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-15'
  },
  {
    id: 5,
    number: '5',
    section: sections[0],
    chapter: chapters[1],
    title: {
      uz: "Mehnat munosabatlarining taraflari",
      ru: "Стороны трудовых отношений",
      en: "Parties to Labor Relations"
    },
    content: {
      uz: "Mehnat munosabatlarining taraflari xodim va ish beruvchi hisoblanadi...",
      ru: "Сторонами трудовых отношений являются работник и работодатель...",
      en: "The parties to labor relations are the employee and the employer..."
    },
    excerpt: {
      uz: "Mehnat munosabatlarining taraflari xodim va ish beruvchi hisoblanadi. Xodim - jismoniy shaxs.",
      ru: "Сторонами трудовых отношений являются работник и работодатель. Работник - физическое лицо.",
      en: "The parties to labor relations are the employee and the employer. An employee is a natural person."
    },
    hasAuthorComment: false,
    hasExpertComment: false,
    translations: ['uz', 'ru', 'en'],
    status: 'published',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
];

// Generate more articles for pagination testing
for (let i = 6; i <= 50; i++) {
  const sectionIndex = Math.floor(Math.random() * sections.length);
  const section = sections[sectionIndex];
  const sectionChapters = chapters.filter(c => c.sectionId === section.id);
  const chapter = sectionChapters[Math.floor(Math.random() * sectionChapters.length)] || chapters[0];
  
  articles.push({
    id: i,
    number: String(i),
    section,
    chapter,
    title: {
      uz: `${i}-modda. Mehnat kodeksi qoidasi`,
      ru: `Статья ${i}. Положение Трудового кодекса`,
      en: `Article ${i}. Labor Code Provision`
    },
    content: {
      uz: `${i}-moddaning mazmuni...`,
      ru: `Содержание статьи ${i}...`,
      en: `Content of article ${i}...`
    },
    excerpt: {
      uz: `Bu ${i}-moddaning qisqacha mazmuni. Mehnat kodeksining muhim qoidalaridan biri.`,
      ru: `Краткое содержание статьи ${i}. Одно из важных положений Трудового кодекса.`,
      en: `Brief content of article ${i}. One of the important provisions of the Labor Code.`
    },
    hasAuthorComment: Math.random() > 0.5,
    hasExpertComment: Math.random() > 0.6,
    translations: Math.random() > 0.3 ? ['uz', 'ru', 'en'] : Math.random() > 0.5 ? ['uz', 'ru'] : ['uz'],
    status: 'published',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  });
}

// Helper functions
export function getLocalizedText(obj: LocalizedString, locale: string): string {
  return obj[locale as keyof LocalizedString] || obj.uz;
}

export function filterArticles(
  articles: Article[],
  filters: {
    search?: string;
    sectionId?: number;
    chapterId?: number;
    hasAuthorComment?: boolean;
    hasExpertComment?: boolean;
    translation?: string;
  }
): Article[] {
  return articles.filter(article => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesNumber = article.number.toLowerCase().includes(searchLower);
      const matchesTitle = 
        article.title.uz.toLowerCase().includes(searchLower) ||
        article.title.ru.toLowerCase().includes(searchLower) ||
        article.title.en.toLowerCase().includes(searchLower);
      if (!matchesNumber && !matchesTitle) return false;
    }
    
    // Section filter
    if (filters.sectionId && article.section.id !== filters.sectionId) return false;
    
    // Chapter filter
    if (filters.chapterId && article.chapter.id !== filters.chapterId) return false;
    
    // Comment filters
    if (filters.hasAuthorComment !== undefined && article.hasAuthorComment !== filters.hasAuthorComment) return false;
    if (filters.hasExpertComment !== undefined && article.hasExpertComment !== filters.hasExpertComment) return false;
    
    // Translation filter
    if (filters.translation && !article.translations.includes(filters.translation as 'uz' | 'ru' | 'en')) return false;
    
    return true;
  });
}



