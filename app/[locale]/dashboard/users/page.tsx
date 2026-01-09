'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import {
  Users,
  Plus,
  Loader2,
  Search,
  Trash2,
  Shield,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import { adminGetUsers, adminCreateUser, adminDeleteUser } from '@/lib/api';
import type { Locale } from '@/types';

interface UsersPageProps {
  params: { locale: string };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: { name: string };
  created_at: string;
  is_active: boolean;
}

const translations = {
  uz: {
    title: 'Foydalanuvchilar',
    subtitle: 'Tizim foydalanuvchilarini boshqaring',
    addUser: "Foydalanuvchi qo'shish",
    searchPlaceholder: 'Qidirish...',
    name: 'Ism',
    email: 'Email',
    role: 'Rol',
    createdAt: 'Yaratilgan',
    actions: 'Harakatlar',
    delete: "O'chirish",
    noUsers: "Foydalanuvchilar yo'q",
    loading: 'Yuklanmoqda...',
    confirmDelete: "Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?",
    createUser: "Yangi foydalanuvchi qo'shish",
    namePlaceholder: 'Ism kiriting',
    emailPlaceholder: 'Email kiriting',
    passwordPlaceholder: 'Parol kiriting',
    password: 'Parol',
    cancel: 'Bekor qilish',
    create: 'Yaratish',
    creating: 'Yaratilmoqda...',
    success: "Foydalanuvchi muvaffaqiyatli qo'shildi",
    error: 'Xatolik yuz berdi',
    admin: 'Administrator',
  },
  ru: {
    title: 'Пользователи',
    subtitle: 'Управление пользователями системы',
    addUser: 'Добавить пользователя',
    searchPlaceholder: 'Поиск...',
    name: 'Имя',
    email: 'Email',
    role: 'Роль',
    createdAt: 'Создан',
    actions: 'Действия',
    delete: 'Удалить',
    noUsers: 'Нет пользователей',
    loading: 'Загрузка...',
    confirmDelete: 'Вы уверены, что хотите удалить этого пользователя?',
    createUser: 'Создать пользователя',
    namePlaceholder: 'Введите имя',
    emailPlaceholder: 'Введите email',
    passwordPlaceholder: 'Введите пароль',
    password: 'Пароль',
    cancel: 'Отмена',
    create: 'Создать',
    creating: 'Создание...',
    success: 'Пользователь успешно создан',
    error: 'Произошла ошибка',
    admin: 'Администратор',
  },
  en: {
    title: 'Users',
    subtitle: 'Manage system users',
    addUser: 'Add User',
    searchPlaceholder: 'Search...',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    createdAt: 'Created',
    actions: 'Actions',
    delete: 'Delete',
    noUsers: 'No users',
    loading: 'Loading...',
    confirmDelete: 'Are you sure you want to delete this user?',
    createUser: 'Create User',
    namePlaceholder: 'Enter name',
    emailPlaceholder: 'Enter email',
    passwordPlaceholder: 'Enter password',
    password: 'Password',
    cancel: 'Cancel',
    create: 'Create',
    creating: 'Creating...',
    success: 'User created successfully',
    error: 'An error occurred',
    admin: 'Administrator',
  },
};

export default function UsersPage({ params: { locale } }: UsersPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGetUsers(locale as Locale);
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [locale]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const result = await adminCreateUser(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
          role_id: 1, // Admin role
        },
        locale as Locale
      );

      if (result.success) {
        setSuccess(t.success);
        setFormData({ name: '', email: '', password: '' });
        setShowCreateModal(false);
        fetchUsers();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      const result = await adminDeleteUser(userId, locale as Locale);
      if (result.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-100 p-3">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-500">{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            {t.addUser}
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Users Table */}
        {!loading && filteredUsers.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{t.noUsers}</p>
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.name}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.email}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.role}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.createdAt}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                          <Shield className="h-3.5 w-3.5" />
                          {t.admin}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          title={t.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-x-auto">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{t.createUser}</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-6">
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t.name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.namePlaceholder}
                      required
                      disabled={creating}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.emailPlaceholder}
                      required
                      disabled={creating}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t.password} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder={t.passwordPlaceholder}
                      required
                      minLength={8}
                      disabled={creating}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.creating}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        {t.create}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}
