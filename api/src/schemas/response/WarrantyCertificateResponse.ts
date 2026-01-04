/**
 * Warranty Certificate Response Schemas
 */

import { FileUploadResponse } from './FileResponse';

/**
 * Warranty Certificate Response
 */
export interface WarrantyCertificateResponse {
  warrantyCertificateId: number;
  commissioningId: number;

  // Related Commissioning/Pre-Commissioning data
  serialNumber?: string;
  productName?: string;
  dispatchId?: number;
  preCommissioningId?: number;
  poId?: string;

  // Warranty Certificate Details
  certificateNo: string;
  issueDate: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyStatus: string;

  // Related data
  files?: FileUploadResponse[];

  // Audit Fields
  createdById?: number;
  createdBy?: string;
  updatedById?: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Warranty Certificate List Response
 */
export interface WarrantyCertificateListResponse {
  data: WarrantyCertificateResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Delete Warranty Certificate Response
 */
export interface DeleteWarrantyCertificateResponse {
  warrantyCertificateId: number;
  deleted: boolean;
}

/**
 * Eligible Commissioning for Warranty Certificate
 */
export interface EligibleCommissioningResponse {
  commissioningId: number;
  preCommissioningId: number;
  serialNumber: string;
  productName: string;
  dispatchId: number;
  commissioningStatus: string;
  commissioningDate?: string;
}

/**
 * Warranty Certificate Accordion Status Response
 */
export interface WarrantyCertificateStatusResponse {
  status: 'Not Started' | 'In-Progress' | 'Done';
  totalEligible: number;
  completed: number;
  pending: number;
}
