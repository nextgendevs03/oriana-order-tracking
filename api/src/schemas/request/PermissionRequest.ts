export interface CreatePermissionRequest {
  permissionName: string;
  description?: string;
  createdBy: string;
  isActive?: boolean;
}

export interface UpdatePermissionRequest {
  permissionName?: string;
  description?: string;
  updatedBy: string;
  isActive?: boolean;
}

export interface ListPermissionRequest {
  page?: number;
  limit?: number;
  isActive?: boolean;
}
