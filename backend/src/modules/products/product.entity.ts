import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Review } from '../reviews/review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  descriptionShort: string;

  @Column('text')
  descriptionFull: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  oldPrice: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  promoPrice: number | null;

  @Column({ nullable: true })
  promoStart: Date | null;

  @Column({ nullable: true })
  promoEnd: Date | null;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: false })
  isHit: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-json', { nullable: true })
  images: Array<{
    id: string;
    url: string;
    isMain: boolean;
    sortOrder: number;
    altText?: string;
  }>;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  weight: number | null;

  @Column('simple-json', { nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
  } | null;

  @Column('simple-json', { nullable: true })
  characteristics: Record<string, string>;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @Column()
  categoryId: string;

  @Column()
  brand: string;

  @Column('simple-json', { nullable: true })
  tags: string[];

  @Column('simple-json', { nullable: true })
  relatedProducts: string[];

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
