import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { ICategoryRepository } from '../repositories/CategoryRepository';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../schemas/request/CategoryRequest';
import { CategoryResponse } from '../schemas/response/CategoryResponse';

export interface ICategoryService {
  createCategory(data: CreateCategoryRequest): Promise<CategoryResponse>;
  getAllCategories(): Promise<CategoryResponse[]>;
  getCategoryById(id: string): Promise<CategoryResponse | null>;
  updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse>;
  deleteCategory(id: string): Promise<void>;
}

@injectable()
export class CategoryService implements ICategoryService {
  constructor(@inject(TYPES.CategoryRepository) private repo: ICategoryRepository) {}

  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const created = await this.repo.create(data);
    return created as unknown as CategoryResponse;
  }

  async getAllCategories(): Promise<CategoryResponse[]> {
    const rows = await this.repo.findAll();
    return rows as unknown as CategoryResponse[];
  }

  async getCategoryById(id: string): Promise<CategoryResponse | null> {
    const c = await this.repo.findById(id);
    return c as unknown as CategoryResponse | null;
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> {
    const updated = await this.repo.update(id, data);
    return updated as unknown as CategoryResponse;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
