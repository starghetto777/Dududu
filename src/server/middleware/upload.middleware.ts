/**
 * Middleware для загрузки файлов через Multer
 * Настройка storage, фильтров и лимитов для разных типов загрузок
 */

import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

// Создание директорий для загрузок если они не существуют
const ensureDirExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Инициализация директорий
const productsDir = path.join(config.uploadDir, 'products');
const bannersDir = path.join(config.uploadDir, 'banners');
const categoriesDir = path.join(config.uploadDir, 'categories');
const mediaDir = path.join(config.uploadDir, 'media');
const avatarsDir = path.join(config.uploadDir, 'avatars');

[productsDir, bannersDir, categoriesDir, mediaDir, avatarsDir].forEach(ensureDirExists);

/**
 * Конфигурация disk storage с уникальными именами файлов
 * @param subDir - Поддиректория в uploads (products, banners, etc.)
 */
const createStorage = (subDir: string): StorageEngine => {
  return multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      const destPath = path.join(config.uploadDir, subDir);
      ensureDirExists(destPath);
      cb(null, destPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      // Генерируем уникальное имя: uuid + оригинальное расширение
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${uniqueId}${ext}`;
      cb(null, filename);
    }
  });
};

/**
 * Фильтр файлов - разрешает только изображения и PDF
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
): void => {
  // Разрешённые MIME типы
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ];

  // Для аватаров только изображения
  if (req.path.includes('avatar') || req.path.includes('profile')) {
    const imageMimeTypes = allowedMimeTypes.filter(type => type.startsWith('image/'));
    if (!imageMimeTypes.includes(file.mimetype)) {
      const error = new Error('Только изображения разрешены для аватара');
      (error as any).code = 'INVALID_FILE_TYPE';
      cb(error, false);
      return;
    }
  } else if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error('Недопустимый тип файла. Разрешены: изображения и PDF');
    (error as any).code = 'INVALID_FILE_TYPE';
    cb(error, false);
    return;
  }

  cb(null, true);
};

/**
 * Фильтр только для изображений
 */
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
): void => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error('Только изображения разрешены (JPEG, PNG, GIF, WebP, SVG)');
    (error as any).code = 'INVALID_FILE_TYPE';
    cb(error, false);
    return;
  }

  cb(null, true);
};

// =============================================================================
// КОНФИГУРАЦИИ ЗАГРУЗЧИКОВ
// =============================================================================

/**
 * Загрузка изображений товаров
 * - Поле: images[]
 * - Максимум файлов: 10
 * - Максимальный размер: 5MB каждый
 */
export const uploadProduct = multer({
  storage: createStorage('products'),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: config.maxFileSize, // 5MB
    files: 10
  }
}).array('images', 10);

/**
 * Загрузка баннеров
 * - Поле: image
 * - Максимум файлов: 1
 * - Максимальный размер: 5MB
 */
export const uploadBanner = multer({
  storage: createStorage('banners'),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: config.maxFileSize, // 5MB
    files: 1
  }
}).single('image');

/**
 * Загрузка изображений категорий
 * - Поле: image
 * - Максимум файлов: 1
 * - Максимальный размер: 5MB
 */
export const uploadCategory = multer({
  storage: createStorage('categories'),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 1
  }
}).single('image');

/**
 * Загрузка медиа файлов в библиотеку
 * - Любые файлы (изображения, PDF)
 * - Максимум файлов: 10
 * - Максимальный размер: 10MB каждый
 */
export const uploadMedia = multer({
  storage: createStorage('media'),
  fileFilter: fileFilter,
  limits: {
    fileSize: config.maxFileSize * 2, // 10MB
    files: 10
  }
}).array('files', 10);

/**
 * Загрузка аватара пользователя
 * - Поле: avatar
 * - Максимум файлов: 1
 * - Максимальный размер: 2MB
 */
export const uploadAvatar = multer({
  storage: createStorage('avatars'),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1
  }
}).single('avatar');

/**
 * Загрузка нескольких файлов для разных полей
 * Используется для сложных форм с несколькими полями файлов
 */
export const uploadFields = multer({
  storage: createStorage('media'),
  fileFilter: fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 20
  }
}).fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 9 },
  { name: 'documents', maxCount: 5 }
]);

/**
 * Обработка ошибок Multer
 * Должна использоваться после middleware загрузки
 */
export const handleMulterError = (
  err: any,
  req: Request,
  res: any,
  next: any
): void => {
  if (err instanceof multer.MulterError) {
    logger.warn(`Multer ошибка: ${err.code} - ${err.message}`);
    
    const errorResponses: Record<string, { status: number; message: string }> = {
      'LIMIT_FILE_SIZE': {
        status: 400,
        message: `Файл слишком большой. Максимальный размер: ${config.maxFileSize / 1024 / 1024}MB`
      },
      'LIMIT_FILE_COUNT': {
        status: 400,
        message: 'Слишком много файлов'
      },
      'LIMIT_UNEXPECTED_FILE': {
        status: 400,
        message: 'Неожиданное поле файла'
      },
      'INVALID_FILE_TYPE': {
        status: 400,
        message: err.message || 'Недопустимый тип файла'
      }
    };

    const errorResponse = errorResponses[err.code] || {
      status: 400,
      message: 'Ошибка при загрузке файла'
    };

    res.status(errorResponse.status).json({
      success: false,
      error: {
        code: err.code,
        message: errorResponse.message
      }
    });
    return;
  }

  if (err) {
    logger.error('Ошибка загрузки файла:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Внутренняя ошибка при загрузке файла'
      }
    });
    return;
  }

  next();
};

/**
 * Helper функция для получения URL файла
 * @param filename - Имя файла
 * @param subDir - Поддиректория
 * @returns Полный URL к файлу
 */
export const getFileUrl = (filename: string, subDir: string): string => {
  return `/uploads/${subDir}/${filename}`;
};

/**
 * Helper функция для получения полного пути к файлу
 * @param filename - Имя файла
 * @param subDir - Поддиректория
 * @returns Абсолютный путь к файлу
 */
export const getFilePath = (filename: string, subDir: string): string => {
  return path.join(config.uploadDir, subDir, filename);
};

/**
 * Удаление файла
 * @param filename - Имя файла
 * @param subDir - Поддиректория
 * @returns true если файл успешно удалён
 */
export const deleteFile = (filename: string, subDir: string): boolean => {
  try {
    const filePath = getFilePath(filename, subDir);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`Файл удалён: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Ошибка при удалении файла:', error);
    return false;
  }
};
