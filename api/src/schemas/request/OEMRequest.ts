export interface CreateOEMRequest {
  name: string;
  isActive: boolean;
  createdBy?: string;
}

export interface UpdateOEMRequest {
  name?: string;
  isActive?: boolean;
  updatedBy?: string;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListOEMRequest extends BaseListRequest {
  isActive?: boolean;
}
