export interface POItemResponse {
  id: string;
  categoryId: string;
  categoryName?: string; // Resolved from relation
  oemId: string;
  oemName?: string; // Resolved from relation
  productId: string;
  productName?: string; // Resolved from relation
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  gstPercent: number;
  finalPrice: number;
  warranty: string;
  createdAt: string;
  updatedAt: string;
}

export interface POResponse {
  poId: string;
  poReceivedDate: string;
  clientId: string;
  clientName?: string; // Resolved from relation
  osgPiNo: string; // Alphanumeric
  osgPiDate: string;
  clientPoNo: string; // Alphanumeric
  clientPoDate: string;
  poStatus: string;
  noOfDispatch: string;
  assignDispatchTo: string | null;
  assignedUserName?: string | null; // Resolved from relation
  clientAddress: string;
  clientContact: string;
  poItems: POItemResponse[];
  dispatchPlanDate: string;
  siteLocation: string;
  oscSupport: string;
  confirmDateOfDispatch: string;
  paymentStatus: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface POListResponse {
  items: POResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeletePOResponse {
  poId: string;
  deleted: boolean;
}
