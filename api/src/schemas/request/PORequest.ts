export interface POItemRequest {
  categoryId: string;
  oemId: string;
  productId: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  gstPercent: number;
  finalPrice: number;
  warranty: string;
}

export interface CreatePORequest {
  poReceivedDate: string;
  clientId: string;
  osgPiNo: string; // Alphanumeric
  osgPiDate: string;
  clientPoNo: string; // Alphanumeric
  clientPoDate: string;
  poStatus: string;
  noOfDispatch: string;
  assignDispatchTo?: string; // Optional - userId from users table
  clientAddress: string;
  clientContact: string;
  poItems: POItemRequest[];
  dispatchPlanDate: string;
  siteLocation: string;
  oscSupport: string;
  confirmDateOfDispatch: string;
  paymentStatus: string;
  remarks?: string;
}

export interface UpdatePORequest extends Partial<CreatePORequest> {
  poId: string;
}

export interface GetPOByIdRequest {
  poId: string;
}

export interface DeletePORequest {
  poId: string;
}

export interface ListPORequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  clientId?: string;
  poStatus?: string;
}
