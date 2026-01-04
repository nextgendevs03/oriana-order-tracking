/**
 * Pre-Commissioning Controller
 *
 * Handles all pre-commissioning-related API endpoints.
 * Endpoints:
 * - POST /api/pre-commissioning - Create pre-commissioning records (bulk)
 * - GET /api/pre-commissioning - Get all with pagination
 * - GET /api/pre-commissioning/po/{poId} - Get by PO ID
 * - GET /api/pre-commissioning/po/{poId}/status - Get accordion status
 * - GET /api/pre-commissioning/po/{poId}/eligible - Get eligible serials
 * - GET /api/pre-commissioning/dispatch/{dispatchId} - Get by dispatch ID
 * - GET /api/pre-commissioning/{id} - Get by ID
 * - PUT /api/pre-commissioning/{id} - Update
 * - DELETE /api/pre-commissioning/{id} - Delete
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
import { IPreCommissioningService } from '../services/PreCommissioningService';
import {
  CreatePreCommissioningRequest,
  UpdatePreCommissioningRequest,
  ListPreCommissioningRequest,
} from '../schemas';

@Controller({ path: '/api/pre-commissioning', lambdaName: 'serviceLifecycle' })
@injectable()
export class PreCommissioningController {
  constructor(
    @inject(TYPES.PreCommissioningService)
    private preCommissioningService: IPreCommissioningService
  ) {}

  /**
   * POST /api/pre-commissioning
   * Create pre-commissioning records (bulk for multiple serials)
   */
  @Post('/')
  async create(
    @Body() data: CreatePreCommissioningRequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    this.validateCreateRequest(data);
    const records = await this.preCommissioningService.createPreCommissioning(
      data,
      currentUser.userId
    );
    return createSuccessResponse(records, 201);
  }

  /**
   * GET /api/pre-commissioning
   * Get all pre-commissioning records with pagination
   */
  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('poId') poId?: string,
    @Query('dispatchId') dispatchId?: string,
    @Query('preCommissioningStatus') preCommissioningStatus?: string,
    @Query('ppmConfirmationStatus') ppmConfirmationStatus?: string
  ): Promise<APIGatewayProxyResult> {
    const params: ListPreCommissioningRequest = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      poId: poId || undefined,
      dispatchId: dispatchId ? parseInt(dispatchId, 10) : undefined,
      preCommissioningStatus: preCommissioningStatus || undefined,
      ppmConfirmationStatus: ppmConfirmationStatus || undefined,
    };

    const result = await this.preCommissioningService.getAllPreCommissionings(params);
    const { data, pagination } = result;
    return createSuccessResponse({ data, pagination }, 200);
  }

  /**
   * GET /api/pre-commissioning/po/{poId}
   * Get all pre-commissioning records for a specific PO
   */
  @Get('/po/{poId}')
  async getByPoId(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const records = await this.preCommissioningService.getPreCommissioningsByPoId(poId);
    return createSuccessResponse(records);
  }

  /**
   * GET /api/pre-commissioning/po/{poId}/status
   * Get accordion status for pre-commissioning section
   */
  @Get('/po/{poId}/status')
  async getAccordionStatus(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const status = await this.preCommissioningService.getAccordionStatus(poId);
    return createSuccessResponse(status);
  }

  /**
   * GET /api/pre-commissioning/po/{poId}/eligible
   * Get eligible serial numbers for pre-commissioning
   */
  @Get('/po/{poId}/eligible')
  async getEligibleSerials(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const serials = await this.preCommissioningService.getEligibleSerials(poId);
    return createSuccessResponse(serials);
  }

  /**
   * GET /api/pre-commissioning/dispatch/{dispatchId}
   * Get all pre-commissioning records for a specific dispatch
   */
  @Get('/dispatch/{dispatchId}')
  async getByDispatchId(@Param('dispatchId') dispatchId: string): Promise<APIGatewayProxyResult> {
    const id = parseInt(dispatchId, 10);
    if (isNaN(id)) {
      throw new ValidationError('Invalid dispatch ID');
    }

    const records = await this.preCommissioningService.getPreCommissioningsByDispatchId(id);
    return createSuccessResponse(records);
  }

  /**
   * GET /api/pre-commissioning/{id}
   * Get pre-commissioning by ID
   */
  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const preCommissioningId = parseInt(id, 10);
    if (isNaN(preCommissioningId)) {
      throw new ValidationError('Invalid pre-commissioning ID');
    }

    const record = await this.preCommissioningService.getPreCommissioningById(preCommissioningId);

    if (!record) {
      throw new NotFoundError(`Pre-commissioning with ID ${id} not found`);
    }

    return createSuccessResponse(record);
  }

  /**
   * PUT /api/pre-commissioning/{id}
   * Update pre-commissioning record
   */
  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePreCommissioningRequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    const preCommissioningId = parseInt(id, 10);
    if (isNaN(preCommissioningId)) {
      throw new ValidationError('Invalid pre-commissioning ID');
    }

    const record = await this.preCommissioningService.updatePreCommissioning(
      preCommissioningId,
      data,
      currentUser.userId
    );

    if (!record) {
      throw new NotFoundError(`Pre-commissioning with ID ${id} not found`);
    }

    return createSuccessResponse(record);
  }

  /**
   * DELETE /api/pre-commissioning/{id}
   * Delete a pre-commissioning record
   */
  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const preCommissioningId = parseInt(id, 10);
    if (isNaN(preCommissioningId)) {
      throw new ValidationError('Invalid pre-commissioning ID');
    }

    const deleted = await this.preCommissioningService.deletePreCommissioning(preCommissioningId);

    if (!deleted) {
      throw new NotFoundError(`Pre-commissioning with ID ${id} not found`);
    }

    return createSuccessResponse({ preCommissioningId, deleted: true });
  }

  /**
   * Validate create request
   */
  private validateCreateRequest(data: CreatePreCommissioningRequest): void {
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    for (const item of data.items) {
      if (!item.dispatchId) {
        throw new ValidationError('Each item must have a dispatchId');
      }
      if (!item.serialNumber) {
        throw new ValidationError('Each item must have a serialNumber');
      }
      if (!item.productName) {
        throw new ValidationError('Each item must have a productName');
      }
    }

    const requiredFields: (keyof CreatePreCommissioningRequest)[] = [
      'pcContact',
      'serviceEngineerAssigned',
      'ppmChecklist',
      'ppmSheetReceivedFromClient',
      'ppmChecklistSharedWithOem',
      'ppmTickedNoFromOem',
      'ppmConfirmationStatus',
      'preCommissioningStatus',
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new ValidationError(`Field '${field}' is required`);
      }
    }
  }
}
