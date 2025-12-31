import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Auth {
  username: string;
  email?: string;
  roleName?: string | null;
  roleId?: number | null;
  permissions?: string[];
}

export interface AuthState {
  auth: Auth;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  auth: {
    username: "",
    email: "",
    roleName: null,
    roleId: null,
    permissions: [],
  },
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload;
    },

    logout: (state) => {
      state.auth = {
        username: "",
        email: "",
        roleName: null,
        roleId: null,
        permissions: [],
      };
    },

    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});
export const selectAuth = (state: RootState) => state.auth.auth;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export const { addAuth, logout, setIsLoggedIn } = authSlice.actions;
export default authSlice.reducer;
