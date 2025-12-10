import { UserResponse } from './UserResponse';

export interface PermissionResponse {
  permissionId: string;
  permissionName: string;
  description: string | null;
  isActive: boolean;
}

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
