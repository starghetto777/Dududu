/**
 * Вспомогательные утилиты для приложения
 * Форматирование, пагинация, генерация и sanitization
 */

import { z } from 'zod';

/**
 * Мета-данные пагинации
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Форматирование цены в рублях
 * @param amount - Сумма в копейках или рублях (число)
 * @returns Отформатированная строка "1 500 ₽"
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Форматирование цены с копейками
 * @param amount - Сумма
 * @returns Отформатированная строка "1 500,00 ₽"
 */
export const formatPriceWithKopecks = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Расчет параметров пагинации
 * @param page - Текущая страница (1-based)
 * @param limit - Количество элементов на странице
 * @param total - Общее количество элементов
 * @returns Объект с мета-данными пагинации
 */
export const paginate = (page: number, limit: number, total: number): PaginationMeta => {
  const currentPage = Math.max(1, Math.floor(page));
  const pageSize = Math.max(1, Math.floor(limit));
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    page: currentPage,
    limit: pageSize,
    totalItems: total,
    totalPages,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null
  };
};

/**
 * Безопасный парсинг JSON строки
 * @param str - JSON строка для парсинга
 * @param fallback - Значение по умолчанию при ошибке
 * @returns Распарсенный объект или fallback
 */
export function parseJsonSafe<T>(str: string | null | undefined, fallback: T): T {
  if (!str || typeof str !== 'string') {
    return fallback;
  }
  
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Генерация номера заказа в формате #YYYYMMDD-NNNN
 * @returns Уникальный номер заказа
 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `#${year}${month}${day}-${random}`;
};

/**
 * Генерация промокода из случайных букв и цифр
 * @param length - Длина промокода (по умолчанию 8)
 * @returns Промокод вида "ABC123XY"
 */
export const generatePromoCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Добавляем дефис для читаемости (ABC-123-XY)
  if (length >= 6) {
    const part1 = result.slice(0, 3);
    const part2 = result.slice(3, 6);
    const part3 = result.slice(6);
    result = `${part1}-${part2}${part3 ? '-' + part3 : ''}`;
  }
  
  return result;
};

/**
 * Очистка HTML от опасных тегов и атрибутов
 * Базовая защита от XSS
 * @param html - Исходный HTML
 * @returns Очищенный HTML
 */
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // Удаляем скрипты и опасные теги
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/on\w+="[^"]*"/g, '') // Удаляем inline обработчики событий
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '');
  
  return sanitized;
};

/**
 * Усечение текста до указанной длины с добавлением многоточия
 * @param text - Исходный текст
 * @param length - Максимальная длина
 * @param suffix - Суффикс для усеченного текста (по умолчанию '...')
 * @returns Усеченный текст
 */
export const truncate = (text: string, length: number, suffix: string = '...'): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= length) {
    return text;
  }
  
  // Находим последний пробел перед обрезкой для красивого разрыва
  let truncated = text.slice(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > length * 0.8) {
    truncated = truncated.slice(0, lastSpace);
  }
  
  return truncated + suffix;
};

/**
 * Усечение текста по словам без разрыва слов
 * @param text - Исходный текст
 * @param wordCount - Максимальное количество слов
 * @returns Усеченный текст
 */
export const truncateWords = (text: string, wordCount: number): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const words = text.trim().split(/\s+/);
  
  if (words.length <= wordCount) {
    return text;
  }
  
  return words.slice(0, wordCount).join(' ') + '...';
};

/**
 * Нормализация email (lowercase + trim)
 * @param email - Email адрес
 * @returns Нормализованный email
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Маскирование чувствительных данных (email, телефон)
 * @param value - Значение для маскирования
 * @param type - Тип данных ('email' | 'phone')
 * @returns Замаскированное значение
 */
export const maskSensitiveData = (value: string, type: 'email' | 'phone'): string => {
  if (!value) return value;
  
  if (type === 'email') {
    const [name, domain] = value.split('@');
    if (!domain) return value;
    
    const maskedName = name.length > 2 
      ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
      : '*'.repeat(name.length);
    
    return `${maskedName}@${domain}`;
  }
  
  if (type === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 4) return '*'.repeat(digits.length);
    
    const visible = digits.slice(-2);
    const masked = '*'.repeat(digits.length - 2);
    
    return masked + visible;
  }
  
  return value;
};

/**
 * Глубокое клонирование объекта через JSON
 * @param obj - Объект для клонирования
 * @returns Клон объекта
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Проверка на пустой объект
 * @param obj - Объект для проверки
 * @returns true если объект пуст
 */
export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Группировка массива объектов по ключу
 * @param array - Массив объектов
 * @param key - Ключ для группировки
 * @returns Объект с группами
 */
export const groupBy = <T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Извлечение уникальных значений из массива
 * @param array - Массив значений
 * @returns Массив уникальных значений
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Конвертация строки в число с обработкой ошибок
 * @param value - Строка или число
 * @param defaultValue - Значение по умолчанию
 * @returns Число или defaultValue
 */
export const toNumber = (value: unknown, defaultValue: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Задержка выполнения (sleep)
 * @param ms - Количество миллисекунд
 * @returns Promise который разрешается через ms мс
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry функция с экспоненциальной задержкой
 * @param fn - Функция для выполнения
 * @param retries - Количество попыток
 * @param delay - Начальная задержка в мс
 * @returns Результат функции
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
}
