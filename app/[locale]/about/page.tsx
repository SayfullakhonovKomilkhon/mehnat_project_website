import { useTranslations } from 'next-intl';
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
  Building2
} from 'lucide-react';
import { Card } from '@/components/ui';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'common' });
  return {
    title: t('about'),
    description: 'O\'zbekiston Respublikasi Mehnat kodeksiga sharh - rasmiy portal haqida',
  };
}

export default function AboutPage({ params }: PageProps) {
  return <AboutContent locale={params.locale} />;
}

function AboutContent({ locale }: { locale: string }) {
  const t = useTranslations();

  const features = [
    {
      icon: BookOpen,
      title: 'Rasmiy sharh',
      description: 'Mehnat kodeksining har bir moddasiga batafsil huquqiy sharh va izohlar'
    },
    {
      icon: Scale,
      title: 'Huquqiy aniqlik',
      description: 'Yuridik ekspertlar tomonidan tasdiqlangan professional izohlar'
    },
    {
      icon: Users,
      title: 'Foydalanuvchilar uchun',
      description: 'Ishchilar, ish beruvchilar va huquqshunoslarga mo\'ljallangan'
    },
    {
      icon: Shield,
      title: 'Ishonchlilik',
      description: 'Davlat tomonidan tasdiqlangan va yangilangan ma\'lumotlar'
    }
  ];

  const stats = [
    { value: '600+', label: 'Moddalar' },
    { value: '50+', label: 'Boblar' },
    { value: '6', label: 'Bo\'limlar' },
    { value: '3', label: 'Tillar' },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-gov-light">
      {/* Hero Section */}
      <section className="bg-primary-800 text-white py-16 lg:py-24">
        <div className="section-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <Building2 className="w-8 h-8 text-accent-gold" />
              </div>
              <span className="text-primary-200 text-sm font-medium uppercase tracking-wider">
                {t('common.about')}
              </span>
            </div>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-6">
              Mehnat Kodeksiga Sharh
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              O'zbekiston Respublikasi Mehnat kodeksining rasmiy sharhi va izohlari. 
              Ushbu portal mehnat huquqi bo'yicha eng ishonchli va to'liq ma'lumot manbayi hisoblanadi.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-gov-border">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              Portal imkoniyatlari
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Mehnat qonunchiligi bo'yicha eng to'liq ma'lumotlar bazasi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} variant="outlined" className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-primary-600" />
                <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
                  Bizning maqsad
                </span>
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-text-primary mb-6">
                Mehnat huquqlarini himoya qilish
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  Bizning asosiy maqsadimiz - O'zbekiston fuqarolariga mehnat qonunchiligi 
                  bo'yicha to'liq va aniq ma'lumot taqdim etishdir.
                </p>
                <p>
                  Portal orqali har bir fuqaro o'z huquqlarini bilib olishi, 
                  ish beruvchi bilan munosabatlarni to'g'ri shakllantirishi mumkin.
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  'Bepul foydalanish',
                  'Doimiy yangilanishlar',
                  'Professional sharhlar',
                  'Ko\'p tilli qo\'llab-quvvatlash'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary-50 rounded-2xl p-8 lg:p-12">
              <Award className="w-16 h-16 text-primary-600 mb-6" />
              <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                Davlat tomonidan tasdiqlangan
              </h3>
              <p className="text-text-secondary mb-6">
                Ushbu portal O'zbekiston Respublikasi Mehnat va ijtimoiy himoya vazirligi 
                bilan hamkorlikda ishlab chiqilgan va rasmiy ma'lumotlar manbai hisoblanadi.
              </p>
              <div className="flex items-center gap-3 text-sm text-primary-600 font-medium">
                <Shield className="w-5 h-5" />
                <span>Rasmiy tasdiqlangan</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


