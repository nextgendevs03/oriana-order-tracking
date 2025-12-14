export interface ProductResponse {
  productId: string;
  productName: string;
  category: {
    categoryId: string;
    categoryName: string;
  };
  oem: {
    oemName: string;
    oemId: string;
  };
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
