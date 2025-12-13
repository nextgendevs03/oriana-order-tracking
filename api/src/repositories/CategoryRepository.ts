import { injectable, inject } from 'inversify';
import { PrismaClient, Category } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../schemas/request/CategoryRequest';
import { CategoryResponse } from 'src/schemas/response/CategoryResponse';
export interface ICategoryRepository {
  findAll(): Promise<CategoryResponse[]>;
  findById(id: string): Promise<Category | null>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(id: string, data: UpdateCategoryRequest): Promise<Category>;
  delete(id: string): Promise<void>;
}

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.Category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.Category.findUnique({ where: { categoryId: id } });
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    return this.prisma.Category.create({
      data: {
        name: data.name,
        status: data.status,
        createdBy: data.createdBy || null,
      },
    });
  }

  async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
    return this.prisma.Category.update({
      where: { categoryId: id },
      data: {
        name: data.name,
        status: data.status,
        updatedBy: data.updatedBy || null,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.Category.delete({ where: { categoryId: id } });
  }
}
