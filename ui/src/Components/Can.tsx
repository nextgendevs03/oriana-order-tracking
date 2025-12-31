import React, { ReactNode } from "react";
import { usePermission, usePermissions, useAnyPermission } from "../hooks/usePermission";

/**
 * Props for the Can component
 */
interface CanProps {
  /**
   * Single permission to check
   * Use this OR `permissions`, not both
   *
   * @example
   * <Can permission="users_create">
   *   <Button>Create User</Button>
   * </Can>
   */
  permission?: string;

  /**
   * Multiple permissions to check
   * Use this OR `permission`, not both
   *
   * @example
   * <Can permissions={['users_create', 'users_update']}>
   *   <Button>Modify User</Button>
   * </Can>
   */
  permissions?: string[];

  /**
   * If true, user must have ALL permissions
   * If false, user must have ANY of the permissions
   * Only applies when using `permissions` prop
   * Default: false (ANY)
   *
   * @example
   * // User must have BOTH permissions
   * <Can permissions={['users_create', 'users_delete']} requireAll>
   *   <Button>Full User Management</Button>
   * </Can>
   */
  requireAll?: boolean;

  /**
   * Content to render if user has permission
   */
  children: ReactNode;

  /**
   * Content to render if user does NOT have permission
   * If not provided, nothing is rendered
   *
   * @example
   * <Can permission="report_export" fallback={<Text>No export access</Text>}>
   *   <Button>Export Report</Button>
   * </Can>
   */
  fallback?: ReactNode;
}

/**
 * Permission-based conditional rendering component
 *
 * Renders children only if the user has the required permission(s).
 * This is a declarative alternative to using the usePermission hook.
 *
 * @example
 * // Single permission code
 * <Can permission="users_create">
 *   <Button>Create User</Button>
 * </Can>
 *
 * @example
 * // Multiple permission codes (ANY - default)
 * <Can permissions={['users_create', 'users_update']}>
 *   <Button>Modify User</Button>
 * </Can>
 *
 * @example
 * // Multiple permission codes (ALL required)
 * <Can permissions={['users_create', 'users_delete']} requireAll>
 *   <Button>Full User Management</Button>
 * </Can>
 *
 * @example
 * // With fallback
 * <Can permission="report_export" fallback={<Text>No export access</Text>}>
 *   <Button>Export Report</Button>
 * </Can>
 *
 * @example
 * // Using permission constants (recommended)
 * import { PERMISSIONS } from '../constants/permissions';
 *
 * <Can permission={PERMISSIONS.USERS_CREATE}>
 *   <Button>Create User</Button>
 * </Can>
 */
const Can: React.FC<CanProps> = ({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}) => {
  // Determine which check to use based on props
  const hasSinglePermission = usePermission(permission || "");
  const hasAllPermissions = usePermissions(permissions || []);
  const hasAnyPermissions = useAnyPermission(permissions || []);

  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasSinglePermission;
  } else if (permissions && permissions.length > 0) {
    // Multiple permissions check
    if (requireAll) {
      hasAccess = hasAllPermissions;
    } else {
      hasAccess = hasAnyPermissions;
    }
  } else {
    // No permission specified - deny by default
    if (process.env.NODE_ENV === "development") {
      console.warn("Can component used without permission or permissions prop");
    }
    hasAccess = false;
  }

  // Render based on access
  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default Can;

