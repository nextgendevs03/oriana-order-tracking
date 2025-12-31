import React, { ReactNode } from "react";
import { usePermission, usePermissions, useAnyPermission } from "../hooks/usePermission";

/**
 * Props for the Cannot component
 */
interface CannotProps {
  /**
   * Single permission to check
   * Use this OR `permissions`, not both
   */
  permission?: string;

  /**
   * Multiple permissions to check
   * Use this OR `permission`, not both
   */
  permissions?: string[];

  /**
   * If true, user must have ALL permissions for content to be hidden
   * If false, user must have ANY of the permissions for content to be hidden
   * Only applies when using `permissions` prop
   * Default: false (ANY)
   */
  requireAll?: boolean;

  /**
   * Content to render if user does NOT have permission
   */
  children: ReactNode;
}

/**
 * Inverse of Can component - renders when user DOES NOT have permission
 *
 * Useful for showing messages or alternative content for unauthorized users.
 * This component renders its children when the user LACKS the specified permission(s).
 *
 * @example
 * // Show message when user cannot export
 * <Cannot permission="report_export">
 *   <Alert type="info">
 *     You don't have permission to export reports. Contact admin.
 *   </Alert>
 * </Cannot>
 *
 * @example
 * // Show upgrade prompt when user lacks premium features
 * <Cannot permissions={['premium_feature_a', 'premium_feature_b']} requireAll>
 *   <Card>
 *     <Text>Upgrade to access all premium features!</Text>
 *     <Button>Upgrade Now</Button>
 *   </Card>
 * </Cannot>
 *
 * @example
 * // Using permission constants (recommended)
 * import { PERMISSIONS } from '../constants/permissions';
 *
 * <Cannot permission={PERMISSIONS.PO_CREATE}>
 *   <Text type="secondary">You cannot create purchase orders.</Text>
 * </Cannot>
 */
const Cannot: React.FC<CannotProps> = ({
  permission,
  permissions,
  requireAll = false,
  children,
}) => {
  // Determine which check to use based on props
  const hasSinglePermission = usePermission(permission || "");
  const hasAllPermissions = usePermissions(permissions || []);
  const hasAnyPermissions = useAnyPermission(permissions || []);

  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions;
    } else {
      hasAccess = hasAnyPermissions;
    }
  }

  // Render when user does NOT have access
  if (!hasAccess) {
    return <>{children}</>;
  }

  return null;
};

export default Cannot;

