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
  warranty: string;
}

export interface DispatchDetail {
  id: string;
  poId: string;
  product: string;
  projectName: string;
  projectLocation: string;
  deliveryLocation: string;
  deliveryAddress: string;
  googleMapLink: string;
  deliveryQuantity: number;
  confirmDispatchDate: string;
  deliveryContact: string;
  remarks: string;
  createdAt: string;
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
}

interface POState {
  poList: POData[];
  dispatchDetails: DispatchDetail[];
}

const initialState: POState = {
  poList: [],
  dispatchDetails: [],
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
  },
});

export const {
  addPO,
  updatePO,
  deletePO,
  addDispatchDetail,
  updateDispatchDetail,
  deleteDispatchDetail,
} = poSlice.actions;

export default poSlice.reducer;
