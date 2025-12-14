/**
 * Controllers Index
 *
 * Export all controllers from this file.
 * The manifest generator auto-imports from here to discover routes.
 *
 * When creating a new controller:
 * 1. Create the controller file (e.g., DispatchController.ts)
 * 2. Add export here: export * from './DispatchController';
 *
 * The @Controller decorator automatically registers routes when imported.
 */

// Purchase Order Controller
export * from './POController';
export * from './UserController';
export * from './AuthController';

// User Managment Controller
// Add new controller exports below:
// export * from './DispatchController';
// export * from './DeliveryController';
// export * from './InventoryController';

//export * from './RolePermissioncontroller';

// export * from './PermissionController';
export * from './PermissionController';
// Role Controller
export * from './RoleController';
// Category Controller
export * from './CategoryController';
// OEM Controller
export * from './OEMController';
// Product Controller
export * from './ProductController';
// Client Controller
export * from './ClientController';
