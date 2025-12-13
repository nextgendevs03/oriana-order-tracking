import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OEMUIState {
  selectedOEMId: string | null;
  searchText: string;
}

const initialState: OEMUIState = {
  selectedOEMId: null,
  searchText: "",
};

const oemSlice = createSlice({
  name: "oem",
  initialState,
  reducers: {
    setSelectedOEM(state, action: PayloadAction<string | null>) {
      state.selectedOEMId = action.payload;
    },

    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },

    resetOEMState(state) {
      state.selectedOEMId = null;
      state.searchText = "";
    },
  },
});

export const { setSelectedOEM, setSearchText, resetOEMState } =
  oemSlice.actions;

export default oemSlice.reducer;
