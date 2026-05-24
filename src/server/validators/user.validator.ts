/**
 * Zod схемы для валидации пользователей (User)
 */

import { z } from 'zod';

// =============================================================================
// СХЕМЫ ДЛЯ АУТЕНТИФИКАЦИИ И РЕГИСТРАЦИИ
// =============================================================================

/**
 * Схема для регистрации нового пользователя
 */
export const registerSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100)
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  name: z.string().min(2, 'Имя обязательно').max(100),
  phone: z.string().min(10, 'Телефон обязателен').max(20).optional()
});

/**
 * Схема для входа пользователя
 */
export const loginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(1, 'Пароль обязателен'),
  remember_me: z.boolean().optional().default(false)
});

/**
 * Схема для обновления профиля пользователя
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(20).nullable().optional(),
  addresses: z.array(z.object({
    id: z.number().optional(),
    name: z.string().max(100),
    city: z.string().max(100),
    address: z.string().max(500),
    zip: z.string().max(20).optional(),
    is_default: z.boolean().optional().default(false)
  })).optional()
});

/**
 * Схема для смены пароля
 */
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Текущий пароль обязателен'),
  new_password: z
    .string()
    .min(8, 'Новый пароль должен содержать минимум 8 символов')
    .max(100)
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  confirm_password: z.string().min(1, 'Подтверждение пароля обязательно')
}).refine(data => data.new_password === data.confirm_password, {
  message: 'Пароли не совпадают',
  path: ['confirm_password']
});

/**
 * Схема для восстановления пароля (запрос)
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Некорректный email адрес')
});

/**
 * Схема для сброса пароля (подтверждение)
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Токен обязателен'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100)
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  confirm_password: z.string().min(1, 'Подтверждение пароля обязательно')
}).refine(data => data.password === data.confirm_password, {
  message: 'Пароли не совпадают',
  path: ['confirm_password']
});

// =============================================================================
// СХЕМЫ ДЛЯ АДМИНКИ (УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ)
// =============================================================================

/**
 * Схема для создания пользователя (админ)
 */
export const createUserSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20).optional().nullable(),
  role: z.enum(['customer', 'manager', 'admin']).default('customer'),
  is_blocked: z.boolean().optional().default(false),
  bonus_balance: z.number().min(0).optional().default(0),
  manager_notes: z.string().nullable().optional()
});

/**
 * Схема для обновления пользователя (админ)
 */
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(20).nullable().optional(),
  role: z.enum(['customer', 'manager', 'admin']).optional(),
  is_blocked: z.boolean().optional(),
  bonus_balance: z.number().min(0).optional(),
  segment: z.enum(['new', 'regular', 'vip']).optional(),
  manager_notes: z.string().nullable().optional()
});

/**
 * Схема для query параметров пользователей
 */
export const userQuerySchema = z.object({
  page: z.string().optional().transform(val => {
    const num = parseInt(val || '1', 10);
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  limit: z.string().optional().transform(val => {
    const num = parseInt(val || '20', 10);
    return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
  }),
  
  // Сортировка
  sort: z.enum(['name', 'email', 'created_at', 'last_login_at', 'bonus_balance']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Фильтры
  role: z.enum(['customer', 'manager', 'admin']).optional(),
  segment: z.enum(['new', 'regular', 'vip']).optional(),
  is_blocked: z.string().optional().transform(val => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }),
  
  // Поиск
  search: z.string().optional().transform(val => val?.trim() || ''),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

/**
 * Схема параметров запроса (ID пользователя)
 */
export const userParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10))
});

// Типы для использования в контроллерах
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
