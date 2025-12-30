export interface CreatePermissionRequest {
  permissionCode: string;
  permissionName: string;
  description?: string;
  createdBy: string;
  isActive?: boolean;
}

export interface UpdatePermissionRequest {
  permissionCode?: string;
  permissionName?: string;
  description?: string;
  updatedBy: string;
  isActive?: boolean;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListPermissionRequest extends BaseListRequest {
  isActive?: boolean;
}
