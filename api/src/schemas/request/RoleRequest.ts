export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: number[]; // Array of permission IDs to assign to this role
}

export interface UpdateRoleRequest {
  roleName?: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: number[]; // Array of permission IDs to sync with this role
}

import { BaseListRequest } from './BaseListRequest';

export interface ListRoleRequest extends BaseListRequest {
  isActive?: boolean;
}
