import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './product.entity';

interface CreateProductDto {
  name: string;
  slug: string;
  sku: string;
  descriptionShort: string;
  descriptionFull: string;
  price: number;
  oldPrice?: number;
  promoPrice?: number;
  promoStart?: Date;
  promoEnd?: Date;
  stockQuantity: number;
  isHit?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  images?: Array<{ url: string; isMain: boolean; sortOrder: number; altText?: string }>;
  videoUrl?: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  characteristics?: Record<string, string>;
  categoryId: string;
  brand: string;
  tags?: string[];
  relatedProducts?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

interface UpdateProductDto extends Partial<CreateProductDto> {}

interface FilterProductsDto {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isHit?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async findAll(filters: FilterProductsDto) {
    const {
      search,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isHit,
      isNew,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const where: any = { isActive: true };

    if (search) {
      where.name = Like(`%${search}%`);
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (brand) {
      where.brand = Like(`%${brand}%`);
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price['>='] = minPrice;
      if (maxPrice !== undefined) where.price['<='] = maxPrice;
    }
    if (inStock !== undefined) {
      where.stockQuantity = inStock ? require('typeorm').MoreThan(0) : 0;
    }
    if (isHit !== undefined) {
      where.isHit = isHit;
    }
    if (isNew !== undefined) {
      where.isNew = isNew;
    }

    const [items, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'reviews'],
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category'],
    });
    if (!product || !product.isActive) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async softDelete(id: string): Promise<Product> {
    const product = await this.findOne(id);
    product.isActive = false;
    return await this.productRepository.save(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQuantity = Math.max(0, product.stockQuantity + quantity);
    return await this.productRepository.save(product);
  }

  async getHits(limit = 10): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isHit: true, isActive: true, stockQuantity: require('typeorm').MoreThan(0) },
      relations: ['category'],
      take: limit,
      order: { rating: 'DESC' },
    });
  }

  async getNew(limit = 10): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isNew: true, isActive: true },
      relations: ['category'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
