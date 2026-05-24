/**
 * Типы данных для всех сущностей интернет-зоомагазина
 * @file types.ts
 */

// ============================================
// ТОВАРЫ И КАТЕГОРИИ
// ============================================

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  barcode: string | null;
  brand_id: number | null;
  brand_name: string | null;
  category_id: number;
  short_description: string;
  full_description: string;
  composition: string | null;
  price: number;
  old_price: number | null;
  cost_price: number | null;
  subscription_price: number | null;
  stock: number;
  low_stock_threshold: number;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  animal_types: string;        // JSON array
  age_groups: string;          // JSON array
  breed_sizes: string;         // JSON array
  badges: string;              // JSON array
  features: string;            // JSON array
  status: 'active' | 'draft' | 'hidden' | 'archived';
  sort_order: number;
  publish_date: string | null;
  internal_notes: string | null;
  rating: number;
  review_count: number;
  view_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  thumbnail_url: string;
  alt: string;
  is_main: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price: number;
  old_price: number | null;
  stock: number;
  weight: number | null;
  image_url: string | null;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string | null;
  image_url: string | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  h1: string | null;
  filter_attributes: string;   // JSON array
  display_template: 'grid' | 'list';
  sort_order: number;
  is_active: boolean;
  product_count: number;
  level: number;
  path: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  country: string | null;
  sort_order: number;
  is_active: boolean;
}

// ============================================
// ЗАКАЗЫ
// ============================================

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: string;               // JSON array of OrderItem[]
  subtotal: number;
  discount: number;
  promo_code: string | null;
  delivery_cost: number;
  total: number;
  status: 'new' | 'confirmed' | 'assembling' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  delivery_method: string;
  delivery_address: string;
  delivery_city: string;
  desired_date: string | null;
  tracking_number: string | null;
  payment_method: string;
  is_paid: boolean;
  paid_at: string | null;
  customer_comment: string | null;
  internal_notes: string | null;
  history: string;             // JSON array of OrderHistoryItem[]
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  product_sku: string;
  variant_id: number | null;
  variant_name: string | null;
  quantity: number;
  price: number;
  old_price: number | null;
  discount: number;
  subtotal: number;
  image_url: string | null;
}

export interface OrderHistoryItem {
  status: string;
  timestamp: string;
  comment: string | null;
  user_name: string | null;
}

// ============================================
// ПОЛЬЗОВАТЕЛИ
// ============================================

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  phone: string | null;
  role: 'customer' | 'manager' | 'admin';
  addresses: string;           // JSON array of Address[]
  bonus_balance: number;
  segment: 'new' | 'regular' | 'vip';
  favorite_ids: string;        // JSON array of number[]
  is_blocked: boolean;
  manager_notes: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface Address {
  id: number;
  title: string;
  city: string;
  street: string;
  house: string;
  apartment: string | null;
  postal_code: string | null;
  is_default: boolean;
}

// ============================================
// БАННЕРЫ И СТРАНИЦЫ
// ============================================

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  image_desktop: string;
  image_mobile: string | null;
  text_position: 'left' | 'center' | 'right';
  text_color: string;
  overlay_opacity: number;
  placement: 'hero' | 'category' | 'sidebar' | 'popup';
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  click_count: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  template: 'full' | 'sidebar';
  meta_title: string | null;
  meta_description: string | null;
  h1: string | null;
  status: 'published' | 'draft';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// ОТЗЫВЫ
// ============================================

export interface Review {
  id: number;
  product_id: number;
  product_name: string;
  user_id: number | null;
  author_name: string;
  rating: number;
  text: string;
  pros: string | null;
  cons: string | null;
  photos: string;              // JSON array
  status: 'pending' | 'approved' | 'rejected';
  admin_reply: string | null;
  admin_reply_date: string | null;
  created_at: string;
}

// ============================================
// ПРОМОКОДЫ
// ============================================

export interface Promo {
  id: number;
  code: string;
  type: 'percent' | 'fixed' | 'free_delivery';
  value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  total_usage_limit: number | null;
  per_user_limit: number;
  usage_count: number;
  start_date: string;
  end_date: string;
  applies_to: 'all' | 'categories' | 'brands' | 'products';
  applies_to_ids: string;      // JSON array
  exclude_ids: string;         // JSON array
  is_active: boolean;
  created_at: string;
}

// ============================================
// МЕДИА ФАЙЛЫ
// ============================================

export interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  thumbnail_url: string | null;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  folder: string;
  used_in: string;             // JSON array
  created_at: string;
}

// ============================================
// НАСТРОЙКИ
// ============================================

export interface Settings {
  key: string;
  value: string;               // JSON string
  group: string;
  updated_at: string;
}

// ============================================
// НАВИГАЦИЯ
// ============================================

export interface NavigationMenu {
  id: number;
  location: 'main' | 'mobile' | 'footer' | 'additional';
  items: string;               // JSON array of NavigationItem[]
  updated_at: string;
}

export interface NavigationItem {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  children: NavigationItem[];
  is_external: boolean;
  target_blank: boolean;
  sort_order: number;
  is_active: boolean;
}

// ============================================
// ЛОГИ АКТИВНОСТИ
// ============================================

export interface ActivityLog {
  id: number;
  user_id: number | null;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: number | null;
  details: string | null;
  ip: string | null;
  created_at: string;
}

// ============================================
// КОРЗИНА (SERVER-SIDE)
// ============================================

export interface CartItem {
  id: number;
  session_id: string;
  user_id: number | null;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  added_at: string;
  updated_at: string;
}

// ============================================
// СЕССИИ
// ============================================

export interface Session {
  id: number;
  session_id: string;
  user_id: number | null;
  data: string;                // JSON string
  expires_at: string;
  created_at: string;
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// ============================================

export interface SEOData {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  no_index: boolean;
  no_follow: boolean;
}

export interface FilterAttribute {
  name: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  values: string[];
  min?: number;
  max?: number;
}

export interface ProductFilter {
  category_ids?: number[];
  brand_ids?: number[];
  price_min?: number;
  price_max?: number;
  animal_types?: string[];
  age_groups?: string[];
  breed_sizes?: string[];
  in_stock?: boolean;
  on_sale?: boolean;
  rating_min?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
