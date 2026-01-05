'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageSwitcher } from '@/components/layout';
import Link from 'next/link';

interface LoginPageProps {
  params: { locale: string };
}

// Translations for login page
const translations = {
  uz: {
    title: 'Admin Panelga Kirish',
    subtitle: 'Mehnat Kodeksiga Sharh',
    emailLabel: 'Email manzilingiz',
    emailPlaceholder: 'email@example.com',
    passwordLabel: 'Parolingiz',
    passwordPlaceholder: 'Parolni kiriting',
    rememberMe: 'Meni eslab qol',
    forgotPassword: 'Parolni unutdingizmi?',
    login: 'Kirish',
    loggingIn: 'Kirilmoqda...',
    backToSite: 'Saytga qaytish',
    invalidEmail: 'Yaroqli email kiriting',
    passwordRequired: 'Parol kiritilishi shart',
    loginError: 'Email yoki parol noto\'g\'ri',
  },
  ru: {
    title: 'Вход в Админ Панель',
    subtitle: 'Комментарии к Трудовому Кодексу',
    emailLabel: 'Ваш email',
    emailPlaceholder: 'email@example.com',
    passwordLabel: 'Ваш пароль',
    passwordPlaceholder: 'Введите пароль',
    rememberMe: 'Запомнить меня',
    forgotPassword: 'Забыли пароль?',
    login: 'Войти',
    loggingIn: 'Вход...',
    backToSite: 'Вернуться на сайт',
    invalidEmail: 'Введите корректный email',
    passwordRequired: 'Пароль обязателен',
    loginError: 'Неверный email или пароль',
  },
  en: {
    title: 'Admin Panel Login',
    subtitle: 'Labor Code Commentary',
    emailLabel: 'Your email',
    emailPlaceholder: 'email@example.com',
    passwordLabel: 'Your password',
    passwordPlaceholder: 'Enter password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    login: 'Login',
    loggingIn: 'Logging in...',
    backToSite: 'Back to site',
    invalidEmail: 'Enter a valid email',
    passwordRequired: 'Password is required',
    loginError: 'Invalid email or password',
  },
};

// Inner component that uses auth context
function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const txt = translations[locale as keyof typeof translations] || translations.uz;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(`/${locale}/dashboard`);
    }
  }, [isAuthenticated, authLoading, router, locale]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = txt.invalidEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = txt.invalidEmail;
    }
    
    if (!password) {
      newErrors.password = txt.passwordRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      router.push(`/${locale}/dashboard`);
    } else {
      setError(result.error || txt.loginError);
    }
    
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 p-4">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
        }}
      />

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher locale={locale} variant="default" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {txt.title}
            </h1>
            <p className="text-gray-500 text-sm">
              {txt.subtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                {txt.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder={txt.emailPlaceholder}
                className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                {txt.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder={txt.passwordPlaceholder}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">{txt.rememberMe}</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {txt.forgotPassword}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {txt.loggingIn}
                </>
              ) : (
                txt.login
              )}
            </button>
          </form>

          {/* Back to Site */}
          <div className="mt-6 text-center">
            <Link
              href={`/${locale}`}
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              ← {txt.backToSite}
            </Link>
          </div>
        </div>

        {/* Demo Accounts Info */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
              DEMO MODE
            </span>
          </div>
          <p className="text-white/80 text-sm text-center mb-3">
            {locale === 'uz' ? 'Istalgan parol bilan kirish mumkin:' : 
             locale === 'ru' ? 'Войдите с любым паролем:' : 
             'Login with any password:'}
          </p>
          <div className="space-y-1.5 text-xs text-white/70">
            <div className="flex justify-between">
              <span className="font-mono">admin@admin.com</span>
              <span className="text-yellow-300">Admin</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">muallif@gmail.com</span>
              <span className="text-blue-300">Muallif</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">translater@crudbooster.com</span>
              <span className="text-green-300">Tarjimon</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">workers@gmail.com</span>
              <span className="text-purple-300">Ishchi guruh</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">expert@gmail.com</span>
              <span className="text-orange-300">Ekspert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with AuthProvider wrapper
export default function LoginPage({ params: { locale } }: LoginPageProps) {
  return (
    <AuthProvider>
      <LoginForm locale={locale} />
    </AuthProvider>
  );
}
