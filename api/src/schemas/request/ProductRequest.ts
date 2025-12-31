export interface CreateProductRequest {
  productName: string;
  categoryId: number;
  oemId: number;
  isActive: boolean;
  createdBy?: string;
}

export interface UpdateProductRequest {
  productName?: string;
  categoryId?: number;
  oemId?: number;
  isActive?: boolean;
  updatedBy?: string;
}

import { BaseListRequest } from './BaseListRequest';

export interface ListProductRequest extends BaseListRequest {
  isActive?: boolean;
  categoryId?: number | string;
  oemId?: number | string;
}
