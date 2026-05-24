/**
 * Middleware для ограничения частоты запросов (Rate Limiting)
 * Настройка express-rate-limit для разных эндпоинтов
 */

import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

// Базовая конфигурация rate limiter
const baseConfig: Options = {
  windowMs: config.rateLimit.windowMs, // 15 минут по умолчанию
  max: config.rateLimit.max, // 100 запросов на окно
  standardHeaders: true, // Возвращать информацию о лимитах в заголовках
  legacyHeaders: false, // Не использовать X-RateLimit-* заголовки
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Слишком много запросов. Пожалуйста, попробуйте позже.'
    }
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit превышен для IP ${req.ip} на пути ${req.path}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Слишком много запросов. Пожалуйста, попробуйте позже.'
      }
    });
  },
  keyGenerator: (req: Request): string => {
    // Используем IP как ключ, но для авторизованных пользователей можно использовать ID
    if (req.user?.id) {
      return `user:${req.user.id}`;
    }
    return req.ip || 'unknown';
  },
  skip: (req: Request): boolean => {
    // Пропускаем rate limiting для внутренних запросов
    const internalIPs = ['::1', '127.0.0.1'];
    if (internalIPs.includes(req.ip || '')) {
      return true;
    }
    return false;
  }
};

/**
 * API Rate Limiter
 * Для всех /api/* endpoints
 * 100 запросов на 15 минут
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Auth Rate Limiter
 * Для /api/auth/* endpoints - более строгий лимит
 * 10 запросов на 15 минут для предотвращения brute force
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_AUTH_ATTEMPTS',
      message: 'Слишком много попыток аутентификации. Пожалуйста, подождите 15 минут.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Upload Rate Limiter
 * Для загрузки файлов - ограничиваем количество загрузок
 * 20 запросов в час
 */
export const uploadLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 час
  max: 20,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_UPLOADS',
      message: 'Слишком много загрузок. Пожалуйста, попробуйте через час.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Search Rate Limiter
 * Для поисковых запросов - предотвращаем злоупотребление
 * 30 запросов в минуту
 */
export const searchLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000, // 1 минута
  max: 30,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_SEARCHES',
      message: 'Слишком много поисковых запросов. Пожалуйста, подождите немного.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Admin Rate Limiter
 * Для админ-панели - более мягкий лимит
 * 200 запросов на 15 минут
 */
export const adminLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 200,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Слишком много запросов к админ-панели.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Order Creation Rate Limiter
 * Для создания заказов - защита от спама
 * 5 заказов в 15 минут
 */
export const orderLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_ORDERS',
      message: 'Слишком много попыток создания заказа. Пожалуйста, подождите.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Review Rate Limiter
 * Для создания отзывов
 * 3 отзыва в час
 */
export const reviewLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 час
  max: 3,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REVIEWS',
      message: 'Слишком много отзывов. Пожалуйста, подождите час перед следующим отзывом.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Contact Form Rate Limiter
 * Для форм обратной связи
 * 5 сообщений в час
 */
export const contactLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1 час
  max: 5,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_MESSAGES',
      message: 'Слишком много сообщений. Пожалуйста, подождите час.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Dynamic Rate Limiter Factory
 * Создание кастомного rate limiter с параметрами
 * 
 * @param windowMs - Окно времени в миллисекундах
 * @param max - Максимальное количество запросов
 * @param message - Сообщение при превышении лимита
 */
export const createRateLimiter = (
  windowMs: number,
  max: number,
  message?: string
): RateLimitRequestHandler => {
  return rateLimit({
    ...baseConfig,
    windowMs,
    max,
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: message || 'Слишком много запросов. Пожалуйста, попробуйте позже.'
      }
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

/**
 * Rate limiter для конкретных IP адресов (blacklist/whitelist)
 */
export const ipBasedLimiter = (options: {
  blacklist?: string[];
  whitelist?: string[];
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip;

    // Проверка blacklist
    if (options.blacklist?.includes(clientIP || '')) {
      logger.warn(`Запрос от заблокированного IP: ${clientIP}`);
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Доступ запрещён'
        }
      });
      return;
    }

    // Проверка whitelist - пропускаем без ограничений
    if (options.whitelist?.includes(clientIP || '')) {
      return next();
    }

    next();
  };
};

/**
 * Middleware для сброса rate limiter для конкретного пользователя
 * Может использоваться после успешной капчи или других проверок
 */
export const skipRateLimit = (): RateLimitRequestHandler => {
  return rateLimit({
    ...baseConfig,
    max: Number.MAX_SAFE_INTEGER, // Фактически отключает лимит
    windowMs: 1
  });
};
