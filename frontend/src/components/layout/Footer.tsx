import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🐾</span>
              <h2 className="text-xl font-bold">PetShop</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Лучший зоомагазин для ваших любимых питомцев. Качество и забота с 2020 года.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/catalog/dogs" className="hover:text-primary-500 transition-colors">Собакам</Link></li>
              <li><Link href="/catalog/cats" className="hover:text-primary-500 transition-colors">Кошкам</Link></li>
              <li><Link href="/catalog/birds" className="hover:text-primary-500 transition-colors">Птицам</Link></li>
              <li><Link href="/catalog/fish" className="hover:text-primary-500 transition-colors">Рыбкам</Link></li>
              <li><Link href="/catalog/reptiles" className="hover:text-primary-500 transition-colors">Рептилиям</Link></li>
              <li><Link href="/catalog/rodents" className="hover:text-primary-500 transition-colors">Грызунам</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">Помощь</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/delivery" className="hover:text-primary-500 transition-colors">Доставка и оплата</Link></li>
              <li><Link href="/returns" className="hover:text-primary-500 transition-colors">Возврат товара</Link></li>
              <li><Link href="/faq" className="hover:text-primary-500 transition-colors">Вопросы и ответы</Link></li>
              <li><Link href="/contacts" className="hover:text-primary-500 transition-colors">Контакты</Link></li>
              <li><Link href="/about" className="hover:text-primary-500 transition-colors">О компании</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>8 (800) 555-35-35</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>info@petshop.ru</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1" />
                <span>Москва, ул. Пушкина, д. 10</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Ежедневно 9:00 - 21:00</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 PetShop. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-primary-500 transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
