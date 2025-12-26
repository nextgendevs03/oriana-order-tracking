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

export interface ListCategoryRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  categoryName?: string;
  isActive?: boolean;
}
