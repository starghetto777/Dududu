/**
 * Middleware для обработки ошибок
 * Централизованная обработка всех типов ошибок
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

// =============================================================================
// КЛАССЫ ОШИБОК
// =============================================================================

/**
 * Базовый класс для кастомных ошибок приложения
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  /**
   * @param message - Сообщение об ошибке
   * @param statusCode - HTTP статус код
   * @param code - Код ошибки для клиента
   * @param isOperational - Является ли ошибка операционной (ожидаемой)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Ошибка для случаев когда ресурс не найден
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден', resource?: string) {
    super(
      message,
      404,
      resource ? `${resource.toUpperCase()}_NOT_FOUND` : 'NOT_FOUND'
    );
  }
}

/**
 * Ошибка для случаев когда доступ запрещён
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Доступ запрещён') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * Ошибка для случаев когда авторизация не пройдена
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Требуется авторизация') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * Ошибка для случаев когда данные невалидны
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Некорректные данные', code: string = 'BAD_REQUEST') {
    super(message, 400, code);
  }
}

/**
 * Ошибка для случаев конфликта данных
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Конфликт данных', code: string = 'CONFLICT') {
    super(message, 409, code);
  }
}

// =============================================================================
// ОБРАБОТЧИК ОШИБОК EXPRESS
// =============================================================================

/**
 * Глобальный обработчик ошибок Express
 * Обрабатывает все типы ошибок и возвращает корректный ответ
 */
export const errorHandler = (
  err: Error | AppError | ZodError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Логирование ошибки
  logger.error(`Ошибка: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Обработка AppError (наши кастомные ошибки)
  if (err instanceof AppError) {
    handleAppError(err, req, res);
    return;
  }

  // Обработка ZodError (ошибки валидации)
  if (err instanceof ZodError) {
    handleZodError(err, req, res);
    return;
  }

  // Обработка ошибок Multer
  if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'INVALID_FILE_TYPE') {
    handleMulterError(err, req, res);
    return;
  }

  // Обработка ошибок JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    handleJWTError(err, req, res);
    return;
  }

  // Обработка ошибок SQLite
  if (err.code?.startsWith('SQLITE_')) {
    handleDatabaseError(err, req, res);
    return;
  }

  // Необработанная ошибка - Internal Server Error
  handleUnknownError(err, req, res);
};

// =============================================================================
// ОБРАБОТЧИКИ КОНКРЕТНЫХ ТИПОВ ОШИБОК
// =============================================================================

/**
 * Обработка кастомных ошибок приложения
 */
const handleAppError = (err: AppError, req: Request, res: Response): void => {
  const response = {
    success: false,
    error: {
      code: err.code,
      message: err.message
    }
  };

  // В режиме разработки добавляем стек трейс
  if (config.nodeEnv === 'development') {
    (response.error as any).stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};

/**
 * Обработка ошибок валидации Zod
 */
const handleZodError = (err: ZodError, req: Request, res: Response): void => {
  const formattedErrors = err.errors.map(error => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
    expected: error.expected
  }));

  const response = {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Ошибка валидации данных',
      details: formattedErrors
    }
  };

  if (config.nodeEnv === 'development') {
    (response.error as any).stack = err.stack;
  }

  res.status(400).json(response);
};

/**
 * Обработка ошибок Multer
 */
const handleMulterError = (err: any, req: Request, res: Response): void => {
  const errorMessages: Record<string, string> = {
    'LIMIT_FILE_SIZE': `Файл слишком большой. Максимальный размер: ${config.maxFileSize / 1024 / 1024}MB`,
    'LIMIT_FILE_COUNT': 'Слишком много файлов',
    'LIMIT_UNEXPECTED_FILE': 'Неожиданное поле файла',
    'INVALID_FILE_TYPE': 'Недопустимый тип файла'
  };

  res.status(400).json({
    success: false,
    error: {
      code: err.code || 'UPLOAD_ERROR',
      message: errorMessages[err.code] || err.message || 'Ошибка при загрузке файла'
    }
  });
};

/**
 * Обработка ошибок JWT
 */
const handleJWTError = (err: any, req: Request, res: Response): void => {
  let message = 'Ошибка аутентификации';
  let code = 'AUTH_ERROR';

  if (err.name === 'TokenExpiredError') {
    message = 'Срок действия токена истёк';
    code = 'TOKEN_EXPIRED';
  } else if (err.name === 'JsonWebTokenError') {
    message = 'Невалидный токен';
    code = 'TOKEN_INVALID';
  }

  res.status(401).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

/**
 * Обработка ошибок базы данных
 */
const handleDatabaseError = (err: any, req: Request, res: Response): void => {
  logger.error('Ошибка базы данных:', err);

  // SQLITE_CONSTRAINT - нарушение ограничений (unique, foreign key, etc.)
  if (err.code === 'SQLITE_CONSTRAINT') {
    if (err.message.includes('UNIQUE')) {
      res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'Запись с такими данными уже существует'
        }
      });
      return;
    }

    if (err.message.includes('FOREIGN KEY')) {
      res.status(400).json({
        success: false,
        error: {
          code: 'FOREIGN_KEY_VIOLATION',
          message: 'Нарушение связи с другой таблицей'
        }
      });
      return;
    }
  }

  // Остальные ошибки БД
  res.status(500).json({
    success: false,
    error: {
      code: 'DATABASE_ERROR',
      message: 'Ошибка базы данных'
    }
  });
};

/**
 * Обработка неизвестных ошибок
 */
const handleUnknownError = (err: any, req: Request, res: Response): void => {
  // В production скрываем детали ошибок от пользователя
  const isDev = config.nodeEnv === 'development';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev ? err.message : 'Внутренняя ошибка сервера'
    },
    ...(isDev && { stack: err.stack })
  });
};

// =============================================================================
// АСИНХРОННЫЙ WRAPPER
// =============================================================================

/**
 * Wrapper для асинхронных route handlers
 * Автоматически передаёт ошибки в next()
 * 
 * Использование:
 * router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Async handler для контроллеров (без next параметра)
 */
export const controllerHandler = <T>(
  fn: (req: Request, res: Response) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};
