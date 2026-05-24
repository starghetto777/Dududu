/**
 * Главный роутер приложения
 * Подключает все маршруты API, магазина и админ-панели
 */

import { Router } from 'express';
import { apiLimiter } from '../middleware/ratelimit.middleware.js';

// Импорт API роутов
import productsApi from './api/products.api.js';
import categoriesApi from './api/categories.api.js';
import ordersApi from './api/orders.api.js';
import usersApi from './api/users.api.js';
import cartApi from './api/cart.api.js';
import favoritesApi from './api/favorites.api.js';
import reviewsApi from './api/reviews.api.js';
import bannersApi from './api/banners.api.js';
import pagesApi from './api/pages.api.js';
import promosApi from './api/promos.api.js';
import mediaApi from './api/media.api.js';
import settingsApi from './api/settings.api.js';
import navigationApi from './api/navigation.api.js';
import analyticsApi from './api/analytics.api.js';

const router = Router();

// =============================================================================
// API ROUTES
// =============================================================================

// Применяем rate limiter ко всем API запросам
router.use('/api', apiLimiter);

// Продукты
router.use('/api/products', productsApi);

// Категории
router.use('/api/categories', categoriesApi);

// Заказы
router.use('/api/orders', ordersApi);

// Пользователи и аутентификация
router.use('/api', usersApi); // Включает /api/auth/* и /api/users/*

// Корзина
router.use('/api/cart', cartApi);

// Избранное
router.use('/api/favorites', favoritesApi);

// Отзывы
router.use('/api', reviewsApi); // Включает /api/reviews и /api/products/:id/reviews

// Баннеры
router.use('/api/banners', bannersApi);

// Страницы
router.use('/api/pages', pagesApi);

// Промокоды
router.use('/api/promos', promosApi);

// Медиа библиотека
router.use('/api/media', mediaApi);

// Настройки
router.use('/api/settings', settingsApi);

// Навигация
router.use('/api/navigation', navigationApi);

// Аналитика
router.use('/api/analytics', analyticsApi);

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// =============================================================================
// API VERSION
// =============================================================================

router.get('/api/version', (req, res) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      node: process.version,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

export default router;
