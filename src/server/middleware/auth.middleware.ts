/**
 * Middleware для аутентификации пользователей
 * Проверка JWT токенов из cookies или заголовков
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

// Расширение интерфейса Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware для защиты роутов - требует аутентификации
 * Проверяет токен в cookie (authToken) или заголовке Authorization
 * Если токен отсутствует или невалиден - возвращает 401
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // Пробуем получить токен из cookie
    if (req.cookies?.authToken) {
      token = req.cookies.authToken;
    }
    // Или из заголовка Authorization: Bearer <token>
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    // Если токен не найден
    if (!token) {
      logger.warn(`Попытка доступа без токена: ${req.method} ${req.path}`);
      
      // Для API запросов возвращаем JSON
      if (req.xhr || req.path.startsWith('/api')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Требуется авторизация'
          }
        });
        return;
      }
      
      // Для обычных запросов редирект на страницу входа
      res.redirect('/admin/login');
      return;
    }

    // Верифицируем токен
    const payload = verifyToken(token);

    if (!payload) {
      logger.warn(`Невалидный токен: ${req.method} ${req.path}`);
      
      if (req.xhr || req.path.startsWith('/api')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_INVALID',
            message: 'Невалидный или истекший токен'
          }
        });
        return;
      }
      
      res.clearCookie('authToken');
      res.redirect('/admin/login');
      return;
    }

    // Добавляем пользователя в request
    req.user = payload;
    
    next();
  } catch (error) {
    logger.error('Ошибка в middleware requireAuth:', error);
    
    if (req.xhr || req.path.startsWith('/api')) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Внутренняя ошибка сервера'
        }
      });
      return;
    }
    
    res.redirect('/admin/login');
  }
};

/**
 * Middleware для опциональной аутентификации
 * Пытается декодировать токен, но не бросает ошибку если его нет
 * Полезно для роутов где контент может отличаться для авторизованных пользователей
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    if (req.cookies?.authToken) {
      token = req.cookies.authToken;
    } else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    logger.error('Ошибка в middleware optionalAuth:', error);
    // Не прерываем запрос, просто продолжаем без пользователя
    next();
  }
};

/**
 * Middleware для проверки конкретной роли пользователя
 * @param allowedRoles - Массив разрешенных ролей
 */
export const requireRole = (...allowedRoles: Array<'customer' | 'manager' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      if (req.xhr || req.path.startsWith('/api')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Требуется авторизация'
          }
        });
        return;
      }
      
      res.redirect('/admin/login');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Пользователь ${req.user.email} пытался получить доступ с ролью ${req.user.role}`);
      
      if (req.xhr || req.path.startsWith('/api')) {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Недостаточно прав для выполнения этого действия'
          }
        });
        return;
      }
      
      res.status(403).render('shop/404', {
        title: 'Доступ запрещен',
        currentUrl: req.originalUrl
      });
      return;
    }

    next();
  };
};

/**
 * Геттер для получения текущего пользователя из запроса
 * Безопасная версия с проверкой на существование
 */
export const getCurrentUser = (req: Request): JWTPayload | null => {
  return req.user || null;
};

/**
 * Проверка является ли пользователь администратором
 */
export const isAdmin = (req: Request): boolean => {
  return req.user?.role === 'admin';
};

/**
 * Проверка является ли пользователь менеджером или администратором
 */
export const isManagerOrAdmin = (req: Request): boolean => {
  return req.user?.role === 'manager' || req.user?.role === 'admin';
};
