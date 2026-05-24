/**
 * Утилиты для работы со слагами (URL-friendly строки)
 * Транслитерация кириллицы и создание уникальных слаг
 */

/**
 * Карта транслитерации русских букв в латинские
 */
const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
  'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
  'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
  'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
  'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
  'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
  'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
  'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
  'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
  'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
  'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
  'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
  'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

/**
 * Генерация слага из текста
 * - Транслитерация русских букв
 * - Замена пробелов и спецсимволов на дефис
 * - Приведение к нижнему регистру
 * - Удаление повторяющихся дефисов
 * 
 * @param text - Исходный текст
 * @returns URL-friendly слаг
 */
export const generateSlug = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Транслитерация
  let slug = text.split('').map(char => {
    return translitMap[char] || char;
  }).join('');

  // Замена любых не буквенно-цифровых символов на дефис
  slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '-');

  // Замена пробелов и множественных дефисов на одинарный дефис
  slug = slug
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') // Удаление дефисов с начала и конца
    .toLowerCase();

  return slug || 'untitled';
};

/**
 * Обеспечение уникальности слага
 * Если слаг уже существует, добавляет числовой суффикс
 * 
 * @param slug - Базовый слаг
 * @param existingSlugs - Массив существующих слаг
 * @returns Уникальный слаг
 */
export const ensureUniqueSlug = (slug: string, existingSlugs: string[]): string => {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
};

/**
 * Генерация слага с проверкой через callback
 * Для использования с базой данных
 * 
 * @param text - Исходный текст
 * @param checkExists - Функция проверки существования слага
 * @returns Уникальный слаг
 */
export const generateUniqueSlug = async (
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  const baseSlug = generateSlug(text);
  
  if (!await checkExists(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (await checkExists(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

/**
 * Синхронная версия генерации уникального слага
 * 
 * @param text - Исходный текст
 * @param checkExists - Синхронная функция проверки существования
 * @returns Уникальный слаг
 */
export const generateUniqueSlugSync = (
  text: string,
  checkExists: (slug: string) => boolean
): string => {
  const baseSlug = generateSlug(text);
  
  if (!checkExists(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (checkExists(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

/**
 * Валидация формата слага
 * 
 * @param slug - Слаг для проверки
 * @returns true если слаг валиден
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Слаг должен содержать только строчные буквы, цифры и дефисы
  // Не должен начинаться или заканчиваться дефисом
  // Не должен содержать подряд идущих дефисов
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
