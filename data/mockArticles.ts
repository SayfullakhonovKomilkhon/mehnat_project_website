import type { Article } from '@/types';

export const mockArticles: Article[] = [
  // ============================================
  // SECTION I - CHAPTER 1: Asosiy qoidalar
  // ============================================
  {
    id: 1,
    number: '1',
    sectionId: 1,
    chapterId: 1,
    section: { id: 1, number: 'I', title: { uz: 'Umumiy qoidalar', ru: 'Общие положения', en: 'General Provisions' } },
    chapter: { id: 1, number: '1', title: { uz: 'Asosiy qoidalar', ru: 'Основные положения', en: 'Basic Provisions' } },
    title: {
      uz: 'Mehnat kodeksining maqsadi',
      ru: 'Цель Трудового кодекса',
      en: 'Purpose of the Labor Code',
    },
    content: {
      uz: `Mazkur Kodeksning maqsadi fuqarolarning mehnat qilish huquqini amalga oshirish bilan bog'liq munosabatlarni, mehnat munosabatlari ishtirokchilarining huquq va manfaatlarini himoya qilish, xavfsiz mehnat sharoitlarini, adolatli mehnat haqini ta'minlash hamda mehnat sohasidagi boshqa munosabatlarni tartibga solishdan iborat.

Mehnat kodeksi quyidagi asosiy vazifalarni bajaradi:
1) fuqarolarning erkin mehnat qilish huquqini ta'minlash;
2) mehnat munosabatlari ishtirokchilarining huquqlari va qonuniy manfaatlarini himoya qilish;
3) qulay mehnat sharoitlarini yaratish;
4) mehnat haqini o'z vaqtida va to'liq miqdorda to'lashni ta'minlash.`,
      ru: `Целью настоящего Кодекса является регулирование отношений, связанных с реализацией гражданами права на труд, защита прав и интересов участников трудовых отношений, обеспечение безопасных условий труда, справедливой оплаты труда, а также регулирование иных отношений в сфере труда.

Трудовой кодекс выполняет следующие основные задачи:
1) обеспечение права граждан на свободный труд;
2) защита прав и законных интересов участников трудовых отношений;
3) создание благоприятных условий труда;
4) обеспечение своевременной и полной выплаты заработной платы.`,
      en: `The purpose of this Code is to regulate relations connected with the exercise of citizens' right to work, protect the rights and interests of participants in labor relations, ensure safe working conditions, fair wages, and regulate other relations in the field of labor.

The Labor Code performs the following main tasks:
1) ensuring citizens' right to free labor;
2) protecting the rights and legitimate interests of participants in labor relations;
3) creating favorable working conditions;
4) ensuring timely and full payment of wages.`,
    },
    excerpt: {
      uz: "Mehnat kodeksining maqsadi va asosiy vazifalari haqida",
      ru: 'О цели и основных задачах Трудового кодекса',
      en: 'About the purpose and main tasks of the Labor Code',
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    viewCount: 15420,
    lastUpdated: '2024-10-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 2,
    number: '2',
    sectionId: 1,
    chapterId: 1,
    section: { id: 1, number: 'I', title: { uz: 'Umumiy qoidalar', ru: 'Общие положения', en: 'General Provisions' } },
    chapter: { id: 1, number: '1', title: { uz: 'Asosiy qoidalar', ru: 'Основные положения', en: 'Basic Provisions' } },
    title: {
      uz: 'Mehnat to\'g\'risidagi qonun hujjatlari',
      ru: 'Законодательство о труде',
      en: 'Labor Legislation',
    },
    content: {
      uz: `Mehnat to'g'risidagi qonun hujjatlari O'zbekiston Respublikasining Konstitutsiyasidan, mazkur Kodeksdan va boshqa qonunlardan, O'zbekiston Respublikasi Prezidentining farmonlari va qarorlaridan, Vazirlar Mahkamasining qarorlaridan, shuningdek boshqa normativ-huquqiy hujjatlardan iborat.

Agar O'zbekiston Respublikasining xalqaro shartnomasida mazkur Kodeksda nazarda tutilganidan boshqacha qoidalar belgilangan bo'lsa, xalqaro shartnoma qoidalari qo'llaniladi.`,
      ru: `Законодательство о труде состоит из Конституции Республики Узбекистан, настоящего Кодекса и иных законов, указов и постановлений Президента Республики Узбекистан, постановлений Кабинета Министров, а также других нормативно-правовых актов.

Если международным договором Республики Узбекистан установлены иные правила, чем предусмотренные настоящим Кодексом, применяются правила международного договора.`,
      en: `Labor legislation consists of the Constitution of the Republic of Uzbekistan, this Code and other laws, decrees and resolutions of the President of the Republic of Uzbekistan, resolutions of the Cabinet of Ministers, as well as other regulatory legal acts.

If an international treaty of the Republic of Uzbekistan establishes rules other than those provided for by this Code, the rules of the international treaty shall apply.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: false,
    translations: ['uz', 'ru', 'en'],
    viewCount: 8932,
    lastUpdated: '2024-09-20T14:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-20T14:00:00Z',
  },
  {
    id: 3,
    number: '3',
    sectionId: 1,
    chapterId: 1,
    section: { id: 1, number: 'I', title: { uz: 'Umumiy qoidalar', ru: 'Общие положения', en: 'General Provisions' } },
    chapter: { id: 1, number: '1', title: { uz: 'Asosiy qoidalar', ru: 'Основные положения', en: 'Basic Provisions' } },
    title: {
      uz: 'Mehnat munosabatlari',
      ru: 'Трудовые отношения',
      en: 'Labor Relations',
    },
    content: {
      uz: `Mehnat munosabatlari — ish beruvchi bilan xodim o'rtasida xodimning shaxsan ma'lum bir mehnat vazifasini (kasb, mutaxassislik, lavozim bo'yicha ishni) bajarishi, ish beruvchi tomonidan belgilangan ichki mehnat tartibiga bo'ysunishi va ish beruvchining mehnat sharoitlarini ta'minlashi haqidagi kelishuvga asoslangan munosabatlardir.

Mehnat munosabatlari quyidagi asoslarda vujudga keladi:
1) mehnat shartnomasi tuzilganda;
2) tanlov (konkurs) asosida lavozimga tayinlanganda;
3) tayinlash yoki tasdiqlanish tartibida lavozimga tayinlanganda.`,
      ru: `Трудовые отношения — отношения, основанные на соглашении между работодателем и работником о личном выполнении работником за плату определенной трудовой функции (работы по должности, профессии, специальности), подчинении работника установленному работодателем внутреннему трудовому распорядку и обеспечении работодателем условий труда.

Трудовые отношения возникают на основании:
1) заключения трудового договора;
2) назначения на должность по конкурсу;
3) назначения или утверждения на должность.`,
      en: `Labor relations are relations based on an agreement between the employer and the employee on the personal performance by the employee of a certain labor function (work in a position, profession, specialty), the employee's subordination to the internal labor regulations established by the employer, and the employer's provision of working conditions.

Labor relations arise on the basis of:
1) conclusion of an employment contract;
2) appointment to a position by competition;
3) appointment or approval to a position.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    viewCount: 12543,
    lastUpdated: '2024-10-01T09:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-01T09:15:00Z',
  },

  // ============================================
  // SECTION II - CHAPTER 7: Mehnat shartnomasini tuzish
  // ============================================
  {
    id: 21,
    number: '21',
    sectionId: 2,
    chapterId: 7,
    section: { id: 2, number: 'II', title: { uz: 'Mehnat shartnomasi', ru: 'Трудовой договор', en: 'Employment Contract' } },
    chapter: { id: 7, number: '7', title: { uz: 'Mehnat shartnomasini tuzish', ru: 'Заключение трудового договора', en: 'Conclusion of Employment Contract' } },
    title: {
      uz: 'Mehnat shartnomasi tushunchasi',
      ru: 'Понятие трудового договора',
      en: 'Concept of Employment Contract',
    },
    content: {
      uz: `Mehnat shartnomasi — bu xodim va ish beruvchi o'rtasidagi kelishuv bo'lib, unga muvofiq ish beruvchi xodimga kelishilgan mehnat vazifasini bajarish uchun ish bilan ta'minlashni, mehnat to'g'risidagi qonun hujjatlarida, boshqa normativ-huquqiy hujjatlarda, jamoa shartnomasida, mahalliy normativ hujjatlarda, ushbu mehnat shartnomasida nazarda tutilgan mehnat sharoitlarini ta'minlashni va mehnat haqi to'lashni o'z zimmasiga oladi, xodim esa belgilangan mehnat tartibiga rioya qilib, o'z shaxsiy mehnat vazifasini bajarishni o'z zimmasiga oladi.

Mehnat shartnomasi yozma shaklda tuziladi va ikki nusxada rasmiylashtiriladi. Bir nusxa xodimga beriladi, ikkinchisi ish beruvchida saqlanadi.`,
      ru: `Трудовой договор — соглашение между работником и работодателем, в соответствии с которым работодатель обязуется предоставить работнику работу по обусловленной трудовой функции, обеспечить условия труда, предусмотренные законодательством о труде, иными нормативно-правовыми актами, коллективным договором, локальными нормативными актами, настоящим трудовым договором, и выплачивать заработную плату, а работник обязуется лично выполнять определенную этим соглашением трудовую функцию с соблюдением установленного трудового распорядка.

Трудовой договор заключается в письменной форме и оформляется в двух экземплярах. Один экземпляр передается работнику, второй хранится у работодателя.`,
      en: `An employment contract is an agreement between an employee and an employer, according to which the employer undertakes to provide the employee with work according to the agreed labor function, to ensure working conditions provided for by labor legislation, other regulatory legal acts, collective agreement, local regulatory acts, this employment contract, and to pay wages, and the employee undertakes to personally perform the labor function specified by this agreement in compliance with the established labor regulations.

The employment contract is concluded in writing and is executed in two copies. One copy is given to the employee, the second is kept by the employer.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    viewCount: 28934,
    lastUpdated: '2024-11-01T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z',
  },
  {
    id: 22,
    number: '22',
    sectionId: 2,
    chapterId: 7,
    section: { id: 2, number: 'II', title: { uz: 'Mehnat shartnomasi', ru: 'Трудовой договор', en: 'Employment Contract' } },
    chapter: { id: 7, number: '7', title: { uz: 'Mehnat shartnomasini tuzish', ru: 'Заключение трудового договора', en: 'Conclusion of Employment Contract' } },
    title: {
      uz: 'Mehnat shartnomasi muddati',
      ru: 'Срок трудового договора',
      en: 'Term of Employment Contract',
    },
    content: {
      uz: `Mehnat shartnomalari quyidagi muddatlarda tuzilishi mumkin:
1) muddatsiz;
2) muayyan muddatga — ikki yildan ko'p bo'lmagan muddatga (muddatli mehnat shartnomasi).

Muddatli mehnat shartnomasi quyidagi hollarda tuziladi:
- ish yoki xizmat ko'rsatish xarakteri yoki shartlaridan kelib chiqqan holda;
- mavsumiy ishlarni bajarishda;
- vaqtincha yo'q bo'lgan xodim o'rnini bosish uchun.

Agar mehnat shartnomasi muddati ko'rsatilmagan bo'lsa, u muddatsiz tuzilgan hisoblanadi.`,
      ru: `Трудовые договоры могут заключаться на следующие сроки:
1) неопределенный срок;
2) определенный срок — не более двух лет (срочный трудовой договор).

Срочный трудовой договор заключается в случаях:
- характера или условий работы или услуг;
- выполнения сезонных работ;
- замещения временно отсутствующего работника.

Если срок трудового договора не указан, он считается заключенным на неопределенный срок.`,
      en: `Employment contracts may be concluded for the following terms:
1) indefinite term;
2) definite term — not more than two years (fixed-term employment contract).

A fixed-term employment contract is concluded in cases of:
- the nature or conditions of work or services;
- performance of seasonal work;
- replacement of a temporarily absent employee.

If the term of the employment contract is not specified, it is considered concluded for an indefinite term.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: false,
    translations: ['uz', 'ru', 'en'],
    viewCount: 19234,
    lastUpdated: '2024-10-25T11:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-25T11:30:00Z',
  },

  // ============================================
  // SECTION III - CHAPTER 12: Ish vaqti
  // ============================================
  {
    id: 73,
    number: '73',
    sectionId: 3,
    chapterId: 12,
    section: { id: 3, number: 'III', title: { uz: 'Ish vaqti va dam olish vaqti', ru: 'Рабочее время и время отдыха', en: 'Working Time and Rest Time' } },
    chapter: { id: 12, number: '12', title: { uz: 'Ish vaqti', ru: 'Рабочее время', en: 'Working Time' } },
    title: {
      uz: 'Ish vaqtining normal davomiyligi',
      ru: 'Нормальная продолжительность рабочего времени',
      en: 'Normal Duration of Working Time',
    },
    content: {
      uz: `Ish vaqtining normal davomiyligi haftasiga 40 soatdan oshmasligi kerak.

Ish beruvchi besh kunlik ish haftasida kunlik ish vaqtining normal davomiyligini o'zi belgilaydi, bunda haftadagi ish vaqti bir xil bo'lishi kerak. Besh kunlik ish haftasida dam olish kunlari shanba va yakshanba hisoblanadi.

Olti kunlik ish haftasida kunlik ish vaqtining davomiyligi 7 soatdan oshmasligi kerak, bunda ish haftasidan oldingi kunda — 5 soat. Dam olish kuni yakshanba hisoblanadi.`,
      ru: `Нормальная продолжительность рабочего времени не должна превышать 40 часов в неделю.

Работодатель сам устанавливает нормальную продолжительность ежедневной работы при пятидневной рабочей неделе, при этом рабочее время в неделю должно быть одинаковым. При пятидневной рабочей неделе выходными днями являются суббота и воскресенье.

При шестидневной рабочей неделе продолжительность ежедневной работы не должна превышать 7 часов, накануне выходного дня — 5 часов. Выходным днем является воскресенье.`,
      en: `The normal duration of working time should not exceed 40 hours per week.

The employer sets the normal duration of daily work with a five-day working week, while working time per week must be the same. With a five-day working week, Saturday and Sunday are days off.

With a six-day working week, the duration of daily work should not exceed 7 hours, on the eve of a day off — 5 hours. Sunday is the day off.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    viewCount: 34521,
    lastUpdated: '2024-10-10T16:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-10T16:45:00Z',
  },

  // ============================================
  // SECTION IV - CHAPTER 16: Mehnat haqi
  // ============================================
  {
    id: 140,
    number: '140',
    sectionId: 4,
    chapterId: 16,
    section: { id: 4, number: 'IV', title: { uz: 'Mehnat haqi', ru: 'Оплата труда', en: 'Remuneration' } },
    chapter: { id: 16, number: '16', title: { uz: 'Mehnat haqini tashkil etish', ru: 'Организация оплаты труда', en: 'Organization of Remuneration' } },
    title: {
      uz: 'Mehnat haqi tushunchasi',
      ru: 'Понятие заработной платы',
      en: 'Concept of Wages',
    },
    content: {
      uz: `Mehnat haqi — bu xodimga bajargan ishi uchun uning malakasi, bajarilgan ish murakkabligi, miqdori, sifati va sharoitlariga qarab to'lanadigan pul kompensatsiyasidir.

Mehnat haqi quyidagi to'lovlardan iborat:
1) asosiy ish haqi;
2) kompensatsiya xarakteridagi to'lovlar;
3) rag'batlantiruvchi to'lovlar.

Ish beruvchi ishchilarga va xizmatchilarga bir xil qiymatdagi mehnat uchun teng ish haqi to'lashni ta'minlashi shart.`,
      ru: `Заработная плата — денежная компенсация, выплачиваемая работнику за выполненную работу в зависимости от его квалификации, сложности, количества, качества и условий выполняемой работы.

Заработная плата включает следующие выплаты:
1) основная заработная плата;
2) выплаты компенсационного характера;
3) стимулирующие выплаты.

Работодатель обязан обеспечить равную оплату за труд равной ценности для рабочих и служащих.`,
      en: `Wages are monetary compensation paid to an employee for work performed depending on their qualifications, complexity, quantity, quality and conditions of the work performed.

Wages include the following payments:
1) basic wages;
2) compensation payments;
3) incentive payments.

The employer must ensure equal pay for work of equal value for workers and employees.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    viewCount: 45123,
    lastUpdated: '2024-11-05T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-05T10:00:00Z',
  },
  {
    id: 141,
    number: '141',
    sectionId: 4,
    chapterId: 16,
    section: { id: 4, number: 'IV', title: { uz: 'Mehnat haqi', ru: 'Оплата труда', en: 'Remuneration' } },
    chapter: { id: 16, number: '16', title: { uz: 'Mehnat haqini tashkil etish', ru: 'Организация оплаты труда', en: 'Organization of Remuneration' } },
    title: {
      uz: 'Minimal ish haqi',
      ru: 'Минимальная заработная плата',
      en: 'Minimum Wage',
    },
    content: {
      uz: `Minimal ish haqi — bu davlat tomonidan kafolatlanadigan eng kam miqdordagi oylik ish haqi bo'lib, undan kam haq to'lash taqiqlanadi.

Minimal ish haqi miqdori O'zbekiston Respublikasi Prezidentining qaroriga muvofiq belgilanadi va inflyatsiya darajasiga qarab qayta ko'rib chiqilishi mumkin.

Xodimga to'lanadigan oylik ish haqi ish vaqti normasi to'liq bajarilgan va mehnat majburiyatlari bajarilgan taqdirda belgilangan minimal ish haqidan kam bo'lishi mumkin emas.`,
      ru: `Минимальная заработная плата — это минимальный размер ежемесячной оплаты труда, гарантируемый государством, ниже которого оплата запрещена.

Размер минимальной заработной платы устанавливается постановлением Президента Республики Узбекистан и может пересматриваться в зависимости от уровня инфляции.

Месячная заработная плата работника не может быть ниже установленной минимальной заработной платы при условии полного выполнения нормы рабочего времени и трудовых обязанностей.`,
      en: `The minimum wage is the minimum amount of monthly remuneration guaranteed by the state, below which payment is prohibited.

The minimum wage amount is set by the resolution of the President of the Republic of Uzbekistan and may be revised depending on the inflation rate.

The monthly wages of an employee cannot be lower than the established minimum wage, provided that the working time norm and labor duties are fully fulfilled.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: false,
    translations: ['uz', 'ru', 'en'],
    viewCount: 38765,
    lastUpdated: '2024-11-02T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-02T14:30:00Z',
  },

  // Additional articles for variety...
  {
    id: 45,
    number: '45',
    sectionId: 2,
    chapterId: 9,
    section: { id: 2, number: 'II', title: { uz: 'Mehnat shartnomasi', ru: 'Трудовой договор', en: 'Employment Contract' } },
    chapter: { id: 9, number: '9', title: { uz: 'Mehnat shartnomasini bekor qilish', ru: 'Прекращение трудового договора', en: 'Termination of Employment Contract' } },
    title: {
      uz: 'Mehnat shartnomasini bekor qilish asoslari',
      ru: 'Основания прекращения трудового договора',
      en: 'Grounds for Termination of Employment Contract',
    },
    content: {
      uz: `Mehnat shartnomasi quyidagi asoslarda bekor qilinadi:
1) tomonlarning kelishuvi;
2) mehnat shartnomasi muddatining tugashi;
3) xodimning tashabbusi;
4) ish beruvchining tashabbusi;
5) xodim nazoratidan tashqari holat yuzaga kelganda;
6) qonun hujjatlarida nazarda tutilgan boshqa asoslar.

Mehnat shartnomasi bekor qilinganda ish beruvchi xodimga ishdan bo'shatilganlik sababini ko'rsatgan holda tegishli buyruq chiqaradi va mehnat daftarchasiga yozuv kiritadi.`,
      ru: `Трудовой договор прекращается по следующим основаниям:
1) соглашение сторон;
2) истечение срока трудового договора;
3) инициатива работника;
4) инициатива работодателя;
5) наступление обстоятельств, не зависящих от работника;
6) иные основания, предусмотренные законодательством.

При прекращении трудового договора работодатель издает соответствующий приказ с указанием причины увольнения и вносит запись в трудовую книжку.`,
      en: `The employment contract is terminated on the following grounds:
1) agreement of the parties;
2) expiration of the employment contract;
3) initiative of the employee;
4) initiative of the employer;
5) occurrence of circumstances beyond the employee's control;
6) other grounds provided by legislation.

Upon termination of the employment contract, the employer issues an appropriate order indicating the reason for dismissal and makes an entry in the employment record book.`,
    },
    status: 'published',
    hasAuthorComment: true,
    hasExpertComment: true,
    translations: ['uz', 'ru', 'en'],
    viewCount: 52341,
    lastUpdated: '2024-10-30T09:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-30T09:00:00Z',
  },
];

// Add more articles programmatically for testing
const additionalArticles: Article[] = [];
let articleIdCounter = 200;

// Generate additional articles for each section
for (let sectionId = 1; sectionId <= 6; sectionId++) {
  for (let i = 1; i <= 8; i++) {
    additionalArticles.push({
      id: articleIdCounter++,
      number: `${articleIdCounter - 200 + sectionId * 10}`,
      sectionId,
      chapterId: sectionId * 4 - 3 + Math.floor(i / 3),
      section: { 
        id: sectionId, 
        number: ['I', 'II', 'III', 'IV', 'V', 'VI'][sectionId - 1], 
        title: {
          uz: ['Umumiy qoidalar', 'Mehnat shartnomasi', 'Ish vaqti va dam olish', 'Mehnat haqi', 'Mehnat intizomi', 'Mehnat muhofazasi'][sectionId - 1],
          ru: ['Общие положения', 'Трудовой договор', 'Рабочее время и отдых', 'Оплата труда', 'Трудовая дисциплина', 'Охрана труда'][sectionId - 1],
          en: ['General Provisions', 'Employment Contract', 'Working Time and Rest', 'Remuneration', 'Labor Discipline', 'Occupational Safety'][sectionId - 1],
        }
      },
      chapter: {
        id: sectionId * 4 - 3 + Math.floor(i / 3),
        number: `${sectionId * 4 - 3 + Math.floor(i / 3)}`,
        title: {
          uz: `${sectionId}-bo'lim ${i}-bob`,
          ru: `Раздел ${sectionId} Глава ${i}`,
          en: `Section ${sectionId} Chapter ${i}`,
        }
      },
      title: {
        uz: `Modda ${articleIdCounter - 200 + sectionId * 10} - Test modda`,
        ru: `Статья ${articleIdCounter - 200 + sectionId * 10} - Тестовая статья`,
        en: `Article ${articleIdCounter - 200 + sectionId * 10} - Test article`,
      },
      content: {
        uz: `Bu ${articleIdCounter - 200 + sectionId * 10}-moddaning to'liq matni. Mehnat kodeksining muhim qoidalaridan biri.`,
        ru: `Это полный текст статьи ${articleIdCounter - 200 + sectionId * 10}. Одно из важных положений Трудового кодекса.`,
        en: `This is the full text of article ${articleIdCounter - 200 + sectionId * 10}. One of the important provisions of the Labor Code.`,
      },
      status: 'published',
      hasAuthorComment: i % 2 === 0,
      hasExpertComment: i % 3 === 0,
      translations: ['uz', 'ru', 'en'],
      viewCount: Math.floor(Math.random() * 10000) + 1000,
      lastUpdated: new Date(2024, 10 - Math.floor(i / 2), 15 + i).toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date(2024, 10 - Math.floor(i / 2), 15 + i).toISOString(),
    });
  }
}

export default [...mockArticles, ...additionalArticles];




