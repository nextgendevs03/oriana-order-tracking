export interface CategoryResponse {
  categoryId: string;
  name: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
