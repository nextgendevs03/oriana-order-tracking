export interface CreateProductRequest {
  name: string;
  category: string;
  oem: string;
  status: 'Active' | 'Inactive';
  createdBy?: string;
}

export interface UpdateProductRequest {
  name?: string;
  category?: string;
  oem?: string;
  status?: 'Active' | 'Inactive';
  updatedBy?: string;
}
