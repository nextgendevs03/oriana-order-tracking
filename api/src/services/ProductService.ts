import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IProductRepository } from '../repositories/ProductRepository';
import { CreateProductRequest, UpdateProductRequest } from '../schemas/request/ProductRequest';
import { ProductResponse } from '../schemas/response/ProductResponse';

export interface IProductService {
  createProduct(data: CreateProductRequest): Promise<ProductResponse>;
  getAllProducts(): Promise<ProductResponse[]>;
  getProductById(id: string): Promise<ProductResponse | null>;
  updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse>;
  deleteProduct(id: string): Promise<void>;
}

@injectable()
export class ProductService implements IProductService {
  constructor(@inject(TYPES.ProductRepository) private repo: IProductRepository) {}

  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    const created = await this.repo.create(data);
    return created as unknown as ProductResponse;
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const rows = await this.repo.findAll();
    return rows as unknown as ProductResponse[];
  }

  async getProductById(id: string): Promise<ProductResponse | null> {
    const p = await this.repo.findById(id);
    return p as unknown as ProductResponse | null;
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ProductResponse> {
    const updated = await this.repo.update(id, data);
    return updated as unknown as ProductResponse;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
