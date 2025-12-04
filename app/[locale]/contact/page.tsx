import { useTranslations } from 'next-intl';
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
  ExternalLink
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'common' });
  return {
    title: t('contact'),
    description: 'Mehnat Kodeksiga Sharh portali bilan bog\'lanish',
  };
}

export default function ContactPage({ params }: PageProps) {
  return <ContactContent locale={params.locale} />;
}

function ContactContent({ locale }: { locale: string }) {
  const t = useTranslations();

  const contactInfo = [
    {
      icon: Phone,
      title: 'Ishonch telefoni',
      value: '1172',
      description: 'Bepul qo\'ng\'iroq (24/7)',
      href: 'tel:1172'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@mehnat.uz',
      description: 'Savollaringiz uchun',
      href: 'mailto:info@mehnat.uz'
    },
    {
      icon: MapPin,
      title: 'Manzil',
      value: 'Toshkent sh., Amir Temur ko\'chasi, 4',
      description: 'Mehnat vazirligi',
      href: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Ish vaqti',
      value: 'Du-Ju: 9:00 - 18:00',
      description: 'Shanba-Yakshanba: dam olish',
      href: null
    }
  ];

  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/mehnatuz', icon: Send },
    { name: 'Facebook', href: 'https://facebook.com/mehnatuz', icon: 'facebook' },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-gov-light">
      {/* Hero Section */}
      <section className="bg-primary-800 text-white py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <MessageSquare className="w-8 h-8 text-accent-gold" />
              </div>
              <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">
                {t('common.contact')}
              </span>
            </div>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-6">
              Biz bilan bog'laning
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning. 
              Sizga yordam berishdan mamnun bo'lamiz.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-16">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <Card key={index} variant="elevated" className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-medium text-text-secondary text-sm mb-1">
                  {item.title}
                </h3>
                {item.href ? (
                  <a 
                    href={item.href}
                    className="font-heading font-semibold text-lg text-primary-800 hover:text-primary-600 transition-colors block mb-1"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-heading font-semibold text-lg text-primary-800 mb-1">
                    {item.value}
                  </p>
                )}
                <p className="text-sm text-text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
                Xabar yuborish
              </h2>
              <p className="text-text-secondary mb-8">
                Formani to'ldiring va biz siz bilan bog'lanamiz
              </p>

              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Ismingiz
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Ismingizni kiriting"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Telefon
                    </label>
                    <Input 
                      type="tel" 
                      placeholder="+998 90 123 45 67"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Mavzu
                  </label>
                  <Input 
                    type="text" 
                    placeholder="Xabar mavzusi"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Xabar matni
                  </label>
                  <textarea 
                    rows={5}
                    placeholder="Xabaringizni yozing..."
                    className="w-full px-4 py-3 rounded-xl border border-gov-border bg-gov-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="w-5 h-5 mr-2" />
                  Xabar yuborish
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
                Qo'shimcha ma'lumot
              </h2>
              <p className="text-text-secondary mb-8">
                Mehnat va ijtimoiy himoya vazirligi
              </p>

              <Card variant="outlined" className="p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">
                      O'zbekiston Respublikasi Mehnat va ijtimoiy himoya vazirligi
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      100000, Toshkent shahri, Amir Temur ko'chasi, 4-uy
                    </p>
                    <a 
                      href="https://mehnat.uz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      mehnat.uz
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card variant="outlined" className="p-6">
                <h3 className="font-semibold text-text-primary mb-4">
                  Ijtimoiy tarmoqlar
                </h3>
                <div className="flex gap-3">
                  <a 
                    href="https://t.me/mehnatuz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                    Telegram
                  </a>
                  <a 
                    href="https://facebook.com/mehnatuz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1877f2] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                </div>
              </Card>

              {/* Map placeholder */}
              <div className="mt-6 h-64 bg-gov-light rounded-xl flex items-center justify-center border border-gov-border">
                <div className="text-center text-text-muted">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-primary-400" />
                  <p>Xarita joylashuvi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


