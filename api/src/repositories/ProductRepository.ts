import { injectable, inject } from 'inversify';
import { PrismaClient, Product, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateProductRequest, UpdateProductRequest } from '../schemas/request/ProductRequest';
import { ProductResponse } from 'src/schemas/response/ProductResponse';

export interface IProductRepository {
  findAll(filters?: {
    name?: string;
    isActive?: boolean;
    categoryId?: string;
    oemId?: string;
  }): Promise<ProductResponse[]>;
  findById(id: string): Promise<ProductResponse | null>;
  create(data: CreateProductRequest): Promise<ProductResponse | null>;
  update(id: string, data: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<void>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(filters?: {
    name?: string;
    isActive?: boolean;
    categoryId?: string;
    oemId?: string;
  }): Promise<ProductResponse[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.name) {
      where.productName = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.oemId) {
      where.oemId = filters.oemId;
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        oem: true,
      },
    });
    return products.map(
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
    );
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
