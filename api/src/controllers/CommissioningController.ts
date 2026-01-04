/**
 * Commissioning Controller
 *
 * Handles all commissioning-related API endpoints.
 * Endpoints:
 * - POST /api/commissioning - Create commissioning records (bulk)
 * - GET /api/commissioning - Get all with pagination
 * - GET /api/commissioning/po/{poId} - Get by PO ID
 * - GET /api/commissioning/po/{poId}/status - Get accordion status
 * - GET /api/commissioning/po/{poId}/eligible - Get eligible pre-commissionings
 * - GET /api/commissioning/{id} - Get by ID
 * - PUT /api/commissioning/{id} - Update
 * - DELETE /api/commissioning/{id} - Delete
 */

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
import { ICommissioningService } from '../services/CommissioningService';
import {
  CreateCommissioningRequest,
  UpdateCommissioningRequest,
  ListCommissioningRequest,
} from '../schemas';

@Controller({ path: '/api/commissioning', lambdaName: 'serviceLifecycle' })
@injectable()
export class CommissioningController {
  constructor(
    @inject(TYPES.CommissioningService)
    private commissioningService: ICommissioningService
  ) {}

  /**
   * POST /api/commissioning
   * Create commissioning records (bulk for multiple pre-commissionings)
   */
  @Post('/')
  async create(
    @Body() data: CreateCommissioningRequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    this.validateCreateRequest(data);
    const records = await this.commissioningService.createCommissioning(data, currentUser.userId);
    return createSuccessResponse(records, 201);
  }

  /**
   * GET /api/commissioning
   * Get all commissioning records with pagination
   */
  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('poId') poId?: string,
    @Query('preCommissioningId') preCommissioningId?: string,
    @Query('commissioningStatus') commissioningStatus?: string
  ): Promise<APIGatewayProxyResult> {
    const params: ListCommissioningRequest = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      poId: poId || undefined,
      preCommissioningId: preCommissioningId ? parseInt(preCommissioningId, 10) : undefined,
      commissioningStatus: commissioningStatus || undefined,
    };

    const result = await this.commissioningService.getAllCommissionings(params);
    const { data, pagination } = result;
    return createSuccessResponse({ data, pagination }, 200);
  }

  /**
   * GET /api/commissioning/po/{poId}
   * Get all commissioning records for a specific PO
   */
  @Get('/po/{poId}')
  async getByPoId(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const records = await this.commissioningService.getCommissioningsByPoId(poId);
    return createSuccessResponse(records);
  }

  /**
   * GET /api/commissioning/po/{poId}/status
   * Get accordion status for commissioning section
   */
  @Get('/po/{poId}/status')
  async getAccordionStatus(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const status = await this.commissioningService.getAccordionStatus(poId);
    return createSuccessResponse(status);
  }

  /**
   * GET /api/commissioning/po/{poId}/eligible
   * Get eligible pre-commissionings for commissioning
   */
  @Get('/po/{poId}/eligible')
  async getEligiblePreCommissionings(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const eligible = await this.commissioningService.getEligiblePreCommissionings(poId);
    return createSuccessResponse(eligible);
  }

  /**
   * GET /api/commissioning/{id}
   * Get commissioning by ID
   */
  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const commissioningId = parseInt(id, 10);
    if (isNaN(commissioningId)) {
      throw new ValidationError('Invalid commissioning ID');
    }

    const record = await this.commissioningService.getCommissioningById(commissioningId);

    if (!record) {
      throw new NotFoundError(`Commissioning with ID ${id} not found`);
    }

    return createSuccessResponse(record);
  }

  /**
   * PUT /api/commissioning/{id}
   * Update commissioning record
   */
  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCommissioningRequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    const commissioningId = parseInt(id, 10);
    if (isNaN(commissioningId)) {
      throw new ValidationError('Invalid commissioning ID');
    }

    const record = await this.commissioningService.updateCommissioning(
      commissioningId,
      data,
      currentUser.userId
    );

    if (!record) {
      throw new NotFoundError(`Commissioning with ID ${id} not found`);
    }

    return createSuccessResponse(record);
  }

  /**
   * DELETE /api/commissioning/{id}
   * Delete a commissioning record
   */
  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const commissioningId = parseInt(id, 10);
    if (isNaN(commissioningId)) {
      throw new ValidationError('Invalid commissioning ID');
    }

    const deleted = await this.commissioningService.deleteCommissioning(commissioningId);

    if (!deleted) {
      throw new NotFoundError(`Commissioning with ID ${id} not found`);
    }

    return createSuccessResponse({ commissioningId, deleted: true });
  }

  /**
   * Validate create request
   */
  private validateCreateRequest(data: CreateCommissioningRequest): void {
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    for (const item of data.items) {
      if (!item.preCommissioningId) {
        throw new ValidationError('Each item must have a preCommissioningId');
      }
    }

    if (!data.commissioningStatus) {
      throw new ValidationError('commissioningStatus is required');
    }
  }
}
