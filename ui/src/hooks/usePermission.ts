import { useAppSelector } from "../store/hooks";
import {
  selectPermissions,
  selectHasPermission,
  selectHasAllPermissions,
  selectHasAnyPermission,
} from "../store/authSlice";
import { RootState } from "../store";

/**
 * Hook to check a single permission code
 *
 * @param permissionCode - The permission code to check (e.g., 'users_create')
 * @returns boolean - Whether the user has the permission
 *
 * @example
 * import { usePermission } from '../hooks/usePermission';
 * import { PERMISSIONS } from '../constants/permissions';
 *
 * const UserActions = () => {
 *   const canCreate = usePermission(PERMISSIONS.USERS_CREATE);
 *   const canDelete = usePermission(PERMISSIONS.USERS_DELETE);
 *
 *   return (
 *     <div>
 *       {canCreate && <Button>Create User</Button>}
 *       {canDelete && <Button danger>Delete User</Button>}
 *     </div>
 *   );
 * };
 */
export function usePermission(permissionCode: string): boolean {
  return useAppSelector((state: RootState) =>
    selectHasPermission(state, permissionCode)
  );
}

/**
 * Hook to check multiple permission codes (ALL required)
 *
 * @param permissionCodes - Array of permission codes that ALL must be present
 * @returns boolean - Whether the user has ALL permission codes
 *
 * @example
 * import { usePermissions } from '../hooks/usePermission';
 * import { PERMISSIONS } from '../constants/permissions';
 *
 * const canFullyManageUsers = usePermissions([
 *   PERMISSIONS.USERS_CREATE,
 *   PERMISSIONS.USERS_UPDATE,
 *   PERMISSIONS.USERS_DELETE
 * ]);
 */
export function usePermissions(permissionCodes: string[]): boolean {
  return useAppSelector((state: RootState) =>
    selectHasAllPermissions(state, permissionCodes)
  );
}

/**
 * Hook to check multiple permission codes (ANY required)
 *
 * @param permissionCodes - Array of permission codes where at least ONE must be present
 * @returns boolean - Whether the user has ANY of the permission codes
 *
 * @example
 * import { useAnyPermission } from '../hooks/usePermission';
 * import { PERMISSIONS } from '../constants/permissions';
 *
 * const canModifyUsers = useAnyPermission([
 *   PERMISSIONS.USERS_CREATE,
 *   PERMISSIONS.USERS_UPDATE
 * ]);
 */
export function useAnyPermission(permissionCodes: string[]): boolean {
  return useAppSelector((state: RootState) =>
    selectHasAnyPermission(state, permissionCodes)
  );
}

/**
 * Hook to get all user permission codes
 *
 * @returns string[] - Array of all permission codes the user has
 *
 * @example
 * const allPermissions = useAllPermissions();
 * console.log('User has permissions:', allPermissions);
 */
export function useAllPermissions(): string[] {
  return useAppSelector(selectPermissions);
}

/**
 * Comprehensive permission hook with all utilities
 *
 * Returns an object with:
 * - permissions: Array of all permission codes
 * - hasPermission: Function to check a single permission
 * - hasAll: Function to check if user has ALL specified permissions
 * - hasAny: Function to check if user has ANY of specified permissions
 *
 * @example
 * import { usePermissionUtils } from '../hooks/usePermission';
 * import { PERMISSIONS } from '../constants/permissions';
 *
 * const UserComponent = () => {
 *   const { hasPermission, hasAll, hasAny, permissions } = usePermissionUtils();
 *
 *   if (hasPermission(PERMISSIONS.USERS_CREATE)) {
 *     // User can create users
 *   }
 *
 *   if (hasAll([PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_DELETE])) {
 *     // User can fully manage users
 *   }
 *
 *   if (hasAny([PERMISSIONS.USERS_READ, PERMISSIONS.USERS_VIEW])) {
 *     // User can view users
 *   }
 *
 *   console.log('All permissions:', permissions);
 * };
 */
export function usePermissionUtils() {
  const permissions = useAppSelector(selectPermissions);

  return {
    /** All permission codes the user has */
    permissions,

    /** Check if user has a specific permission code */
    hasPermission: (permissionCode: string): boolean =>
      permissions.includes(permissionCode),

    /** Check if user has ALL specified permission codes */
    hasAll: (codes: string[]): boolean =>
      codes.every((code) => permissions.includes(code)),

    /** Check if user has ANY of the specified permission codes */
    hasAny: (codes: string[]): boolean =>
      codes.some((code) => permissions.includes(code)),
  };
}

