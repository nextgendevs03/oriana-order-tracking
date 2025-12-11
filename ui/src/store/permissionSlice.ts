// src/store/permissionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Permission {
  key: string;
  name: string;
  code: string;
  module: string;
  description: string;
  roles: string[];
}

interface PermissionState {
  permissions: Permission[];
}

const initialState: PermissionState = {
  permissions: [],
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<Permission[]>) => {
      state.permissions = action.payload;
    },
    addPermission: (state, action: PayloadAction<Permission>) => {
      state.permissions.push(action.payload);
    },
    updatePermission: (state, action: PayloadAction<Permission>) => {
      const index = state.permissions.findIndex(
        (p) => p.key === action.payload.key
      );
      if (index !== -1) state.permissions[index] = action.payload;
    },
    deletePermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter(
        (p) => p.key !== action.payload
      );
    },
  },
});

export const { setPermissions, addPermission, updatePermission, deletePermission } =
  permissionSlice.actions;
export default permissionSlice.reducer;
