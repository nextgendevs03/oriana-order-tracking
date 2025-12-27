export interface CreateCategoryRequest {
  categoryName: string;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateCategoryRequest {
  categoryName?: string;
  isActive?: boolean;
  updatedBy: string;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListCategoryRequest extends BaseListRequest {
  isActive?: boolean;
}
