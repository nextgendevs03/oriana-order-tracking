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
