/**
 * Commissioning Response Schemas
 */

import { FileUploadResponse } from './FileResponse';

/**
 * Commissioning Response
 */
export interface CommissioningResponse {
  commissioningId: number;
  preCommissioningId: number;

  // Related Pre-Commissioning data
  serialNumber?: string;
  productName?: string;
  dispatchId?: number;
  poId?: string;

  // Commissioning Details
  ecdFromClient?: string;
  serviceTicketNo?: string;
  ccdFromClient?: string;
  issues?: string;
  solution?: string;
  infoGenerated?: string;
  commissioningDate?: string;
  commissioningStatus: string;
  remarks?: string;

  // Related data
  files?: FileUploadResponse[];

  // Flags for eligibility
  hasWarrantyCertificate?: boolean;

  // Audit Fields
  createdById?: number;
  createdBy?: string;
  updatedById?: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Commissioning List Response
 */
export interface CommissioningListResponse {
  data: CommissioningResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Delete Commissioning Response
 */
export interface DeleteCommissioningResponse {
  commissioningId: number;
  deleted: boolean;
}

/**
 * Eligible Pre-Commissioning for Commissioning
 */
export interface EligiblePreCommissioningResponse {
  preCommissioningId: number;
  serialNumber: string;
  productName: string;
  dispatchId: number;
  preCommissioningStatus: string;
}

/**
 * Commissioning Accordion Status Response
 */
export interface CommissioningStatusResponse {
  status: 'Not Started' | 'In-Progress' | 'Done';
  totalEligible: number;
  completed: number;
  pending: number;
}
