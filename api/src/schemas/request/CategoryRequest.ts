export interface CreateCategoryRequest {
  name: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  status?: 'Active' | 'Inactive';
  updatedBy: string;
}
