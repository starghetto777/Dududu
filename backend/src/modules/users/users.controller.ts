import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  update(
    @Param('id') id: string,
    @Body() dto: { name?: string; phone?: string; avatarUrl?: string },
  ): Promise<User> {
    return this.usersService.update(id, dto);
  }

  @Post(':id/toggle-status')
  @ApiOperation({ summary: 'Заблокировать/разблокировать пользователя' })
  toggleStatus(@Param('id') id: string): Promise<User> {
    return this.usersService.toggleStatus(id);
  }

  @Put(':id/role')
  @ApiOperation({ summary: 'Изменить роль пользователя' })
  updateRole(
    @Param('id') id: string,
    @Body() dto: { role: UserRole },
  ): Promise<User> {
    return this.usersService.updateRole(id, dto.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
