import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import {
  Shield,
  Users,
  Target,
  Award,
  BookOpen,
  Scale,
  CheckCircle,
  Building2,
} from 'lucide-react';
import { Card } from '@/components/ui';

interface PageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    pageTitle: 'Biz haqimizda',
    heroTitle: 'Mehnat Kodeksiga Sharh',
    heroDescription:
      "O'zbekiston Respublikasi Mehnat kodeksining rasmiy sharhi va izohlari. Ushbu portal mehnat huquqi bo'yicha eng ishonchli va to'liq ma'lumot manbayi hisoblanadi.",
    stats: {
      articles: 'Moddalar',
      chapters: 'Boblar',
      sections: "Bo'limlar",
      languages: 'Tillar',
    },
    featuresTitle: 'Portal imkoniyatlari',
    featuresDescription: "Mehnat qonunchiligi bo'yicha eng to'liq ma'lumotlar bazasi",
    features: [
      {
        title: 'Rasmiy sharh',
        description: 'Mehnat kodeksining har bir moddasiga batafsil huquqiy sharh va izohlar',
      },
      {
        title: 'Huquqiy aniqlik',
        description: 'Yuridik ekspertlar tomonidan tasdiqlangan professional izohlar',
      },
      {
        title: 'Foydalanuvchilar uchun',
        description: "Ishchilar, ish beruvchilar va huquqshunoslarga mo'ljallangan",
      },
      {
        title: 'Ishonchlilik',
        description: "Davlat tomonidan tasdiqlangan va yangilangan ma'lumotlar",
      },
    ],
    missionLabel: 'Bizning maqsad',
    missionTitle: 'Mehnat huquqlarini himoya qilish',
    missionText1:
      "Bizning asosiy maqsadimiz - O'zbekiston fuqarolariga mehnat qonunchiligi bo'yicha to'liq va aniq ma'lumot taqdim etishdir.",
    missionText2:
      "Portal orqali har bir fuqaro o'z huquqlarini bilib olishi, ish beruvchi bilan munosabatlarni to'g'ri shakllantirishi mumkin.",
    missionFeatures: [
      'Bepul foydalanish',
      'Doimiy yangilanishlar',
      'Professional sharhlar',
      "Ko'p tilli qo'llab-quvvatlash",
    ],
    governmentApproved: 'Davlat tomonidan tasdiqlangan',
    governmentDescription:
      "Ushbu portal O'zbekiston Respublikasi Kambag'allikni qisqartirish va bandlik vazirligi bilan hamkorlikda ishlab chiqilgan va rasmiy ma'lumotlar manbai hisoblanadi.",
    officiallyApproved: 'Rasmiy tasdiqlangan',
  },
  ru: {
    pageTitle: 'О нас',
    heroTitle: 'Комментарий к Трудовому Кодексу',
    heroDescription:
      'Официальный комментарий и разъяснения к Трудовому кодексу Республики Узбекистан. Данный портал является самым надежным и полным источником информации по трудовому праву.',
    stats: {
      articles: 'Статей',
      chapters: 'Глав',
      sections: 'Разделов',
      languages: 'Языка',
    },
    featuresTitle: 'Возможности портала',
    featuresDescription: 'Самая полная база данных по трудовому законодательству',
    features: [
      {
        title: 'Официальный комментарий',
        description:
          'Подробные правовые комментарии и разъяснения к каждой статье Трудового кодекса',
      },
      {
        title: 'Правовая точность',
        description: 'Профессиональные комментарии, одобренные юридическими экспертами',
      },
      {
        title: 'Для пользователей',
        description: 'Предназначено для работников, работодателей и юристов',
      },
      {
        title: 'Надежность',
        description: 'Данные, утвержденные и обновляемые государством',
      },
    ],
    missionLabel: 'Наша миссия',
    missionTitle: 'Защита трудовых прав',
    missionText1:
      'Наша главная цель - предоставить гражданам Узбекистана полную и точную информацию о трудовом законодательстве.',
    missionText2:
      'Через портал каждый гражданин может узнать свои права и правильно выстроить отношения с работодателем.',
    missionFeatures: [
      'Бесплатное использование',
      'Постоянные обновления',
      'Профессиональные комментарии',
      'Многоязычная поддержка',
    ],
    governmentApproved: 'Одобрено государством',
    governmentDescription:
      'Данный портал разработан совместно с Министерством сокращения бедности и занятости Республики Узбекистан и является официальным источником информации.',
    officiallyApproved: 'Официально одобрено',
  },
  en: {
    pageTitle: 'About Us',
    heroTitle: 'Labor Code Commentary',
    heroDescription:
      'Official commentary and explanations to the Labor Code of the Republic of Uzbekistan. This portal is the most reliable and comprehensive source of information on labor law.',
    stats: {
      articles: 'Articles',
      chapters: 'Chapters',
      sections: 'Sections',
      languages: 'Languages',
    },
    featuresTitle: 'Portal Features',
    featuresDescription: 'The most complete database on labor legislation',
    features: [
      {
        title: 'Official Commentary',
        description: 'Detailed legal comments and explanations for each article of the Labor Code',
      },
      {
        title: 'Legal Accuracy',
        description: 'Professional comments approved by legal experts',
      },
      {
        title: 'For Users',
        description: 'Designed for workers, employers, and lawyers',
      },
      {
        title: 'Reliability',
        description: 'Data approved and updated by the state',
      },
    ],
    missionLabel: 'Our Mission',
    missionTitle: 'Protection of Labor Rights',
    missionText1:
      'Our main goal is to provide citizens of Uzbekistan with complete and accurate information on labor legislation.',
    missionText2:
      'Through the portal, every citizen can learn their rights and properly build relationships with employers.',
    missionFeatures: [
      'Free to use',
      'Regular updates',
      'Professional comments',
      'Multilingual support',
    ],
    governmentApproved: 'Government Approved',
    governmentDescription:
      'This portal was developed in cooperation with the Ministry of Poverty Reduction and Employment of the Republic of Uzbekistan and is an official source of information.',
    officiallyApproved: 'Officially Approved',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'common' });
  const pageT = translations[params.locale as keyof typeof translations] || translations.uz;
  return {
    title: pageT.pageTitle,
    description: pageT.heroDescription,
  };
}

export default function AboutPage({ params }: PageProps) {
  return <AboutContent locale={params.locale} />;
}

function AboutContent({ locale }: { locale: string }) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const icons = [BookOpen, Scale, Users, Shield];

  const stats = [
    { value: '600+', label: t.stats.articles },
    { value: '50+', label: t.stats.chapters },
    { value: '6', label: t.stats.sections },
    { value: '3', label: t.stats.languages },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-gov-light">
      {/* Hero Section */}
      <section className="bg-primary-800 py-10 text-white sm:py-16 lg:py-24">
        <div className="section-container">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
              <div className="rounded-lg bg-white/10 p-2 sm:rounded-xl sm:p-3">
                <Building2 className="h-6 w-6 text-accent-gold sm:h-8 sm:w-8" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-primary-200 sm:text-sm">
                {t.pageTitle}
              </span>
            </div>
            <h1 className="mb-4 font-heading text-2xl font-bold sm:mb-6 sm:text-3xl lg:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="text-base leading-relaxed text-primary-100 sm:text-lg lg:text-xl">
              {t.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gov-border bg-white py-6 sm:py-8">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-0.5 text-2xl font-bold text-primary-800 sm:mb-1 sm:text-3xl lg:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs text-text-secondary sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="section-container">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="mb-3 font-heading text-xl font-bold text-text-primary sm:mb-4 sm:text-2xl lg:text-3xl">
              {t.featuresTitle}
            </h2>
            <p className="mx-auto max-w-2xl px-4 text-sm text-text-secondary sm:text-base">
              {t.featuresDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {t.features.map((feature, index) => {
              const Icon = icons[index];
              return (
                <Card
                  key={index}
                  variant="outlined"
                  className="p-4 text-center transition-shadow hover:shadow-lg sm:p-6"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 sm:mb-4 sm:h-14 sm:w-14 sm:rounded-xl">
                    <Icon className="h-5 w-5 text-primary-600 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="mb-1.5 font-heading text-base font-semibold text-text-primary sm:mb-2 sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-secondary sm:text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-10 sm:py-16 lg:py-24">
        <div className="section-container">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                <Target className="h-5 w-5 text-primary-600 sm:h-6 sm:w-6" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary-600 sm:text-sm">
                  {t.missionLabel}
                </span>
              </div>
              <h2 className="mb-4 font-heading text-xl font-bold text-text-primary sm:mb-6 sm:text-2xl lg:text-3xl">
                {t.missionTitle}
              </h2>
              <div className="space-y-3 text-sm text-text-secondary sm:space-y-4 sm:text-base">
                <p>{t.missionText1}</p>
                <p>{t.missionText2}</p>
              </div>

              <ul className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
                {t.missionFeatures.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500 sm:h-5 sm:w-5" />
                    <span className="text-sm text-text-primary sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-primary-50 p-6 sm:rounded-2xl sm:p-8 lg:p-12">
              <Award className="mb-4 h-12 w-12 text-primary-600 sm:mb-6 sm:h-16 sm:w-16" />
              <h3 className="mb-3 font-heading text-lg font-bold text-text-primary sm:mb-4 sm:text-xl">
                {t.governmentApproved}
              </h3>
              <p className="mb-4 text-sm text-text-secondary sm:mb-6 sm:text-base">
                {t.governmentDescription}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-primary-600 sm:gap-3 sm:text-sm">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{t.officiallyApproved}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
