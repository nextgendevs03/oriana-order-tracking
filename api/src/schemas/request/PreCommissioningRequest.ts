/**
 * Pre-Commissioning Request Schemas
 */

import { BaseListRequest } from './BaseListRequest';

/**
 * Pre-Commissioning Item for bulk creation
 */
export interface PreCommissioningItemRequest {
  dispatchId: number;
  serialNumber: string;
  productName: string;
}

/**
 * Create Pre-Commissioning Request (Bulk)
 * Creates pre-commissioning records for multiple serial numbers
 */
export interface CreatePreCommissioningRequest {
  items: PreCommissioningItemRequest[];
  pcContact: string;
  serviceEngineerAssigned: string;
  ppmChecklist: string;
  ppmSheetReceivedFromClient: string;
  ppmChecklistSharedWithOem: string;
  ppmTickedNoFromOem: string;
  ppmConfirmationStatus: string;
  oemComments?: string;
  preCommissioningStatus: string;
  remarks?: string;
  fileIds?: number[]; // File IDs for PPM documents
}

/**
 * Update Pre-Commissioning Request
 */
export interface UpdatePreCommissioningRequest {
  pcContact?: string;
  serviceEngineerAssigned?: string;
  ppmChecklist?: string;
  ppmSheetReceivedFromClient?: string;
  ppmChecklistSharedWithOem?: string;
  ppmTickedNoFromOem?: string;
  ppmConfirmationStatus?: string;
  oemComments?: string;
  preCommissioningStatus?: string;
  remarks?: string;
  fileIds?: number[]; // File IDs for PPM documents
}

/**
 * List Pre-Commissioning Request
 */
export interface ListPreCommissioningRequest extends BaseListRequest {
  dispatchId?: number;
  poId?: string;
  preCommissioningStatus?: string;
  ppmConfirmationStatus?: string;
}
