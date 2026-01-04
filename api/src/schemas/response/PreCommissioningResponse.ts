/**
 * Pre-Commissioning Response Schemas
 */

import { FileUploadResponse } from './FileResponse';

/**
 * Pre-Commissioning Response
 */
export interface PreCommissioningResponse {
  preCommissioningId: number;
  dispatchId: number;
  serialNumber: string;
  productName: string;

  // Pre-Commissioning Details
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

  // Related data
  poId?: string;
  files?: FileUploadResponse[];

  // Flags for eligibility
  hasCommissioning?: boolean;

  // Audit Fields
  createdById?: number;
  createdBy?: string;
  updatedById?: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pre-Commissioning List Response
 */
export interface PreCommissioningListResponse {
  data: PreCommissioningResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Delete Pre-Commissioning Response
 */
export interface DeletePreCommissioningResponse {
  preCommissioningId: number;
  deleted: boolean;
}

/**
 * Eligible Serial Number for Pre-Commissioning
 */
export interface EligibleSerialResponse {
  dispatchId: number;
  serialNumber: string;
  productName: string;
  dispatchDate?: string;
}

/**
 * Pre-Commissioning Accordion Status Response
 */
export interface PreCommissioningStatusResponse {
  status: 'Not Started' | 'In-Progress' | 'Done';
  totalEligible: number;
  completed: number;
  pending: number;
}
