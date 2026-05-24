/**
 * Конфигурация приложения
 * Загрузка переменных окружения и их типизация
 */

import { z } from 'zod';

// Схема валидации переменных окружения
const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_PATH: z.string().default('./data/shop.db'),
  UPLOADS_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().default('5242880'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX: z.string().default('100'),
  LOG_LEVEL: z.string().default('info'),
  LOG_FILE_PATH: z.string().default('./logs/app.log'),
  ADMIN_EMAIL: z.string().email().default('admin@zooshop.com'),
  ADMIN_PASSWORD: z.string().min(1).default('admin123'),
  SESSION_SECRET: z.string().default('session_secret_here')
});

// Парсинг и валидация
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Ошибка валидации переменных окружения:');
  console.error(parsed.error.format());
  process.exit(1);
}

const env = parsed.data;

/**
 * Основной объект конфигурации
 */
export const config = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  dbPath: env.DATABASE_PATH,
  uploadDir: env.UPLOADS_PATH,
  maxFileSize: parseInt(env.MAX_FILE_SIZE, 10),
  adminEmail: env.ADMIN_EMAIL,
  adminPassword: env.ADMIN_PASSWORD,
  email: {
    host: env.SMTP_HOST || '',
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 587,
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
    from: env.SMTP_FROM || 'noreply@zooshop.com'
  },
  cors: {
    origin: env.CORS_ORIGIN
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.RATE_LIMIT_MAX, 10)
  },
  logLevel: env.LOG_LEVEL,
  logFilePath: env.LOG_FILE_PATH,
  sessionSecret: env.SESSION_SECRET
};

export type Config = typeof config;
