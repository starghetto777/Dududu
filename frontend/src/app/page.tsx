'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { ProductCard, type Product } from '@/components/product/ProductCard';

// Mock data
const categories = [
  { name: 'Собакам', icon: '🐕', slug: 'dogs', color: 'bg-blue-100' },
  { name: 'Кошкам', icon: '🐱', slug: 'cats', color: 'bg-orange-100' },
  { name: 'Птицам', icon: '🐦', slug: 'birds', color: 'bg-green-100' },
  { name: 'Рыбкам', icon: '🐠', slug: 'fish', color: 'bg-cyan-100' },
  { name: 'Рептилиям', icon: '🦎', slug: 'reptiles', color: 'bg-emerald-100' },
  { name: 'Грызунам', icon: '🐹', slug: 'rodents', color: 'bg-amber-100' },
];

const heroSlides = [
  {
    title: 'Большая распродажа кормов',
    subtitle: 'Скидки до 50% на премиум корма',
    cta: 'Смотреть каталог',
    bg: 'from-primary-100 to-primary-200',
  },
  {
    title: 'Новинки для ваших питомцев',
    subtitle: 'Лучшие товары этого сезона',
    cta: 'Купить сейчас',
    bg: 'from-secondary-100 to-secondary-200',
  },
  {
    title: 'Бесплатная доставка',
    subtitle: 'При заказе от 2990₽',
    cta: 'В каталог',
    bg: 'from-accent-100 to-accent-200',
  },
];

const hitProducts: Product[] = [
  {
    id: '1',
    name: 'Сухой корм Royal Canin для собак средних пород, 10 кг',
    slug: 'royal-canin-medium-adult-10kg',
    sku: 'RC-MED-10',
    price: 4590,
    oldPrice: 5290,
    image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?w=500',
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 150,
    isHit: true,
    category: 'Собакам',
    brand: 'Royal Canin',
  },
  {
    id: '2',
    name: 'Игрушка Kong Classic для собак',
    slug: 'kong-classic-toy',
    sku: 'KONG-CLS-S',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500',
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 85,
    isHit: true,
    category: 'Собакам',
    brand: 'Kong',
  },
  {
    id: '3',
    name: 'Корм Hill\'s Science Plan для кошек стерилизованных, 5 кг',
    slug: 'hills-science-plan-cat-sterilised-5kg',
    sku: 'HILLS-SP-5',
    price: 3890,
    oldPrice: 4490,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 200,
    isPromo: true,
    promoPercent: 13,
    category: 'Кошкам',
    brand: 'Hill\'s',
  },
  {
    id: '4',
    name: 'Наполнитель для кошачьего туалета комкующийся, 10 л',
    slug: 'cat-litter-clumping-10l',
    sku: 'CL-CMP-10',
    price: 890,
    image: 'https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?w=500',
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    stockQuantity: 500,
    isNew: true,
    category: 'Кошкам',
    brand: 'Clean Step',
  },
];

const advantages = [
  {
    icon: Truck,
    title: 'Быстрая доставка',
    description: 'Доставим в день заказа или в удобное время',
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Только сертифицированные товары',
  },
  {
    icon: Headphones,
    title: 'Поддержка 24/7',
    description: 'Поможем с выбором и ответим на вопросы',
  },
  {
    icon: RotateCcw,
    title: 'Легкий возврат',
    description: 'Вернем деньги в течение 30 дней',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Slider */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className={`bg-gradient-to-r ${heroSlides[0].bg} p-12 md:p-20`}>
            <div className="max-w-2xl">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                {heroSlides[0].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 mb-8"
              >
                {heroSlides[0].subtitle}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
              >
                {heroSlides[0].cta}
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Категории товаров</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/catalog/${category.slug}`}
                className={`${category.color} p-6 rounded-2xl text-center hover:shadow-lg transition-shadow block group`}
              >
                <motion.span
                  className="text-5xl mb-3 block"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {category.icon}
                </motion.span>
                <span className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hit Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🔥 Хиты продаж</h2>
          <Link
            href="/catalog/hits"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-1"
          >
            Смотреть все
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hitProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Почему выбирают нас</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-md text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <advantage.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Скидка 10% на первый заказ
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Подпишитесь на нашу рассылку и получите промокод
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-accent-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Подписаться
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
