/**
 * Основной файл приложения Express
 * Настройка сервера, middleware, роутов и обработчиков ошибок
 */

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

// Конфигурация
import { config } from './config.js';

// Логгер
import { logger } from './utils/logger.js';

// Роуты
import shopRoutes from './routes/shop.routes.js';
import adminRoutes from './routes/admin.routes.js';
import apiRoutes from './routes/index.js';

// Middleware ошибок
import { errorHandler } from './middleware/error.middleware.js';

// Создание Express приложения
const app = express();

// Настройка доверенных прокси (для корректной работы за reverse proxy)
app.set('trust proxy', 1);

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet - защита заголовками безопасности
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS настройка
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// =============================================================================
// COMPRESSION & PARSING
// =============================================================================

// Сжатие ответов
app.use(compression({
  level: 6,
  threshold: 1024
}));

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));

// Парсинг URL-encoded данных
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Парсинг cookies
app.use(cookieParser(config.sessionSecret));

// =============================================================================
// LOGGING
// =============================================================================

// Morgan логирование HTTP запросов
if (config.nodeEnv === 'development') {
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// =============================================================================
// STATIC FILES
// =============================================================================

// Статика для клиентской части магазина
const shopAssetsPath = path.join(__dirname, '../../src/client/shop');
if (fs.existsSync(shopAssetsPath)) {
  app.use('/assets', express.static(shopAssetsPath, {
    maxAge: '1d',
    etag: true
  }));
}

// Статика для админ-панели
const adminAssetsPath = path.join(__dirname, '../../src/client/admin');
if (fs.existsSync(adminAssetsPath)) {
  app.use('/admin-assets', express.static(adminAssetsPath, {
    maxAge: '1d',
    etag: true
  }));
}

// Статика для загруженных файлов
const uploadsPath = path.join(__dirname, '../../uploads');
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '7d',
    etag: true
  }));
}

// Общие ассеты
const sharedPath = path.join(__dirname, '../../src/client/shared');
if (fs.existsSync(sharedPath)) {
  app.use('/shared', express.static(sharedPath, {
    maxAge: '1d',
    etag: true
  }));
}

// =============================================================================
// VIEW ENGINE
// =============================================================================

// Настройка EJS как шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));

// Локальные переменные для всех views
app.locals.config = config;
app.locals.formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
};
app.locals.formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
app.locals.formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// =============================================================================
// ROUTES
// =============================================================================

// Основные роуты магазина
app.use('/', shopRoutes);

// Админ-панель
app.use('/admin', adminRoutes);

// API роуты
app.use('/api', apiRoutes);

// =============================================================================
// 404 HANDLER
// =============================================================================

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Ресурс не найден'
      }
    });
  } else {
    res.status(404).render('shop/404', {
      title: 'Страница не найдена',
      currentUrl: req.originalUrl
    });
  }
});

// =============================================================================
// ERROR HANDLER
// =============================================================================

app.use(errorHandler);

// =============================================================================
// SERVER START
// =============================================================================

let server: any = null;

const startServer = () => {
  server = app.listen(config.port, () => {
    logger.info(`🚀 Сервер запущен на порту ${config.port}`);
    logger.info(`📦 Режим: ${config.nodeEnv}`);
    logger.info(`🌐 URL: http://localhost:${config.port}`);
    logger.info(`🔧 Admin: http://localhost:${config.port}/admin`);
  });

  // Обработка таймаутов
  server.timeout = 120000; // 2 минуты
};

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================

const gracefulShutdown = (signal: string) => {
  logger.info(`\n⚠️  Получен сигнал ${signal}. Начинаем graceful shutdown...`);
  
  if (server) {
    server.close((err: Error) => {
      if (err) {
        logger.error('❌ Ошибка при закрытии сервера:', err);
        process.exit(1);
      }
      
      logger.info('✅ Сервер успешно остановлен');
      
      // Закрытие соединений с БД
      try {
        const { getDb } = require('./database/db.js');
        const db = getDb();
        if (db) {
          db.close();
          logger.info('✅ База данных закрыта');
        }
      } catch (e) {
        logger.warn('⚠️  Не удалось закрыть соединение с БД');
      }
      
      process.exit(0);
    });
    
    // Принудительное завершение через 30 секунд
    setTimeout(() => {
      logger.error('⚠️  Принудительное завершение работы');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Обработка необработанных исключений
process.on('uncaughtException', (err: Error) => {
  logger.error('💥 Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Запуск сервера
startServer();

export default app;
