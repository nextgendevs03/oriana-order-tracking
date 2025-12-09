/**
 * API Barrel Export
 *
 * This file exports all API-related items from a single location.
 * Import from here instead of individual files for cleaner imports.
 *
 * Usage in components:
 * import { useGetPOsQuery, useCreatePOMutation } from '../store/api';
 */

// Base API (needed for store configuration)
export { baseApi } from './baseApi';

// PO API hooks and types
export {
  poApi,
  useGetPOsQuery,
  useGetPOByIdQuery,
  useLazyGetPOsQuery,
  useLazyGetPOByIdQuery,
  useCreatePOMutation,
  useUpdatePOMutation,
  useDeletePOMutation,
} from './poApi';

// Export types for use in components
export type {
  POItem,
  POResponse,
  ListPOParams,
  PaginatedResponse,
  CreatePORequest,
  UpdatePORequest,
} from './poApi';

// ============================================
// Add exports for new APIs below:
// ============================================

// Example: Dispatch API (when created)
// export {
//   dispatchApi,
//   useGetDispatchesQuery,
//   useGetDispatchByIdQuery,
//   useCreateDispatchMutation,
//   useUpdateDispatchMutation,
//   useDeleteDispatchMutation,
// } from './dispatchApi';
// export type {
//   DispatchResponse,
//   CreateDispatchRequest,
//   UpdateDispatchRequest,
// } from './dispatchApi';

// Example: User API (when created)
// export {
//   userApi,
//   useGetUsersQuery,
//   useGetUserByIdQuery,
//   useCreateUserMutation,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
// } from './userApi';
// export type {
//   UserResponse,
//   CreateUserRequest,
//   UpdateUserRequest,
// } from './userApi';

// Example: Admin API (when created)
// export {
//   adminApi,
//   useGetRolesQuery,
//   useGetPermissionsQuery,
//   useCreateRoleMutation,
//   useAssignPermissionsMutation,
// } from './adminApi';

export {
  permissionApi,
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from './permissionApi';
