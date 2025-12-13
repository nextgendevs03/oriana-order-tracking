export interface ProductResponse {
  productId: string;
  name: string;
  category: string;
  oem: string;
  status: 'Active' | 'Inactive';
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
