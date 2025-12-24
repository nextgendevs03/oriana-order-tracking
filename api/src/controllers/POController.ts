import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  createSuccessResponse,
  NotFoundError,
  ValidationError,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IPOService } from '../services/POService';
import { CreatePORequest, UpdatePORequest, ListPORequest } from '../schemas';

export interface IPOController {
  create(data: CreatePORequest): Promise<APIGatewayProxyResult>;
  getAll(
    page?: string,
    limit?: string,
    sortBy?: string,
    sortOrder?: string,
    clientId?: string,
    poStatus?: string
  ): Promise<APIGatewayProxyResult>;
  getById(poId: string): Promise<APIGatewayProxyResult>;
  update(poId: string, data: UpdatePORequest): Promise<APIGatewayProxyResult>;
  delete(poId: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/po', lambdaName: 'CreatePO' })
@injectable()
export class POController implements IPOController {
  constructor(@inject(TYPES.POService) private poService: IPOService) {}

  @Post('/')
  async create(@Body() data: CreatePORequest): Promise<APIGatewayProxyResult> {
    this.validateCreateRequest(data);
    const po = await this.poService.createPO(data);
    return createSuccessResponse(po, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('clientId') clientId?: string,
    @Query('poStatus') poStatus?: string
  ): Promise<APIGatewayProxyResult> {
    const params: ListPORequest = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      clientId,
      poStatus,
    };

    const result = await this.poService.getAllPOs(params);
    return createSuccessResponse(result.items, 200, result.pagination);
  }

  @Get('/{poId}')
  async getById(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    const po = await this.poService.getPOById(poId);

    if (!po) {
      throw new NotFoundError(`Purchase Order with ID ${poId} not found`);
    }

    return createSuccessResponse(po);
  }

  @Put('/{poId}')
  async update(
    @Param('poId') poId: string,
    @Body() data: UpdatePORequest
  ): Promise<APIGatewayProxyResult> {
    const updateData = { ...data, poId };
    const po = await this.poService.updatePO(poId, updateData);

    if (!po) {
      throw new NotFoundError(`Purchase Order with ID ${poId} not found`);
    }

    return createSuccessResponse(po);
  }

  @Delete('/{poId}')
  async delete(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    const deleted = await this.poService.deletePO(poId);

    if (!deleted) {
      throw new NotFoundError(`Purchase Order with ID ${poId} not found`);
    }

    return createSuccessResponse({ poId, deleted: true });
  }

  private validateCreateRequest(data: CreatePORequest): void {
    const requiredFields: (keyof CreatePORequest)[] = [
      'poReceivedDate',
      'clientId',
      'osgPiNo',
      'osgPiDate',
      'clientPoNo',
      'clientPoDate',
      'poStatus',
      'noOfDispatch',
      'clientAddress',
      'clientContact',
      'dispatchPlanDate',
      'siteLocation',
      'oscSupport',
      'confirmDateOfDispatch',
      'paymentStatus',
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new ValidationError(`Field '${field}' is required`);
      }
    }

    if (!data.poItems || data.poItems.length === 0) {
      throw new ValidationError('At least one PO item is required');
    }

    for (const item of data.poItems) {
      if (!item.categoryId || !item.productId || !item.quantity) {
        throw new ValidationError('Each PO item must have categoryId, productId, and quantity');
      }
      if (!item.oemId) {
        throw new ValidationError('Each PO item must have oemId');
      }
      if (item.gstPercent === undefined || item.gstPercent === null) {
        throw new ValidationError('Each PO item must have gstPercent');
      }
    }
  }
}
