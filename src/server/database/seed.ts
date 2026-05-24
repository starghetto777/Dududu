/**
 * Seed-скрипт для заполнения базы данных тестовыми данными
 * Реалистичные данные для интернет-зоомагазина
 * @file seed.ts
 */

import { getDb } from './db';
import { runMigrations, resetDatabase } from './migrations';
import bcrypt from 'bcrypt';

/**
 * Генерирует уникальный slug из названия
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Генерирует номер заказа
 */
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}-${random}`;
}

/**
 * Основная функция seed
 */
async function seed(): Promise<void> {
  const db = getDb();

  console.log('🌱 Запуск seed-скрипта...');

  // Сначала выполняем миграции
  runMigrations();

  // Очищаем базу перед заполнением (опционально)
  // resetDatabase();
  // runMigrations();

  const now = new Date().toISOString();

  // ============================================
  // 1. КАТЕГОРИИ
  // ============================================
  console.log('📁 Создание категорий...');

  const categories = [
    // Собаки (id: 1)
    { id: 1, name: 'Собаки', slug: 'dogs', parent_id: null, level: 0, path: '/dogs' },
    { id: 2, name: 'Корма для собак', slug: 'dog-food', parent_id: 1, level: 1, path: '/dogs/dog-food' },
    { id: 3, name: 'Сухие корма', slug: 'dry-dog-food', parent_id: 2, level: 2, path: '/dogs/dog-food/dry' },
    { id: 4, name: 'Влажные корма', slug: 'wet-dog-food', parent_id: 2, level: 2, path: '/dogs/dog-food/wet' },
    { id: 5, name: 'Лечебные корма', slug: 'medical-dog-food', parent_id: 2, level: 2, path: '/dogs/dog-food/medical' },
    { id: 6, name: 'Лакомства', slug: 'dog-treats', parent_id: 2, level: 2, path: '/dogs/dog-food/treats' },
    { id: 7, name: 'Игрушки для собак', slug: 'dog-toys', parent_id: 1, level: 1, path: '/dogs/toys' },
    { id: 8, name: 'Амуниция', slug: 'dog-equipment', parent_id: 1, level: 1, path: '/dogs/equipment' },
    { id: 9, name: 'Лежаки и домики', slug: 'dog-beds', parent_id: 1, level: 1, path: '/dogs/beds' },
    
    // Кошки (id: 10)
    { id: 10, name: 'Кошки', slug: 'cats', parent_id: null, level: 0, path: '/cats' },
    { id: 11, name: 'Корма для кошек', slug: 'cat-food', parent_id: 10, level: 1, path: '/cats/cat-food' },
    { id: 12, name: 'Сухие корма', slug: 'dry-cat-food', parent_id: 11, level: 2, path: '/cats/cat-food/dry' },
    { id: 13, name: 'Влажные корма', slug: 'wet-cat-food', parent_id: 11, level: 2, path: '/cats/cat-food/wet' },
    { id: 14, name: 'Наполнители', slug: 'cat-litter', parent_id: 10, level: 1, path: '/cats/litter' },
    { id: 15, name: 'Игрушки для кошек', slug: 'cat-toys', parent_id: 10, level: 1, path: '/cats/toys' },
    
    // Грызуны (id: 16)
    { id: 16, name: 'Грызуны', slug: 'rodents', parent_id: null, level: 0, path: '/rodents' },
    
    // Птицы (id: 17)
    { id: 17, name: 'Птицы', slug: 'birds', parent_id: null, level: 0, path: '/birds' },
    
    // Рыбки (id: 18)
    { id: 18, name: 'Рыбки', slug: 'fish', parent_id: null, level: 0, path: '/fish' },
  ];

  for (const cat of categories) {
    db.prepare(`
      INSERT OR REPLACE INTO categories 
      (id, name, slug, parent_id, level, path, description, is_active, filter_attributes, display_template)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, '[]', 'grid')
    `).run(
      cat.id,
      cat.name,
      cat.slug,
      cat.parent_id,
      cat.level,
      cat.path,
      `Все товары для категории "${cat.name}"`
    );
  }

  // ============================================
  // 2. БРЕНДЫ
  // ============================================
  console.log('🏷️ Создание брендов...');

  const brands = [
    { name: 'Royal Canin', country: 'Франция' },
    { name: 'Purina Pro Plan', country: 'США' },
    { name: "Hill's", country: 'США' },
    { name: 'Brit', country: 'Чехия' },
    { name: 'Acana', country: 'Канада' },
    { name: 'Orijen', country: 'Канада' },
    { name: 'Pedigree', country: 'США' },
    { name: 'Whiskas', country: 'США' },
    { name: 'Josera', country: 'Германия' },
    { name: 'Monge', country: 'Италия' },
  ];

  for (const brand of brands) {
    db.prepare(`
      INSERT OR IGNORE INTO brands (name, slug, country, is_active)
      VALUES (?, ?, ?, 1)
    `).run(brand.name, generateSlug(brand.name), brand.country);
  }

  // ============================================
  // 3. ТОВАРЫ (20 товаров)
  // ============================================
  console.log('🛍️ Создание товаров...');

  const products = [
    {
      name: 'Сухой корм Royal Canin Maxi Adult 15кг',
      sku: 'RC-MAXI-15',
      category_id: 3,
      brand_name: 'Royal Canin',
      price: 2500,
      stock: 45,
      short_description: 'Полнорационный сухой корм для взрослых собак крупных пород',
      full_description: 'Royal Canin Maxi Adult — это сбалансированный рацион для взрослых собак крупных пород весом от 26 до 44 кг. Содержит оптимальное количество белков, жиров и углеводов для поддержания здоровья и активности вашей собаки.',
      weight: 15000,
      rating: 4.8,
      review_count: 124,
      sales_count: 567,
      animal_types: ['dogs'],
      age_groups: ['adult'],
      breed_sizes: ['large']
    },
    {
      name: 'Сухой корм Royal Canin Indoor 2кг',
      sku: 'RC-IND-2',
      category_id: 12,
      brand_name: 'Royal Canin',
      price: 890,
      stock: 23,
      short_description: 'Корм для домашних кошек, ведущих малоподвижный образ жизни',
      full_description: 'Royal Canin Indoor разработан специально для кошек, которые проводят большую часть времени в помещении. Помогает поддерживать оптимальный вес и снижает запах стула.',
      weight: 2000,
      rating: 4.6,
      review_count: 89,
      sales_count: 432,
      animal_types: ['cats'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: 'Влажный корм Purina Pro Plan курица 400г',
      sku: 'PP-CHK-400',
      category_id: 4,
      brand_name: 'Purina Pro Plan',
      price: 180,
      stock: 120,
      short_description: 'Влажный корм с курицей для взрослых собак',
      full_description: 'Purina Pro Plan с нежной курицей — это вкусный и питательный влажный корм для взрослых собак всех пород. Содержит высококачественный белок и витамины.',
      weight: 400,
      rating: 4.5,
      review_count: 56,
      sales_count: 289,
      animal_types: ['dogs'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: 'Brit Premium Dog Lamb 15кг',
      sku: 'BR-LAMB-15',
      category_id: 3,
      brand_name: 'Brit',
      price: 3200,
      stock: 8,
      short_description: 'Премиум корм с ягнёнком для взрослых собак',
      full_description: 'Brit Premium Dog Lamb — гипоаллергенный корм на основе мяса ягнёнка. Идеально подходит для собак с чувствительным пищеварением.',
      weight: 15000,
      rating: 4.7,
      review_count: 78,
      sales_count: 234,
      animal_types: ['dogs'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: "Hill's Science Plan Adult Medium 12кг",
      sku: 'HL-SCI-12',
      category_id: 3,
      brand_name: "Hill's",
      price: 4500,
      stock: 15,
      short_description: 'Научно разработанный корм для собак средних пород',
      full_description: "Hill's Science Plan содержит точный баланс питательных веществ для поддержания здоровья собак средних пород. Обогащён антиоксидантами.",
      weight: 12000,
      rating: 4.9,
      review_count: 156,
      sales_count: 445,
      animal_types: ['dogs'],
      age_groups: ['adult'],
      breed_sizes: ['medium']
    },
    {
      name: 'Acana Wild Prairie Dog 6кг',
      sku: 'AC-WILD-6',
      category_id: 3,
      brand_name: 'Acana',
      price: 3800,
      stock: 20,
      short_description: 'Биологически соответствующий корм с мясом свободной выгула',
      full_description: 'Acana Wild Prairie содержит 70% качественного мяса курицы, индейки и яиц. Беззерновая формула для здоровья вашей собаки.',
      weight: 6000,
      rating: 4.8,
      review_count: 92,
      sales_count: 312,
      animal_types: ['dogs'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: 'Royal Canin Indoor 37 для кошек 400г',
      sku: 'RC-IND37-400',
      category_id: 12,
      brand_name: 'Royal Canin',
      price: 650,
      stock: 67,
      short_description: 'Сухой корм для домашних кошек',
      full_description: 'Специальная формула для кошек, живущих в помещении. Поддерживает здоровье мочевыводящих путей и контролирует вес.',
      weight: 400,
      rating: 4.5,
      review_count: 45,
      sales_count: 198,
      animal_types: ['cats'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: 'Purina One Adult для кошек 1.5кг',
      sku: 'PO-ADT-1.5',
      category_id: 12,
      brand_name: 'Purina Pro Plan',
      price: 780,
      stock: 34,
      short_description: 'Полнорационный корм для взрослых кошек',
      full_description: 'Purina One обеспечивает полное и сбалансированное питание для взрослых кошек. Содержит натуральный пребиотик для здорового пищеварения.',
      weight: 1500,
      rating: 4.4,
      review_count: 67,
      sales_count: 256,
      animal_types: ['cats'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: 'Whiskas паштет с курицей 85г',
      sku: 'WH-PAT-85',
      category_id: 13,
      brand_name: 'Whiskas',
      price: 45,
      stock: 200,
      short_description: 'Нежный паштет для взрослых кошек',
      full_description: 'Whiskas паштет — это вкусное и полезное лакомство для вашей кошки. Нежная текстура и насыщенный вкус курицы.',
      weight: 85,
      rating: 4.2,
      review_count: 234,
      sales_count: 1567,
      animal_types: ['cats'],
      age_groups: ['adult'],
      breed_sizes: ['all']
    },
    {
      name: 'Наполнитель Catsan 5л',
      sku: 'CT-SAN-5L',
      category_id: 14,
      brand_name: 'Catsan',
      price: 520,
      stock: 89,
      short_description: 'Минеральный наполнитель для кошачьего туалета',
      full_description: 'Catsan — высококачественный минеральный наполнитель с отличной впитываемостью. Контролирует запах до 7 дней.',
      weight: 5000,
      rating: 4.3,
      review_count: 178,
      sales_count: 678,
      animal_types: ['cats'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
    {
      name: 'Игрушка мяч с колокольчиком',
      sku: 'TOY-BALL-01',
      category_id: 15,
      brand_name: null,
      price: 250,
      stock: 150,
      short_description: 'Интерактивная игрушка для кошек',
      full_description: 'Яркий мячик с колокольчиком внутри. Изготовлен из безопасных материалов. Отлично подходит для активных игр.',
      weight: 50,
      rating: 4.6,
      review_count: 89,
      sales_count: 445,
      animal_types: ['cats'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
    {
      name: 'Поводок кожаный 120см',
      sku: 'EQ-LEASH-120',
      category_id: 8,
      brand_name: null,
      price: 1200,
      stock: 30,
      short_description: 'Прочный кожаный поводок для собак',
      full_description: 'Кожаный поводок длиной 120 см. Удобная ручка, надёжная фурнитура. Подходит для собак средних и крупных пород.',
      weight: 200,
      length: 120,
      rating: 4.7,
      review_count: 34,
      sales_count: 123,
      animal_types: ['dogs'],
      age_groups: ['all'],
      breed_sizes: ['medium', 'large']
    },
    {
      name: 'Ошейник нейлоновый M',
      sku: 'EQ-COL-M',
      category_id: 8,
      brand_name: null,
      price: 450,
      stock: 55,
      short_description: 'Нейлоновый ошейник среднего размера',
      full_description: 'Прочный нейлоновый ошейник с регулируемой застёжкой. Доступен в различных цветах. Размер M подходит для собак средних пород.',
      weight: 50,
      rating: 4.4,
      review_count: 56,
      sales_count: 234,
      animal_types: ['dogs'],
      age_groups: ['all'],
      breed_sizes: ['medium']
    },
    {
      name: 'Лежанка Уют размер L',
      sku: 'BED-COZ-L',
      category_id: 9,
      brand_name: null,
      price: 2800,
      stock: 12,
      short_description: 'Мягкая лежанка для собак крупных пород',
      full_description: 'Уютная лежанка с мягкими бортиками. Съемный чехол можно стирать. Размер L подходит для собак до 40 кг.',
      weight: 2500,
      length: 90,
      width: 70,
      height: 20,
      rating: 4.8,
      review_count: 67,
      sales_count: 189,
      animal_types: ['dogs'],
      age_groups: ['all'],
      breed_sizes: ['large']
    },
    {
      name: 'Переноска пластиковая M',
      sku: 'CAR-PL-M',
      category_id: 8,
      brand_name: null,
      price: 1900,
      stock: 18,
      short_description: 'Пластиковая переноска для кошек и мелких собак',
      full_description: 'Надёжная пластиковая переноска с вентиляционными отверстиями. Подходит для перевозки в автомобиле и самолёте.',
      weight: 1800,
      length: 50,
      width: 35,
      height: 35,
      rating: 4.5,
      review_count: 45,
      sales_count: 156,
      animal_types: ['cats', 'dogs'],
      age_groups: ['all'],
      breed_sizes: ['small', 'medium']
    },
    {
      name: 'Автоматическая поилка',
      sku: 'ACC-BOWL-AUTO',
      category_id: 8,
      brand_name: null,
      price: 1500,
      stock: 25,
      short_description: 'Поилка с циркуляцией воды для кошек',
      full_description: 'Автоматическая поилка с фильтром стимулирует кошек пить больше воды. Ёмкость 2 литра, тихий насос.',
      weight: 800,
      rating: 4.6,
      review_count: 78,
      sales_count: 267,
      animal_types: ['cats'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
    {
      name: 'Когтеточка напольная',
      sku: 'CAT-SCR-FLOOR',
      category_id: 15,
      brand_name: null,
      price: 1800,
      stock: 20,
      short_description: 'Высокая когтеточка с домиком',
      full_description: 'Напольная когтеточка высотой 80 см с уютным домиком наверху. Обмотана джутовым канатом.',
      weight: 5000,
      height: 80,
      rating: 4.7,
      review_count: 92,
      sales_count: 234,
      animal_types: ['cats'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
    {
      name: 'Корм для грызунов Vitakraft 500г',
      sku: 'VIT-GR-500',
      category_id: 16,
      brand_name: 'Vitakraft',
      price: 320,
      stock: 75,
      short_description: 'Полнорационный корм для хомяков и мышей',
      full_description: 'Vitakraft Menu — сбалансированный корм для мелких грызунов. Содержит злаки, семена и витамины.',
      weight: 500,
      rating: 4.5,
      review_count: 34,
      sales_count: 145,
      animal_types: ['rodents'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
    {
      name: 'Аквариум 30л комплект',
      sku: 'AQ-SET-30',
      category_id: 18,
      brand_name: null,
      price: 3500,
      stock: 10,
      short_description: 'Аквариум с оборудованием для начинающих',
      full_description: 'Комплект включает аквариум 30л, фильтр, светильник и компрессор. Идеально для новичков.',
      weight: 8000,
      length: 40,
      width: 25,
      height: 30,
      rating: 4.4,
      review_count: 28,
      sales_count: 67,
      animal_types: ['fish'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
    {
      name: 'Корм для попугаев Versele-Laga 1кг',
      sku: 'VL-PAR-1KG',
      category_id: 17,
      brand_name: 'Versele-Laga',
      price: 480,
      stock: 40,
      short_description: 'Корм для средних попугаев',
      full_description: 'Versele-Laga Prestige — полнорационный корм для волнистых попугаев и корелл. Содержит фрукты и минералы.',
      weight: 1000,
      rating: 4.6,
      review_count: 56,
      sales_count: 189,
      animal_types: ['birds'],
      age_groups: ['all'],
      breed_sizes: ['all']
    },
  ];

  for (const prod of products) {
    const slug = generateSlug(prod.name);
    const brandId = prod.brand_name 
      ? (db.prepare('SELECT id FROM brands WHERE name = ?').get(prod.brand_name) as { id: number } | null)?.id || null
      : null;

    const result = db.prepare(`
      INSERT OR REPLACE INTO products 
      (name, slug, sku, brand_id, brand_name, category_id, short_description, full_description,
       price, stock, weight, length, width, height, rating, review_count, sales_count,
       animal_types, age_groups, breed_sizes, status, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1)
    `).run(
      prod.name,
      slug,
      prod.sku,
      brandId,
      prod.brand_name,
      prod.category_id,
      prod.short_description,
      prod.full_description,
      prod.price,
      prod.stock,
      prod.weight || null,
      prod.length || null,
      prod.width || null,
      prod.height || null,
      prod.rating,
      prod.review_count,
      prod.sales_count,
      JSON.stringify(prod.animal_types),
      JSON.stringify(prod.age_groups),
      JSON.stringify(prod.breed_sizes)
    );

    const productId = result.lastInsertRowid as number;

    // Добавляем изображения для товара
    const images = [
      { url: `https://images.unsplash.com/photo-1589924691195-41432c84c161?w=800`, alt: `${prod.name} - главное фото`, is_main: 1 },
      { url: `https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800`, alt: `${prod.name} - фото 2`, is_main: 0 },
      { url: `https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800`, alt: `${prod.name} - фото 3`, is_main: 0 },
    ];

    for (let i = 0; i < images.length; i++) {
      db.prepare(`
        INSERT INTO product_images (product_id, url, thumbnail_url, alt, is_main, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(productId, images[i].url, images[i].url.replace('w=800', 'w=200'), images[i].alt, images[i].is_main, i);
    }
  }

  // ============================================
  // 4. БАННЕРЫ (3 баннера)
  // ============================================
  console.log('🎨 Создание баннеров...');

  const banners = [
    {
      title: 'Скидки до 40% на Royal Canin',
      subtitle: 'Только до конца месяца! Успейте купить корма по выгодной цене',
      button_text: 'Купить сейчас',
      button_link: '/catalog?brand=royal-canin',
      placement: 'hero',
      text_position: 'left',
      image_desktop: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?w=1920',
      image_mobile: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?w=800'
    },
    {
      title: 'Бесплатная доставка от 2000₽',
      subtitle: 'Заказывайте выгодно — доставим бесплатно по всему городу',
      button_text: 'В каталог',
      button_link: '/catalog',
      placement: 'hero',
      text_position: 'center',
      image_desktop: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=1920',
      image_mobile: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800'
    },
    {
      title: 'Новинки сезона — уже в наличии',
      subtitle: 'Игрушки, аксессуары и корма от лучших производителей',
      button_text: 'Смотреть новинки',
      button_link: '/new',
      placement: 'hero',
      text_position: 'right',
      image_desktop: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1920',
      image_mobile: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'
    },
  ];

  for (const banner of banners) {
    db.prepare(`
      INSERT INTO banners 
      (title, subtitle, button_text, button_link, placement, text_position, 
       image_desktop, image_mobile, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      banner.title,
      banner.subtitle,
      banner.button_text,
      banner.button_link,
      banner.placement,
      banner.text_position,
      banner.image_desktop,
      banner.image_mobile,
      banners.indexOf(banner)
    );
  }

  // ============================================
  // 5. ПОЛЬЗОВАТЕЛИ (3 пользователя)
  // ============================================
  console.log('👥 Создание пользователей...');

  const users = [
    { email: 'admin@zoo.ru', password: 'admin123', name: 'Администратор', role: 'admin' },
    { email: 'manager@zoo.ru', password: 'manager123', name: 'Менеджер', role: 'manager' },
    { email: 'user@zoo.ru', password: 'user123', name: 'Покупатель', role: 'customer' },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    db.prepare(`
      INSERT OR IGNORE INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run(user.email, passwordHash, user.name, user.role);
  }

  // ============================================
  // 6. ЗАКАЗЫ (5 заказов)
  // ============================================
  console.log('📦 Создание заказов...');

  const orders = [
    { status: 'delivered', total: 3200, items: 2 },
    { status: 'shipped', total: 1500, items: 1 },
    { status: 'assembling', total: 5600, items: 4 },
    { status: 'confirmed', total: 890, items: 1 },
    { status: 'new', total: 4200, items: 3 },
  ];

  for (const order of orders) {
    db.prepare(`
      INSERT INTO orders 
      (order_number, user_id, customer_name, customer_email, customer_phone,
       items, subtotal, delivery_cost, total, status, delivery_method,
       delivery_address, delivery_city, payment_method, is_paid)
      VALUES (?, 3, ?, ?, ?, ?, ?, 300, ?, ?, 'courier', ?, 'Москва', 'card', ?)
    `).run(
      generateOrderNumber(),
      'Иван Петров',
      'ivan@example.com',
      '+7 (999) 123-45-67',
      JSON.stringify([{ product_id: 1, product_name: 'Товар 1', quantity: 1, price: order.total / order.items }]),
      order.total - 300,
      order.total,
      order.status,
      'ул. Примерная, д. 1, кв. 1',
      order.status === 'delivered' ? 1 : 0
    );
  }

  // ============================================
  // 7. ОТЗЫВЫ (10 отзывов)
  // ============================================
  console.log('⭐ Создание отзывов...');

  const reviews = [
    { product_id: 1, rating: 5, text: 'Отличный корм! Собака ест с удовольствием.', status: 'approved' },
    { product_id: 1, rating: 4, text: 'Хороший корм, но дороговат.', status: 'approved' },
    { product_id: 2, rating: 5, text: 'Кошке очень нравится, буду заказывать ещё.', status: 'approved' },
    { product_id: 3, rating: 4, text: 'Качественный влажный корм, рекомендую.', status: 'approved' },
    { product_id: 4, rating: 5, text: 'Лучший корм для нашей собаки!', status: 'approved' },
    { product_id: 5, rating: 5, text: 'Научный подход к питанию, видно результат.', status: 'approved' },
    { product_id: 6, rating: 4, text: 'Хороший состав, но цена кусается.', status: 'pending' },
    { product_id: 7, rating: 3, text: 'Нормально, но есть варианты лучше.', status: 'pending' },
    { product_id: 8, rating: 5, text: 'Отличное соотношение цены и качества!', status: 'approved' },
    { product_id: 9, rating: 4, text: 'Кошка в восторге от паштета.', status: 'rejected' },
  ];

  for (const review of reviews) {
    const product = db.prepare('SELECT name FROM products WHERE id = ?').get(review.product_id) as { name: string };
    db.prepare(`
      INSERT INTO reviews (product_id, product_name, author_name, rating, text, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      review.product_id,
      product.name,
      ['Анна', 'Борис', 'Виктор', 'Галина', 'Дмитрий'][Math.floor(Math.random() * 5)],
      review.rating,
      review.text,
      review.status
    );
  }

  // ============================================
  // 8. ПРОМОКОДЫ (3 промокода)
  // ============================================
  console.log('🎟️ Создание промокодов...');

  const promos = [
    {
      code: 'WELCOME20',
      type: 'percent',
      value: 20,
      min_order_amount: 1000,
      start_date: now,
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: '20% на первый заказ'
    },
    {
      code: 'SHIP2000',
      type: 'free_delivery',
      value: 0,
      min_order_amount: 2000,
      start_date: now,
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Бесплатная доставка'
    },
    {
      code: 'SAVE500',
      type: 'fixed',
      value: 500,
      min_order_amount: 3000,
      max_discount_amount: 500,
      start_date: now,
      end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Скидка 500₽ от 3000₽'
    },
  ];

  for (const promo of promos) {
    db.prepare(`
      INSERT INTO promos 
      (code, type, value, min_order_amount, max_discount_amount, start_date, end_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      promo.code,
      promo.type,
      promo.value,
      promo.min_order_amount,
      promo.max_discount_amount || null,
      promo.start_date,
      promo.end_date
    );
  }

  // ============================================
  // 9. НАСТРОЙКИ САЙТА
  // ============================================
  console.log('⚙️ Создание настроек сайта...');

  const settings = [
    {
      key: 'general',
      group: 'general',
      value: JSON.stringify({
        site_name: 'ЗооМагазин',
        site_description: 'Всё для ваших питомцев',
        phone: '+7 (495) 123-45-67',
        email: 'info@zooshop.ru',
        address: 'г. Москва, ул. Примерная, д. 1',
        working_hours: 'Пн-Вс: 9:00 - 21:00',
        currency: 'RUB',
        currency_symbol: '₽'
      })
    },
    {
      key: 'appearance',
      group: 'appearance',
      value: JSON.stringify({
        primary_color: '#4CAF50',
        secondary_color: '#FF9800',
        logo_url: '/uploads/logo.png',
        favicon_url: '/uploads/favicon.ico',
        font_family: 'Roboto, sans-serif'
      })
    },
    {
      key: 'delivery',
      group: 'delivery',
      value: JSON.stringify({
        methods: [
          { id: 'courier', name: 'Курьерская доставка', cost: 300, free_from: 2000 },
          { id: 'pickup', name: 'Самовывоз', cost: 0, free_from: 0 },
          { id: 'post', name: 'Почта России', cost: 500, free_from: 3000 }
        ],
        free_delivery_threshold: 2000
      })
    },
    {
      key: 'payment',
      group: 'payment',
      value: JSON.stringify({
        methods: [
          { id: 'card', name: 'Банковской картой', enabled: true },
          { id: 'cash', name: 'При получении', enabled: true },
          { id: 'sbp', name: 'СБП', enabled: true }
        ]
      })
    },
    {
      key: 'seo',
      group: 'seo',
      value: JSON.stringify({
        default_title: 'ЗооМагазин - всё для питомцев',
        default_description: 'Широкий ассортимент кормов, игрушек и аксессуаров для животных',
        default_keywords: 'зоомагазин, корм для собак, корм для кошек, игрушки для животных'
      })
    },
    {
      key: 'notifications',
      group: 'notifications',
      value: JSON.stringify({
        email_enabled: true,
        telegram_enabled: false,
        telegram_bot_token: '',
        telegram_chat_id: '',
        order_notification_email: 'orders@zooshop.ru'
      })
    },
  ];

  for (const setting of settings) {
    db.prepare(`
      INSERT OR REPLACE INTO settings (key, value, group, updated_at)
      VALUES (?, ?, ?, ?)
    `).run(setting.key, setting.value, setting.group, now);
  }

  // ============================================
  // 10. МЕНЮ НАВИГАЦИИ
  // ============================================
  console.log('📋 Создание меню навигации...');

  const mainMenuItems = [
    { id: 1, title: 'Каталог', url: '/catalog', icon: 'catalog', children: [], is_external: false, target_blank: false, sort_order: 1, is_active: true },
    { id: 2, title: 'О нас', url: '/about', icon: 'info', children: [], is_external: false, target_blank: false, sort_order: 2, is_active: true },
    { id: 3, title: 'Доставка', url: '/delivery', icon: 'delivery', children: [], is_external: false, target_blank: false, sort_order: 3, is_active: true },
    { id: 4, title: 'Контакты', url: '/contacts', icon: 'phone', children: [], is_external: false, target_blank: false, sort_order: 4, is_active: true },
  ];

  db.prepare(`
    INSERT OR REPLACE INTO navigation_menus (location, items, updated_at)
    VALUES ('main', ?, ?)
  `).run(JSON.stringify(mainMenuItems), now);

  db.prepare(`
    INSERT OR REPLACE INTO navigation_menus (location, items, updated_at)
    VALUES ('footer', ?, ?)
  `).run(JSON.stringify([
    { id: 1, title: 'О компании', url: '/about', children: [], is_external: false, sort_order: 1 },
    { id: 2, title: 'Политика конфиденциальности', url: '/privacy', children: [], is_external: false, sort_order: 2 },
    { id: 3, title: 'Публичная оферта', url: '/offer', children: [], is_external: false, sort_order: 3 },
  ]), now);

  console.log('✅ Seed-скрипт завершён успешно!');
  console.log('📊 Создано:');
  console.log(`   - ${categories.length} категорий`);
  console.log(`   - ${brands.length} брендов`);
  console.log(`   - ${products.length} товаров`);
  console.log(`   - ${banners.length} баннеров`);
  console.log(`   - ${users.length} пользователей`);
  console.log(`   - ${orders.length} заказов`);
  console.log(`   - ${reviews.length} отзывов`);
  console.log(`   - ${promos.length} промокодов`);
  console.log(`   - ${settings.length} групп настроек`);
}

// Запуск seed-скрипта
seed().catch(console.error);
