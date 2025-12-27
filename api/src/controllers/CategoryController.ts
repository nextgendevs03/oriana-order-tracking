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
  Query,
  createSuccessResponse,
  createErrorResponse,
} from '@oriana/shared';

import { TYPES } from '../types/types';
import { ICategoryService } from '../services/CategoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../schemas/request/CategoryRequest';

export interface ICategoryController {
  create(data: CreateCategoryRequest): Promise<APIGatewayProxyResult>;
  getAll(isActive?: string): Promise<APIGatewayProxyResult>;
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
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('isActive') isActive?: string,
    @Query('searchKey') searchKey?: string,
    @Query('searchTerm') searchTerm?: string
  ) {
    try {
      const result = await this.categoryService.getAllCategories({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        sortBy: sortBy || 'createdAt',
        sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
        isActive: isActive ? isActive === 'true' : undefined,
        searchKey: searchKey || undefined,
        searchTerm: searchTerm || undefined,
      });
      return createSuccessResponse(result.data, 200, result.pagination);
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
