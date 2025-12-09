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
  permissions: [
    {
      key: "1",
      name: "View Users",
      code: "user.view",
      module: "users",
      description: "Can view user list and details",
      roles: ["Super Admin", "Manager"],
    },
    {
      key: "2",
      name: "Create Users",
      code: "user.create",
      module: "users",
      description: "Can create new users",
      roles: ["Super Admin"],
    },
    {
      key: "3",
      name: "Edit Users",
      code: "user.edit",
      module: "users",
      description: "Can edit existing users",
      roles: ["Super Admin", "Manager"],
    },
    {
      key: "4",
      name: "Delete Users",
      code: "user.delete",
      module: "users",
      description: "Can delete users",
      roles: ["Super Admin"],
    },
  ],
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
