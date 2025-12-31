export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: string; // Role name (for backward compatibility)
  roleId?: number; // Role ID (foreign key)
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  username?: string;
  email?: string;
  password?: string;
  role?: string; // Role name (for backward compatibility)
  roleId?: number; // Role ID (foreign key)
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListUserRequest extends BaseListRequest {
  role?: string;
  status?: string;
}
