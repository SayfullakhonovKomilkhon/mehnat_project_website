'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
  Server,
} from 'lucide-react';

interface SettingsPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Sozlamalar',
    subtitle: 'Tizim sozlamalari va konfiguratsiyasi',
    general: 'Umumiy',
    cache: 'Kesh',
    notifications: 'Bildirishnomalar',
    security: 'Xavfsizlik',
    siteName: 'Sayt nomi',
    siteDescription: 'Sayt tavsifi',
    defaultLanguage: 'Standart til',
    enableRegistration: "Ro'yxatdan o'tishni yoqish",
    enableComments: 'Sharhlarni yoqish',
    moderateComments: 'Sharhlarni moderatsiya qilish',
    clearCache: 'Keshni tozalash',
    clearCacheDesc: 'Barcha keshni tozalash',
    clearingCache: 'Tozalanmoqda...',
    cacheCleared: 'Kesh tozalandi',
    emailNotifications: 'Email bildirishnomalar',
    pushNotifications: 'Push bildirishnomalar',
    newCommentNotify: 'Yangi sharh haqida xabar berish',
    newUserNotify: 'Yangi foydalanuvchi haqida xabar berish',
    twoFactorAuth: 'Ikki bosqichli autentifikatsiya',
    sessionTimeout: 'Sessiya vaqti (daqiqa)',
    save: 'Saqlash',
    saving: 'Saqlanmoqda...',
    saved: 'Saqlandi',
    apiUrl: 'API manzili',
    backendStatus: 'Backend holati',
    online: 'Onlayn',
    offline: 'Oflayn',
    checkStatus: 'Holatni tekshirish',
  },
  ru: {
    title: 'Настройки',
    subtitle: 'Настройки и конфигурация системы',
    general: 'Общие',
    cache: 'Кэш',
    notifications: 'Уведомления',
    security: 'Безопасность',
    siteName: 'Название сайта',
    siteDescription: 'Описание сайта',
    defaultLanguage: 'Язык по умолчанию',
    enableRegistration: 'Включить регистрацию',
    enableComments: 'Включить комментарии',
    moderateComments: 'Модерировать комментарии',
    clearCache: 'Очистить кэш',
    clearCacheDesc: 'Очистить весь кэш системы',
    clearingCache: 'Очистка...',
    cacheCleared: 'Кэш очищен',
    emailNotifications: 'Email уведомления',
    pushNotifications: 'Push уведомления',
    newCommentNotify: 'Уведомлять о новых комментариях',
    newUserNotify: 'Уведомлять о новых пользователях',
    twoFactorAuth: 'Двухфакторная аутентификация',
    sessionTimeout: 'Время сессии (минуты)',
    save: 'Сохранить',
    saving: 'Сохранение...',
    saved: 'Сохранено',
    apiUrl: 'API адрес',
    backendStatus: 'Статус бэкенда',
    online: 'Онлайн',
    offline: 'Офлайн',
    checkStatus: 'Проверить статус',
  },
  en: {
    title: 'Settings',
    subtitle: 'System settings and configuration',
    general: 'General',
    cache: 'Cache',
    notifications: 'Notifications',
    security: 'Security',
    siteName: 'Site Name',
    siteDescription: 'Site Description',
    defaultLanguage: 'Default Language',
    enableRegistration: 'Enable Registration',
    enableComments: 'Enable Comments',
    moderateComments: 'Moderate Comments',
    clearCache: 'Clear Cache',
    clearCacheDesc: 'Clear all system cache',
    clearingCache: 'Clearing...',
    cacheCleared: 'Cache cleared',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    newCommentNotify: 'Notify on new comments',
    newUserNotify: 'Notify on new users',
    twoFactorAuth: 'Two-Factor Authentication',
    sessionTimeout: 'Session Timeout (minutes)',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    apiUrl: 'API URL',
    backendStatus: 'Backend Status',
    online: 'Online',
    offline: 'Offline',
    checkStatus: 'Check Status',
  },
};

export default function SettingsPage({ params: { locale } }: SettingsPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('online');

  const [settings, setSettings] = useState({
    siteName: 'Mehnat Kodeksiga Sharh',
    siteDescription: "O'zbekiston Respublikasi Mehnat kodeksiga sharhlar portali",
    defaultLanguage: 'uz',
    enableRegistration: true,
    enableComments: true,
    moderateComments: true,
    emailNotifications: true,
    pushNotifications: false,
    newCommentNotify: true,
    newUserNotify: true,
    twoFactorAuth: false,
    sessionTimeout: 60,
  });

  const tabs = [
    { key: 'general', label: t.general, icon: <Globe className="h-4 w-4" /> },
    { key: 'cache', label: t.cache, icon: <Database className="h-4 w-4" /> },
    { key: 'notifications', label: t.notifications, icon: <Bell className="h-4 w-4" /> },
    { key: 'security', label: t.security, icon: <Shield className="h-4 w-4" /> },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      // Try to trigger cache clear on backend
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      // For now, just simulate - in production, call a cache clear endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    } catch (err) {
      console.error('Error clearing cache:', err);
    } finally {
      setClearingCache(false);
    }
  };

  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'https://mehnat-project.onrender.com/api/v1';
      const response = await fetch(`${apiUrl}/sections`, { method: 'HEAD' });
      setBackendStatus(response.ok ? 'online' : 'offline');
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-1 text-gray-500">{t.subtitle}</p>
        </div>

        {/* Settings Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-primary-600 bg-primary-50 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.siteName}
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.siteDescription}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.siteDescription}
                    onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.defaultLanguage}
                  </label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={e => setSettings({ ...settings, defaultLanguage: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="uz">O'zbekcha</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.enableRegistration}
                      onChange={e =>
                        setSettings({ ...settings, enableRegistration: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{t.enableRegistration}</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.enableComments}
                      onChange={e => setSettings({ ...settings, enableComments: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{t.enableComments}</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.moderateComments}
                      onChange={e =>
                        setSettings({ ...settings, moderateComments: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{t.moderateComments}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Cache Settings */}
            {activeTab === 'cache' && (
              <div className="space-y-6">
                {/* Backend Status */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t.backendStatus}</p>
                        <p className="text-sm text-gray-500">
                          {t.apiUrl}:{' '}
                          {process.env.NEXT_PUBLIC_API_URL ||
                            'https://mehnat-project.onrender.com/api/v1'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${
                          backendStatus === 'online'
                            ? 'bg-green-100 text-green-700'
                            : backendStatus === 'offline'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {backendStatus === 'checking' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : backendStatus === 'online' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        {backendStatus === 'online'
                          ? t.online
                          : backendStatus === 'offline'
                            ? t.offline
                            : '...'}
                      </span>
                      <button
                        onClick={checkBackendStatus}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-200"
                        title={t.checkStatus}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${backendStatus === 'checking' ? 'animate-spin' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clear Cache */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trash2 className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t.clearCache}</p>
                        <p className="text-sm text-gray-500">{t.clearCacheDesc}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearCache}
                      disabled={clearingCache}
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {clearingCache ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.clearingCache}
                        </>
                      ) : cacheCleared ? (
                        <>
                          <Check className="h-4 w-4" />
                          {t.cacheCleared}
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          {t.clearCache}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {t.emailNotifications}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={e =>
                        setSettings({ ...settings, emailNotifications: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {t.pushNotifications}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={e =>
                        setSettings({ ...settings, pushNotifications: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {t.newCommentNotify}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.newCommentNotify}
                      onChange={e =>
                        setSettings({ ...settings, newCommentNotify: e.target.checked })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{t.newUserNotify}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.newUserNotify}
                      onChange={e => setSettings({ ...settings, newUserNotify: e.target.checked })}
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t.twoFactorAuth}</p>
                      <p className="text-xs text-gray-500">Require 2FA for admin users</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={e => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.sessionTimeout}
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={e =>
                      setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 60 })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min={5}
                    max={1440}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.saving}
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {t.saved}
                </>
              ) : (
                t.save
              )}
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
