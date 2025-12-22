import type { Commentary, Author } from '@/types';

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: 1,
    name: 'Aziz Tojiboyev',
    role: 'author',
    avatar: '/images/avatars/author-1.jpg',
    credentials: "Yuridik fanlar doktori, professor",
    organization: "O'zbekiston Milliy universiteti",
    bio: {
      uz: "Mehnat huquqi bo'yicha 25 yillik tajribaga ega mutaxassis",
      ru: 'Специалист с 25-летним опытом в области трудового права',
      en: 'Specialist with 25 years of experience in labor law',
    },
  },
  {
    id: 2,
    name: 'Dilfuza Rahimova',
    role: 'author',
    avatar: '/images/avatars/author-2.jpg',
    credentials: "Yuridik fanlar nomzodi",
    organization: "Toshkent davlat yuridik universiteti",
    bio: {
      uz: "Mehnat huquqi kafedrasi dotsenti",
      ru: 'Доцент кафедры трудового права',
      en: 'Associate professor of labor law department',
    },
  },
  {
    id: 3,
    name: 'Botir Karimov',
    role: 'expert',
    avatar: '/images/avatars/expert-1.jpg',
    credentials: "Oliy toifali advokat",
    organization: "Huquqiy yordam markazi",
    bio: {
      uz: "20 yillik advokatlık tajribasi, mehnat nizolari bo'yicha mutaxassis",
      ru: 'Адвокат с 20-летним стажем, специалист по трудовым спорам',
      en: '20 years of legal practice, specialist in labor disputes',
    },
  },
  {
    id: 4,
    name: 'Nilufar Saidova',
    role: 'expert',
    avatar: '/images/avatars/expert-2.jpg',
    credentials: "Mehnat inspeksiyasi bosh inspektori",
    organization: "Bandlik va mehnat vazirligi",
    bio: {
      uz: "Davlat mehnat inspeksiyasida 15 yillik ish tajribasi",
      ru: '15 лет опыта работы в государственной инспекции труда',
      en: '15 years of experience in state labor inspection',
    },
  },
  {
    id: 5,
    name: 'Jamshid Alimov',
    role: 'expert',
    avatar: '/images/avatars/expert-3.jpg',
    credentials: "HR direktor",
    organization: "Xalqaro kompaniya",
    bio: {
      uz: "Xalqaro korporatsiyalarda kadrlar boshqaruvi bo'yicha tajriba",
      ru: 'Опыт управления персоналом в международных корпорациях',
      en: 'Experience in human resources management in international corporations',
    },
  },
];

export const mockCommentaries: Commentary[] = [
  // Commentaries for Article 1
  {
    id: 1,
    articleId: 1,
    type: 'author',
    title: {
      uz: 'Mehnat kodeksining maqsadi haqida sharh',
      ru: 'Комментарий о цели Трудового кодекса',
      en: 'Commentary on the Purpose of the Labor Code',
    },
    content: {
      uz: `Mazkur modda Mehnat kodeksining maqsad va vazifalarini belgilaydi. Bu Kodeksning boshqa barcha moddalarini tushunish uchun asos yaratadi.

Kodeksning asosiy maqsadi - fuqarolarning mehnat huquqlarini himoya qilish. Bu huquqlar O'zbekiston Respublikasi Konstitutsiyasining 37-moddasida mustahkamlangan.

**Amaliy ahamiyati:**
- Ish beruvchilar xodimlarning huquqlarini hurmat qilishi shart
- Xodimlar o'z huquqlarini bilishi va himoya qilishi mumkin
- Davlat mehnat munosabatlarini tartibga solish uchun huquqiy asos yaratadi

**E'tibor bering:** Ushbu modda barcha mehnat munosabatlariga tatbiq etiladi, shu jumladan xususiy sektorda ham.`,
      ru: `Данная статья определяет цели и задачи Трудового кодекса. Это создает основу для понимания всех других статей Кодекса.

Основная цель Кодекса - защита трудовых прав граждан. Эти права закреплены в статье 37 Конституции Республики Узбекистан.

**Практическое значение:**
- Работодатели обязаны уважать права работников
- Работники могут знать и защищать свои права
- Государство создает правовую основу для регулирования трудовых отношений

**Обратите внимание:** Данная статья применяется ко всем трудовым отношениям, включая частный сектор.`,
      en: `This article defines the goals and objectives of the Labor Code. This creates a foundation for understanding all other articles of the Code.

The main purpose of the Code is to protect the labor rights of citizens. These rights are enshrined in Article 37 of the Constitution of the Republic of Uzbekistan.

**Practical significance:**
- Employers are obliged to respect workers' rights
- Workers can know and protect their rights
- The state creates a legal basis for regulating labor relations

**Please note:** This article applies to all labor relations, including the private sector.`,
    },
    author: mockAuthors[0],
    status: 'published',
    references: ['O\'zbekiston Respublikasi Konstitutsiyasi, 37-modda', 'Mehnat kodeksi, 2-modda'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 2,
    articleId: 1,
    type: 'expert',
    title: {
      uz: 'Amaliyotdan ko\'rinish',
      ru: 'Взгляд из практики',
      en: 'View from Practice',
    },
    content: {
      uz: `Advokatlık amaliyotimda ushbu moddaning ahamiyatini ko'p marta ko'rganman. Sud ishlarida bu modda ko'pincha boshqa moddalarni sharhlash uchun asos sifatida ishlatiladi.

**Muhim holatlar:**

1. **Ish beruvchi bilan nizo:** Agar ish beruvchi xodim huquqlarini buzsa, xodim ushbu moddaga asoslanib sud orqali huquqlarini tiklashi mumkin.

2. **Mehnat inspeksiyasi tekshiruvi:** Inspektorlar ushbu moddani asosiy me'yor sifatida qo'llaydilar.

3. **Mehnat shartnomasi tuzish:** Shartnoma shartlari ushbu moddaga zid bo'lmasligi kerak.

**Maslahat:** Har qanday mehnat nizosida birinchi navbatda ushbu moddani o'rganing - u sizga huquqiy yo'nalish beradi.`,
      ru: `В своей адвокатской практике я неоднократно видел важность данной статьи. В судебных делах эта статья часто используется как основа для толкования других статей.

**Важные ситуации:**

1. **Спор с работодателем:** Если работодатель нарушает права работника, работник может восстановить свои права через суд на основании этой статьи.

2. **Проверка трудовой инспекции:** Инспекторы применяют эту статью как основную норму.

3. **Заключение трудового договора:** Условия договора не должны противоречить данной статье.

**Совет:** В любом трудовом споре в первую очередь изучите эту статью - она даст вам правовое направление.`,
      en: `In my legal practice, I have repeatedly seen the importance of this article. In court cases, this article is often used as a basis for interpreting other articles.

**Important situations:**

1. **Dispute with employer:** If the employer violates the employee's rights, the employee can restore their rights through court based on this article.

2. **Labor inspection audit:** Inspectors apply this article as the main norm.

3. **Conclusion of employment contract:** Contract terms must not contradict this article.

**Advice:** In any labor dispute, first study this article - it will give you legal direction.`,
    },
    author: mockAuthors[2],
    status: 'published',
    basedOn: 'Sud amaliyoti va huquqiy maslahatlar tajribasiga asoslanadi',
    references: ['Oliy sud Plenumi qarori, 2022-yil', 'Mehnat nizolari bo\'yicha sud amaliyoti sharhi'],
    createdAt: '2024-07-20T14:30:00Z',
    updatedAt: '2024-10-15T10:30:00Z',
  },

  // Commentaries for Article 21
  {
    id: 3,
    articleId: 21,
    type: 'author',
    title: {
      uz: 'Mehnat shartnomasi tushunchasi',
      ru: 'Понятие трудового договора',
      en: 'Concept of Employment Contract',
    },
    content: {
      uz: `Mehnat shartnomasi - bu mehnat munosabatlarining huquqiy asosi. U ish beruvchi va xodim o'rtasidagi huquq va majburiyatlarni belgilaydi.

**Shartnomaning muhim elementlari:**
1. Tomonlar (ish beruvchi va xodim)
2. Mehnat vazifasi
3. Mehnat haqi
4. Ish rejimi
5. Shartnoma muddati

**Yozma shakl majburiyligi:**
Mehnat shartnomasi albatta yozma shaklda tuzilishi kerak. Og'zaki kelishuv huquqiy kuchga ega emas.

**Shartnoma turlari:**
- Muddatsiz (asosiy tur)
- Muddatli (2 yilgacha)
- Mavsumiy ishlar uchun
- Vaqtinchalik ishlar uchun`,
      ru: `Трудовой договор - это правовая основа трудовых отношений. Он определяет права и обязанности между работодателем и работником.

**Важные элементы договора:**
1. Стороны (работодатель и работник)
2. Трудовая функция
3. Оплата труда
4. Режим работы
5. Срок договора

**Обязательность письменной формы:**
Трудовой договор должен быть заключен в письменной форме. Устное соглашение не имеет юридической силы.

**Виды договоров:**
- Бессрочный (основной вид)
- Срочный (до 2 лет)
- Для сезонных работ
- Для временных работ`,
      en: `An employment contract is the legal basis of labor relations. It defines the rights and obligations between the employer and employee.

**Important elements of the contract:**
1. Parties (employer and employee)
2. Labor function
3. Remuneration
4. Work schedule
5. Contract term

**Mandatory written form:**
The employment contract must be concluded in writing. An oral agreement has no legal force.

**Types of contracts:**
- Indefinite (main type)
- Fixed-term (up to 2 years)
- For seasonal work
- For temporary work`,
    },
    author: mockAuthors[1],
    status: 'published',
    references: ['Mehnat kodeksi, 21-28 moddalar', 'Vazirlar Mahkamasi qarori, 2023-yil'],
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z',
  },
  {
    id: 4,
    articleId: 21,
    type: 'expert',
    content: {
      uz: `Amaliyotda ko'p uchraydigan muammolar va ularning yechimlari:

**Muammo 1: Shartnoma tuzilmagan**
Ko'plab ish beruvchilar shartnoma tuzmay xodimlarni ishlatadilar. Bu qonunga xilof va xodim huquqlarini buzadi.

*Yechim:* Xodim mehnat inspeksiyasiga murojaat qilishi yoki sudga ariza berishi mumkin.

**Muammo 2: Shartnoma shartlari o'zgartiriladi**
Ish beruvchi xodimning roziligisiz shartnoma shartlarini o'zgartirishi mumkin emas.

*Yechim:* Har qanday o'zgarish ikki tomonlama kelishuv asosida amalga oshirilishi kerak.

**Muammo 3: Shartnomada muhim shartlar ko'rsatilmagan**
Ba'zi shartnomalarida mehnat haqi yoki ish vaqti aniq belgilanmagan.

*Yechim:* Shartnomani imzolashdan oldin diqqat bilan o'qing va barcha shartlarni tushunib oling.`,
      ru: `Часто встречающиеся на практике проблемы и их решения:

**Проблема 1: Договор не заключен**
Многие работодатели используют работников без заключения договора. Это противозаконно и нарушает права работника.

*Решение:* Работник может обратиться в инспекцию труда или подать заявление в суд.

**Проблема 2: Условия договора изменяются**
Работодатель не может изменять условия договора без согласия работника.

*Решение:* Любые изменения должны осуществляться на основе двустороннего соглашения.

**Проблема 3: В договоре не указаны важные условия**
В некоторых договорах не указаны конкретно оплата труда или рабочее время.

*Решение:* Внимательно прочитайте договор перед подписанием и убедитесь, что все условия понятны.`,
      en: `Common problems in practice and their solutions:

**Problem 1: No contract concluded**
Many employers use workers without concluding a contract. This is illegal and violates the worker's rights.

*Solution:* The worker can contact the labor inspection or file a lawsuit.

**Problem 2: Contract terms are changed**
The employer cannot change the terms of the contract without the employee's consent.

*Solution:* Any changes must be made on the basis of a bilateral agreement.

**Problem 3: Important conditions are not specified in the contract**
Some contracts do not specify wages or working hours.

*Solution:* Read the contract carefully before signing and make sure all terms are understood.`,
    },
    author: mockAuthors[3],
    status: 'published',
    basedOn: 'Mehnat inspeksiyasi tekshiruvlari tajribasiga asoslanadi',
    createdAt: '2024-08-15T11:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z',
  },

  // Commentaries for Article 73
  {
    id: 5,
    articleId: 73,
    type: 'author',
    content: {
      uz: `Ish vaqti normasi - bu xodimning sog'lig'ini himoya qilish va samarali mehnat qilishini ta'minlash uchun muhim qoidadir.

**Asosiy qoidalar:**
- Haftalik ish vaqti - 40 soatdan oshmasligi kerak
- Kunlik ish vaqti - 8 soatdan oshmasligi kerak (5 kunlik ish haftasida)
- Dam olish kunlari - haftada kamida 2 kun

**Istisno holatlar:**
1. Qisqartirilgan ish vaqti (16-18 yoshlilar uchun - 36 soat)
2. Zararli sharoitlarda ishlovchilar uchun - 36 soat
3. Nogironlar uchun - qonunga muvofiq

**Amaliy maslahat:** Ish beruvchi ortiqcha ish vaqti uchun qo'shimcha haq to'lashi yoki qo'shimcha dam olish vaqti berishi kerak.`,
      ru: `Норма рабочего времени - это важное правило для защиты здоровья работника и обеспечения эффективного труда.

**Основные правила:**
- Рабочее время в неделю - не более 40 часов
- Рабочее время в день - не более 8 часов (при 5-дневной рабочей неделе)
- Выходные дни - минимум 2 дня в неделю

**Исключения:**
1. Сокращенное рабочее время (для лиц 16-18 лет - 36 часов)
2. Для работающих во вредных условиях - 36 часов
3. Для инвалидов - согласно законодательству

**Практический совет:** Работодатель должен оплатить сверхурочное время или предоставить дополнительное время отдыха.`,
      en: `The working time norm is an important rule for protecting the health of the worker and ensuring effective work.

**Basic rules:**
- Working time per week - no more than 40 hours
- Working time per day - no more than 8 hours (with a 5-day working week)
- Days off - at least 2 days per week

**Exceptions:**
1. Reduced working hours (for persons 16-18 years old - 36 hours)
2. For those working in harmful conditions - 36 hours
3. For disabled persons - according to legislation

**Practical advice:** The employer must pay for overtime or provide additional rest time.`,
    },
    author: mockAuthors[0],
    status: 'published',
    references: ['Mehnat kodeksi, 73-82 moddalar', 'Sog\'liqni saqlash vazirligi me\'yorlari'],
    createdAt: '2024-04-20T08:00:00Z',
    updatedAt: '2024-10-10T16:45:00Z',
  },
  {
    id: 6,
    articleId: 73,
    type: 'expert',
    content: {
      uz: `HR mutaxassisi sifatida ish vaqti masalasida quyidagi tavsiyalarni beraman:

**Ish beruvchilar uchun:**
1. Ish vaqti hisobini aniq yuritish
2. Ortiqcha ish vaqtini minimallashtirish
3. Moslashuvchan ish grafigini ko'rib chiqish

**Xodimlar uchun:**
1. O'z ish vaqtingizni kuzatib boring
2. Ortiqcha ishdan bosh tortish huquqingiz borligini biling
3. Zararli sharoitda ishlasangiz, qisqartirilgan ish vaqti talab qiling

**Zamonaviy tendensiyalar:**
- Masofaviy ish
- Moslashuvchan grafik
- 4 kunlik ish haftasi (ayrim kompaniyalarda)

Bu o'zgarishlar qonunchilikda ham aks etishi kutilmoqda.`,
      ru: `Как HR-специалист, даю следующие рекомендации по вопросам рабочего времени:

**Для работодателей:**
1. Вести точный учет рабочего времени
2. Минимизировать сверхурочную работу
3. Рассмотреть гибкий график работы

**Для работников:**
1. Следите за своим рабочим временем
2. Знайте, что имеете право отказаться от сверхурочной работы
3. При работе во вредных условиях требуйте сокращенное рабочее время

**Современные тенденции:**
- Удаленная работа
- Гибкий график
- 4-дневная рабочая неделя (в некоторых компаниях)

Ожидается, что эти изменения будут отражены и в законодательстве.`,
      en: `As an HR specialist, I give the following recommendations on working time issues:

**For employers:**
1. Keep accurate records of working time
2. Minimize overtime
3. Consider flexible work schedules

**For employees:**
1. Track your working time
2. Know that you have the right to refuse overtime
3. When working in harmful conditions, demand reduced working hours

**Modern trends:**
- Remote work
- Flexible schedule
- 4-day work week (in some companies)

These changes are expected to be reflected in legislation as well.`,
    },
    author: mockAuthors[4],
    status: 'published',
    basedOn: 'Xalqaro HR amaliyoti va O\'zbekiston bozori tajribasiga asoslanadi',
    createdAt: '2024-09-01T14:00:00Z',
    updatedAt: '2024-10-10T16:45:00Z',
  },

  // Add more commentaries for other articles...
  {
    id: 7,
    articleId: 140,
    type: 'author',
    content: {
      uz: `Mehnat haqi - bu xodimning eng muhim huquqlaridan biri. Ushbu modda mehnat haqining tarkibiy qismlarini belgilaydi.

**Mehnat haqi tarkibi:**

1. **Asosiy ish haqi** - bu lavozim bo'yicha belgilangan doimiy to'lov.

2. **Kompensatsiya to'lovlari:**
   - Zararli sharoitlar uchun
   - Tungi ish uchun
   - Ortiqcha ish uchun

3. **Rag'batlantiruvchi to'lovlar:**
   - Mukofotlar
   - Bonus to'lovlar
   - Foizli qo'shimchalar

**Muhim:** Ish beruvchi mehnat haqini oyiga kamida bir marta to'lashi shart.`,
      ru: `Заработная плата - одно из важнейших прав работника. Данная статья определяет составные части заработной платы.

**Состав заработной платы:**

1. **Основная заработная плата** - это постоянная выплата по должности.

2. **Компенсационные выплаты:**
   - За вредные условия
   - За ночную работу
   - За сверхурочную работу

3. **Стимулирующие выплаты:**
   - Премии
   - Бонусные выплаты
   - Процентные надбавки

**Важно:** Работодатель обязан выплачивать заработную плату не реже одного раза в месяц.`,
      en: `Wages are one of the most important rights of an employee. This article defines the components of wages.

**Wage composition:**

1. **Basic wages** - this is the fixed payment for the position.

2. **Compensation payments:**
   - For harmful conditions
   - For night work
   - For overtime

3. **Incentive payments:**
   - Bonuses
   - Bonus payments
   - Percentage allowances

**Important:** The employer must pay wages at least once a month.`,
    },
    author: mockAuthors[1],
    status: 'published',
    references: ['Mehnat kodeksi, 140-155 moddalar', 'Soliq kodeksi'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-11-05T10:00:00Z',
  },
  {
    id: 8,
    articleId: 140,
    type: 'expert',
    content: {
      uz: `Mehnat haqi masalasida eng ko'p uchraydigan muammolar va ularning huquqiy yechimlari:

**Muammo 1: Mehnat haqi kechiktiriladi**
Qonunga ko'ra, ish beruvchi mehnat haqini o'z vaqtida to'lamasligi uchun javobgar.
*Yechim:* Kechiktirilgan har bir kun uchun foiz hisoblash huquqingiz bor.

**Muammo 2: Minimal ish haqidan kam to'lanadi**
Bu to'g'ridan-to'g'ri qonun buzilishi hisoblanadi.
*Yechim:* Mehnat inspeksiyasiga murojaat qiling.

**Muammo 3: "Konvertda" to'lov**
Rasmiy hujjatsiz naqd pul to'lovi - noqonuniy.
*Yechim:* Barcha to'lovlarni rasmiy hujjatlashtiring.

**Maslahat:** Har oyda olgan mehnat haqingiz haqida yozma tasdiq oling.`,
      ru: `Наиболее часто встречающиеся проблемы с оплатой труда и их правовые решения:

**Проблема 1: Задержка зарплаты**
По закону работодатель несет ответственность за несвоевременную выплату.
*Решение:* Вы имеете право на проценты за каждый день задержки.

**Проблема 2: Оплата ниже минимальной**
Это прямое нарушение закона.
*Решение:* Обратитесь в инспекцию труда.

**Проблема 3: Оплата "в конверте"**
Наличная оплата без официальных документов - незаконна.
*Решение:* Оформляйте все выплаты официально.

**Совет:** Ежемесячно получайте письменное подтверждение полученной зарплаты.`,
      en: `Most common wage problems and their legal solutions:

**Problem 1: Wage delays**
According to the law, the employer is responsible for untimely payment.
*Solution:* You have the right to interest for each day of delay.

**Problem 2: Payment below minimum wage**
This is a direct violation of the law.
*Solution:* Contact the labor inspection.

**Problem 3: Payment "in an envelope"**
Cash payment without official documents is illegal.
*Solution:* Document all payments officially.

**Advice:** Get written confirmation of your salary every month.`,
    },
    author: mockAuthors[2],
    status: 'published',
    basedOn: 'Mehnat nizolari bo\'yicha sud amaliyotiga asoslanadi',
    createdAt: '2024-06-01T16:00:00Z',
    updatedAt: '2024-11-05T10:00:00Z',
  },
];

export default mockCommentaries;





