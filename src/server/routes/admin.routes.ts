/**
 * Роуты для админ-панели
 * Страницы входа, дашборд и управление сущностями
 */

import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// =============================================================================
// АУТЕНТИФИКАЦИЯ
// =============================================================================

/**
 * GET /admin/login - Страница входа
 */
router.get('/login', (req: Request, res: Response) => {
  // Если уже авторизован как админ - редирект на дашборд
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return res.redirect('/admin');
  }
  
  res.render('admin/login', {
    title: 'Вход в админ-панель',
    error: req.query.error,
    redirect: req.query.redirect
  });
});

/**
 * POST /admin/login - Обработка входа
 * Реальная обработка происходит в API /api/auth/login
 * Здесь только перенаправление
 */
router.post('/login', (req: Request, res: Response) => {
  // После успешного входа через API пользователь будет перенаправлен
  res.redirect('/admin');
});

/**
 * GET /admin/logout - Выход из системы
 */
router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken');
  res.redirect('/admin/login');
});

// =============================================================================
// ЗАЩИЩЁННЫЕ РОУТЫ АДМИН-ПАНЕЛИ
// =============================================================================

/**
 * GET /admin - Дашборд
 */
router.get('/', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/dashboard', {
    title: 'Дашборд',
    currentPage: 'dashboard',
    user: req.user
  });
});

/**
 * GET /admin/products - Список товаров
 */
router.get('/products', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/products', {
    title: 'Товары',
    currentPage: 'products',
    user: req.user
  });
});

/**
 * GET /admin/products/new - Новый товар
 */
router.get('/products/new', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/product-edit', {
    title: 'Новый товар',
    currentPage: 'products',
    user: req.user,
    isEdit: false
  });
});

/**
 * GET /admin/products/:id - Редактирование товара
 */
router.get('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  
  res.render('admin/product-edit', {
    title: `Редактирование товара #${id}`,
    currentPage: 'products',
    user: req.user,
    isEdit: true,
    productId: parseInt(id, 10)
  });
});

/**
 * GET /admin/categories - Категории
 */
router.get('/categories', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/categories', {
    title: 'Категории',
    currentPage: 'categories',
    user: req.user
  });
});

/**
 * GET /admin/orders - Заказы
 */
router.get('/orders', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/orders', {
    title: 'Заказы',
    currentPage: 'orders',
    user: req.user
  });
});

/**
 * GET /admin/orders/:id - Детали заказа
 */
router.get('/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  
  res.render('admin/order-detail', {
    title: `Заказ #${id}`,
    currentPage: 'orders',
    user: req.user,
    orderId: parseInt(id, 10)
  });
});

/**
 * GET /admin/users - Пользователи
 */
router.get('/users', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/users', {
    title: 'Пользователи',
    currentPage: 'users',
    user: req.user
  });
});

/**
 * GET /admin/reviews - Отзывы
 */
router.get('/reviews', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/reviews', {
    title: 'Отзывы',
    currentPage: 'reviews',
    user: req.user
  });
});

/**
 * GET /admin/banners - Баннеры
 */
router.get('/banners', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/banners', {
    title: 'Баннеры',
    currentPage: 'banners',
    user: req.user
  });
});

/**
 * GET /admin/pages - Страницы
 */
router.get('/pages', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/pages', {
    title: 'Страницы',
    currentPage: 'pages',
    user: req.user
  });
});

/**
 * GET /admin/pages/new - Новая страница
 */
router.get('/pages/new', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/page-edit', {
    title: 'Новая страница',
    currentPage: 'pages',
    user: req.user,
    isEdit: false
  });
});

/**
 * GET /admin/pages/:id - Редактирование страницы
 */
router.get('/pages/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  
  res.render('admin/page-edit', {
    title: `Редактирование страницы #${id}`,
    currentPage: 'pages',
    user: req.user,
    isEdit: true,
    pageId: parseInt(id, 10)
  });
});

/**
 * GET /admin/media - Медиа библиотека
 */
router.get('/media', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/media', {
    title: 'Медиа библиотека',
    currentPage: 'media',
    user: req.user
  });
});

/**
 * GET /admin/appearance - Внешний вид
 */
router.get('/appearance', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/appearance', {
    title: 'Внешний вид',
    currentPage: 'appearance',
    user: req.user
  });
});

/**
 * GET /admin/navigation - Редактор меню
 */
router.get('/navigation', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/navigation', {
    title: 'Меню навигации',
    currentPage: 'navigation',
    user: req.user
  });
});

/**
 * GET /admin/seo - SEO настройки
 */
router.get('/seo', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/seo', {
    title: 'SEO настройки',
    currentPage: 'seo',
    user: req.user
  });
});

/**
 * GET /admin/promos - Промокоды
 */
router.get('/promos', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/promos', {
    title: 'Промокоды',
    currentPage: 'promos',
    user: req.user
  });
});

/**
 * GET /admin/settings - Настройки
 */
router.get('/settings', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/settings', {
    title: 'Настройки',
    currentPage: 'settings',
    user: req.user
  });
});

/**
 * GET /admin/analytics - Аналитика
 */
router.get('/analytics', requireAdmin, (req: Request, res: Response) => {
  res.render('admin/analytics', {
    title: 'Аналитика',
    currentPage: 'analytics',
    user: req.user
  });
});

export default router;
