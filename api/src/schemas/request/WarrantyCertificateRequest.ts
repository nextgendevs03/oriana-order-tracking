/**
 * Warranty Certificate Request Schemas
 */

import { BaseListRequest } from './BaseListRequest';

/**
 * Warranty Certificate Item for bulk creation
 */
export interface WarrantyCertificateItemRequest {
  commissioningId: number;
}

/**
 * Create Warranty Certificate Request (Bulk)
 * Creates warranty certificate records for multiple commissioning entries
 */
export interface CreateWarrantyCertificateRequest {
  items: WarrantyCertificateItemRequest[];
  certificateNo: string;
  issueDate: string; // YYYY-MM-DD format
  warrantyStartDate: string; // YYYY-MM-DD format
  warrantyEndDate: string; // YYYY-MM-DD format
  warrantyStatus: string;
  fileIds?: number[]; // File IDs for warranty documents
}

/**
 * Update Warranty Certificate Request
 */
export interface UpdateWarrantyCertificateRequest {
  certificateNo?: string;
  issueDate?: string; // YYYY-MM-DD format
  warrantyStartDate?: string; // YYYY-MM-DD format
  warrantyEndDate?: string; // YYYY-MM-DD format
  warrantyStatus?: string;
  fileIds?: number[]; // File IDs for warranty documents
}

/**
 * List Warranty Certificate Request
 */
export interface ListWarrantyCertificateRequest extends BaseListRequest {
  commissioningId?: number;
  poId?: string;
  warrantyStatus?: string;
}
