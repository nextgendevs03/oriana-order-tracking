import { injectable, inject } from 'inversify';
import { PrismaClient, Product } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateProductRequest, UpdateProductRequest } from '../schemas/request/ProductRequest';
import { ProductResponse } from 'src/schemas/response/ProductResponse';

export interface IProductRepository {
  findAll(): Promise<ProductResponse[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductRequest): Promise<Product>;
  update(id: string, data: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<void>;
}

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { productId: id } });
  }

  async create(data: CreateProductRequest): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        oem: data.oem,
        status: data.status,
        createdBy: data.createdBy || null,
      },
    });
  }

  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    return this.prisma.product.update({
      where: { productId: id },
      data: {
        name: data.name,
        category: data.category,
        oem: data.oem,
        status: data.status,
        updatedBy: data.updatedBy || null,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { productId: id } });
  }
}
