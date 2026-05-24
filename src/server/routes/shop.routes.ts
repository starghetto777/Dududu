/**
 * Роуты для клиентской части магазина
 * Рендеринг EJS страниц
 */

import { Router, Request, Response } from 'express';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Применяем optionalAuth ко всем роутам магазина
router.use(optionalAuth);

// =============================================================================
// ГЛАВНАЯ СТРАНИЦА
// =============================================================================

/**
 * GET / - Главная страница
 */
router.get('/', (req: Request, res: Response) => {
  res.render('shop/index', {
    title: 'Зоомагазин - товары для животных',
    description: 'Широкий ассортимент товаров для собак, кошек, грызунов, птиц и рыбок',
    currentPage: 'home'
  });
});

// =============================================================================
// КАТАЛОГ ТОВАРОВ
// =============================================================================

/**
 * GET /catalog - Каталог всех товаров
 */
router.get('/catalog', (req: Request, res: Response) => {
  res.render('shop/catalog', {
    title: 'Каталог товаров',
    description: 'Все товары нашего зоомагазина',
    currentPage: 'catalog',
    filters: {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 100000 }
    }
  });
});

/**
 * GET /catalog/:slug - Каталог категории
 */
router.get('/catalog/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  
  res.render('shop/catalog', {
    title: `Категория: ${slug}`,
    description: `Товары категории ${slug}`,
    currentPage: 'catalog',
    categorySlug: slug,
    filters: {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 100000 }
    }
  });
});

// =============================================================================
// СТРАНИЦА ТОВАРА
// =============================================================================

/**
 * GET /product/:slug - Страница товара
 */
router.get('/product/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  
  res.render('shop/product', {
    title: `Товар: ${slug}`,
    description: `Подробная информация о товаре ${slug}`,
    currentPage: 'catalog',
    productSlug: slug
  });
});

// =============================================================================
// КОРЗИНА
// =============================================================================

/**
 * GET /cart - Корзина покупок
 */
router.get('/cart', (req: Request, res: Response) => {
  res.render('shop/cart', {
    title: 'Корзина',
    description: 'Ваши выбранные товары',
    currentPage: 'cart'
  });
});

// =============================================================================
// ОФОРМЛЕНИЕ ЗАКАЗА
// =============================================================================

/**
 * GET /checkout - Оформление заказа
 */
router.get('/checkout', (req: Request, res: Response) => {
  // Если пользователь не авторизован, можно предложить войти или оформить как гость
  res.render('shop/checkout', {
    title: 'Оформление заказа',
    description: 'Завершение покупки',
    currentPage: 'checkout',
    user: req.user || null
  });
});

// =============================================================================
// ЛИЧНЫЙ КАБИНЕТ
// =============================================================================

/**
 * GET /profile - Личный кабинет
 */
router.get('/profile', (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/admin/login?redirect=/profile');
  }
  
  res.render('shop/profile', {
    title: 'Личный кабинет',
    description: 'Управление профилем и заказами',
    currentPage: 'profile',
    user: req.user
  });
});

/**
 * GET /profile/orders - История заказов
 */
router.get('/profile/orders', (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/admin/login?redirect=/profile/orders');
  }
  
  res.render('shop/profile', {
    title: 'История заказов',
    description: 'Ваши заказы',
    currentPage: 'profile',
    activeTab: 'orders',
    user: req.user
  });
});

// =============================================================================
// ИЗБРАННОЕ
// =============================================================================

/**
 * GET /favorites - Избранные товары
 */
router.get('/favorites', (req: Request, res: Response) => {
  res.render('shop/favorites', {
    title: 'Избранное',
    description: 'Ваши избранные товары',
    currentPage: 'favorites',
    user: req.user || null
  });
});

// =============================================================================
// СРАВНЕНИЕ ТОВАРОВ
// =============================================================================

/**
 * GET /comparison - Сравнение товаров
 */
router.get('/comparison', (req: Request, res: Response) => {
  res.render('shop/comparison', {
    title: 'Сравнение товаров',
    description: 'Сравните характеристики товаров',
    currentPage: 'comparison'
  });
});

// =============================================================================
// ПОИСК
// =============================================================================

/**
 * GET /search - Результаты поиска
 */
router.get('/search', (req: Request, res: Response) => {
  const { q } = req.query;
  
  res.render('shop/search', {
    title: q ? `Поиск: ${q}` : 'Поиск товаров',
    description: 'Результаты поиска',
    currentPage: 'search',
    query: q || ''
  });
});

// =============================================================================
// СТАТИЧЕСКИЕ СТРАНИЦЫ
// =============================================================================

/**
 * GET /page/:slug - Статическая страница
 */
router.get('/page/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  
  res.render('shop/page', {
    title: slug,
    description: `Информационная страница: ${slug}`,
    currentPage: 'page',
    pageSlug: slug
  });
});

// Популярные статические страницы (можно вынести отдельно)
router.get('/about', (req: Request, res: Response) => {
  res.render('shop/page', {
    title: 'О нас',
    description: 'Информация о нашем зоомагазине',
    currentPage: 'page',
    pageSlug: 'about'
  });
});

router.get('/delivery', (req: Request, res: Response) => {
  res.render('shop/page', {
    title: 'Доставка и оплата',
    description: 'Условия доставки и способы оплаты',
    currentPage: 'page',
    pageSlug: 'delivery'
  });
});

router.get('/contacts', (req: Request, res: Response) => {
  res.render('shop/page', {
    title: 'Контакты',
    description: 'Наши контактные данные',
    currentPage: 'page',
    pageSlug: 'contacts'
  });
});

// =============================================================================
// 404 HANDLER ДЛЯ МАГАЗИНА
// =============================================================================

/**
 * Обработчик 404 для несуществующих страниц магазина
 * Должен быть последним роутом
 */
router.use((req: Request, res: Response) => {
  // Если это API запрос - возвращаем JSON
  if (req.path.startsWith('/api')) {
    return; // Пропускаем, дальше обработает API роутер
  }
  
  // Для обычных запросов рендерим 404 страницу
  res.status(404).render('shop/404', {
    title: 'Страница не найдена',
    description: 'Запрашиваемая страница не существует',
    currentUrl: req.originalUrl
  });
});

export default router;
