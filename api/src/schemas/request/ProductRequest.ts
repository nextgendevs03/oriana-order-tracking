export interface CreateProductRequest {
  productName: string;
  categoryId: string;
  oemId: string;
  isActive: boolean;
  createdBy?: string;
}

export interface UpdateProductRequest {
  productName?: string;
  categoryId?: string;
  oemId?: string;
  isActive?: boolean;
  updatedBy?: string;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListProductRequest extends BaseListRequest {
  isActive?: boolean;
  categoryId?: string;
  oemId?: string;
}
