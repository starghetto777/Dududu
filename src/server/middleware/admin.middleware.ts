/**
 * Middleware для проверки прав администратора/менеджера
 * Логирование действий в activity_logs
 */

import { Request, Response, NextFunction } from 'express';
import { getDb } from '../database/db.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware для защиты админ-роутов
 * Требует роль 'admin' или 'manager'
 * Если пользователь не авторизован - редирект на /admin/login
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Проверяем наличие пользователя (должен быть установлен requireAuth перед этим)
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

  // Проверяем роль - допускаем admin и manager
  const allowedRoles = ['admin', 'manager'];
  
  if (!allowedRoles.includes(req.user.role)) {
    logger.warn(`Пользователь ${req.user.email} с ролью ${req.user.role} пытался получить доступ к админ-панели`);
    
    if (req.xhr || req.path.startsWith('/api')) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Недостаточно прав для доступа к админ-панели'
        }
      });
      return;
    }
    
    res.status(403).render('admin/dashboard', {
      error: 'Недостаточно прав для доступа к этой странице'
    });
    return;
  }

  next();
};

/**
 * Middleware для роутов требующих только super admin
 * Менеджеры не имеют доступа
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
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

  if (req.user.role !== 'admin') {
    logger.warn(`Пользователь ${req.user.email} с ролью ${req.user.role} пытался получить доступ к super admin функционалу`);
    
    if (req.xhr || req.path.startsWith('/api')) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Только супер-администратор имеет доступ к этой функции'
        }
      });
      return;
    }
    
    res.status(403).render('admin/dashboard', {
      error: 'Только супер-администратор имеет доступ к этой странице'
    });
    return;
  }

  next();
};

/**
 * Функция для логирования действий пользователя
 * Записывает информацию о действии в таблицу activity_logs
 * 
 * @param userId - ID пользователя (может быть null для системных действий)
 * @param userName - Имя пользователя
 * @param action - Тип действия (CREATE, UPDATE, DELETE, LOGIN, LOGOUT и т.д.)
 * @param entityType - Тип сущности (product, order, user, category и т.д.)
 * @param entityId - ID сущности (может быть null)
 * @param details - Дополнительные детали в JSON формате
 * @param ip - IP адрес пользователя
 */
export const logActivity = async (
  userId: number | null,
  userName: string,
  action: string,
  entityType: string,
  entityId: number | null,
  details: Record<string, unknown> | null = null,
  ip: string | null = null
): Promise<void> => {
  try {
    const db = getDb();
    
    const query = `
      INSERT INTO activity_logs (
        user_id,
        user_name,
        action,
        entity_type,
        entity_id,
        details,
        ip,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [
      userId,
      userName,
      action,
      entityType,
      entityId,
      details ? JSON.stringify(details) : null,
      ip,
      new Date().toISOString()
    ]);
  } catch (error) {
    logger.error('Ошибка при логировании активности:', error);
    // Не прерываем выполнение, просто логируем ошибку
  }
};

/**
 * Middleware-обёртка для автоматического логирования действий
 * Используется вместе с requireAdmin
 * 
 * @param action - Тип действия
 * @param entityType - Тип сущности
 */
export const logAction = (action: string, entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Сохраняем оригинальный метод send для перехвата ответа
    const originalSend = res.send;
    
    // Перехватываем ответ чтобы получить entityId из результата
    res.send = function(body: any) {
      // Восстанавливаем оригинальный метод
      res.send = originalSend;
      
      // Логируем действие асинхронно (не блокируя ответ)
      setImmediate(async () => {
        try {
          let entityId: number | null = null;
          
          // Пытаемся извлечь ID сущности из ответа
          if (body && typeof body === 'object') {
            if ('id' in body && typeof body.id === 'number') {
              entityId = body.id;
            } else if ('data' in body && body.data?.id) {
              entityId = body.data.id;
            }
          }
          
          // Также проверяем params (для UPDATE/DELETE)
          if (!entityId && req.params.id) {
            entityId = parseInt(req.params.id, 10) || null;
          }
          
          await logActivity(
            req.user?.id || null,
            req.user?.email || 'Anonymous',
            action,
            entityType,
            entityId,
            {
              method: req.method,
              path: req.path,
              query: req.query
            },
            req.ip
          );
        } catch (error) {
          logger.error('Ошибка в middleware logAction:', error);
        }
      });
      
      // Вызываем оригинальный send
      return originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * Вспомогательная функция для получения имени действия по HTTP методу
 */
export const getActionNameByMethod = (method: string): string => {
  const actions: Record<string, string> = {
    'GET': 'VIEW',
    'POST': 'CREATE',
    'PUT': 'UPDATE',
    'PATCH': 'UPDATE',
    'DELETE': 'DELETE'
  };
  
  return actions[method.toUpperCase()] || 'UNKNOWN';
};
