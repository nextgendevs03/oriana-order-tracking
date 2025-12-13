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
import { IProductService } from '../services/ProductService';
import { CreateProductRequest, UpdateProductRequest } from '../schemas/request/ProductRequest';

export interface IProductController {
  create(data: CreateProductRequest): Promise<APIGatewayProxyResult>;
  getAll(): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateProductRequest): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/product', lambdaName: 'product' })
@injectable()
export class ProductController implements IProductController {
  constructor(@inject(TYPES.ProductService) private productService: IProductService) {}

  @Post('/')
  async create(@Body() data: CreateProductRequest): Promise<APIGatewayProxyResult> {
    try {
      const p = await this.productService.createProduct(data);
      return createSuccessResponse(p, 201);
    } catch (err: any) {
      return createErrorResponse(err.message || 'Error creating product');
    }
  }

  @Get('/')
  async getAll(): Promise<APIGatewayProxyResult> {
    try {
      const products = await this.productService.getAllProducts();
      return createSuccessResponse(products);
    } catch (err: any) {
      return createErrorResponse(err.message || 'Error fetching products');
    }
  }

  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    try {
      const product = await this.productService.getProductById(id);
      return createSuccessResponse(product);
    } catch (err: any) {
      return createErrorResponse(err.message || 'Error fetching product');
    }
  }

  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductRequest
  ): Promise<APIGatewayProxyResult> {
    try {
      const p = await this.productService.updateProduct(id, data);
      return createSuccessResponse(p);
    } catch (err: any) {
      return createErrorResponse(err.message || 'Error updating product');
    }
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    try {
      await this.productService.deleteProduct(id);
      return createSuccessResponse({ deleted: true });
    } catch (err: any) {
      return createErrorResponse(err.message || 'Error deleting product');
    }
  }
}
