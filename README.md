# PetShop - Интернет-магазин для животных

Современный fullstack интернет-магазин товаров для домашних животных с админ-панелью.

## 📋 Оглавление

- [Технологический стек](#технологический-стек)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [API Документация](#api-документация)
- [Функционал](#функционал)
- [База данных](#база-данных)

---

## 🚀 Технологический стек

### Frontend
- **Next.js 14** - React фреймворк с SSR/SSG
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Zustand** - state management
- **Framer Motion** - анимации
- **React Hook Form + Zod** - формы и валидация

### Backend
- **NestJS** - Node.js фреймворк
- **TypeORM** - ORM для работы с БД
- **PostgreSQL** - основная база данных
- **Redis** - кэширование
- **Passport.js** - аутентификация (JWT, OAuth2)
- **Swagger** - API документация

---

## 📁 Структура проекта

```
/workspace
├── frontend/                 # Next.js приложение
│   ├── src/
│   │   ├── app/             # App Router страницы
│   │   │   ├── admin/       # Админ-панель
│   │   │   ├── cart/        # Корзина
│   │   │   ├── catalog/     # Каталог товаров
│   │   │   ├── products/    # Карточка товара
│   │   │   └── profile/     # Личный кабинет
│   │   ├── components/      # React компоненты
│   │   │   ├── layout/      # Header, Footer
│   │   │   ├── product/     # ProductCard, ProductGallery
│   │   │   ├── cart/        # CartDrawer, CartItem
│   │   │   └── admin/       # Admin компоненты
│   │   ├── store/           # Zustand stores
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Утилиты, API клиент
│   │   └── types/           # TypeScript типы
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.mjs
│
├── backend/                  # NestJS приложение
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # Аутентификация
│   │   │   ├── users/       # Пользователи
│   │   │   ├── products/    # Товары
│   │   │   ├── categories/  # Категории
│   │   │   ├── orders/      # Заказы
│   │   │   ├── cart/        # Корзина
│   │   │   ├── reviews/     # Отзывы
│   │   │   └── analytics/   # Аналитика
│   │   ├── common/          # Общие модули
│   │   ├── main.ts          # Entry point
│   │   └── app.module.ts    # Главный модуль
│   ├── test/                # Тесты
│   └── package.json
│
└── docs/                     # Документация
```

---

## 🛠 Быстрый старт

### Предварительные требования

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm или yarn

### Установка

#### 1. Клонирование репозитория

```bash
cd /workspace
```

#### 2. Настройка Backend

```bash
cd backend

# Установка зависимостей
npm install

# Создание .env файла
cp .env.example .env

# Редактирование .env (укажите ваши данные БД)
```

#### 3. Настройка Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Создание .env.local
cp .env.example .env.local
```

#### 4. Запуск базы данных (Docker)

```bash
docker-compose up -d postgres redis
```

#### 5. Миграции БД

```bash
cd backend
npm run typeorm migration:run
```

#### 6. Запуск приложения

```bash
# Backend (порт 3001)
cd backend
npm run start:dev

# Frontend (порт 3000)
cd frontend
npm run dev
```

### Переменные окружения

#### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=petshop

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# OAuth (опционально)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
VK_CLIENT_ID=
VK_CLIENT_SECRET=
YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📚 API Документация

После запуска backend приложения Swagger документация доступна по адресу:

```
http://localhost:3001/api/docs
```

### Основные endpoints

#### Аутентификация
```
POST   /api/auth/register       # Регистрация
POST   /api/auth/login          # Вход
POST   /api/auth/refresh        # Обновление токена
POST   /api/auth/logout         # Выход
POST   /api/auth/forgot-password # Восстановление пароля
```

#### Пользователи
```
GET    /api/users               # Список пользователей (Admin)
GET    /api/users/:id           # Профиль пользователя
PUT    /api/users/:id           # Обновление профиля
POST   /api/users/:id/toggle-status # Блокировка (Admin)
```

#### Товары
```
GET    /api/products            # Каталог товаров
GET    /api/products/:slug      # Карточка товара
GET    /api/products/hits       # Хиты продаж
GET    /api/products/new        # Новинки
POST   /api/products            # Создать товар (Admin)
PUT    /api/products/:id        # Обновить товар (Admin)
DELETE /api/products/:id        # Удалить товар (Admin)
```

#### Заказы
```
GET    /api/orders              # Мои заказы
POST   /api/orders              # Создать заказ
GET    /api/orders/:id          # Детали заказа
```

#### Корзина
```
GET    /api/cart                # Получить корзину
POST   /api/cart/items          # Добавить товар
PUT    /api/cart/items/:id      # Обновить количество
DELETE /api/cart/items/:id      # Удалить товар
POST   /api/cart/promo          # Применить промокод
```

---

## ✨ Функционал

### Клиентская часть

- ✅ Главная страница с баннерами и категориями
- ✅ Каталог товаров с фильтрами и сортировкой
- ✅ Карточка товара с галереей и отзывами
- ✅ Корзина с сохранением между сессиями
- ✅ Оформление заказа
- ✅ Личный кабинет с историей заказов
- ✅ Избранное
- ✅ Поиск товаров

### Админ-панель

- ✅ Управление товарами (CRUD)
- ✅ Загрузка изображений
- ✅ Управление категориями
- ✅ Управление заказами
- ✅ Управление пользователями
- ✅ Аналитика продаж

---

## 🗄 База данных

### Основные таблицы

#### users
```sql
id, email, passwordHash, name, phone, role, isActive, 
avatarUrl, addresses (JSON), createdAt, updatedAt
```

#### products
```sql
id, name, slug, sku, descriptionShort, descriptionFull,
price, oldPrice, promoPrice, promoStart, promoEnd,
stockQuantity, isHit, isNew, isActive, images (JSON),
videoUrl, weight, dimensions (JSON), characteristics (JSON),
rating, reviewCount, categoryId, brand, tags (JSON),
relatedProducts (JSON), metaTitle, metaDescription,
createdAt, updatedAt
```

#### categories
```sql
id, name, slug, parentId, icon, isActive, sortOrder
```

#### orders
```sql
id, userId, status, totalAmount, deliveryAddress,
paymentMethod, paymentStatus, createdAt, updatedAt
```

#### order_items
```sql
id, orderId, productId, nameSnapshot, priceSnapshot,
quantity, subtotal
```

#### reviews
```sql
id, productId, userId, rating, comment, isApproved,
createdAt
```

---

## 🧪 Тесты

```bash
# Backend тесты
cd backend
npm run test           # Unit тесты
npm run test:e2e       # E2E тесты
npm run test:cov       # Coverage

# Frontend тесты
cd frontend
npm run test           # Vitest
npm run test:e2e       # Playwright
```

---

## 📦 Деплой

### Docker Compose (Production)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: petshop
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    
  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_HOST: redis
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 👥 Команда разработки

Создано для демонстрации современных веб-технологий.

## 📝 Лицензия

MIT
