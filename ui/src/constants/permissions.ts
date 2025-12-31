/**
 * Permission Constants
 *
 * This file contains all permission codes used in the application.
 * These match the permission_code values in the database.
 *
 * Benefits:
 * 1. Avoid typos in permission strings
 * 2. Get autocomplete in IDE
 * 3. Single source of truth
 * 4. Easy to refactor if permission codes change
 *
 * @see api/docs/PERMISSION_LIST.MD for full descriptions
 */
export const PERMISSIONS = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCT MANAGEMENT
  // Covers: Products, OEM, Category, Client
  // ═══════════════════════════════════════════════════════════════════════════
  /** Permission to create products, OEM, Category, Client */
  PRODUCT_CREATE: "product_create",
  /** Permission to read products, OEM, Category, Client */
  PRODUCT_READ: "product_read",
  /** Permission to update products, OEM, Category, Client */
  PRODUCT_UPDATE: "product_update",
  /** Permission to delete products, OEM, Category, Client */
  PRODUCT_DELETE: "product_delete",

  // ═══════════════════════════════════════════════════════════════════════════
  // USER MANAGEMENT
  // Covers: Users, Roles, Permissions
  // ═══════════════════════════════════════════════════════════════════════════
  /** Permission to create users, roles and permissions */
  USERS_CREATE: "users_create",
  /** Permission to read users, roles and permissions */
  USERS_READ: "users_read",
  /** Permission to update users, roles and permissions */
  USERS_UPDATE: "users_update",
  /** Permission to delete users, roles and permissions */
  USERS_DELETE: "users_delete",
  /** Permission to view users, roles and permissions */
  USERS_VIEW: "users_view",

  // ═══════════════════════════════════════════════════════════════════════════
  // PO (PURCHASE ORDER) MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  /** Permission to create POs */
  PO_CREATE: "po_create",
  /** Permission to read POs */
  PO_READ: "po_read",
  /** Permission to update POs */
  PO_UPDATE: "po_update",
  /** Permission to delete POs */
  PO_DELETE: "po_delete",
  /** Permission to view pricing of own created POs only */
  PO_PRICING_VIEW_OWN: "po_pricing_view_own",
  /** Permission to view pricing of all POs (Admin only) */
  PO_PRICING_VIEW_ALL: "po_pricing_view_all",

  // ═══════════════════════════════════════════════════════════════════════════
  // DISPATCH MANAGEMENT
  // Covers: Dispatches, Delivery, Documents
  // ═══════════════════════════════════════════════════════════════════════════
  /** Permission to create Dispatches, Delivery and documents */
  DISPATCH_CREATE: "dispatch_create",
  /** Permission to read Dispatches, Delivery and documents */
  DISPATCH_READ: "dispatch_read",
  /** Permission to update Dispatches, Delivery and documents */
  DISPATCH_UPDATE: "dispatch_update",
  /** Permission to delete Dispatches, Delivery and documents */
  DISPATCH_DELETE: "dispatch_delete",

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMISSIONING MANAGEMENT
  // Covers: Pre-Commissioning, Commissioning, Warranty
  // ═══════════════════════════════════════════════════════════════════════════
  /** Permission to create Pre-Commissioning, Commissioning, and Warranty */
  COMMISSIONING_CREATE: "commissioning_create",
  /** Permission to read Pre-Commissioning, Commissioning, and Warranty */
  COMMISSIONING_READ: "commissioning_read",
  /** Permission to update Pre-Commissioning, Commissioning, and Warranty */
  COMMISSIONING_UPDATE: "commissioning_update",
  /** Permission to delete Pre-Commissioning, Commissioning, and Warranty */
  COMMISSIONING_DELETE: "commissioning_delete",
} as const;

/**
 * Type for permission values
 * Use this type when you need to accept a permission code as a parameter
 *
 * @example
 * function checkPermission(permission: Permission): boolean { ... }
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ═══════════════════════════════════════════════════════════════════════════════
// PERMISSION GROUPS (for convenience)
// ═══════════════════════════════════════════════════════════════════════════════

/** All product management permissions */
export const PRODUCT_PERMISSIONS = [
  PERMISSIONS.PRODUCT_CREATE,
  PERMISSIONS.PRODUCT_READ,
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.PRODUCT_DELETE,
] as const;

/** All user management permissions */
export const USERS_PERMISSIONS = [
  PERMISSIONS.USERS_CREATE,
  PERMISSIONS.USERS_READ,
  PERMISSIONS.USERS_UPDATE,
  PERMISSIONS.USERS_DELETE,
  PERMISSIONS.USERS_VIEW,
] as const;

/** All PO management permissions */
export const PO_PERMISSIONS = [
  PERMISSIONS.PO_CREATE,
  PERMISSIONS.PO_READ,
  PERMISSIONS.PO_UPDATE,
  PERMISSIONS.PO_DELETE,
  PERMISSIONS.PO_PRICING_VIEW_OWN,
  PERMISSIONS.PO_PRICING_VIEW_ALL,
] as const;

/** All dispatch management permissions */
export const DISPATCH_PERMISSIONS = [
  PERMISSIONS.DISPATCH_CREATE,
  PERMISSIONS.DISPATCH_READ,
  PERMISSIONS.DISPATCH_UPDATE,
  PERMISSIONS.DISPATCH_DELETE,
] as const;

/** All commissioning management permissions */
export const COMMISSIONING_PERMISSIONS = [
  PERMISSIONS.COMMISSIONING_CREATE,
  PERMISSIONS.COMMISSIONING_READ,
  PERMISSIONS.COMMISSIONING_UPDATE,
  PERMISSIONS.COMMISSIONING_DELETE,
] as const;

