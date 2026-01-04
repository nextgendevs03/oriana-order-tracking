/**
 * Commissioning Request Schemas
 */

import { BaseListRequest } from './BaseListRequest';

/**
 * Commissioning Item for bulk creation
 */
export interface CommissioningItemRequest {
  preCommissioningId: number;
}

/**
 * Create Commissioning Request (Bulk)
 * Creates commissioning records for multiple pre-commissioning entries
 */
export interface CreateCommissioningRequest {
  items: CommissioningItemRequest[];
  ecdFromClient?: string;
  serviceTicketNo?: string;
  ccdFromClient?: string;
  issues?: string;
  solution?: string;
  infoGenerated?: string;
  commissioningDate?: string; // YYYY-MM-DD format
  commissioningStatus: string;
  remarks?: string;
  fileIds?: number[]; // File IDs for commissioning documents
}

/**
 * Update Commissioning Request
 */
export interface UpdateCommissioningRequest {
  ecdFromClient?: string;
  serviceTicketNo?: string;
  ccdFromClient?: string;
  issues?: string;
  solution?: string;
  infoGenerated?: string;
  commissioningDate?: string; // YYYY-MM-DD format
  commissioningStatus?: string;
  remarks?: string;
  fileIds?: number[]; // File IDs for commissioning documents
}

/**
 * List Commissioning Request
 */
export interface ListCommissioningRequest extends BaseListRequest {
  preCommissioningId?: number;
  poId?: string;
  commissioningStatus?: string;
}
