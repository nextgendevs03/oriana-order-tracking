import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryUIState {
  selectedCategoryId: string | null;
  searchText: string;
}

const initialState: CategoryUIState = {
  selectedCategoryId: null,
  searchText: "",
};

const categorySlice = createSlice({ 
  name: 'CategorySlice',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
    },

    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },

    resetCategoryState(state) {
      state.selectedCategoryId = null;
      state.searchText = "";
    },
  },
});

export const { setSelectedCategory, setSearchText, resetCategoryState } =
  categorySlice.actions;

export default categorySlice.reducer;
