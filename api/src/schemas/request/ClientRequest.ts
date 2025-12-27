export interface CreateClientRequest {
  clientName: string;
  clientAddress?: string;
  clientContact?: string;
  clientGST?: string;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateClientRequest {
  clientName?: string;
  clientAddress?: string;
  clientContact?: string;
  clientGST?: string;
  isActive?: boolean;
  updatedBy: string;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListClientRequest extends BaseListRequest {
  isActive?: boolean;
}
