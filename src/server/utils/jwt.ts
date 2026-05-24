/**
 * Утилиты для работы с JWT токенами
 * Генерация, верификация и обновление токенов
 */

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { logger } from './logger.js';

/**
 * Типизация полезной нагрузки токена
 */
export interface JWTPayload {
  id: number;
  email: string;
  role: 'customer' | 'manager' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Типизация payload для refresh токена
 */
export interface RefreshTokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

/**
 * Генерация access токена
 * @param payload - Данные для включения в токен
 * @param expiresIn - Время жизни токена (по умолчанию из конфига)
 * @returns Подписанный JWT токен
 */
export const generateToken = (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  expiresIn: string = config.jwtExpiresIn
): string => {
  try {
    return jwt.sign(payload, config.jwtSecret, { expiresIn });
  } catch (error) {
    logger.error('Ошибка при генерации JWT токена:', error);
    throw new Error('Не удалось создать токен доступа');
  }
};

/**
 * Верификация токена
 * @param token - JWT токен для проверки
 * @returns Расшифрованный payload или null если токен невалиден
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Истек срок действия токена');
      return null;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Невалидный JWT токен');
      return null;
    }
    logger.error('Ошибка при верификации токена:', error);
    return null;
  }
};

/**
 * Генерация refresh токена
 * @param userId - ID пользователя
 * @returns Refresh токен со сроком жизни 30 дней
 */
export const generateRefreshToken = (userId: number): string => {
  try {
    const payload: RefreshTokenPayload = { userId };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' });
  } catch (error) {
    logger.error('Ошибка при генерации refresh токена:', error);
    throw new Error('Не удалось создать токен обновления');
  }
};

/**
 * Декодирование токена без верификации (для отладки)
 * @param token - JWT токен
 * @returns Payload токена или null
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    logger.error('Ошибка при декодировании токена:', error);
    return null;
  }
};

/**
 * Проверка истечения срока действия токена
 * @param token - JWT токен
 * @returns true если токен истек или скоро истечет (менее 5 минут)
 */
export const isTokenExpiringSoon = (token: string, thresholdMinutes: number = 5): boolean => {
  try {
    const decoded = jwt.decode(token) as JWTPayload & { exp?: number };
    if (!decoded?.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    const thresholdSeconds = thresholdMinutes * 60;
    
    return timeUntilExpiry < thresholdSeconds;
  } catch (error) {
    logger.error('Ошибка при проверке срока действия токена:', error);
    return true;
  }
};
