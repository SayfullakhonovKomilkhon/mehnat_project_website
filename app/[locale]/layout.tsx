import { ReactNode } from 'react';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { inter, fontVariables } from '@/lib/fonts';
import { LayoutWrapper } from '@/components/layout';
import { OrganizationSchema, WebsiteSchema } from '@/components/seo';
import '@/app/globals.css';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

// Base URL for production
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mehnat-kodeksi.uz';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: LocaleLayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'header' });

  const title = "Mehnat Kodeksiga Sharh - O'zbekiston Respublikasi";
  const description = locale === 'uz' 
    ? "O'zbekiston Respublikasi Mehnat kodeksining barcha moddalariga sharhlar, tushuntirishlar va ekspert izohlari"
    : locale === 'ru'
    ? 'Комментарии, разъяснения и экспертные заключения ко всем статьям Трудового кодекса Республики Узбекистан'
    : 'Comments, explanations and expert opinions on all articles of the Labor Code of the Republic of Uzbekistan';

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: `%s | Mehnat Kodeksiga Sharh`,
    },
    description,
    keywords: [
      'mehnat kodeksi',
      'labor code',
      'трудовой кодекс',
      'uzbekistan',
      "o'zbekiston",
      'узбекистан',
      'mehnat qonunlari',
      'трудовое право',
      'labor law',
      'ish huquqi',
      'sharh',
      'комментарий',
      'commentary',
    ],
    authors: [
      { name: "Bandlik va mehnat munosabatlari vazirligi" },
      { name: 'Ministry of Employment and Labor Relations' },
    ],
    creator: "O'zbekiston Respublikasi Hukumati",
    publisher: "Bandlik va mehnat munosabatlari vazirligi",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'uz' ? 'uz_UZ' : locale === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: ['uz_UZ', 'ru_RU', 'en_US'].filter(
        l => l !== (locale === 'uz' ? 'uz_UZ' : locale === 'ru' ? 'ru_RU' : 'en_US')
      ),
      siteName: 'Mehnat Kodeksiga Sharh',
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: `${BASE_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Mehnat Kodeksiga Sharh',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/images/og-image.png`],
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_SITE_VERIFICATION,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'uz-UZ': `${BASE_URL}/uz`,
        'ru-RU': `${BASE_URL}/ru`,
        'en-US': `${BASE_URL}/en`,
      },
    },
    category: 'government',
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={`scroll-smooth ${fontVariables}`}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1E3A8A" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1E3A5F" />
        
        {/* Mobile optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mehnat Kodeksi" />
      </head>
      <body className={`min-h-screen flex flex-col ${inter.className}`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {/* Structured Data */}
          <OrganizationSchema baseUrl={BASE_URL} />
          <WebsiteSchema baseUrl={BASE_URL} locale={locale} />

          {/* Layout Wrapper - handles public vs admin layouts */}
          <LayoutWrapper locale={locale}>
            {children}
          </LayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
