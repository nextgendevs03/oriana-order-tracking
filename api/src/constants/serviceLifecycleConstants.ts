/**
 * Service Lifecycle Constants
 *
 * Status enums and options for Pre-Commissioning, Commissioning, and Warranty Certificate
 */

// ============================================================================
// PPM CONFIRMATION STATUS
// ============================================================================

export const PPM_CONFIRMATION_STATUS = {
  DONE: 'Done',
  PENDING: 'Pending',
  HOLD: 'Hold',
  CANCELLED: 'Cancelled',
} as const;

export type PpmConfirmationStatus =
  (typeof PPM_CONFIRMATION_STATUS)[keyof typeof PPM_CONFIRMATION_STATUS];

export const PPM_CONFIRMATION_STATUS_OPTIONS = [
  { value: PPM_CONFIRMATION_STATUS.DONE, label: 'Done' },
  { value: PPM_CONFIRMATION_STATUS.PENDING, label: 'Pending' },
  { value: PPM_CONFIRMATION_STATUS.HOLD, label: 'Hold' },
  { value: PPM_CONFIRMATION_STATUS.CANCELLED, label: 'Cancelled' },
];

// ============================================================================
// PRE-COMMISSIONING STATUS
// ============================================================================

export const PRE_COMMISSIONING_STATUS = {
  DONE: 'Done',
  PENDING: 'Pending',
  HOLD: 'Hold',
  CANCELLED: 'Cancelled',
} as const;

export type PreCommissioningStatus =
  (typeof PRE_COMMISSIONING_STATUS)[keyof typeof PRE_COMMISSIONING_STATUS];

export const PRE_COMMISSIONING_STATUS_OPTIONS = [
  { value: PRE_COMMISSIONING_STATUS.DONE, label: 'Done' },
  { value: PRE_COMMISSIONING_STATUS.PENDING, label: 'Pending' },
  { value: PRE_COMMISSIONING_STATUS.HOLD, label: 'Hold' },
  { value: PRE_COMMISSIONING_STATUS.CANCELLED, label: 'Cancelled' },
];

// ============================================================================
// COMMISSIONING STATUS
// ============================================================================

export const COMMISSIONING_STATUS = {
  DONE: 'Done',
  PENDING: 'Pending',
  HOLD: 'Hold',
  CANCELLED: 'Cancelled',
} as const;

export type CommissioningStatus = (typeof COMMISSIONING_STATUS)[keyof typeof COMMISSIONING_STATUS];

export const COMMISSIONING_STATUS_OPTIONS = [
  { value: COMMISSIONING_STATUS.DONE, label: 'Done' },
  { value: COMMISSIONING_STATUS.PENDING, label: 'Pending' },
  { value: COMMISSIONING_STATUS.HOLD, label: 'Hold' },
  { value: COMMISSIONING_STATUS.CANCELLED, label: 'Cancelled' },
];

// ============================================================================
// WARRANTY STATUS
// ============================================================================

export const WARRANTY_STATUS = {
  DONE: 'Done',
  PENDING: 'Pending',
  HOLD: 'Hold',
  CANCELLED: 'Cancelled',
} as const;

export type WarrantyStatus = (typeof WARRANTY_STATUS)[keyof typeof WARRANTY_STATUS];

export const WARRANTY_STATUS_OPTIONS = [
  { value: WARRANTY_STATUS.DONE, label: 'Done' },
  { value: WARRANTY_STATUS.PENDING, label: 'Pending' },
  { value: WARRANTY_STATUS.HOLD, label: 'Hold' },
  { value: WARRANTY_STATUS.CANCELLED, label: 'Cancelled' },
];

// ============================================================================
// ACCORDION STATUS (Computed aggregate status for UI)
// ============================================================================

export const ACCORDION_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In-Progress',
  DONE: 'Done',
} as const;

export type AccordionStatus = (typeof ACCORDION_STATUS)[keyof typeof ACCORDION_STATUS];

// ============================================================================
// ENTITY TYPES FOR FILE UPLOADS
// ============================================================================

export const SERVICE_LIFECYCLE_ENTITY_TYPES = {
  PRE_COMMISSIONING: 'pre_commissioning',
  COMMISSIONING: 'commissioning',
  WARRANTY_CERTIFICATE: 'warranty_certificate',
} as const;

export type ServiceLifecycleEntityType =
  (typeof SERVICE_LIFECYCLE_ENTITY_TYPES)[keyof typeof SERVICE_LIFECYCLE_ENTITY_TYPES];
