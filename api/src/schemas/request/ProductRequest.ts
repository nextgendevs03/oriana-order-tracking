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

export interface ListProductRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  name?: string;
  isActive?: boolean;
  categoryId?: string;
  oemId?: string;
}
