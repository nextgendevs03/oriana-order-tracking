export interface POItemRequest {
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  warranty: string;
}

export interface CreatePORequest {
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
  poItems: POItemRequest[];
  dispatchPlanDate: string;
  siteLocation: string;
  oscSupport: string;
  confirmDateOfDispatch: string;
  paymentStatus: string;
  remarks?: string;
}

export interface UpdatePORequest extends Partial<CreatePORequest> {
  id: string;
}

export interface GetPOByIdRequest {
  id: string;
}

export interface DeletePORequest {
  id: string;
}

export interface ListPORequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  clientName?: string;
  poStatus?: string;
}
