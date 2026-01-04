/**
 * Warranty Certificate Service
 *
 * Business logic layer for warranty certificate operations.
 * Includes eligibility validation and status calculation.
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import {
  IWarrantyCertificateRepository,
  WarrantyCertificateWithRelations,
} from '../repositories/WarrantyCertificateRepository';
import { IFileRepository } from '../repositories/FileRepository';
import {
  CreateWarrantyCertificateRequest,
  UpdateWarrantyCertificateRequest,
  ListWarrantyCertificateRequest,
  WarrantyCertificateResponse,
  WarrantyCertificateListResponse,
  EligibleCommissioningResponse,
  WarrantyCertificateStatusResponse,
} from '../schemas';
import { ACCORDION_STATUS, WARRANTY_STATUS } from '../constants';

export interface IWarrantyCertificateService {
  createWarrantyCertificate(
    data: CreateWarrantyCertificateRequest,
    createdById?: number
  ): Promise<WarrantyCertificateResponse[]>;
  getWarrantyCertificateById(
    warrantyCertificateId: number
  ): Promise<WarrantyCertificateResponse | null>;
  getAllWarrantyCertificates(
    params: ListWarrantyCertificateRequest
  ): Promise<WarrantyCertificateListResponse>;
  getWarrantyCertificatesByPoId(poId: string): Promise<WarrantyCertificateResponse[]>;
  updateWarrantyCertificate(
    warrantyCertificateId: number,
    data: UpdateWarrantyCertificateRequest,
    updatedById?: number
  ): Promise<WarrantyCertificateResponse | null>;
  deleteWarrantyCertificate(warrantyCertificateId: number): Promise<boolean>;
  getEligibleCommissionings(poId: string): Promise<EligibleCommissioningResponse[]>;
  getAccordionStatus(poId: string): Promise<WarrantyCertificateStatusResponse>;
}

@injectable()
export class WarrantyCertificateService implements IWarrantyCertificateService {
  constructor(
    @inject(TYPES.WarrantyCertificateRepository)
    private warrantyCertificateRepository: IWarrantyCertificateRepository,
    @inject(TYPES.FileRepository)
    private fileRepository: IFileRepository
  ) {}

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDate(date: Date | null | undefined): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  /**
   * Map warranty certificate to response format
   */
  private mapToResponse(record: WarrantyCertificateWithRelations): WarrantyCertificateResponse {
    return {
      warrantyCertificateId: record.warrantyCertificateId,
      commissioningId: record.commissioningId,

      // Related data
      serialNumber: record.commissioning?.preCommissioning?.serialNumber,
      productName: record.commissioning?.preCommissioning?.productName,
      dispatchId: record.commissioning?.preCommissioning?.dispatchId,
      preCommissioningId: record.commissioning?.preCommissioningId,
      poId: record.commissioning?.preCommissioning?.dispatch?.poId,

      // Warranty Certificate Details
      certificateNo: record.certificateNo,
      issueDate: this.formatDate(record.issueDate),
      warrantyStartDate: this.formatDate(record.warrantyStartDate),
      warrantyEndDate: this.formatDate(record.warrantyEndDate),
      warrantyStatus: record.warrantyStatus,

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
   * Create warranty certificate records for multiple commissioning entries
   */
  async createWarrantyCertificate(
    data: CreateWarrantyCertificateRequest,
    createdById?: number
  ): Promise<WarrantyCertificateResponse[]> {
    const records = await this.warrantyCertificateRepository.create(data, createdById);

    // If file IDs provided, confirm files
    if (data.fileIds && data.fileIds.length > 0 && records.length > 0) {
      const entityId = records[0].warrantyCertificateId.toString();
      await this.fileRepository.confirmMultiple(data.fileIds, {
        entityType: 'warranty_certificate',
        entityId,
      });
    }

    return records.map((record) => this.mapToResponse(record));
  }

  /**
   * Get warranty certificate by ID
   */
  async getWarrantyCertificateById(
    warrantyCertificateId: number
  ): Promise<WarrantyCertificateResponse | null> {
    const record = await this.warrantyCertificateRepository.findById(warrantyCertificateId);
    if (!record) return null;

    const response = this.mapToResponse(record);

    // Get associated files
    const files = await this.fileRepository.findByEntity(
      'warranty_certificate',
      warrantyCertificateId.toString()
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
   * Get all warranty certificate records with pagination
   */
  async getAllWarrantyCertificates(
    params: ListWarrantyCertificateRequest
  ): Promise<WarrantyCertificateListResponse> {
    const { page = 1, limit = 20 } = params;
    const { rows, count } = await this.warrantyCertificateRepository.findAll(params);

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
   * Get all warranty certificate records for a specific PO
   */
  /**
   * Get all warranty certificates for a specific PO (with files)
   */
  async getWarrantyCertificatesByPoId(poId: string): Promise<WarrantyCertificateResponse[]> {
    const records = await this.warrantyCertificateRepository.findByPoId(poId);

    // Fetch files for each record
    const responses = await Promise.all(
      records.map(async (record) => {
        const response = this.mapToResponse(record);
        const files = await this.fileRepository.findByEntity(
          'warranty_certificate',
          record.warrantyCertificateId.toString()
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
   * Update a warranty certificate record
   */
  async updateWarrantyCertificate(
    warrantyCertificateId: number,
    data: UpdateWarrantyCertificateRequest,
    updatedById?: number
  ): Promise<WarrantyCertificateResponse | null> {
    const record = await this.warrantyCertificateRepository.update(
      warrantyCertificateId,
      data,
      updatedById
    );
    if (!record) return null;

    // If file IDs provided, confirm files
    if (data.fileIds && data.fileIds.length > 0) {
      await this.fileRepository.confirmMultiple(data.fileIds, {
        entityType: 'warranty_certificate',
        entityId: warrantyCertificateId.toString(),
      });
    }

    return this.mapToResponse(record);
  }

  /**
   * Delete a warranty certificate record
   */
  async deleteWarrantyCertificate(warrantyCertificateId: number): Promise<boolean> {
    return this.warrantyCertificateRepository.delete(warrantyCertificateId);
  }

  /**
   * Get eligible commissioning records for warranty certificate
   */
  async getEligibleCommissionings(poId: string): Promise<EligibleCommissioningResponse[]> {
    const eligible = await this.warrantyCertificateRepository.findEligibleCommissionings(poId);
    return eligible.map((c) => ({
      commissioningId: c.commissioningId,
      preCommissioningId: c.preCommissioningId,
      serialNumber: c.serialNumber,
      productName: c.productName,
      dispatchId: c.dispatchId,
      commissioningStatus: c.commissioningStatus,
      commissioningDate: c.commissioningDate
        ? c.commissioningDate.toISOString().split('T')[0]
        : undefined,
    }));
  }

  /**
   * Get accordion status for warranty certificate section
   */
  async getAccordionStatus(poId: string): Promise<WarrantyCertificateStatusResponse> {
    // Get eligible commissionings count
    const eligible = await this.warrantyCertificateRepository.findEligibleCommissionings(poId);
    const totalEligible = eligible.length;

    // Get warranty certificate records for this PO
    const records = await this.warrantyCertificateRepository.findByPoId(poId);
    const completed = records.filter((r) => r.warrantyStatus === WARRANTY_STATUS.DONE).length;
    const pending = records.length - completed;

    // Calculate all commissionings that should have warranty certificate
    const allCommissioningsCount = totalEligible + records.length;

    let status: 'Not Started' | 'In-Progress' | 'Done';
    if (records.length === 0) {
      status = ACCORDION_STATUS.NOT_STARTED;
    } else if (
      allCommissioningsCount > 0 &&
      records.length >= allCommissioningsCount &&
      completed === records.length
    ) {
      status = ACCORDION_STATUS.DONE;
    } else {
      status = ACCORDION_STATUS.IN_PROGRESS;
    }

    return {
      status,
      totalEligible: allCommissioningsCount,
      completed,
      pending,
    };
  }
}
