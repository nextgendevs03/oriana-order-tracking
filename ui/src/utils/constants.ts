/**
 * Form Constants
 * 
 * Common dropdown options and form constants used across multiple components.
 * Centralized location for maintaining all form-related constants.
 */

/**
 * PO Status Options
 */
export const poStatusOptions = [
  { value: "po_received", label: "PO received" },
  { value: "po_confirmed_phone", label: "PO confirmed on Phone" },
  { value: "on_call", label: "on Call" },
  { value: "on_mail", label: "on Mail" },
];

/**
 * Dispatch Type Options
 */
export const dispatchOptions = [
  { value: "single", label: "Single" },
  { value: "multiple", label: "Multiple" },
];

/**
 * Assign Dispatch To Options
 */
export const assignDispatchToOptions = [
  { value: 1, label: "Aman" },
  { value: 2, label: "Rahul" },
];

/**
 * OSC Support Options
 */
export const oscSupportOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Maybe" },
];

/**
 * Payment Status Options
 */
export const paymentStatusOptions = [
  { value: "advanced", label: "Advanced" },
  { value: "received", label: "Received" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "15_dc", label: "15 DC" },
  { value: "30_dc", label: "30 DC" },
  { value: "45_dc", label: "45 DC" },
  { value: "60_dc", label: "60 DC" },
  { value: "15_lc", label: "15 LC" },
  { value: "30_lc", label: "30 LC" },
  { value: "45_lc", label: "45 LC" },
  { value: "60_lc", label: "60 LC" },
];

/**
 * Warranty Options
 */
export const warrantyOptions = [
  { value: "3_years", label: "3 Years" },
  { value: "5_years", label: "5 Years" },
  { value: "7_years", label: "7 Years" },
];

/**
 * GST Percent Options
 */
export const gstPercentOptions = [
  { value: 5, label: "5%" },
  { value: 9, label: "9%" },
  { value: 15, label: "15%" },
  { value: 18, label: "18%" },
];

/**
 * Commissioning Status Options
 */
export const commissioningStatusOptions = [
  { value: "Done", label: "Done" },
  { value: "Pending", label: "Pending" },
  { value: "Hold", label: "Hold" },
  { value: "Cancelled", label: "Cancelled" },
];

/**
 * Warranty Status Options
 */
export const warrantyStatusOptions = [
  { value: "Done", label: "Done" },
  { value: "Pending", label: "Pending" },
  { value: "Hold", label: "Hold" },
  { value: "Cancelled", label: "Cancelled" },
];

/**
 * Delivery Status Options
 */
export const deliveryStatusOptions = [
  { value: "done", label: "Done" },
  { value: "pending", label: "Pending" },
  { value: "hold", label: "Hold" },
  { value: "cancelled", label: "Cancelled" },
];

/**
 * No Dues Clearance Options
 */
export const noDuesClearanceOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
];

/**
 * Dispatch Status Options
 */
export const dispatchStatusOptions = [
  { value: "done", label: "Done" },
  { value: "pending", label: "Pending" },
  { value: "hold", label: "Hold" },
  { value: "cancelled", label: "Cancelled" },
];
