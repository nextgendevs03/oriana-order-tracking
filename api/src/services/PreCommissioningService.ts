/**
 * Pre-Commissioning Service
 *
 * Business logic layer for pre-commissioning operations.
 * Includes eligibility validation and status calculation.
 */

import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import {
  IPreCommissioningRepository,
  PreCommissioningWithRelations,
} from '../repositories/PreCommissioningRepository';
import { IFileRepository } from '../repositories/FileRepository';
import {
  CreatePreCommissioningRequest,
  UpdatePreCommissioningRequest,
  ListPreCommissioningRequest,
  PreCommissioningResponse,
  PreCommissioningListResponse,
  EligibleSerialResponse,
  PreCommissioningStatusResponse,
} from '../schemas';
import { ACCORDION_STATUS, PRE_COMMISSIONING_STATUS } from '../constants';

export interface IPreCommissioningService {
  createPreCommissioning(
    data: CreatePreCommissioningRequest,
    createdById?: number
  ): Promise<PreCommissioningResponse[]>;
  getPreCommissioningById(preCommissioningId: number): Promise<PreCommissioningResponse | null>;
  getAllPreCommissionings(
    params: ListPreCommissioningRequest
  ): Promise<PreCommissioningListResponse>;
  getPreCommissioningsByPoId(poId: string): Promise<PreCommissioningResponse[]>;
  getPreCommissioningsByDispatchId(dispatchId: number): Promise<PreCommissioningResponse[]>;
  updatePreCommissioning(
    preCommissioningId: number,
    data: UpdatePreCommissioningRequest,
    updatedById?: number
  ): Promise<PreCommissioningResponse | null>;
  deletePreCommissioning(preCommissioningId: number): Promise<boolean>;
  getEligibleSerials(poId: string): Promise<EligibleSerialResponse[]>;
  getAccordionStatus(poId: string): Promise<PreCommissioningStatusResponse>;
}

@injectable()
export class PreCommissioningService implements IPreCommissioningService {
  constructor(
    @inject(TYPES.PreCommissioningRepository)
    private preCommissioningRepository: IPreCommissioningRepository,
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
   * Map pre-commissioning to response format
   */
  private mapToResponse(record: PreCommissioningWithRelations): PreCommissioningResponse {
    return {
      preCommissioningId: record.preCommissioningId,
      dispatchId: record.dispatchId,
      serialNumber: record.serialNumber,
      productName: record.productName,

      // Pre-Commissioning Details
      pcContact: record.pcContact,
      serviceEngineerAssigned: record.serviceEngineerAssigned,
      ppmChecklist: record.ppmChecklist,
      ppmSheetReceivedFromClient: record.ppmSheetReceivedFromClient,
      ppmChecklistSharedWithOem: record.ppmChecklistSharedWithOem,
      ppmTickedNoFromOem: record.ppmTickedNoFromOem,
      ppmConfirmationStatus: record.ppmConfirmationStatus,
      oemComments: record.oemComments || undefined,
      preCommissioningStatus: record.preCommissioningStatus,
      remarks: record.remarks || undefined,

      // Related data
      poId: record.dispatch?.poId,
      hasCommissioning: !!record.commissioning,

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
   * Create pre-commissioning records for multiple serial numbers
   */
  async createPreCommissioning(
    data: CreatePreCommissioningRequest,
    createdById?: number
  ): Promise<PreCommissioningResponse[]> {
    const records = await this.preCommissioningRepository.create(data, createdById);

    // If file IDs provided, confirm files
    if (data.fileIds && data.fileIds.length > 0 && records.length > 0) {
      const entityId = records[0].preCommissioningId.toString();
      await this.fileRepository.confirmMultiple(data.fileIds, {
        entityType: 'pre_commissioning',
        entityId,
      });
    }

    return records.map((record) => this.mapToResponse(record));
  }

  /**
   * Get pre-commissioning by ID
   */
  async getPreCommissioningById(
    preCommissioningId: number
  ): Promise<PreCommissioningResponse | null> {
    const record = await this.preCommissioningRepository.findById(preCommissioningId);
    if (!record) return null;

    const response = this.mapToResponse(record);

    // Get associated files
    const files = await this.fileRepository.findByEntity(
      'pre_commissioning',
      preCommissioningId.toString()
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
   * Get all pre-commissioning records with pagination
   */
  async getAllPreCommissionings(
    params: ListPreCommissioningRequest
  ): Promise<PreCommissioningListResponse> {
    const { page = 1, limit = 20 } = params;
    const { rows, count } = await this.preCommissioningRepository.findAll(params);

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
   * Get all pre-commissioning records for a specific PO (with files)
   */
  async getPreCommissioningsByPoId(poId: string): Promise<PreCommissioningResponse[]> {
    const records = await this.preCommissioningRepository.findByPoId(poId);

    // Fetch files for each record
    const responses = await Promise.all(
      records.map(async (record) => {
        const response = this.mapToResponse(record);
        const files = await this.fileRepository.findByEntity(
          'pre_commissioning',
          record.preCommissioningId.toString()
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
   * Get all pre-commissioning records for a specific dispatch (with files)
   */
  async getPreCommissioningsByDispatchId(dispatchId: number): Promise<PreCommissioningResponse[]> {
    const records = await this.preCommissioningRepository.findByDispatchId(dispatchId);

    // Fetch files for each record
    const responses = await Promise.all(
      records.map(async (record) => {
        const response = this.mapToResponse(record);
        const files = await this.fileRepository.findByEntity(
          'pre_commissioning',
          record.preCommissioningId.toString()
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
   * Update a pre-commissioning record
   */
  async updatePreCommissioning(
    preCommissioningId: number,
    data: UpdatePreCommissioningRequest,
    updatedById?: number
  ): Promise<PreCommissioningResponse | null> {
    const record = await this.preCommissioningRepository.update(
      preCommissioningId,
      data,
      updatedById
    );
    if (!record) return null;

    // If file IDs provided, confirm files
    if (data.fileIds && data.fileIds.length > 0) {
      await this.fileRepository.confirmMultiple(data.fileIds, {
        entityType: 'pre_commissioning',
        entityId: preCommissioningId.toString(),
      });
    }

    return this.mapToResponse(record);
  }

  /**
   * Delete a pre-commissioning record
   */
  async deletePreCommissioning(preCommissioningId: number): Promise<boolean> {
    return this.preCommissioningRepository.delete(preCommissioningId);
  }

  /**
   * Get eligible serial numbers for pre-commissioning
   */
  async getEligibleSerials(poId: string): Promise<EligibleSerialResponse[]> {
    const eligibleSerials = await this.preCommissioningRepository.findEligibleSerials(poId);
    return eligibleSerials.map((s) => ({
      dispatchId: s.dispatchId,
      serialNumber: s.serialNumber,
      productName: s.productName,
      dispatchDate: this.formatDate(s.dispatchDate),
    }));
  }

  /**
   * Get accordion status for pre-commissioning section
   */
  async getAccordionStatus(poId: string): Promise<PreCommissioningStatusResponse> {
    // Get eligible serials count
    const eligibleSerials = await this.preCommissioningRepository.findEligibleSerials(poId);
    const totalEligible = eligibleSerials.length;

    // Get pre-commissioning records for this PO
    const records = await this.preCommissioningRepository.findByPoId(poId);
    const completed = records.filter(
      (r) => r.preCommissioningStatus === PRE_COMMISSIONING_STATUS.DONE
    ).length;
    const pending = records.length - completed;

    // Calculate all serials that should have pre-commissioning
    const allSerialsCount = totalEligible + records.length;

    let status: 'Not Started' | 'In-Progress' | 'Done';
    if (records.length === 0) {
      status = ACCORDION_STATUS.NOT_STARTED;
    } else if (
      allSerialsCount > 0 &&
      records.length >= allSerialsCount &&
      completed === records.length
    ) {
      status = ACCORDION_STATUS.DONE;
    } else {
      status = ACCORDION_STATUS.IN_PROGRESS;
    }

    return {
      status,
      totalEligible: allSerialsCount,
      completed,
      pending,
    };
  }
}
