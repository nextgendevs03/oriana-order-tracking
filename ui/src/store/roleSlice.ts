import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleResponse } from "@OrianaTypes";

interface RoleState {
  roleToEdit: RoleResponse | null;
  isModalOpen: boolean;
  searchText: string;
  currentPage: number;
  pageSize: number;
}

const initialState: RoleState = {
  roleToEdit: null,
  isModalOpen: false,
  searchText: "",
  currentPage: 1,
  pageSize: 10,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
      state.roleToEdit = null;
    },

    openModalForEdit: (state, action: PayloadAction<RoleResponse>) => {
      state.isModalOpen = true;
      state.roleToEdit = action.payload;
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.roleToEdit = null;
    },

    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },

    setPagination: (
      state,
      action: PayloadAction<{ page: number; pageSize: number }>
    ) => {
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.pageSize;
    },
  },
});

export const {
  openModal,
  closeModal,
  openModalForEdit,
  setSearchText,
  setPagination,
} = roleSlice.actions;

export default roleSlice.reducer;
