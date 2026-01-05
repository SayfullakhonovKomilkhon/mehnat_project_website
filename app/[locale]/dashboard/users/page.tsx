'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoleGuard } from '@/components/dashboard/RoleGuard';
import { 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  Calendar,
  Key,
  Plus,
} from 'lucide-react';
import {
  adminGetUsers,
  adminGetRoles,
  adminUpdateUserRole,
  adminUpdateUserStatus,
  adminDeleteUser,
  adminCreateUser,
} from '@/lib/api';
import type { Locale } from '@/types';

interface UsersPageProps {
  params: { locale: string };
}

// Translations
const translations = {
  uz: {
    title: 'Foydalanuvchilar',
    subtitle: 'Tizim foydalanuvchilarini boshqarish',
    addUser: 'Yangi foydalanuvchi',
    search: 'Ism yoki email bo\'yicha qidirish...',
    id: 'ID',
    name: 'Ism',
    email: 'Email',
    role: 'Rol',
    status: 'Holat',
    lastLogin: 'Oxirgi kirish',
    actions: 'Amallar',
    active: 'Faol',
    blocked: 'Bloklangan',
    edit: 'Tahrirlash',
    block: 'Bloklash',
    activate: 'Faollashtirish',
    resetPassword: 'Parolni tiklash',
    delete: 'O\'chirish',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    createUser: 'Yangi foydalanuvchi yaratish',
    editUser: 'Foydalanuvchini tahrirlash',
    password: 'Parol',
    passwordHint: 'Kamida 8 ta belgi',
    selectRole: 'Rolni tanlang',
    admin: 'Administrator',
    muallif: 'Muallif',
    tarjimon: 'Tarjimon',
    ishchi_guruh: 'Ishchi guruh',
    ekspert: 'Ekspert',
    showing: 'Ko\'rsatilmoqda',
    of: 'dan',
    results: 'natija',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    noUsers: 'Foydalanuvchilar topilmadi',
    confirmDelete: 'Rostdan ham o\'chirmoqchimisiz?',
    confirmBlock: 'Foydalanuvchini bloklashni xohlaysizmi?',
    userDetails: 'Foydalanuvchi ma\'lumotlari',
    createdAt: 'Ro\'yxatdan o\'tgan',
    showPassword: 'Parolni ko\'rsatish',
    hidePassword: 'Parolni yashirish',
    defaultPassword: 'Standart parol',
    close: 'Yopish',
    passwordNote: 'Parollar xavfsizlik uchun shifrlangan. Quyida standart parol ko\'rsatilgan.',
  },
  ru: {
    title: 'Пользователи',
    subtitle: 'Управление пользователями системы',
    addUser: 'Новый пользователь',
    search: 'Поиск по имени или email...',
    id: 'ID',
    name: 'Имя',
    email: 'Email',
    role: 'Роль',
    status: 'Статус',
    lastLogin: 'Последний вход',
    actions: 'Действия',
    active: 'Активен',
    blocked: 'Заблокирован',
    edit: 'Редактировать',
    block: 'Заблокировать',
    activate: 'Активировать',
    resetPassword: 'Сбросить пароль',
    delete: 'Удалить',
    save: 'Сохранить',
    cancel: 'Отмена',
    createUser: 'Создать пользователя',
    editUser: 'Редактировать пользователя',
    password: 'Пароль',
    passwordHint: 'Минимум 8 символов',
    selectRole: 'Выберите роль',
    admin: 'Администратор',
    muallif: 'Автор',
    tarjimon: 'Переводчик',
    ishchi_guruh: 'Рабочая группа',
    ekspert: 'Эксперт',
    showing: 'Показано',
    of: 'из',
    results: 'результатов',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    noUsers: 'Пользователи не найдены',
    confirmDelete: 'Вы уверены, что хотите удалить?',
    confirmBlock: 'Вы хотите заблокировать пользователя?',
    userDetails: 'Информация о пользователе',
    createdAt: 'Дата регистрации',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    defaultPassword: 'Стандартный пароль',
    close: 'Закрыть',
    passwordNote: 'Пароли зашифрованы для безопасности. Ниже показан стандартный пароль.',
  },
  en: {
    title: 'Users',
    subtitle: 'Manage system users',
    addUser: 'New User',
    search: 'Search by name or email...',
    id: 'ID',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    lastLogin: 'Last Login',
    actions: 'Actions',
    active: 'Active',
    blocked: 'Blocked',
    edit: 'Edit',
    block: 'Block',
    activate: 'Activate',
    resetPassword: 'Reset Password',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    createUser: 'Create User',
    editUser: 'Edit User',
    password: 'Password',
    passwordHint: 'At least 8 characters',
    selectRole: 'Select role',
    admin: 'Administrator',
    muallif: 'Author',
    tarjimon: 'Translator',
    ishchi_guruh: 'Working Group',
    ekspert: 'Expert',
    showing: 'Showing',
    of: 'of',
    results: 'results',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    noUsers: 'No users found',
    confirmDelete: 'Are you sure you want to delete?',
    confirmBlock: 'Do you want to block this user?',
    userDetails: 'User Details',
    createdAt: 'Registered',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    defaultPassword: 'Default password',
    close: 'Close',
    passwordNote: 'Passwords are encrypted for security. Default password is shown below.',
  },
};

// Default passwords based on role (from seeder)
const defaultPasswords: Record<string, string> = {
  admin: 'Admin123!',
  moderator: 'ModeratorPass123!',
  user: 'UserPass123!',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  muallif: 'bg-blue-100 text-blue-800',
  tarjimon: 'bg-green-100 text-green-800',
  ishchi_guruh: 'bg-purple-100 text-purple-800',
  ekspert: 'bg-yellow-100 text-yellow-800',
};

export default function UsersPage({ params: { locale } }: UsersPageProps) {
  const t = translations[locale as keyof typeof translations] || translations.uz;
  
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'muallif',
    roleId: 2,
    isActive: true,
  });

  // Load data from API
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        adminGetUsers(locale as Locale),
        adminGetRoles(locale as Locale),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(t.error);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, [locale, t.error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role?.slug || user.role?.name || 'muallif',
        roleId: user.role?.id || user.role_id || 2,
        isActive: user.is_active !== false,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'muallif',
        roleId: 2,
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = !user.is_active;
    if (!newStatus && !confirm(t.confirmBlock)) return;
    
    setSaving(true);
    try {
      const result = await adminUpdateUserStatus(user.id, newStatus, locale as Locale);
      if (result.success) {
        await loadData();
      } else {
        alert(result.error || t.error);
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: any) => {
    if (!confirm(t.confirmDelete)) return;
    
    setSaving(true);
    try {
      const result = await adminDeleteUser(user.id, locale as Locale);
      if (result.success) {
        await loadData();
      } else {
        alert(result.error || t.error);
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    try {
      if (editingUser) {
        // Update existing user's role
        const result = await adminUpdateUserRole(editingUser.id, formData.roleId, locale as Locale);
        if (result.success) {
          setModalOpen(false);
          await loadData();
        } else {
          alert(result.error || t.error);
        }
      } else {
        // Create new user
        if (!formData.name || !formData.email || !formData.password) {
          alert('Please fill all required fields');
          setSaving(false);
          return;
        }
        
        const result = await adminCreateUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
          role_id: formData.roleId,
        }, locale as Locale);
        
        if (result.success) {
          setModalOpen(false);
          await loadData();
        } else {
          alert(result.error || t.error);
        }
      }
    } catch (err) {
      alert(t.error);
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: any) => {
    const roleName = role?.slug || role?.name || role;
    return t[roleName as keyof typeof t] || roleName;
  };

  const getRoleSlug = (role: any) => {
    return role?.slug || role?.name || role || 'muallif';
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setShowPassword(false);
    setDetailsModalOpen(true);
  };

  const getDefaultPassword = (user: any) => {
    const roleSlug = getRoleSlug(user.role);
    if (roleSlug === 'admin') return defaultPasswords.admin;
    if (roleSlug === 'moderator') return defaultPasswords.moderator;
    return defaultPasswords.user;
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-gray-500">{t.loading}</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['admin']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <RefreshCw className="w-4 h-4" />
              {t.retry}
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.addUser}
            </button>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.id}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.name}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.email}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.role}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {t.noUsers}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewDetails(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleColors[getRoleSlug(user.role)] || 'bg-gray-100 text-gray-800'}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active !== false ? t.active : t.blocked}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                            title={t.edit}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded ${
                              user.is_active !== false 
                                ? 'text-orange-600 hover:bg-orange-100' 
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={user.is_active !== false ? t.block : t.activate}
                            disabled={saving}
                          >
                            {user.is_active !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                            title={t.delete}
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t.showing} <span className="font-medium">{filteredUsers.length}</span> {t.of}{' '}
              <span className="font-medium">{users.length}</span> {t.results}
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !saving && setModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                disabled={saving}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingUser ? t.editUser : t.createUser}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.name} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={!!editingUser || saving}
                    required={!editingUser}
                    placeholder={!editingUser ? 'John Doe' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.email} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={!!editingUser || saving}
                    required={!editingUser}
                    placeholder={!editingUser ? 'user@example.com' : ''}
                  />
                </div>

                {/* Password field - only for creating new user */}
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.password} *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={saving}
                      required
                      placeholder={t.passwordHint}
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.passwordHint}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.role}
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => {
                      const selectedRole = roles.find(r => r.id === parseInt(e.target.value));
                      setFormData({ 
                        ...formData, 
                        roleId: parseInt(e.target.value),
                        role: selectedRole?.slug || selectedRole?.name || 'muallif'
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={saving}
                  >
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.display_name || role.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">{t.admin}</option>
                        <option value="2">{t.muallif}</option>
                        <option value="3">{t.tarjimon}</option>
                        <option value="4">{t.ishchi_guruh}</option>
                        <option value="5">{t.ekspert}</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    disabled={saving}
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {detailsModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDetailsModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                {t.userDetails}
              </h3>

              <div className="space-y-4">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-gray-900">{selectedUser.name}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${roleColors[getRoleSlug(selectedUser.role)] || 'bg-gray-100 text-gray-800'}`}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="grid gap-3">
                  {/* ID */}
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-medium">ID</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{t.id}</div>
                      <div className="text-sm font-medium text-gray-900">{selectedUser.id}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{t.email}</div>
                      <div className="text-sm font-medium text-gray-900">{selectedUser.email}</div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                      <div className="text-sm font-medium text-gray-900">{getRoleLabel(selectedUser.role)}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedUser.is_active !== false ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {selectedUser.is_active !== false ? (
                        <UserCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <UserX className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{t.status}</div>
                      <div className={`text-sm font-medium ${
                        selectedUser.is_active !== false ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedUser.is_active !== false ? t.active : t.blocked}
                      </div>
                    </div>
                  </div>

                  {/* Created At */}
                  {selectedUser.created_at && (
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{t.createdAt}</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(selectedUser.created_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="p-3 border border-gray-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-gray-500">{t.defaultPassword}</span>
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            {t.hidePassword}
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            {t.showPassword}
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={getDefaultPassword(selectedUser)}
                        readOnly
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚠️ {t.passwordNote}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
