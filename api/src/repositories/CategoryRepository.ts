import { injectable, inject } from 'inversify';
import { PrismaClient, Category, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../schemas/request/CategoryRequest';
import { CategoryResponse } from 'src/schemas/response/CategoryResponse';
export interface ICategoryRepository {
  findAll(filters?: { isActive?: boolean; categoryName?: string }): Promise<CategoryResponse[]>;
  findById(id: string): Promise<Category | null>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(id: string, data: UpdateCategoryRequest): Promise<Category>;
  delete(id: string): Promise<void>;
}

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(filters?: {
    isActive?: boolean;
    categoryName?: string;
  }): Promise<CategoryResponse[]> {
    const where: Prisma.CategoryWhereInput = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.categoryName) {
      where.categoryName = {
        contains: filters.categoryName,
        mode: 'insensitive',
      };
    }

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Map Prisma Category objects to CategoryResponse format, ensuring 'createdAt'/'updatedAt' are strings
    return categories.map((category) => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      isActive: category.isActive,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
    }));
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { categoryId: id } });
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    return this.prisma.category.create({
      data: {
        categoryName: data.categoryName,
        isActive: data.isActive ?? true,
        createdBy: data.createdBy ?? '',
        updatedBy: data.createdBy ?? '',
      },
    });
  }

  async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
    return this.prisma.category.update({
      where: { categoryId: id },
      data: {
        categoryName: data.categoryName,
        isActive: data.isActive ?? true,
        updatedBy: data.updatedBy ?? undefined,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { categoryId: id } });
  }
}
