import { injectable, inject } from 'inversify';
import { PrismaClient, Product, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ListProductRequest,
} from '../schemas/request/ProductRequest';
import { ProductResponse } from 'src/schemas/response/ProductResponse';

export interface IProductRepository {
  findAll(params?: ListProductRequest): Promise<{ rows: ProductResponse[]; count: number }>;
  findById(id: string): Promise<ProductResponse | null>;
  create(data: CreateProductRequest): Promise<ProductResponse | null>;
  update(id: string, data: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<void>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(params?: ListProductRequest): Promise<{ rows: ProductResponse[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      name,
      isActive,
      categoryId,
      oemId,
    } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (name) {
      where.productName = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (oemId) {
      where.oemId = oemId;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'productName') {
      orderBy.productName = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          category: true,
          oem: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      rows: rows.map(
        (product): ProductResponse => ({
          productId: product.productId,
          productName: product.productName,
          category: {
            categoryId: product.category.categoryId,
            categoryName: product.category.categoryName,
          },
          oem: {
            oemId: product.oem.oemId,
            oemName: product.oem.oemName,
          },
          isActive: product.isActive ?? true,
          createdBy: product.createdBy,
          updatedBy: product.updatedBy,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
      ),
      count,
    };
  }

  async findById(id: string): Promise<ProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { productId: id },
      include: {
        category: true,
        oem: true,
      },
    });
    if (!product) return null;
    return {
      productId: product.productId,
      productName: product.productName,
      category: {
        categoryId: product.category.categoryId,
        categoryName: product.category.categoryName,
      },
      oem: {
        oemId: product.oem.oemId,
        oemName: product.oem.oemName,
      },
      isActive: product.isActive ?? true,
      createdBy: product.createdBy,
      updatedBy: product.updatedBy,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async create(data: CreateProductRequest): Promise<ProductResponse | null> {
    const product = await this.prisma.product.create({
      data: {
        productName: data.productName,
        category: { connect: { categoryId: data.categoryId } },
        oem: { connect: { oemId: data.oemId } },
        isActive: data.isActive,
        createdBy: data.createdBy ?? '',
        updatedBy: data.createdBy ?? '',
      },
    });

    return await this.findById(product.productId);
  }

  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { productId: id },
      data: {
        productName: data.productName,
        category: { connect: { categoryId: data.categoryId } },
        oem: { connect: { oemId: data.oemId } },
        isActive: data.isActive ?? true,
        updatedBy: data.updatedBy ?? '',
      },
    });
    return product;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { productId: id } });
  }
}
