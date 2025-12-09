import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleType } from "./api/roleApi";

interface RoleState {
  roleToEdit: RoleType | null;
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
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.roleToEdit = null;
    },
    setRoleToEdit: (state, action: PayloadAction<RoleType | null>) => {
      state.roleToEdit = action.payload;
      state.isModalOpen = true;
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
  setRoleToEdit,
  setSearchText,
  setPagination,
} = roleSlice.actions;
export default roleSlice.reducer;
