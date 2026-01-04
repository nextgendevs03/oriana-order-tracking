/**
 * Warranty Certificate Controller
 *
 * Handles all warranty certificate-related API endpoints.
 * Endpoints:
 * - POST /api/warranty-certificate - Create warranty certificate records (bulk)
 * - GET /api/warranty-certificate - Get all with pagination
 * - GET /api/warranty-certificate/po/{poId} - Get by PO ID
 * - GET /api/warranty-certificate/po/{poId}/status - Get accordion status
 * - GET /api/warranty-certificate/po/{poId}/eligible - Get eligible commissionings
 * - GET /api/warranty-certificate/{id} - Get by ID
 * - PUT /api/warranty-certificate/{id} - Update
 * - DELETE /api/warranty-certificate/{id} - Delete
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
import { IWarrantyCertificateService } from '../services/WarrantyCertificateService';
import {
  CreateWarrantyCertificateRequest,
  UpdateWarrantyCertificateRequest,
  ListWarrantyCertificateRequest,
} from '../schemas';

@Controller({ path: '/api/warranty-certificate', lambdaName: 'serviceLifecycle' })
@injectable()
export class WarrantyCertificateController {
  constructor(
    @inject(TYPES.WarrantyCertificateService)
    private warrantyCertificateService: IWarrantyCertificateService
  ) {}

  /**
   * POST /api/warranty-certificate
   * Create warranty certificate records (bulk for multiple commissionings)
   */
  @Post('/')
  async create(
    @Body() data: CreateWarrantyCertificateRequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    this.validateCreateRequest(data);
    const records = await this.warrantyCertificateService.createWarrantyCertificate(
      data,
      currentUser.userId
    );
    return createSuccessResponse(records, 201);
  }

  /**
   * GET /api/warranty-certificate
   * Get all warranty certificate records with pagination
   */
  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('poId') poId?: string,
    @Query('commissioningId') commissioningId?: string,
    @Query('warrantyStatus') warrantyStatus?: string
  ): Promise<APIGatewayProxyResult> {
    const params: ListWarrantyCertificateRequest = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      poId: poId || undefined,
      commissioningId: commissioningId ? parseInt(commissioningId, 10) : undefined,
      warrantyStatus: warrantyStatus || undefined,
    };

    const result = await this.warrantyCertificateService.getAllWarrantyCertificates(params);
    const { data, pagination } = result;
    return createSuccessResponse({ data, pagination }, 200);
  }

  /**
   * GET /api/warranty-certificate/po/{poId}
   * Get all warranty certificate records for a specific PO
   */
  @Get('/po/{poId}')
  async getByPoId(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const records = await this.warrantyCertificateService.getWarrantyCertificatesByPoId(poId);
    return createSuccessResponse(records);
  }

  /**
   * GET /api/warranty-certificate/po/{poId}/status
   * Get accordion status for warranty certificate section
   */
  @Get('/po/{poId}/status')
  async getAccordionStatus(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const status = await this.warrantyCertificateService.getAccordionStatus(poId);
    return createSuccessResponse(status);
  }

  /**
   * GET /api/warranty-certificate/po/{poId}/eligible
   * Get eligible commissionings for warranty certificate
   */
  @Get('/po/{poId}/eligible')
  async getEligibleCommissionings(@Param('poId') poId: string): Promise<APIGatewayProxyResult> {
    if (!poId) {
      throw new ValidationError('PO ID is required');
    }

    const eligible = await this.warrantyCertificateService.getEligibleCommissionings(poId);
    return createSuccessResponse(eligible);
  }

  /**
   * GET /api/warranty-certificate/{id}
   * Get warranty certificate by ID
   */
  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const warrantyCertificateId = parseInt(id, 10);
    if (isNaN(warrantyCertificateId)) {
      throw new ValidationError('Invalid warranty certificate ID');
    }

    const record =
      await this.warrantyCertificateService.getWarrantyCertificateById(warrantyCertificateId);

    if (!record) {
      throw new NotFoundError(`Warranty certificate with ID ${id} not found`);
    }

    return createSuccessResponse(record);
  }

  /**
   * PUT /api/warranty-certificate/{id}
   * Update warranty certificate record
   */
  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateWarrantyCertificateRequest,
    @CurrentUser() currentUser: JWTPayload
  ): Promise<APIGatewayProxyResult> {
    const warrantyCertificateId = parseInt(id, 10);
    if (isNaN(warrantyCertificateId)) {
      throw new ValidationError('Invalid warranty certificate ID');
    }

    const record = await this.warrantyCertificateService.updateWarrantyCertificate(
      warrantyCertificateId,
      data,
      currentUser.userId
    );

    if (!record) {
      throw new NotFoundError(`Warranty certificate with ID ${id} not found`);
    }

    return createSuccessResponse(record);
  }

  /**
   * DELETE /api/warranty-certificate/{id}
   * Delete a warranty certificate record
   */
  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const warrantyCertificateId = parseInt(id, 10);
    if (isNaN(warrantyCertificateId)) {
      throw new ValidationError('Invalid warranty certificate ID');
    }

    const deleted =
      await this.warrantyCertificateService.deleteWarrantyCertificate(warrantyCertificateId);

    if (!deleted) {
      throw new NotFoundError(`Warranty certificate with ID ${id} not found`);
    }

    return createSuccessResponse({ warrantyCertificateId, deleted: true });
  }

  /**
   * Validate create request
   */
  private validateCreateRequest(data: CreateWarrantyCertificateRequest): void {
    if (!data.items || data.items.length === 0) {
      throw new ValidationError('At least one item is required');
    }

    for (const item of data.items) {
      if (!item.commissioningId) {
        throw new ValidationError('Each item must have a commissioningId');
      }
    }

    const requiredFields: (keyof CreateWarrantyCertificateRequest)[] = [
      'certificateNo',
      'issueDate',
      'warrantyStartDate',
      'warrantyEndDate',
      'warrantyStatus',
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new ValidationError(`Field '${field}' is required`);
      }
    }
  }
}
