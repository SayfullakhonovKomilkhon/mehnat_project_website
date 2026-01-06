import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

interface PageProps {
  params: { locale: string };
}

const translations = {
  uz: {
    pageTitle: 'Aloqa',
    heroTitle: "Biz bilan bog'laning",
    heroDescription:
      "Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning. Sizga yordam berishdan mamnun bo'lamiz.",
    contactInfo: [
      {
        title: 'Ishonch telefoni',
        value: '1172',
        description: "Bepul qo'ng'iroq (24/7)",
      },
      {
        title: 'Email',
        value: 'info@bv.gov.uz, bandlik@exat.uz',
        description: 'Savollaringiz uchun',
      },
      {
        title: 'Manzil',
        value: "Toshkent sh., Mirobod tumani, Nukus ko'chasi, 8",
        description: 'Bandlik vazirligi',
      },
      {
        title: 'Ish vaqti',
        value: 'Du-Ju: 9:00 - 18:00',
        description: 'Shanba-Yakshanba: dam olish',
      },
    ],
    formTitle: 'Xabar yuborish',
    formDescription: "Formani to'ldiring va biz siz bilan bog'lanamiz",
    formFields: {
      name: 'Ismingiz',
      namePlaceholder: 'Ismingizni kiriting',
      phone: 'Telefon',
      email: 'Email',
      subject: 'Mavzu',
      subjectPlaceholder: 'Xabar mavzusi',
      message: 'Xabar matni',
      messagePlaceholder: 'Xabaringizni yozing...',
      submit: 'Xabar yuborish',
    },
    additionalInfo: "Qo'shimcha ma'lumot",
    ministryName: "O'zbekiston Respublikasi Kambag'allikni qisqartirish va bandlik vazirligi",
    ministryAddress: "100000, Toshkent shahri, Mirobod tumani, Nukus ko'chasi, 8-uy",
    socialNetworks: 'Ijtimoiy tarmoqlar',
    mapLocation: 'Xarita joylashuvi',
  },
  ru: {
    pageTitle: 'Контакты',
    heroTitle: 'Свяжитесь с нами',
    heroDescription:
      'Если у вас есть вопросы или предложения, свяжитесь с нами. Мы будем рады вам помочь.',
    contactInfo: [
      {
        title: 'Горячая линия',
        value: '1172',
        description: 'Бесплатный звонок (24/7)',
      },
      {
        title: 'Email',
        value: 'info@bv.gov.uz, bandlik@exat.uz',
        description: 'Для ваших вопросов',
      },
      {
        title: 'Адрес',
        value: 'г. Ташкент, Мирабадский район, ул. Нукус, 8',
        description: 'Министерство занятости',
      },
      {
        title: 'Рабочее время',
        value: 'Пн-Пт: 9:00 - 18:00',
        description: 'Суббота-Воскресенье: выходной',
      },
    ],
    formTitle: 'Отправить сообщение',
    formDescription: 'Заполните форму и мы свяжемся с вами',
    formFields: {
      name: 'Ваше имя',
      namePlaceholder: 'Введите ваше имя',
      phone: 'Телефон',
      email: 'Email',
      subject: 'Тема',
      subjectPlaceholder: 'Тема сообщения',
      message: 'Текст сообщения',
      messagePlaceholder: 'Напишите ваше сообщение...',
      submit: 'Отправить сообщение',
    },
    additionalInfo: 'Дополнительная информация',
    ministryName: 'Министерство сокращения бедности и занятости Республики Узбекистан',
    ministryAddress: '100000, г. Ташкент, Мирабадский район, ул. Нукус, дом 8',
    socialNetworks: 'Социальные сети',
    mapLocation: 'Расположение на карте',
  },
  en: {
    pageTitle: 'Contact',
    heroTitle: 'Contact Us',
    heroDescription:
      'If you have questions or suggestions, contact us. We will be happy to help you.',
    contactInfo: [
      {
        title: 'Hotline',
        value: '1172',
        description: 'Free call (24/7)',
      },
      {
        title: 'Email',
        value: 'info@bv.gov.uz, bandlik@exat.uz',
        description: 'For your questions',
      },
      {
        title: 'Address',
        value: 'Tashkent, Mirabad district, Nukus St., 8',
        description: 'Ministry of Employment',
      },
      {
        title: 'Working Hours',
        value: 'Mon-Fri: 9:00 - 18:00',
        description: 'Saturday-Sunday: closed',
      },
    ],
    formTitle: 'Send a Message',
    formDescription: 'Fill out the form and we will contact you',
    formFields: {
      name: 'Your Name',
      namePlaceholder: 'Enter your name',
      phone: 'Phone',
      email: 'Email',
      subject: 'Subject',
      subjectPlaceholder: 'Message subject',
      message: 'Message',
      messagePlaceholder: 'Write your message...',
      submit: 'Send Message',
    },
    additionalInfo: 'Additional Information',
    ministryName: 'Ministry of Poverty Reduction and Employment of the Republic of Uzbekistan',
    ministryAddress: '100000, Tashkent, Mirabad district, Nukus Street, 8',
    socialNetworks: 'Social Networks',
    mapLocation: 'Map Location',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageT = translations[params.locale as keyof typeof translations] || translations.uz;
  return {
    title: pageT.pageTitle,
    description: pageT.heroDescription,
  };
}

export default function ContactPage({ params }: PageProps) {
  return <ContactContent locale={params.locale} />;
}

function ContactContent({ locale }: { locale: string }) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const contactIcons = [Phone, Mail, MapPin, Clock];
  const contactHrefs = ['tel:1172', 'mailto:info@bv.gov.uz', 'https://maps.google.com', null];

  return (
    <main id="main-content" className="min-h-screen bg-gov-light">
      {/* Hero Section */}
      <section className="bg-primary-800 py-10 text-white sm:py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
              <div className="rounded-lg bg-white/10 p-2 sm:rounded-xl sm:p-3">
                <MessageSquare className="h-6 w-6 text-accent-gold sm:h-8 sm:w-8" />
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

      {/* Contact Info Cards */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {t.contactInfo.map((item, index) => {
              const Icon = contactIcons[index];
              const href = contactHrefs[index];
              return (
                <Card
                  key={index}
                  variant="elevated"
                  className="p-3 transition-shadow hover:shadow-lg sm:p-4 lg:p-6"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl lg:h-12 lg:w-12">
                    <Icon className="h-4 w-4 text-primary-600 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </div>
                  <h3 className="mb-0.5 text-xs font-medium text-text-secondary sm:mb-1 sm:text-sm">
                    {item.title}
                  </h3>
                  {href ? (
                    <a
                      href={href}
                      className="mb-0.5 block break-words font-heading text-sm font-semibold text-primary-800 transition-colors hover:text-primary-600 sm:mb-1 sm:text-base lg:text-lg"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mb-0.5 font-heading text-sm font-semibold text-primary-800 sm:mb-1 sm:text-base lg:text-lg">
                      {item.value}
                    </p>
                  )}
                  <p className="hidden text-xs text-text-muted sm:block sm:text-sm">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="section-container">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-1.5 font-heading text-xl font-bold text-text-primary sm:mb-2 sm:text-2xl">
                {t.formTitle}
              </h2>
              <p className="mb-6 text-sm text-text-secondary sm:mb-8 sm:text-base">
                {t.formDescription}
              </p>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                      {t.formFields.name}
                    </label>
                    <Input
                      type="text"
                      placeholder={t.formFields.namePlaceholder}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                      {t.formFields.phone}
                    </label>
                    <Input type="tel" placeholder="+998 90 123 45 67" className="w-full text-sm" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                    {t.formFields.email}
                  </label>
                  <Input type="email" placeholder="email@example.com" className="w-full text-sm" />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                    {t.formFields.subject}
                  </label>
                  <Input
                    type="text"
                    placeholder={t.formFields.subjectPlaceholder}
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-primary sm:mb-2 sm:text-sm">
                    {t.formFields.message}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t.formFields.messagePlaceholder}
                    className="w-full resize-none rounded-lg border border-gov-border bg-gov-surface px-3 py-2.5 text-sm text-text-primary transition-shadow placeholder:text-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 sm:rounded-xl sm:px-4 sm:py-3"
                  />
                </div>

                <Button type="submit" size="md" className="w-full text-sm sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  {t.formFields.submit}
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h2 className="mb-1.5 font-heading text-xl font-bold text-text-primary sm:mb-2 sm:text-2xl">
                {t.additionalInfo}
              </h2>
              <p className="mb-6 text-sm text-text-secondary sm:mb-8 sm:text-base">
                {t.ministryName.split(' ').slice(0, 3).join(' ')}
              </p>

              <Card variant="outlined" className="mb-4 p-4 sm:mb-6 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-primary-100 p-2 sm:rounded-xl sm:p-3">
                    <Building2 className="h-5 w-5 text-primary-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1.5 text-sm font-semibold text-text-primary sm:mb-2 sm:text-base">
                      {t.ministryName}
                    </h3>
                    <p className="mb-3 text-xs text-text-secondary sm:mb-4 sm:text-sm">
                      {t.ministryAddress}
                    </p>
                    <a
                      href="https://mehnat.uz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 sm:gap-2 sm:text-sm"
                    >
                      mehnat.uz
                      <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card variant="outlined" className="p-4 sm:p-6">
                <h3 className="mb-3 text-sm font-semibold text-text-primary sm:mb-4 sm:text-base">
                  {t.socialNetworks}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <a
                    href="https://t.me/mehnatuz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#0088cc] px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    Telegram
                  </a>
                  <a
                    href="https://facebook.com/mehnatuz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#1877f2] px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                </div>
              </Card>

              {/* Map placeholder */}
              <div className="mt-4 flex h-48 items-center justify-center rounded-lg border border-gov-border bg-gov-light sm:mt-6 sm:h-64 sm:rounded-xl">
                <div className="text-center text-text-muted">
                  <MapPin className="mx-auto mb-1.5 h-8 w-8 text-primary-400 sm:mb-2 sm:h-10 sm:w-10" />
                  <p className="text-sm">{t.mapLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
