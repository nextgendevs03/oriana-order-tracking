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
