/**
 * Zod схемы для валидации заказов (Order)
 */

import { z } from 'zod';

// =============================================================================
// СХЕМЫ ДЛЯ ЗАКАЗОВ
// =============================================================================

/**
 * Схема элемента заказа
 */
export const orderItemSchema = z.object({
  product_id: z.number().int().positive(),
  product_name: z.string(),
  sku: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
  total: z.number().positive(),
  image_url: z.string().url().optional()
});

/**
 * Схема для создания нового заказа
 */
export const createOrderSchema = z.object({
  // Данные клиента
  customer_name: z.string().min(2, 'Имя обязательно').max(100),
  customer_email: z.string().email('Некорректный email'),
  customer_phone: z.string().min(10, 'Телефон обязателен').max(20),
  
  // Товары в заказе
  items: z.array(orderItemSchema).min(1, 'Заказ должен содержать хотя бы один товар'),
  
  // Доставка
  delivery_method: z.enum(['courier', 'pickup', 'post', 'boxberry']).default('courier'),
  delivery_address: z.string().min(5, 'Адрес доставки обязателен').max(500),
  delivery_city: z.string().min(2, 'Город обязателен').max(100),
  desired_date: z.string().datetime().nullable().optional(),
  
  // Оплата
  payment_method: z.enum(['card', 'cash', 'online', 'invoice']).default('card'),
  
  // Промокод
  promo_code: z.string().max(20).optional().nullable(),
  
  // Комментарий
  customer_comment: z.string().max(1000).optional().default('')
});

/**
 * Схема для обновления заказа (админ)
 */
export const updateOrderSchema = z.object({
  customer_name: z.string().min(2).max(100).optional(),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().min(10).max(20).optional(),
  delivery_method: z.enum(['courier', 'pickup', 'post', 'boxberry']).optional(),
  delivery_address: z.string().min(5).max(500).optional(),
  delivery_city: z.string().min(2).max(100).optional(),
  desired_date: z.string().datetime().nullable().optional(),
  payment_method: z.enum(['card', 'cash', 'online', 'invoice']).optional(),
  status: z.enum(['new', 'confirmed', 'assembling', 'shipped', 'delivered', 'cancelled', 'returned']).optional(),
  tracking_number: z.string().max(100).nullable().optional(),
  internal_notes: z.string().nullable().optional()
});

/**
 * Схема для изменения статуса заказа
 */
export const updateOrderStatusSchema = z.object({
  status: z.enum(['new', 'confirmed', 'assembling', 'shipped', 'delivered', 'cancelled', 'returned']),
  notify_customer: z.boolean().optional().default(true),
  comment: z.string().max(500).optional().default('')
});

/**
 * Схема для query параметров заказов
 */
export const orderQuerySchema = z.object({
  page: z.string().optional().transform(val => {
    const num = parseInt(val || '1', 10);
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  limit: z.string().optional().transform(val => {
    const num = parseInt(val || '20', 10);
    return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
  }),
  
  // Сортировка
  sort: z.enum(['created_at', 'total', 'status', 'customer_name']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Фильтры
  status: z.enum(['new', 'confirmed', 'assembling', 'shipped', 'delivered', 'cancelled', 'returned']).optional(),
  payment_method: z.enum(['card', 'cash', 'online', 'invoice']).optional(),
  delivery_method: z.enum(['courier', 'pickup', 'post', 'boxberry']).optional(),
  
  // Поиск
  search: z.string().optional().transform(val => val?.trim() || ''),
  order_number: z.string().optional(),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().optional(),
  
  // Диапазон дат
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  
  // Диапазон сумм
  min_total: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  max_total: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  
  // Фильтр по оплаченным
  is_paid: z.string().optional().transform(val => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  })
});

/**
 * Схема параметров запроса (ID заказа)
 */
export const orderParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10))
});

// Типы для использования в контроллерах
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
