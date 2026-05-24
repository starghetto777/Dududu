import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, Heart, Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              8 (800) 555-35-35
            </span>
            <span>Бесплатная доставка от 2990₽</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/profile/orders">Мои заказы</Link>
            <Link href="/profile">Личный кабинет</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="text-4xl"
            >
              🐾
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-primary-600">PetShop</h1>
              <p className="text-xs text-gray-500">Для ваших питомцев</p>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs">Избранное</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Войти</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center text-gray-600 hover:text-primary-600 transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
              <span className="text-xs">Корзина</span>
            </motion.button>

            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-full focus:outline-none focus:border-primary-500 transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 py-3 overflow-x-auto">
            <li>
              <Link href="/catalog/dogs" className="flex items-center gap-2 whitespace-nowrap hover:text-primary-600 transition-colors">
                <span>🐕</span>
                <span>Собакам</span>
              </Link>
            </li>
            <li>
              <Link href="/catalog/cats" className="flex items-center gap-2 whitespace-nowrap hover:text-primary-600 transition-colors">
                <span>🐱</span>
                <span>Кошкам</span>
              </Link>
            </li>
            <li>
              <Link href="/catalog/birds" className="flex items-center gap-2 whitespace-nowrap hover:text-primary-600 transition-colors">
                <span>🐦</span>
                <span>Птицам</span>
              </Link>
            </li>
            <li>
              <Link href="/catalog/fish" className="flex items-center gap-2 whitespace-nowrap hover:text-primary-600 transition-colors">
                <span>🐠</span>
                <span>Рыбкам</span>
              </Link>
            </li>
            <li>
              <Link href="/catalog/reptiles" className="flex items-center gap-2 whitespace-nowrap hover:text-primary-600 transition-colors">
                <span>🦎</span>
                <span>Рептилиям</span>
              </Link>
            </li>
            <li>
              <Link href="/catalog/rodents" className="flex items-center gap-2 whitespace-nowrap hover:text-primary-600 transition-colors">
                <span>🐹</span>
                <span>Грызунам</span>
              </Link>
            </li>
            <li className="ml-auto">
              <Link href="/catalog/promo" className="text-accent-600 font-semibold whitespace-nowrap">
                🔥 Акции
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
