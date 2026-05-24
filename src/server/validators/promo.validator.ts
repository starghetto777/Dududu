/**
 * Zod схемы для валидации промокодов (Promo)
 */

import { z } from 'zod';

// =============================================================================
// СХЕМЫ ДЛЯ ПРОМОКОДОВ
// =============================================================================

/**
 * Схема для создания нового промокода
 */
export const createPromoSchema = z.object({
  code: z
    .string()
    .min(3, 'Код должен содержать минимум 3 символа')
    .max(20)
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, 'Код должен содержать только буквы, цифры, дефисы и подчёркивания'),
  
  type: z.enum(['percent', 'fixed', 'free_delivery'], {
    errorMap: () => ({ message: 'Неверный тип промокода' })
  }),
  
  value: z.number().positive('Значение должно быть положительным'),
  
  min_order_amount: z.number().min(0).nullable().optional(),
  max_discount_amount: z.number().min(0).nullable().optional(),
  
  total_usage_limit: z.number().int().min(1).nullable().optional(),
  per_user_limit: z.number().int().min(1).default(1),
  
  start_date: z.string().datetime('Неверный формат даты начала'),
  end_date: z.string().datetime('Неверный формат даты окончания'),
  
  applies_to: z.enum(['all', 'categories', 'brands', 'products']).default('all'),
  applies_to_ids: z.array(z.number().int().positive()).optional().default([]),
  exclude_ids: z.array(z.number().int().positive()).optional().default([]),
  
  is_active: z.boolean().optional().default(true),
  description: z.string().max(500).optional().default('')
});

/**
 * Схема для обновления промокода
 * Все поля опциональны
 */
export const updatePromoSchema = createPromoSchema.partial();

/**
 * Схема для валидации промокода при оформлении заказа
 */
export const validatePromoSchema = z.object({
  code: z.string().min(1, 'Код промокода обязателен').toUpperCase(),
  order_amount: z.number().positive('Сумма заказа должна быть положительной'),
  customer_id: z.number().int().positive().optional(), // Для проверки per_user_limit
  applied_items: z.array(z.object({
    product_id: z.number().int().positive(),
    category_id: z.number().int().positive().optional(),
    brand_id: z.number().int().positive().optional()
  })).optional().default([])
});

/**
 * Схема для query параметров промокодов
 */
export const promoQuerySchema = z.object({
  page: z.string().optional().transform(val => {
    const num = parseInt(val || '1', 10);
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  limit: z.string().optional().transform(val => {
    const num = parseInt(val || '20', 10);
    return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
  }),
  
  // Сортировка
  sort: z.enum(['code', 'created_at', 'start_date', 'end_date', 'usage_count']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Фильтры
  type: z.enum(['percent', 'fixed', 'free_delivery']).optional(),
  is_active: z.string().optional().transform(val => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }),
  applies_to: z.enum(['all', 'categories', 'brands', 'products']).optional(),
  
  // Поиск
  search: z.string().optional().transform(val => val?.trim() || ''),
  
  // Диапазон дат
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional()
});

/**
 * Схема параметров запроса (ID промокода)
 */
export const promoParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10))
});

/**
 * Схема для массовых операций с промокодами
 */
export const bulkPromoActionSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete']),
  ids: z.array(z.number().int().positive())
});

// =============================================================================
// ДОПОЛНИТЕЛЬНЫЕ СХЕМЫ
// =============================================================================

/**
 * Схема для применения промокода к заказу
 */
export const applyPromoSchema = z.object({
  promo_code: z.string().min(1).toUpperCase(),
  order_total: z.number().positive(),
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    category_id: z.number().int().positive().optional(),
    brand_id: z.number().int().positive().optional(),
    price: z.number().positive(),
    quantity: z.number().int().min(1)
  }))
});

// Типы для использования в контроллерах
export type CreatePromoInput = z.infer<typeof createPromoSchema>;
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>;
export type ValidatePromoInput = z.infer<typeof validatePromoSchema>;
export type PromoQueryInput = z.infer<typeof promoQuerySchema>;
export type ApplyPromoInput = z.infer<typeof applyPromoSchema>;
