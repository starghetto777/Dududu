export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'dogs' | 'cats' | 'rodents' | 'birds' | 'fish';
  type: 'food' | 'toys' | 'pharma' | 'accessories' | 'grooming';
  price: number; // in Rubles
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  weightOptions?: string[]; // e.g., ["400г", "2кг", "10кг"]
  selectedWeight?: string;
  description: string;
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  specifications: Record<string, string>;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  petName?: string;
  likes: number;
}

export interface StoreLocation {
  id: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  hasVetClinic: boolean;
  hasGrooming: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'Все товары', icon: 'Sparkles' },
  { id: 'dogs', label: 'Собакам', icon: 'Dog', count: 1450 },
  { id: 'cats', label: 'Кошкам', icon: 'Cat', count: 1890 },
  { id: 'rodents', label: 'Грызунам', icon: 'Rabbit', count: 340 },
  { id: 'fish', label: 'Рыбкам', icon: 'Fish', count: 210 },
  { id: 'birds', label: 'Птицам', icon: 'Bird', count: 180 },
];

export const PRODUCT_TYPES = [
  { id: 'all', label: 'Все типы' },
  { id: 'food', label: 'Корма и лакомства' },
  { id: 'toys', label: 'Игрушки' },
  { id: 'pharma', label: 'Ветаптека и витамины' },
  { id: 'accessories', label: 'Амуниция и лежанки' },
  { id: 'grooming', label: 'Гигиена и уход' },
];

export const BRANDS: Brand[] = [
  { id: 'grandorf', name: 'Grandorf', logo: '🐾 Grandorf' },
  { id: 'royal-canin', name: 'Royal Canin', logo: '👑 Royal Canin' },
  { id: 'hills', name: 'Hill\'s', logo: '⛰️ Hill\'s' },
  { id: 'pro-plan', name: 'Pro Plan', logo: '🔬 Pro Plan' },
  { id: 'acana', name: 'Acana', logo: '🌾 Acana' },
  { id: 'kong', name: 'Kong', logo: '🧸 Kong' },
  { id: 'furminator', name: 'Furminator', logo: '✂️ Furminator' },
  { id: 'tetra', name: 'Tetra', logo: '🐠 Tetra' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Сухой низкозерновой корм для стерилизованных кошек с индейкой и рисом',
    brand: 'Grandorf',
    category: 'cats',
    type: 'food',
    price: 2450,
    oldPrice: 2980,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1589723900909-5e73d115dbb3?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['400г', '2кг', '10кг'],
    description: 'Гипоаллергенный низкозерновой корм премиум-класса. Идеально подходит для стерилизованных кошек, способствует поддержанию оптимального веса и здоровья мочевыводящих путей. Содержит 70% высококачественного мяса.',
    inStock: true,
    isBestSeller: true,
    isPromo: true,
    specifications: {
      'Класс корма': 'Холистик',
      'Возраст': 'Для взрослых кошек (1-6 лет)',
      'Страна производства': 'Бельгия',
      'Особенности': 'Для стерилизованных, гипоаллергенный'
    }
  },
  {
    id: 'p2',
    name: 'Влажный пауч-корм с нежным ягненком в соусе для котят',
    brand: 'Pro Plan',
    category: 'cats',
    type: 'food',
    price: 85,
    oldPrice: 110,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1608454509081-3d86885c3817?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['85г', '12 шт х 85г'],
    description: 'Полнорационный сбалансированный корм для котят в возрасте до 1 года. Содержит все необходимые питательные вещества для здорового роста, крепких костей и блестящей шерсти.',
    inStock: true,
    isPromo: true,
    specifications: {
      'Текстура': 'Кусочки в соусе',
      'Возраст': 'Для котят (до 1 года)',
      'Вкус': 'Ягненок',
      'Страна производства': 'Франция'
    }
  },
  {
    id: 'p3',
    name: 'Сверхпрочная резиновая игрушка-неваляшка для лакомств',
    brand: 'Kong',
    category: 'dogs',
    type: 'toys',
    price: 1380,
    rating: 5.0,
    reviewsCount: 242,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['Размер S', 'Размер M', 'Размер L'],
    description: 'Легендарная игрушка из натурального сверхпрочного каучука. Стимулирует ментальную активность, помогает бороться со скукой и стрессом. Можно заполнять паштетом или сухими лакомствами.',
    inStock: true,
    isBestSeller: true,
    specifications: {
      'Материал': 'Натуральный каучук',
      'Назначение': 'Интерактивные игры, чистка зубов',
      'Безопасность': 'Нетоксично, одобрено ветеринарами'
    }
  },
  {
    id: 'p4',
    name: 'Ортопедический мягкий лежак с бортиками и эффектом памяти memory foam',
    brand: 'Hill\'s',
    category: 'dogs',
    type: 'accessories',
    price: 5900,
    oldPrice: 7200,
    rating: 4.7,
    reviewsCount: 43,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['60x45 см', '80x60 см', '100x80 см'],
    description: 'Премиальный ортопедический лежак. Снижает нагрузку на суставы и позвоночник, идеально подходит для собак всех возрастов, особенно пожилых. Легко чистится благодаря съемному чехлу.',
    inStock: true,
    isNew: true,
    specifications: {
      'Наполнитель': 'Пена с эффектом памяти',
      'Материал чехла': 'Износостойкий флок с водоотталкивающей пропиткой',
      'Уход': 'Съемный чехол, машинная стирка при 30°С'
    }
  },
  {
    id: 'p5',
    name: 'Сухой беззерновой корм Grasslands с ягненком и уткой',
    brand: 'Acana',
    category: 'dogs',
    type: 'food',
    price: 4890,
    rating: 4.9,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['2кг', '6кг', '11.4кг'],
    description: 'Биологически соответствующий сухой корм для собак всех пород и возрастов. Богат разнообразным свежим мясом (ягненок, утка, индейка, яйца) без добавления быстрых углеводов.',
    inStock: true,
    isBestSeller: true,
    specifications: {
      'Класс корма': 'Биологически соответствующий (Холистик)',
      'Содержание мяса': '70%',
      'Ингредиенты': 'Ягненок, утка, фермерское яйцо, щука',
      'Страна производства': 'Канада'
    }
  },
  {
    id: 'p6',
    name: 'Трехуровневый игровой комплекс для кошек с домиком и когтеточкой',
    brand: 'Grandorf',
    category: 'cats',
    type: 'accessories',
    price: 7400,
    oldPrice: 8900,
    rating: 4.6,
    reviewsCount: 51,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=600',
    description: 'Уютный игровой комплекс для активных кошек. Включает комфортный закрытый домик, три платформы на разной высоте, подвесную мышку-игрушку и столбики, плотно обмотанные сизалем для точки когтей.',
    inStock: true,
    specifications: {
      'Высота': '125 см',
      'Материал обмотки': 'Натуральный сизаль',
      'Материал обивки': 'Мягкий искусственный мех'
    }
  },
  {
    id: 'p7',
    name: 'Автоматический питьевой фонтан-поилка с тройной фильтрацией воды',
    brand: 'Pro Plan',
    category: 'cats',
    type: 'accessories',
    price: 3100,
    rating: 4.8,
    reviewsCount: 115,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['1.8 л', '3.0 л'],
    description: 'Поилка-фонтан мотивирует кошек пить больше воды, защищая от мочекаменной болезни. Умная система непрерывной фильтрации очищает воду от шерсти, пыли и хлора.',
    inStock: true,
    isNew: true,
    specifications: {
      'Объем': '1.8 литра',
      'Питание': 'USB-кабель (адаптер в комплекте)',
      'Уровень шума': 'До 20 дБ (абсолютно бесшумный)'
    }
  },
  {
    id: 'p8',
    name: 'Инструмент против линьки короткошерстных средних собак Medium Short Hair',
    brand: 'Furminator',
    category: 'dogs',
    type: 'grooming',
    price: 2750,
    oldPrice: 3300,
    rating: 4.9,
    reviewsCount: 187,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600',
    description: 'Оригинальный Фурминатор уменьшает линьку животного до 90%. Лезвие из нержавеющей стали глубоко проникает сквозь остевой волос, деликатно удаляя отмерший подшерсток, не повреждая кожу.',
    inStock: true,
    specifications: {
      'Ширина лезвия': '6.7 см',
      'Тип шерсти': 'Короткая (до 5 см)',
      'Очистка лезвия': 'Кнопка FURejector для быстрой очистки'
    }
  },
  {
    id: 'p9',
    name: 'Универсальный мягкий зоошампунь с экстрактом овса и алоэ вера',
    brand: 'Furminator',
    category: 'dogs',
    type: 'grooming',
    price: 680,
    rating: 4.5,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1535268647977-a403b69ed740?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['250мл', '500мл'],
    description: 'Деликатный шампунь для чувствительной кожи. Восстанавливает структуру шерсти, снимает раздражения и оставляет приятный нежный аромат. Не щиплет глазки.',
    inStock: true,
    specifications: {
      'Объем': '250 мл',
      'Состав': 'Натуральные ПАВ, пантенол, экстракт ромашки',
      'pH': 'Нейтральный для кожи животных'
    }
  },
  {
    id: 'p10',
    name: 'Полнорационный сбалансированный корм TetraMin Flakes для декоративных рыбок',
    brand: 'Tetra',
    category: 'fish',
    type: 'food',
    price: 420,
    rating: 4.8,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['100мл', '250мл', '1л'],
    description: 'Корм в виде хлопьев из смеси более чем 40 видов отборного высококачественного сырья. Обеспечивает здоровый рост, яркую окраску и прекрасное самочувствие ваших аквариумных обитателей.',
    inStock: true,
    specifications: {
      'Форма выпуска': 'Хлопья',
      'Назначение': 'Для всех видов пресноводных рыб',
      'Преимущество': 'Чистая вода без помутнений'
    }
  },
  {
    id: 'p11',
    name: 'Премиальный стеклянный аквариумный набор с LED-освещением и фильтром',
    brand: 'Tetra',
    category: 'fish',
    type: 'accessories',
    price: 8900,
    oldPrice: 10500,
    rating: 4.7,
    reviewsCount: 28,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600',
    description: 'Современный панорамный аквариум со встроенным фильтром EasyCrystal и яркой энергосберегающей LED-подсветкой (дневной/ночной режимы). Идеальное решение для начинающих аквариумистов.',
    inStock: true,
    isNew: true,
    specifications: {
      'Объем': '30 литров',
      'Материал': 'Сверхпрочное силикатное стекло Float',
      'Гарантия': '2 года на швы'
    }
  },
  {
    id: 'p12',
    name: 'Просторная двухэтажная клетка для хомяков и грызунов со спиральной горкой',
    brand: 'Hill\'s',
    category: 'rodents',
    type: 'accessories',
    price: 3600,
    rating: 4.6,
    reviewsCount: 74,
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600',
    description: 'Комфортабельная клетка с высоким пластиковым поддоном, предотвращающим высыпание опилок. В комплекте: беговое колесо, домик, поилка, миска и интерактивная пластиковая горка-тоннель.',
    inStock: true,
    specifications: {
      'Размер': '47х30х37 см',
      'Расстояние между прутьями': '9 мм',
      'Материал прутьев': 'Безопасная порошковая эмаль'
    }
  },
  {
    id: 'p13',
    name: 'Ароматное луговое сено премиум-качества с одуванчиком для кроликов',
    brand: 'Acana',
    category: 'rodents',
    type: 'food',
    price: 290,
    rating: 4.9,
    reviewsCount: 150,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['500г', '1кг'],
    description: 'Экологически чистое сено, собранное вручную на альпийских лугах. Важнейший источник клетчатки для правильного пищеварения и естественного стачивания зубов у всех видов грызунов.',
    inStock: true,
    specifications: {
      'Состав': 'Трава луговая сушеная, одуванчик лекарственный',
      'Польза': 'Высокое содержание клетчатки'
    }
  },
  {
    id: 'p14',
    name: 'Питательный витаминный комплекс для певчих птиц в период линьки',
    brand: 'Royal Canin',
    category: 'birds',
    type: 'pharma',
    price: 540,
    rating: 4.7,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['15мл'],
    description: 'Жидкая мультивитаминная добавка в воду или корм для всех видов мелких и средних птиц. Способствует быстрому и безболезненному обновлению оперения, делает его ярким и блестящим.',
    inStock: true,
    specifications: {
      'Объем': '15 мл (флакон с дозатором)',
      'Витамины': 'A, D3, E, B1, B2, B6, B12, C',
      'Курс применения': '10-14 дней'
    }
  },
  {
    id: 'p15',
    name: 'Интерактивная лазерная указка со сменными фигурами-проекциями',
    brand: 'Kong',
    category: 'cats',
    type: 'toys',
    price: 490,
    rating: 4.4,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    description: 'Безопасная светодиодная указка, которая проецирует забавные красные силуэты (мышка, рыбка, лапка, бабочка). Гарантирует часы веселых игр и разминки для вашей кошки.',
    inStock: true,
    specifications: {
      'Тип батареек': '3 x LR44 (входят в комплект)',
      'Длина луча': 'до 5 метров',
      'Безопасность': 'Класс лазера II, абсолютно безопасен для глаз при случайном попадании'
    }
  },
  {
    id: 'p16',
    name: 'Капли на холку от блох, клещей и гельминтов «Инспектор Квадро» для собак',
    brand: 'Pro Plan',
    category: 'dogs',
    type: 'pharma',
    price: 980,
    oldPrice: 1200,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    weightOptions: ['Для собак 4-10 кг', 'Для собак 10-25 кг', 'Для собак >25 кг'],
    description: 'Комплексный ветеринарный препарат нового поколения для эффективной профилактики и лечения заражения 20 видами внешних и внутренних паразитов. Действует в течение 30 дней после нанесения.',
    inStock: true,
    isPromo: true,
    specifications: {
      'Форма выпуска': 'Капли на холку (спот-он)',
      'Возраст применения': 'С 7-недельного возраста',
      'Защита от': 'Блохи, иксодовые клещи, вши, власоеды, круглые и ленточные гельминты'
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    author: 'Анна К.',
    rating: 5,
    date: '24.01.2026',
    text: 'Отличный корм! У моего британца чувствительное пищеварение, от большинства кормов начинались проблемы. С переходом на Grandorf стул нормализовался, шерсть лоснится, котик бодрый и довольный. Будем брать еще!',
    petName: 'Сэмми (Британец, 3 года)',
    likes: 18
  },
  {
    id: 'r2',
    productId: 'p1',
    author: 'Михаил С.',
    rating: 5,
    date: '15.01.2026',
    text: 'Удобная фасовка по 2 кг с качественным зип-замком. Запах у корма не резкий, гранулы среднего размера, кошка разгрызает без проблем. Состав действительно супер - 70% мяса на первом месте.',
    petName: 'Милка (Метис, 1.5 года)',
    likes: 7
  },
  {
    id: 'r3',
    productId: 'p3',
    author: 'Дарья Д.',
    rating: 5,
    date: '20.01.2026',
    text: 'Эта игрушка просто спасла нашу обувь! Лабрадор грызет ее целыми днями, внутрь забиваем творог или паштет и замораживаем. Собака занята на час, а мы спокойны. Качество KONG на высоте, резина неубиваемая!',
    petName: 'Рокки (Лабрадор, 8 месяцев)',
    likes: 32
  },
  {
    id: 'r4',
    productId: 'p8',
    author: 'Екатерина Т.',
    rating: 5,
    date: '10.01.2026',
    text: 'Фурминатор оригинальный! Вычесывает просто гору подшерстка за один раз. Раньше по квартире летали клубы шерсти, теперь ковер чистый. Собаке процедура нравится, расслабляется. Рекомендую!',
    petName: 'Арчи (Корги, 2 года)',
    likes: 24
  }
];

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 's1',
    city: 'Москва',
    address: 'ул. Ленинский проспект, д. 42, стр. 1',
    hours: '09:00 - 22:00',
    phone: '+7 (495) 123-45-67',
    coordinates: { lat: 55.702343, lng: 37.578923 },
    hasVetClinic: true,
    hasGrooming: true
  },
  {
    id: 's2',
    city: 'Москва',
    address: 'ул. Тверская, д. 9 (вход со двора)',
    hours: '10:00 - 21:00',
    phone: '+7 (495) 123-45-68',
    coordinates: { lat: 55.758382, lng: 37.613853 },
    hasVetClinic: false,
    hasGrooming: true
  },
  {
    id: 's3',
    city: 'Санкт-Петербург',
    address: 'Невский проспект, д. 120',
    hours: '09:00 - 22:00',
    phone: '+7 (812) 987-65-43',
    coordinates: { lat: 59.931883, lng: 30.360432 },
    hasVetClinic: true,
    hasGrooming: false
  },
  {
    id: 's4',
    city: 'Санкт-Петербург',
    address: 'пр. Просвещения, д. 35, лит. А',
    hours: '10:00 - 22:00',
    phone: '+7 (812) 987-65-44',
    coordinates: { lat: 60.051234, lng: 30.334567 },
    hasVetClinic: true,
    hasGrooming: true
  },
  {
    id: 's5',
    city: 'Екатеринбург',
    address: 'ул. Малышева, д. 53 (ТЦ Антей)',
    hours: '10:00 - 21:00',
    phone: '+7 (343) 333-44-55',
    coordinates: { lat: 56.838234, lng: 60.618901 },
    hasVetClinic: false,
    hasGrooming: true
  }
];

export const FAQS = [
  {
    question: 'Каковы условия бесплатной доставки?',
    answer: 'Бесплатная доставка осуществляется при заказе от 2000 рублей в пределах городов нашего присутствия (Москва, Санкт-Петербург, Екатеринбург). При меньшей сумме заказа стоимость доставки составляет 290 рублей.'
  },
  {
    question: 'Как работает бонусная программа?',
    answer: 'С каждой покупки на вашу бонусную карту "Клуб Хвостиков" начисляется от 3% до 10% кэшбэка в виде баллов (1 балл = 1 рубль). Накопленными баллами вы можете оплатить до 50% стоимости будущих покупок. Карту можно завести бесплатно прямо на сайте!'
  },
  {
    question: 'Можно ли вернуть неподошедший товар?',
    answer: 'Товары надлежащего качества (аксессуары, лежанки, игрушки) можно вернуть или обменять в течение 14 дней при сохранении товарного вида. Ветеринарные препараты и открытые корма обмену и возврату не подлежат согласно законодательству РФ.'
  },
  {
    question: 'Как быстро доставляется заказ?',
    answer: 'При оформлении заказа до 14:00 доставка осуществляется в тот же день вечером с 18:00 до 22:00. При оформлении после 14:00 — на следующий день в удобный временной интервал. Также доступен мгновенный экспресс-самовывоз из ближайшего магазина через 15 минут после подтверждения.'
  }
];
