import { injectable, inject } from 'inversify';
import { PrismaClient, Category, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ListCategoryRequest,
} from '../schemas/request/CategoryRequest';
import { CategoryResponse } from 'src/schemas/response/CategoryResponse';
export interface ICategoryRepository {
  findAll(params?: ListCategoryRequest): Promise<{ rows: CategoryResponse[]; count: number }>;
  findById(id: string): Promise<Category | null>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(id: string, data: UpdateCategoryRequest): Promise<Category>;
  delete(id: string): Promise<void>;
}

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(
    params?: ListCategoryRequest
  ): Promise<{ rows: CategoryResponse[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      categoryName,
      isActive,
    } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (categoryName) {
      where.categoryName = {
        contains: categoryName,
        mode: 'insensitive',
      };
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'categoryName') {
      orderBy.categoryName = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      rows: rows.map((category) => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        isActive: category.isActive,
        createdBy: category.createdBy,
        updatedBy: category.updatedBy,
      })),
      count,
    };
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
