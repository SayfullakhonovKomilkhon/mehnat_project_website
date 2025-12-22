import type { Chapter } from '@/types';

export const mockChapters: Chapter[] = [
  // ============================================
  // SECTION I: Umumiy qoidalar (General Provisions)
  // ============================================
  {
    id: 1,
    sectionId: 1,
    number: '1',
    title: {
      uz: 'Asosiy qoidalar',
      ru: 'Основные положения',
      en: 'Basic Provisions',
    },
    description: {
      uz: "Mehnat kodeksining maqsadi va vazifalari",
      ru: 'Цели и задачи Трудового кодекса',
      en: 'Purpose and objectives of the Labor Code',
    },
    articlesCount: 8,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 2,
    sectionId: 1,
    number: '2',
    title: {
      uz: 'Mehnat munosabatlarining sub\'ektlari',
      ru: 'Субъекты трудовых отношений',
      en: 'Subjects of Labor Relations',
    },
    articlesCount: 6,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 3,
    sectionId: 1,
    number: '3',
    title: {
      uz: 'Mehnat huquqining asosiy tamoyillari',
      ru: 'Основные принципы трудового права',
      en: 'Basic Principles of Labor Law',
    },
    articlesCount: 5,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 4,
    sectionId: 1,
    number: '4',
    title: {
      uz: 'Mehnat sohasida kamsitishni taqiqlash',
      ru: 'Запрещение дискриминации в сфере труда',
      en: 'Prohibition of Discrimination in Employment',
    },
    articlesCount: 4,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 5,
    sectionId: 1,
    number: '5',
    title: {
      uz: 'Mehnat to\'g\'risidagi qonun hujjatlari',
      ru: 'Законодательные акты о труде',
      en: 'Labor Legislation',
    },
    articlesCount: 5,
    order: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },

  // ============================================
  // SECTION II: Mehnat shartnomasi (Employment Contract)
  // ============================================
  {
    id: 6,
    sectionId: 2,
    number: '6',
    title: {
      uz: 'Mehnat shartnomasi tushunchasi va turlari',
      ru: 'Понятие и виды трудового договора',
      en: 'Concept and Types of Employment Contract',
    },
    articlesCount: 8,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },
  {
    id: 7,
    sectionId: 2,
    number: '7',
    title: {
      uz: 'Mehnat shartnomasini tuzish',
      ru: 'Заключение трудового договора',
      en: 'Conclusion of Employment Contract',
    },
    articlesCount: 10,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },
  {
    id: 8,
    sectionId: 2,
    number: '8',
    title: {
      uz: 'Mehnat shartnomasini o\'zgartirish',
      ru: 'Изменение трудового договора',
      en: 'Amendment of Employment Contract',
    },
    articlesCount: 7,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },
  {
    id: 9,
    sectionId: 2,
    number: '9',
    title: {
      uz: 'Mehnat shartnomasini bekor qilish',
      ru: 'Прекращение трудового договора',
      en: 'Termination of Employment Contract',
    },
    articlesCount: 12,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },
  {
    id: 10,
    sectionId: 2,
    number: '10',
    title: {
      uz: 'Sinov muddati',
      ru: 'Испытательный срок',
      en: 'Probationary Period',
    },
    articlesCount: 4,
    order: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },
  {
    id: 11,
    sectionId: 2,
    number: '11',
    title: {
      uz: 'Mehnat daftarchasi',
      ru: 'Трудовая книжка',
      en: 'Employment Record Book',
    },
    articlesCount: 4,
    order: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-20T14:15:00Z',
  },

  // ============================================
  // SECTION III: Ish vaqti va dam olish (Working Time)
  // ============================================
  {
    id: 12,
    sectionId: 3,
    number: '12',
    title: {
      uz: 'Ish vaqti',
      ru: 'Рабочее время',
      en: 'Working Time',
    },
    articlesCount: 12,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-28T09:45:00Z',
  },
  {
    id: 13,
    sectionId: 3,
    number: '13',
    title: {
      uz: 'Dam olish vaqti',
      ru: 'Время отдыха',
      en: 'Rest Time',
    },
    articlesCount: 8,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-28T09:45:00Z',
  },
  {
    id: 14,
    sectionId: 3,
    number: '14',
    title: {
      uz: 'Mehnat ta\'tillari',
      ru: 'Трудовые отпуска',
      en: 'Annual Leave',
    },
    articlesCount: 10,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-28T09:45:00Z',
  },
  {
    id: 15,
    sectionId: 3,
    number: '15',
    title: {
      uz: 'Ijtimoiy ta\'tillar',
      ru: 'Социальные отпуска',
      en: 'Social Leave',
    },
    articlesCount: 8,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-28T09:45:00Z',
  },

  // ============================================
  // SECTION IV: Mehnat haqi (Remuneration)
  // ============================================
  {
    id: 16,
    sectionId: 4,
    number: '16',
    title: {
      uz: 'Mehnat haqini tashkil etish',
      ru: 'Организация оплаты труда',
      en: 'Organization of Remuneration',
    },
    articlesCount: 12,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T16:20:00Z',
  },
  {
    id: 17,
    sectionId: 4,
    number: '17',
    title: {
      uz: 'Mehnat haqi kafolatlari',
      ru: 'Гарантии оплаты труда',
      en: 'Wage Guarantees',
    },
    articlesCount: 10,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T16:20:00Z',
  },
  {
    id: 18,
    sectionId: 4,
    number: '18',
    title: {
      uz: 'Ish haqidan ushlab qolish',
      ru: 'Удержания из заработной платы',
      en: 'Wage Deductions',
    },
    articlesCount: 10,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T16:20:00Z',
  },

  // ============================================
  // SECTION V: Mehnat intizomi (Labor Discipline)
  // ============================================
  {
    id: 19,
    sectionId: 5,
    number: '19',
    title: {
      uz: 'Mehnat intizomi qoidalari',
      ru: 'Правила трудовой дисциплины',
      en: 'Labor Discipline Rules',
    },
    articlesCount: 10,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-08-15T11:30:00Z',
  },
  {
    id: 20,
    sectionId: 5,
    number: '20',
    title: {
      uz: 'Intizomiy javobgarlik',
      ru: 'Дисциплинарная ответственность',
      en: 'Disciplinary Liability',
    },
    articlesCount: 8,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-08-15T11:30:00Z',
  },

  // ============================================
  // SECTION VI: Mehnat muhofazasi (Occupational Safety)
  // ============================================
  {
    id: 21,
    sectionId: 6,
    number: '21',
    title: {
      uz: 'Mehnat muhofazasi asoslari',
      ru: 'Основы охраны труда',
      en: 'Fundamentals of Occupational Safety',
    },
    articlesCount: 10,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-05T13:00:00Z',
  },
  {
    id: 22,
    sectionId: 6,
    number: '22',
    title: {
      uz: 'Xavfsiz mehnat sharoitlari',
      ru: 'Безопасные условия труда',
      en: 'Safe Working Conditions',
    },
    articlesCount: 10,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-05T13:00:00Z',
  },
  {
    id: 23,
    sectionId: 6,
    number: '23',
    title: {
      uz: 'Ishlab chiqarishdagi baxtsiz hodisalar',
      ru: 'Несчастные случаи на производстве',
      en: 'Workplace Accidents',
    },
    articlesCount: 8,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-05T13:00:00Z',
  },
  {
    id: 24,
    sectionId: 6,
    number: '24',
    title: {
      uz: 'Ayollar va yoshlar mehnatini muhofaza qilish',
      ru: 'Охрана труда женщин и молодежи',
      en: 'Protection of Women and Youth Labor',
    },
    articlesCount: 7,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-05T13:00:00Z',
  },
];

export default mockChapters;





