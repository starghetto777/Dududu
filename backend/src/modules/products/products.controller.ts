import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, ParseUUIDPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список товаров с фильтрами' })
  findAll(@Query() filters: any) {
    return this.productsService.findAll(filters);
  }

  @Get('hits')
  @ApiOperation({ summary: 'Получить хиты продаж' })
  getHits(@Query('limit') limit?: number) {
    return this.productsService.getHits(limit ? parseInt(limit) : 10);
  }

  @Get('new')
  @ApiOperation({ summary: 'Получить новинки' })
  getNew(@Query('limit') limit?: number) {
    return this.productsService.getNew(limit ? parseInt(limit) : 10);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получить товар по slug' })
  findOneBySlug(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.findOneBySlug(slug);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать товар (Admin)' })
  create(@Body() dto: any): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить товар (Admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: any,
  ): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар (Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  @Post(':id/soft-delete')
  @ApiOperation({ summary: 'Скрыть товар (Admin)' })
  softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productsService.softDelete(id);
  }

  @Post(':id/stock')
  @ApiOperation({ summary: 'Обновить остаток товара (Admin)' })
  updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { quantity: number },
  ): Promise<Product> {
    return this.productsService.updateStock(id, dto.quantity);
  }
}
