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
import { IProductService } from '../services/ProductService';
import { CreateProductRequest, UpdateProductRequest } from '../schemas/request/ProductRequest';

export interface IProductController {
  create(data: CreateProductRequest): Promise<APIGatewayProxyResult>;
  getAll(
    name?: string,
    isActive?: string,
    categoryId?: string,
    oemId?: string
  ): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateProductRequest): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/product', lambdaName: 'productManagement' })
@injectable()
export class ProductController implements IProductController {
  constructor(
    @inject(TYPES.ProductService)
    private productService: IProductService
  ) {}

  // CREATE
  @Post('/')
  async create(@Body() data: CreateProductRequest): Promise<APIGatewayProxyResult> {
    try {
      const product = await this.productService.createProduct(data);
      return createSuccessResponse(product, 201);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error creating product');
      return createErrorResponse(error);
    }
  }

  // GET ALL
  @Get('/')
  async getAll(
    @Query('name') name?: string,
    @Query('isActive') isActive?: string,
    @Query('categoryId') categoryId?: string,
    @Query('oemId') oemId?: string
  ): Promise<APIGatewayProxyResult> {
    try {
      const products = await this.productService.getAllProducts({
        name: name || undefined,
        isActive: isActive ? isActive === 'true' : undefined,
        categoryId: categoryId || undefined,
        oemId: oemId || undefined,
      });
      return createSuccessResponse(products);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error fetching products');
      return createErrorResponse(error);
    }
  }

  // GET BY ID
  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    try {
      const product = await this.productService.getProductById(id);
      return createSuccessResponse(product);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error fetching product');
      return createErrorResponse(error);
    }
  }

  // UPDATE
  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductRequest
  ): Promise<APIGatewayProxyResult> {
    try {
      const product = await this.productService.updateProduct(id, data);
      return createSuccessResponse(product);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error updating product');
      return createErrorResponse(error);
    }
  }

  // DELETE
  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    try {
      await this.productService.deleteProduct(id);
      return createSuccessResponse({ deleted: true });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error deleting product');
      return createErrorResponse(error);
    }
  }
}
