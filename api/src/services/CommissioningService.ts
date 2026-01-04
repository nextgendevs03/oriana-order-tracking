/**
 * Commissioning Service
 *
 * Business logic layer for commissioning operations.
 * Includes eligibility validation and status calculation.
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import {
  ICommissioningRepository,
  CommissioningWithRelations,
} from '../repositories/CommissioningRepository';
import { IFileRepository } from '../repositories/FileRepository';
import {
  CreateCommissioningRequest,
  UpdateCommissioningRequest,
  ListCommissioningRequest,
  CommissioningResponse,
  CommissioningListResponse,
  EligiblePreCommissioningResponse,
  CommissioningStatusResponse,
} from '../schemas';
import { ACCORDION_STATUS, COMMISSIONING_STATUS } from '../constants';

export interface ICommissioningService {
  createCommissioning(
    data: CreateCommissioningRequest,
    createdById?: number
  ): Promise<CommissioningResponse[]>;
  getCommissioningById(commissioningId: number): Promise<CommissioningResponse | null>;
  getAllCommissionings(params: ListCommissioningRequest): Promise<CommissioningListResponse>;
  getCommissioningsByPoId(poId: string): Promise<CommissioningResponse[]>;
  updateCommissioning(
    commissioningId: number,
    data: UpdateCommissioningRequest,
    updatedById?: number
  ): Promise<CommissioningResponse | null>;
  deleteCommissioning(commissioningId: number): Promise<boolean>;
  getEligiblePreCommissionings(poId: string): Promise<EligiblePreCommissioningResponse[]>;
  getAccordionStatus(poId: string): Promise<CommissioningStatusResponse>;
}

@injectable()
export class CommissioningService implements ICommissioningService {
  constructor(
    @inject(TYPES.CommissioningRepository)
    private commissioningRepository: ICommissioningRepository,
    @inject(TYPES.FileRepository)
    private fileRepository: IFileRepository
  ) {}

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDate(date: Date | null | undefined): string | undefined {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  }

  /**
   * Map commissioning to response format
   */
  private mapToResponse(record: CommissioningWithRelations): CommissioningResponse {
    return {
      commissioningId: record.commissioningId,
      preCommissioningId: record.preCommissioningId,

      // Related Pre-Commissioning data
      serialNumber: record.preCommissioning?.serialNumber,
      productName: record.preCommissioning?.productName,
      dispatchId: record.preCommissioning?.dispatchId,
      poId: record.preCommissioning?.dispatch?.poId,

      // Commissioning Details
      ecdFromClient: record.ecdFromClient || undefined,
      serviceTicketNo: record.serviceTicketNo || undefined,
      ccdFromClient: record.ccdFromClient || undefined,
      issues: record.issues || undefined,
      solution: record.solution || undefined,
      infoGenerated: record.infoGenerated || undefined,
      commissioningDate: this.formatDate(record.commissioningDate),
      commissioningStatus: record.commissioningStatus,
      remarks: record.remarks || undefined,

      // Flags
      hasWarrantyCertificate: !!record.warrantyCertificate,

      // Audit Fields
      createdById: record.createdById || undefined,
      createdBy: record.createdBy?.username,
      updatedById: record.updatedById || undefined,
      updatedBy: record.updatedBy?.username,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  /**
   * Create commissioning records for multiple pre-commissioning entries
   */
  async createCommissioning(
    data: CreateCommissioningRequest,
    createdById?: number
  ): Promise<CommissioningResponse[]> {
    const records = await this.commissioningRepository.create(data, createdById);

    // If file IDs provided, confirm files
    if (data.fileIds && data.fileIds.length > 0 && records.length > 0) {
      const entityId = records[0].commissioningId.toString();
      await this.fileRepository.confirmMultiple(data.fileIds, {
        entityType: 'commissioning',
        entityId,
      });
    }

    return records.map((record) => this.mapToResponse(record));
  }

  /**
   * Get commissioning by ID
   */
  async getCommissioningById(commissioningId: number): Promise<CommissioningResponse | null> {
    const record = await this.commissioningRepository.findById(commissioningId);
    if (!record) return null;

    const response = this.mapToResponse(record);

    // Get associated files
    const files = await this.fileRepository.findByEntity(
      'commissioning',
      commissioningId.toString()
    );
    response.files = files.map((f) => ({
      fileId: f.fileId,
      originalFileName: f.originalFileName,
      storedFileName: f.storedFileName,
      mimeType: f.mimeType,
      fileSize: f.fileSize,
      s3Key: f.s3Key,
      s3Bucket: f.s3Bucket,
      status: f.status,
      entityType: f.entityType || undefined,
      entityId: f.entityId || undefined,
      poId: f.poId || undefined,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));

    return response;
  }

  /**
   * Get all commissioning records with pagination
   */
  async getAllCommissionings(params: ListCommissioningRequest): Promise<CommissioningListResponse> {
    const { page = 1, limit = 20 } = params;
    const { rows, count } = await this.commissioningRepository.findAll(params);

    return {
      data: rows.map((record) => this.mapToResponse(record)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Get all commissioning records for a specific PO
   */
  /**
   * Get all commissioning records for a specific PO (with files)
   */
  async getCommissioningsByPoId(poId: string): Promise<CommissioningResponse[]> {
    const records = await this.commissioningRepository.findByPoId(poId);

    // Fetch files for each record
    const responses = await Promise.all(
      records.map(async (record) => {
        const response = this.mapToResponse(record);
        const files = await this.fileRepository.findByEntity(
          'commissioning',
          record.commissioningId.toString()
        );
        response.files = files.map((f) => ({
          fileId: f.fileId,
          originalFileName: f.originalFileName,
          storedFileName: f.storedFileName,
          mimeType: f.mimeType,
          fileSize: f.fileSize,
          status: f.status,
          entityType: f.entityType || undefined,
          entityId: f.entityId || undefined,
          createdAt: f.createdAt.toISOString(),
        }));
        return response;
      })
    );

    return responses;
  }

  /**
   * Update a commissioning record
   */
  async updateCommissioning(
    commissioningId: number,
    data: UpdateCommissioningRequest,
    updatedById?: number
  ): Promise<CommissioningResponse | null> {
    const record = await this.commissioningRepository.update(commissioningId, data, updatedById);
    if (!record) return null;

    // If file IDs provided, confirm files
    if (data.fileIds && data.fileIds.length > 0) {
      await this.fileRepository.confirmMultiple(data.fileIds, {
        entityType: 'commissioning',
        entityId: commissioningId.toString(),
      });
    }

    return this.mapToResponse(record);
  }

  /**
   * Delete a commissioning record
   */
  async deleteCommissioning(commissioningId: number): Promise<boolean> {
    return this.commissioningRepository.delete(commissioningId);
  }

  /**
   * Get eligible pre-commissioning records for commissioning
   */
  async getEligiblePreCommissionings(poId: string): Promise<EligiblePreCommissioningResponse[]> {
    const eligible = await this.commissioningRepository.findEligiblePreCommissionings(poId);
    return eligible;
  }

  /**
   * Get accordion status for commissioning section
   */
  async getAccordionStatus(poId: string): Promise<CommissioningStatusResponse> {
    // Get eligible pre-commissionings count
    const eligible = await this.commissioningRepository.findEligiblePreCommissionings(poId);
    const totalEligible = eligible.length;

    // Get commissioning records for this PO
    const records = await this.commissioningRepository.findByPoId(poId);
    const completed = records.filter(
      (r) => r.commissioningStatus === COMMISSIONING_STATUS.DONE
    ).length;
    const pending = records.length - completed;

    // Calculate all pre-commissionings that should have commissioning
    const allPreCommissioningsCount = totalEligible + records.length;

    let status: 'Not Started' | 'In-Progress' | 'Done';
    if (records.length === 0) {
      status = ACCORDION_STATUS.NOT_STARTED;
    } else if (
      allPreCommissioningsCount > 0 &&
      records.length >= allPreCommissioningsCount &&
      completed === records.length
    ) {
      status = ACCORDION_STATUS.DONE;
    } else {
      status = ACCORDION_STATUS.IN_PROGRESS;
    }

    return {
      status,
      totalEligible: allPreCommissioningsCount,
      completed,
      pending,
    };
  }
}
