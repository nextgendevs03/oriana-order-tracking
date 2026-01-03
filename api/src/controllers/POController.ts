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
  CurrentUser,
  createSuccessResponse,
  NotFoundError,
  ValidationError,
  JWTPayload,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IPOService } from '../services/POService';
import { CreatePORequest, UpdatePORequest, ListPORequest } from '../schemas';

export interface IPOController {
  create(data: CreatePORequest, currentUser: JWTPayload): Promise<APIGatewayProxyResult>;
  getAll(
    page?: string,
    limit?: string,
    sortBy?: string,
    sortOrder?: string,
    clientId?: string,
    poStatus?: string
  ): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(
    id: string,
    data: UpdatePORequest,
    currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/po', lambdaName: 'CreatePO' })
@injectable()
export class POController implements IPOController {
  constructor(@inject(TYPES.POService) private poService: IPOService) {}

  @Post('/')
  async create(
    @Body() data: CreatePORequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    this.validateCreateRequest(data);
    const enrichedData = {
      ...data,
      createdById: currentUser.userId,
      updatedById: currentUser.userId,
    };
    const po = await this.poService.createPO(enrichedData);
    return createSuccessResponse(po, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('clientId') clientId?: string,
    @Query('poStatus') poStatus?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('searchKey') searchKey?: string,
    @Query('searchTerm') searchTerm?: string
  ): Promise<APIGatewayProxyResult> {
    const params: ListPORequest = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      clientId,
      poStatus,
      assignedTo: assignedTo ? parseInt(assignedTo, 10) : undefined,
      searchKey: searchKey || undefined,
      searchTerm: searchTerm || undefined,
    };

    const result = await this.poService.getAllPOs(params);
    const { data, pagination } = result;
    return createSuccessResponse({ data, pagination }, 200);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const po = await this.poService.getPOById(id);

    if (!po) {
      throw new NotFoundError(`Purchase Order with ID ${id} not found`);
    }

    return createSuccessResponse(po);
  }

  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePORequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    const updateData = {
      ...data,
      poId: id,
      updatedById: currentUser.userId,
    };
    const po = await this.poService.updatePO(id, updateData);

    if (!po) {
      throw new NotFoundError(`Purchase Order with ID ${id} not found`);
    }

    return createSuccessResponse(po);
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const deleted = await this.poService.deletePO(id);

    if (!deleted) {
      throw new NotFoundError(`Purchase Order with ID ${id} not found`);
    }

    return createSuccessResponse({ id, deleted: true });
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
