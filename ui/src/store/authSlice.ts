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
      state.isLoggedIn = false;
    },

    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});
// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Select auth state
 */
export const selectAuth = (state: RootState) => state.auth.auth;

/**
 * Select isLoggedIn state
 */
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

/**
 * Select all permissions (permission codes)
 */
export const selectPermissions = (state: RootState): string[] =>
  state.auth.auth.permissions || [];

/**
 * Check if user has a specific permission code
 *
 * @example
 * const canCreate = useAppSelector((state) => selectHasPermission(state, 'users_create'));
 */
export const selectHasPermission = (
  state: RootState,
  permissionCode: string
): boolean => {
  const permissions = state.auth.auth.permissions || [];
  return permissions.includes(permissionCode);
};

/**
 * Check if user has ALL of the specified permission codes
 *
 * @example
 * const canManage = useAppSelector((state) => selectHasAllPermissions(state, ['users_create', 'users_delete']));
 */
export const selectHasAllPermissions = (
  state: RootState,
  permissionCodes: string[]
): boolean => {
  const permissions = state.auth.auth.permissions || [];
  return permissionCodes.every((code) => permissions.includes(code));
};

/**
 * Check if user has ANY of the specified permission codes
 *
 * @example
 * const canModify = useAppSelector((state) => selectHasAnyPermission(state, ['users_create', 'users_update']));
 */
export const selectHasAnyPermission = (
  state: RootState,
  permissionCodes: string[]
): boolean => {
  const permissions = state.auth.auth.permissions || [];
  return permissionCodes.some((code) => permissions.includes(code));
};

// ============================================================================
// ACTIONS & REDUCER EXPORT
// ============================================================================

export const { addAuth, logout, setIsLoggedIn } = authSlice.actions;
export default authSlice.reducer;
