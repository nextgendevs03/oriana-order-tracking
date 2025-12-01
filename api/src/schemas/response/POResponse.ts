export interface POItemResponse {
  id: string;
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  warranty: string;
  createdAt: string;
  updatedAt: string;
}

export interface POResponse {
  id: string;
  date: string;
  clientName: string;
  osgPiNo: number;
  osgPiDate: string;
  clientPoNo: number;
  clientPoDate: string;
  poStatus: string;
  noOfDispatch: string;
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
  id: string;
  deleted: boolean;
}
