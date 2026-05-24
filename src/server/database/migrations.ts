/**
 * Миграции базы данных для интернет-зоомагазина
 * Создаёт все необходимые таблицы, индексы и ограничения
 * @file migrations.ts
 */

import Database from 'better-sqlite3';
import { getDb } from './db';

/**
 * Запускает все миграции базы данных
 */
export function runMigrations(): void {
  const db = getDb();

  // Включаем поддержку внешних ключей
  db.pragma('foreign_keys = ON');

  console.log('Запуск миграций базы данных...');

  // ============================================
  // ТАБЛИЦА: categories (Категории товаров)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      parent_id INTEGER DEFAULT NULL,
      icon TEXT DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      description TEXT DEFAULT NULL,
      meta_title TEXT DEFAULT NULL,
      meta_description TEXT DEFAULT NULL,
      h1 TEXT DEFAULT NULL,
      filter_attributes TEXT DEFAULT '[]',
      display_template TEXT DEFAULT 'grid' CHECK(display_template IN ('grid', 'list')),
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      product_count INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      path TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // ============================================
  // ТАБЛИЦА: brands (Бренды)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      logo_url TEXT DEFAULT NULL,
      description TEXT DEFAULT NULL,
      country TEXT DEFAULT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: products (Товары)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sku TEXT NOT NULL UNIQUE,
      barcode TEXT DEFAULT NULL,
      brand_id INTEGER DEFAULT NULL,
      brand_name TEXT DEFAULT NULL,
      category_id INTEGER NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      composition TEXT DEFAULT NULL,
      price REAL NOT NULL,
      old_price REAL DEFAULT NULL,
      cost_price REAL DEFAULT NULL,
      subscription_price REAL DEFAULT NULL,
      stock INTEGER DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 5,
      weight REAL DEFAULT NULL,
      length REAL DEFAULT NULL,
      width REAL DEFAULT NULL,
      height REAL DEFAULT NULL,
      animal_types TEXT DEFAULT '[]',
      age_groups TEXT DEFAULT '[]',
      breed_sizes TEXT DEFAULT '[]',
      badges TEXT DEFAULT '[]',
      features TEXT DEFAULT '[]',
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'draft', 'hidden', 'archived')),
      sort_order INTEGER DEFAULT 0,
      publish_date TEXT DEFAULT NULL,
      internal_notes TEXT DEFAULT NULL,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      sales_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // ============================================
  // ТАБЛИЦА: product_images (Изображения товаров)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      alt TEXT DEFAULT '',
      is_main INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // ============================================
  // ТАБЛИЦА: product_variants (Варианты товаров)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      old_price REAL DEFAULT NULL,
      stock INTEGER DEFAULT 0,
      weight REAL DEFAULT NULL,
      image_url TEXT DEFAULT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // ============================================
  // ТАБЛИЦА: users (Пользователи)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT DEFAULT NULL,
      role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'manager', 'admin')),
      addresses TEXT DEFAULT '[]',
      bonus_balance REAL DEFAULT 0,
      segment TEXT DEFAULT 'new' CHECK(segment IN ('new', 'regular', 'vip')),
      favorite_ids TEXT DEFAULT '[]',
      is_blocked INTEGER DEFAULT 0,
      manager_notes TEXT DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT DEFAULT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: orders (Заказы)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      user_id INTEGER DEFAULT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      promo_code TEXT DEFAULT NULL,
      delivery_cost REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'new' CHECK(status IN ('new', 'confirmed', 'assembling', 'shipped', 'delivered', 'cancelled', 'returned')),
      delivery_method TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      delivery_city TEXT NOT NULL,
      desired_date TEXT DEFAULT NULL,
      tracking_number TEXT DEFAULT NULL,
      payment_method TEXT NOT NULL,
      is_paid INTEGER DEFAULT 0,
      paid_at TEXT DEFAULT NULL,
      customer_comment TEXT DEFAULT NULL,
      internal_notes TEXT DEFAULT NULL,
      history TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // ============================================
  // ТАБЛИЦА: banners (Баннеры)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT NULL,
      button_text TEXT DEFAULT NULL,
      button_link TEXT DEFAULT NULL,
      image_desktop TEXT NOT NULL,
      image_mobile TEXT DEFAULT NULL,
      text_position TEXT DEFAULT 'center' CHECK(text_position IN ('left', 'center', 'right')),
      text_color TEXT DEFAULT '#ffffff',
      overlay_opacity REAL DEFAULT 0.5,
      placement TEXT DEFAULT 'hero' CHECK(placement IN ('hero', 'category', 'sidebar', 'popup')),
      sort_order INTEGER DEFAULT 0,
      start_date TEXT DEFAULT NULL,
      end_date TEXT DEFAULT NULL,
      is_active INTEGER DEFAULT 1,
      click_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: pages (Страницы)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      template TEXT DEFAULT 'full' CHECK(template IN ('full', 'sidebar')),
      meta_title TEXT DEFAULT NULL,
      meta_description TEXT DEFAULT NULL,
      h1 TEXT DEFAULT NULL,
      status TEXT DEFAULT 'published' CHECK(status IN ('published', 'draft')),
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: reviews (Отзывы)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      user_id INTEGER DEFAULT NULL,
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      text TEXT NOT NULL,
      pros TEXT DEFAULT NULL,
      cons TEXT DEFAULT NULL,
      photos TEXT DEFAULT '[]',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      admin_reply TEXT DEFAULT NULL,
      admin_reply_date TEXT DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // ============================================
  // ТАБЛИЦА: promos (Промокоды)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS promos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('percent', 'fixed', 'free_delivery')),
      value REAL NOT NULL,
      min_order_amount REAL DEFAULT NULL,
      max_discount_amount REAL DEFAULT NULL,
      total_usage_limit INTEGER DEFAULT NULL,
      per_user_limit INTEGER DEFAULT 1,
      usage_count INTEGER DEFAULT 0,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      applies_to TEXT DEFAULT 'all' CHECK(applies_to IN ('all', 'categories', 'brands', 'products')),
      applies_to_ids TEXT DEFAULT '[]',
      exclude_ids TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: media_files (Медиа файлы)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail_url TEXT DEFAULT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER DEFAULT NULL,
      height INTEGER DEFAULT NULL,
      alt TEXT DEFAULT NULL,
      folder TEXT DEFAULT '',
      used_in TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: settings (Настройки)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      group TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: navigation_menus (Меню навигации)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS navigation_menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL UNIQUE CHECK(location IN ('main', 'mobile', 'footer', 'additional')),
      items TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ============================================
  // ТАБЛИЦА: activity_logs (Логи активности)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT NULL,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER DEFAULT NULL,
      details TEXT DEFAULT NULL,
      ip TEXT DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // ============================================
  // ТАБЛИЦА: cart_items (Корзина - server-side)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      user_id INTEGER DEFAULT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER DEFAULT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
    )
  `);

  // ============================================
  // ТАБЛИЦА: sessions (Сессии пользователей)
  // ============================================
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL UNIQUE,
      user_id INTEGER DEFAULT NULL,
      data TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // ============================================
  // ИНДЕКСЫ для ускорения поиска
  // ============================================

  // Индексы для products
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at)`);

  // Индексы для categories
  db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active)`);

  // Индексы для orders
  db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)`);

  // Индексы для users
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);

  // Индексы для reviews
  db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)`);

  // Индексы для banners
  db.exec(`CREATE INDEX IF NOT EXISTS idx_banners_placement ON banners(placement)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active)`);

  // Индексы для pages
  db.exec(`CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status)`);

  // Индексы для promos
  db.exec(`CREATE INDEX IF NOT EXISTS idx_promos_code ON promos(code)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_promos_active ON promos(is_active)`);

  // Индексы для media_files
  db.exec(`CREATE INDEX IF NOT EXISTS idx_media_folder ON media_files(folder)`);

  // Индексы для activity_logs
  db.exec(`CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_logs(entity_type, entity_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at)`);

  // Индексы для cart_items
  db.exec(`CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id)`);

  // Индексы для sessions
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_id ON sessions(session_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`);

  console.log('Миграции успешно выполнены!');
}

/**
 * Сбрасывает все таблицы базы данных (для разработки)
 */
export function resetDatabase(): void {
  const db = getDb();

  console.log('Сброс базы данных...');

  // Отключаем внешние ключи на время сброса
  db.pragma('foreign_keys = OFF');

  // Получаем список всех таблиц
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all() as { name: string }[];

  // Удаляем все таблицы
  for (const table of tables) {
    db.exec(`DROP TABLE IF EXISTS ${table.name}`);
  }

  // Включаем внешние ключи обратно
  db.pragma('foreign_keys = ON');

  console.log('База данных сброшена!');
}

// Запуск миграций при импорте модуля (если вызван напрямую)
if (require.main === module) {
  runMigrations();
}
