import { UserResponse } from './UserResponse';
import { PermissionResponse } from './PermissionResponse';
export interface RoleResponse {
  roleId: string;
  roleName: string;
  description: string | null;
  isActive: boolean;
  permissions?: PermissionResponse[];
  users?: UserResponse[];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleListResponse {
  items: RoleResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
