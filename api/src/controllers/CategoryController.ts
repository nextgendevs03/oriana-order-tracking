import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  createSuccessResponse,
  createErrorResponse,
} from '@oriana/shared';

import { TYPES } from '../types/types';
import { ICategoryService } from '../services/CategoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../schemas/request/CategoryRequest';

export interface ICategoryController {
  create(data: CreateCategoryRequest): Promise<APIGatewayProxyResult>;
  getAll(): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateCategoryRequest): Promise<APIGatewayProxyResult>;
  delete(id: string, data: { updatedBy: string }): Promise<APIGatewayProxyResult>;
}
@Controller({ path: '/api/category', lambdaName: 'productManagement' })
@injectable()
export class CategoryController implements ICategoryController {
  constructor(
    @inject(TYPES.CategoryService)
    private categoryService: ICategoryService
  ) {}

  @Post('/')
  async create(@Body() data: CreateCategoryRequest) {
    try {
      const category = await this.categoryService.createCategory(data);
      return createSuccessResponse(category, 201);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Get('/')
  async getAll() {
    try {
      const categories = await this.categoryService.getAllCategories();
      return createSuccessResponse(categories);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Get('/{id}')
  async getById(@Param('id') id: string) {
    try {
      const category = await this.categoryService.getCategoryById(id);
      return createSuccessResponse(category);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Put('/{id}')
  async update(@Param('id') id: string, @Body() data: UpdateCategoryRequest) {
    try {
      const updated = await this.categoryService.updateCategory(id, data);
      return createSuccessResponse(updated);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string) {
    try {
      await this.categoryService.deleteCategory(id);
      return createSuccessResponse({ deleted: true });
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }
}
