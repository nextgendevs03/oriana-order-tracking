import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface POItem {
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  gstPercent: number;
  finalPrice: number;
  warranty: string;
}

export interface DispatchedItem {
  product: string;
  quantity: number;
  serialNumbers?: string;
}

export interface DispatchDocument {
  uid: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface DispatchDetail {
  id: string;
  poId: string;
  dispatchedItems: DispatchedItem[];
  projectName: string;
  projectLocation: string;
  deliveryLocation: string;
  deliveryAddress: string;
  googleMapLink: string;
  confirmDispatchDate: string;
  deliveryContact: string;
  remarks: string;
  createdAt: string;
  // Document fields (flat)
  noDuesClearance?: string;
  docOsgPiNo?: string;
  docOsgPiDate?: string;
  taxInvoiceNumber?: string;
  invoiceDate?: string;
  ewayBill?: string;
  deliveryChallan?: string;
  dispatchDate?: string;
  packagingList?: string;
  dispatchFromLocation?: string;
  dispatchStatus?: string;
  dispatchLrNo?: string;
  dispatchRemarks?: string;
  dispatchDocuments?: DispatchDocument[];
  documentUpdatedAt?: string;
  // Delivery confirmation fields (flat)
  dateOfDelivery?: string;
  deliveryStatus?: string;
  proofOfDelivery?: string;
  deliveryDocuments?: DispatchDocument[];
  deliveryUpdatedAt?: string;
}

export interface PreCommissioning {
  id: string;
  poId: string;
  dispatchId: string;
  serialNumber: string;
  product: string;
  pcContact: string;
  serviceEngineerAssigned: string;
  ppmChecklist: string;
  ppmSheetReceivedFromClient: string;
  ppmChecklistSharedWithOem: string;
  ppmTickedNoFromOem: string;
  ppmConfirmationStatus: string;
  oemComments?: string;
  preCommissioningStatus: string;
  remarks: string;
  ppmDocuments?: DispatchDocument[];
  createdAt: string;
  // Commissioning fields (flat structure)
  commissioningEcdFromClient?: string;
  commissioningServiceTicketNo?: string;
  commissioningCcdFromClient?: string;
  commissioningIssues?: string;
  commissioningSolution?: string;
  commissioningInfoGenerated?: string;
  commissioningDate?: string;
  commissioningStatus?: string;
  commissioningRemarks?: string;
  commissioningDocuments?: DispatchDocument[];
  commissioningUpdatedAt?: string;
  // Warranty Certificate fields (flat structure)
  warrantyCertificateNo?: string;
  warrantyIssueDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  warrantyStatus?: string;
  warrantyDocuments?: DispatchDocument[];
  warrantyUpdatedAt?: string;
}

export interface PODocument {
  uid: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface POData {
  id: string;
  date: string;
  clientName: string;
  osgPiNo: number;
  osgPiDate: string;
  clientPoNo: number;
  clientPoDate: string;
  poStatus: string;
  noOfDispatch: string;
  assignDispatchTo: number;
  clientAddress: string;
  clientContact: string;
  poItems: POItem[];
  dispatchPlanDate: string;
  siteLocation: string;
  oscSupport: string;
  confirmDateOfDispatch: string;
  paymentStatus: string;
  remarks: string;
  createdAt: string;
  uploadedDocuments?: PODocument[];
}

export interface POState {
  poList: POData[];
  dispatchDetails: DispatchDetail[];
  preCommissioningDetails: PreCommissioning[];
}

const initialState: POState = {
  poList: [],
  dispatchDetails: [],
  preCommissioningDetails: [],
};

const poSlice = createSlice({
  name: "po",
  initialState,
  reducers: {
    addPO: (state, action: PayloadAction<POData>) => {
      state.poList.push(action.payload);
    },
    updatePO: (state, action: PayloadAction<POData>) => {
      const index = state.poList.findIndex((po) => po.id === action.payload.id);
      if (index !== -1) {
        state.poList[index] = action.payload;
      }
    },
    deletePO: (state, action: PayloadAction<string>) => {
      state.poList = state.poList.filter((po) => po.id !== action.payload);
    },
    addDispatchDetail: (state, action: PayloadAction<DispatchDetail>) => {
      state.dispatchDetails.push(action.payload);
    },
    updateDispatchDetail: (state, action: PayloadAction<DispatchDetail>) => {
      const index = state.dispatchDetails.findIndex(
        (dispatch) => dispatch.id === action.payload.id
      );
      if (index !== -1) {
        state.dispatchDetails[index] = action.payload;
      }
    },
    deleteDispatchDetail: (state, action: PayloadAction<string>) => {
      state.dispatchDetails = state.dispatchDetails.filter(
        (dispatch) => dispatch.id !== action.payload
      );
    },
    addPreCommissioning: (state, action: PayloadAction<PreCommissioning>) => {
      state.preCommissioningDetails.push(action.payload);
    },
    addMultiplePreCommissioning: (state, action: PayloadAction<PreCommissioning[]>) => {
      state.preCommissioningDetails.push(...action.payload);
    },
    updatePreCommissioning: (state, action: PayloadAction<PreCommissioning>) => {
      const index = state.preCommissioningDetails.findIndex(
        (pc) => pc.id === action.payload.id
      );
      if (index !== -1) {
        state.preCommissioningDetails[index] = action.payload;
      }
    },
    deletePreCommissioning: (state, action: PayloadAction<string>) => {
      state.preCommissioningDetails = state.preCommissioningDetails.filter(
        (pc) => pc.id !== action.payload
      );
    },
  },
});

export const {
  addPO,
  updatePO,
  deletePO,
  addDispatchDetail,
  updateDispatchDetail,
  deleteDispatchDetail,
  addPreCommissioning,
  addMultiplePreCommissioning,
  updatePreCommissioning,
  deletePreCommissioning,
} = poSlice.actions;
export default poSlice.reducer;
