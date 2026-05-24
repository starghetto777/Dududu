/**
 * Middleware для валидации запросов через Zod
 * Валидация body, query и params
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger.js';

/**
 * Middleware для валидации req.body
 * @param schema - Zod схема для валидации тела запроса
 */
export const validate = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Парсим и валидируем тело запроса
      const validatedData = schema.parse(req.body);
      
      // Заменяем req.body на валидированные данные (с приведёнными типами)
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Ошибка валидации body: ${error.message}`);
        
        // Форматируем ошибки для клиента
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ошибка валидации данных',
            details: formattedErrors
          }
        });
        return;
      }
      
      logger.error('Неожиданная ошибка валидации:', error);
      next(error);
    }
  };
};

/**
 * Middleware для валидации req.query
 * @param schema - Zod схема для валидации query параметров
 */
export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Ошибка валидации query: ${error.message}`);
        
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ошибка валидации параметров запроса',
            details: formattedErrors
          }
        });
        return;
      }
      
      logger.error('Неожиданная ошибка валидации query:', error);
      next(error);
    }
  };
};

/**
 * Middleware для валидации req.params
 * @param schema - Zod схема для валидации route параметров
 */
export const validateParams = <T extends ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Ошибка валидации params: ${error.message}`);
        
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ошибка валидации параметров пути',
            details: formattedErrors
          }
        });
        return;
      }
      
      logger.error('Неожиданная ошибка валидации params:', error);
      next(error);
    }
  };
};

/**
 * Комбинированный middleware для валидации нескольких частей запроса
 * @param options - Объект с схемами для body, query, params
 */
export const validateRequest = <
  BodySchema extends ZodSchema | null = null,
  QuerySchema extends ZodSchema | null = null,
  ParamsSchema extends ZodSchema | null = null
>(options: {
  body?: BodySchema;
  query?: QuerySchema;
  params?: ParamsSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Валидация body
      if (options.body) {
        req.body = options.body.parse(req.body);
      }
      
      // Валидация query
      if (options.query) {
        req.query = options.query.parse(req.query) as any;
      }
      
      // Валидация params
      if (options.params) {
        req.params = options.params.parse(req.params) as any;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Ошибка валидации запроса: ${error.message}`);
        
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          expected: err.expected
        }));
        
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ошибка валидации данных запроса',
            details: formattedErrors
          }
        });
        return;
      }
      
      logger.error('Неожиданная ошибка валидации:', error);
      next(error);
    }
  };
};

/**
 * Helper функция для создания схемы пагинации
 */
export const createPaginationSchema = () => {
  return z.object({
    page: z.string().optional().transform(val => {
      const num = parseInt(val || '1', 10);
      return isNaN(num) || num < 1 ? 1 : num;
    }),
    limit: z.string().optional().transform(val => {
      const num = parseInt(val || '20', 10);
      return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
    }),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional().default('asc')
  });
};

/**
 * Helper функция для создания схемы поиска
 */
export const createSearchSchema = () => {
  return z.object({
    q: z.string().optional().transform(val => val?.trim() || ''),
    search: z.string().optional().transform(val => val?.trim() || '')
  });
};

/**
 * Helper функция для создания схемы фильтрации по статусу
 */
export const createStatusFilterSchema = <T extends readonly string[]>(statuses: T) => {
  return z.object({
    status: z.enum(statuses).optional()
  });
};

/**
 * Helper функция для создания схемы диапазона цен
 */
export const createPriceRangeSchema = () => {
  return z.object({
    minPrice: z.string().optional().transform(val => {
      const num = parseFloat(val || '0');
      return isNaN(num) ? 0 : num;
    }),
    maxPrice: z.string().optional().transform(val => {
      const num = parseFloat(val || '999999999');
      return isNaN(num) ? 999999999 : num;
    })
  });
};
