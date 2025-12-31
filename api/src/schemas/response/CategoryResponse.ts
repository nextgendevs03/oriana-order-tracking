export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface CategoryListResponse {
  data: CategoryResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
