export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  roleName?: string;
  description?: string;
  isActive?: boolean;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListRoleRequest extends BaseListRequest {
  isActive?: boolean;
}
