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

import { BaseListRequest } from './BaseListRequest';

export interface ListPermissionRequest extends BaseListRequest {
  isActive?: boolean;
}
