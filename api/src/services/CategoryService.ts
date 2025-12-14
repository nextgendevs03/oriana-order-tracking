import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { ICategoryRepository } from '../repositories/CategoryRepository';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../schemas/request/CategoryRequest';
import { CategoryResponse } from '../schemas/response/CategoryResponse';

export interface ICategoryService {
  createCategory(data: CreateCategoryRequest): Promise<CategoryResponse>;
  getAllCategories(filters?: {
    isActive?: boolean;
    categoryName?: string;
  }): Promise<CategoryResponse[]>;
  getCategoryById(id: string): Promise<CategoryResponse | null>;
  updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse>;
  deleteCategory(id: string): Promise<void>;
}

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.CategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const created = await this.categoryRepository.create(data);
    return created;
  }

  async getAllCategories(filters?: {
    isActive?: boolean;
    categoryName?: string;
  }): Promise<CategoryResponse[]> {
    return this.categoryRepository.findAll(filters);
  }

  async getCategoryById(id: string): Promise<CategoryResponse | null> {
    const category = await this.categoryRepository.findById(id);
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> {
    const updatedCategory = await this.categoryRepository.update(id, data);
    return updatedCategory;
  }

  async deleteCategory(id: string) {
    await this.categoryRepository.delete(id);
  }
}
