import type { Section } from '@/types';

export const mockSections: Section[] = [
  {
    id: 1,
    number: 'I',
    title: {
      uz: 'Umumiy qoidalar',
      ru: 'Общие положения',
      en: 'General Provisions',
    },
    description: {
      uz: "Mehnat kodeksining maqsadi, vazifalari va asosiy tamoyillari. Mehnat munosabatlarining huquqiy asoslari.",
      ru: 'Цели, задачи и основные принципы Трудового кодекса. Правовые основы трудовых отношений.',
      en: 'Purpose, objectives and basic principles of the Labor Code. Legal foundations of labor relations.',
    },
    chaptersCount: 5,
    articlesCount: 28,
    icon: 'Scale',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 2,
    number: 'II',
    title: {
      uz: 'Mehnat shartnomasi',
      ru: 'Трудовой договор',
      en: 'Employment Contract',
    },
    description: {
      uz: "Mehnat shartnomasi tuzish, o'zgartirish va bekor qilish tartibi. Ishga qabul qilish va ishdan bo'shatish.",
      ru: 'Порядок заключения, изменения и расторжения трудового договора. Прием на работу и увольнение.',
      en: 'Procedure for concluding, amending and terminating employment contracts. Hiring and dismissal.',
    },
    chaptersCount: 6,
    articlesCount: 45,
    icon: 'FileSignature',
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },
  {
    id: 3,
    number: 'III',
    title: {
      uz: 'Ish vaqti va dam olish vaqti',
      ru: 'Рабочее время и время отдыха',
      en: 'Working Time and Rest Time',
    },
    description: {
      uz: "Ish vaqti normalari, dam olish kunlari, ta'tillar va qo'shimcha dam olish vaqtlari.",
      ru: 'Нормы рабочего времени, выходные дни, отпуска и дополнительное время отдыха.',
      en: 'Working time standards, days off, vacations and additional rest time.',
    },
    chaptersCount: 4,
    articlesCount: 38,
    icon: 'Clock',
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-28T09:45:00Z',
  },
  {
    id: 4,
    number: 'IV',
    title: {
      uz: 'Mehnat haqi',
      ru: 'Оплата труда',
      en: 'Remuneration',
    },
    description: {
      uz: "Mehnat haqini to'lash tartibi, minimal ish haqi, mukofotlar va qo'shimcha to'lovlar.",
      ru: 'Порядок выплаты заработной платы, минимальная оплата труда, премии и дополнительные выплаты.',
      en: 'Wage payment procedures, minimum wage, bonuses and additional payments.',
    },
    chaptersCount: 3,
    articlesCount: 32,
    icon: 'Banknote',
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T16:20:00Z',
  },
  {
    id: 5,
    number: 'V',
    title: {
      uz: 'Mehnat intizomi',
      ru: 'Трудовая дисциплина',
      en: 'Labor Discipline',
    },
    description: {
      uz: "Mehnat intizomi qoidalari, intizomiy javobgarlik turlari va ularni qo'llash tartibi.",
      ru: 'Правила трудовой дисциплины, виды дисциплинарной ответственности и порядок их применения.',
      en: 'Labor discipline rules, types of disciplinary liability and procedures for their application.',
    },
    chaptersCount: 2,
    articlesCount: 18,
    icon: 'Shield',
    order: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-08-15T11:30:00Z',
  },
  {
    id: 6,
    number: 'VI',
    title: {
      uz: 'Mehnat muhofazasi',
      ru: 'Охрана труда',
      en: 'Occupational Safety',
    },
    description: {
      uz: "Xavfsiz mehnat sharoitlarini ta'minlash, mehnatni muhofaza qilish standartlari va me'yorlari.",
      ru: 'Обеспечение безопасных условий труда, стандарты и нормы охраны труда.',
      en: 'Ensuring safe working conditions, occupational safety standards and regulations.',
    },
    chaptersCount: 4,
    articlesCount: 35,
    icon: 'HardHat',
    order: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-05T13:00:00Z',
  },
];

export default mockSections;




