import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Scale, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isHit?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  promoPercent?: number;
  category: string;
  brand: string;
  shortDescription?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      quantity: 1,
      maxStock: product.stockQuantity,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isHit && (
              <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                🔥 ХИТ
              </span>
            )}
            {product.isNew && (
              <span className="bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ✨ НОВИНКА
              </span>
            )}
            {product.isPromo && product.promoPercent && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{product.promoPercent}%
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors">
              <Scale className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="text-xs text-gray-500 mb-1">
          {product.brand} • {product.category}
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="text-xs mb-4">
          {product.inStock ? (
            <span className="text-secondary-600">
              ✓ В наличии: {product.stockQuantity} шт.
            </span>
          ) : (
            <span className="text-gray-400">Под заказ</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              product.inStock
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            В корзину
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-accent-100 text-accent-600 p-3 rounded-xl hover:bg-accent-200 transition-colors"
            title="Купить в 1 клик"
          >
            <Zap className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
