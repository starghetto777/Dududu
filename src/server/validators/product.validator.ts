/**
 * Zod схемы для валидации товаров (Product)
 */

import { z } from 'zod';

// =============================================================================
// БАЗОВЫЕ СХЕМЫ
// =============================================================================

/**
 * Схема для создания нового товара
 */
export const createProductSchema = z.object({
  name: z.string().min(2, 'Название должно содержать минимум 2 символа').max(200),
  slug: z.string().optional(), // Генерируется автоматически если не указан
  sku: z.string().min(1, 'Артикул обязателен').max(50),
  barcode: z.string().nullable().optional(),
  brand_id: z.number().int().positive().nullable().optional(),
  category_id: z.number().int().positive('Категория обязательна'),
  short_description: z.string().max(500).optional().default(''),
  full_description: z.string().optional().default(''),
  composition: z.string().nullable().optional(),
  
  // Цены
  price: z.number().positive('Цена должна быть положительной'),
  old_price: z.number().positive().nullable().optional(),
  cost_price: z.number().positive().nullable().optional(),
  subscription_price: z.number().positive().nullable().optional(),
  
  // Остатки
  stock: z.number().int().min(0).default(0),
  low_stock_threshold: z.number().int().min(0).default(10),
  
  // Габариты
  weight: z.number().positive().nullable().optional(),
  length: z.number().positive().nullable().optional(),
  width: z.number().positive().nullable().optional(),
  height: z.number().positive().nullable().optional(),
  
  // Характеристики
  animal_types: z.array(z.string()).optional().default([]),
  age_groups: z.array(z.string()).optional().default([]),
  breed_sizes: z.array(z.string()).optional().default([]),
  badges: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  
  // Статус и сортировка
  status: z.enum(['active', 'draft', 'hidden', 'archived']).default('draft'),
  sort_order: z.number().int().default(0),
  publish_date: z.string().datetime().nullable().optional(),
  
  // Внутренние заметки
  internal_notes: z.string().nullable().optional()
});

/**
 * Схема для обновления товара
 * Все поля опциональны
 */
export const updateProductSchema = createProductSchema.partial();

/**
 * Схема для параметров запроса (ID товара)
 */
export const productParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
  slug: z.string().optional()
});

/**
 * Схема для query параметров (фильтры, пагинация, сортировка)
 */
export const productQuerySchema = z.object({
  page: z.string().optional().transform(val => {
    const num = parseInt(val || '1', 10);
    return isNaN(num) || num < 1 ? 1 : num;
  }),
  limit: z.string().optional().transform(val => {
    const num = parseInt(val || '20', 10);
    return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
  }),
  
  // Сортировка
  sort: z.enum(['name', 'price', 'created_at', 'stock', 'rating', 'sales_count']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  
  // Фильтры
  category_id: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  brand_id: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  status: z.enum(['active', 'draft', 'hidden', 'archived']).optional(),
  
  // Диапазон цен
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  
  // Наличие
  inStock: z.string().optional().transform(val => val === 'true'),
  lowStock: z.string().optional().transform(val => val === 'true'),
  
  // Поиск
  search: z.string().optional().transform(val => val?.trim() || ''),
  q: z.string().optional().transform(val => val?.trim() || ''),
  
  // Характеристики
  animal_type: z.string().optional(),
  age_group: z.string().optional(),
  breed_size: z.string().optional(),
  
  // Badges
  badge: z.string().optional()
});

/**
 * Схема для массовых операций с товарами
 */
export const bulkActionSchema = z.object({
  action: z.enum(['delete', 'archive', 'activate', 'deactivate', 'update_status']),
  ids: z.array(z.number().int().positive()),
  data: z.record(z.unknown()).optional() // Дополнительные данные для update_status
});

/**
 * Схема для импорта товаров (CSV/Excel)
 */
export const importProductsSchema = z.object({
  products: z.array(createProductSchema),
  skipExisting: z.boolean().optional().default(false),
  updateExisting: z.boolean().optional().default(false)
});

/**
 * Схема для экспорта товаров
 */
export const exportProductsSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'json']).optional().default('csv'),
  fields: z.array(z.string()).optional(),
  filters: productQuerySchema.optional()
});

// =============================================================================
// СХЕМЫ ДЛЯ ИЗОБРАЖЕНИЙ ТОВАРА
// =============================================================================

/**
 * Схема для добавления изображения товара
 */
export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(200).optional().default(''),
  is_main: z.boolean().optional().default(false),
  sort_order: z.number().int().min(0).optional().default(0)
});

/**
 * Схема для обновления изображения
 */
export const updateProductImageSchema = productImageSchema.partial();

// =============================================================================
// СХЕМЫ ДЛЯ ВАРИАНТОВ ТОВАРА
// =============================================================================

/**
 * Схема для создания варианта товара
 */
export const productVariantSchema = z.object({
  name: z.string().min(1).max(100),
  sku: z.string().min(1).max(50),
  price: z.number().positive(),
  old_price: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  weight: z.number().positive().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().min(0).optional().default(0)
});

/**
 * Схема для обновления варианта
 */
export const updateProductVariantSchema = productVariantSchema.partial();

// Типы для использования в контроллерах
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type BulkActionInput = z.infer<typeof bulkActionSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
