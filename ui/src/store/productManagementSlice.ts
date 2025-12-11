import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

// Types
export interface Category {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export interface OEM {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  oemId: string;
  status: "active" | "inactive";
}

export interface ProductManagementState {
  categories: Category[];
  oems: OEM[];
  products: Product[];
}

const initialState: ProductManagementState = {
  categories: [],
  oems: [],
  products: [],
};

const productManagementSlice = createSlice({
  name: "productManagement",
  initialState,
  reducers: {
    // Category actions
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },

    // OEM actions
    addOEM: (state, action: PayloadAction<OEM>) => {
      state.oems.push(action.payload);
    },
    updateOEM: (state, action: PayloadAction<OEM>) => {
      const index = state.oems.findIndex((oem) => oem.id === action.payload.id);
      if (index !== -1) {
        state.oems[index] = action.payload;
      }
    },

    // Product actions
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

// Selectors
export const selectCategories = (state: RootState) =>
  state.productManagement.categories;
export const selectOEMs = (state: RootState) => state.productManagement.oems;
export const selectProducts = (state: RootState) =>
  state.productManagement.products;

// Export actions
export const {
  addCategory,
  updateCategory,
  addOEM,
  updateOEM,
  addProduct,
  updateProduct,
} = productManagementSlice.actions;

export default productManagementSlice.reducer;

