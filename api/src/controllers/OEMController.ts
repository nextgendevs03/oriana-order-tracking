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
import { IOEMService } from '../services/OEMService';
import { CreateOEMRequest, UpdateOEMRequest } from '../schemas/request/OEMRequest';

export interface IOEMController {
  create(data: CreateOEMRequest): Promise<APIGatewayProxyResult>;
  getAll(oemName?: string, isActive?: string): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateOEMRequest): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/oem', lambdaName: 'productManagement' })
@injectable()
export class OEMController implements IOEMController {
  constructor(@inject(TYPES.OEMService) private oemService: IOEMService) {}

  @Post('/')
  async create(@Body() data: CreateOEMRequest): Promise<APIGatewayProxyResult> {
    try {
      const oem = await this.oemService.createOEM(data);
      return createSuccessResponse(oem, 201);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error creating OEM');
      return createErrorResponse(error);
    }
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('oemName') oemName?: string,
    @Query('isActive') isActive?: string
  ): Promise<APIGatewayProxyResult> {
    try {
      const result = await this.oemService.getAllOEMs({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        sortBy: sortBy || 'createdAt',
        sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
        oemName: oemName || undefined,
        isActive: isActive ? isActive === 'true' : undefined,
      });
      return createSuccessResponse(result.data, 200, result.pagination);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error fetching OEMs');
      return createErrorResponse(error);
    }
  }

  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    try {
      const oem = await this.oemService.getOEMById(id);
      return createSuccessResponse(oem);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error fetching OEM');
      return createErrorResponse(error);
    }
  }

  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateOEMRequest
  ): Promise<APIGatewayProxyResult> {
    try {
      const oem = await this.oemService.updateOEM(id, data);
      return createSuccessResponse(oem);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error updating OEM');
      return createErrorResponse(error);
    }
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    try {
      await this.oemService.deleteOEM(id);
      return createSuccessResponse({ deleted: true });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Error deleting OEM');
      return createErrorResponse(error);
    }
  }
}
