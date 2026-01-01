/**
 * Base API Configuration
 *
 * This file sets up the foundation for all RTK Query APIs.
 * It handles:
 * - Base URL configuration
 * - JWT token injection for authenticated requests
 * - Common headers
 * - Token expiry and unauthorized error handling
 *
 * All feature-specific APIs should use `baseApi.injectEndpoints()`
 * to add their endpoints.
 */

import {
  createApi,
  retry,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import { logout } from "../authSlice";

// API base URL - configure based on environment
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Flag to prevent multiple logout redirects
let isLoggingOut = false;

// Base query function
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,

  // Prepare headers for every request
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Set content type for JSON requests
    headers.set("Content-Type", "application/json");

    return headers;
  },
});

/**
 * Check if the error is an authentication error (401 or token expired)
 */
const isAuthError = (error: FetchBaseQueryError): boolean => {
  if (error.status === 401) return true;

  const errorData = error.data as { message?: string; error?: { message?: string } } | undefined;
  const errorMessage = errorData?.message?.toLowerCase() || "";
  const nestedErrorMessage = errorData?.error?.message?.toLowerCase() || "";

  return (
    errorMessage.includes("access token has expired") ||
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("token expired") ||
    nestedErrorMessage.includes("access token has expired")
  );
};

/**
 * Handle logout: clear tokens, dispatch logout action, and redirect
 */
const handleLogout = (
  api: { dispatch: (action: unknown) => void },
  errorMessage?: string
) => {
  // Prevent multiple logout attempts
  if (isLoggingOut) return;
  isLoggingOut = true;

  // Clear the auth token from session storage
  sessionStorage.removeItem("authToken");

  // Dispatch logout action to clear Redux state (including persisted state)
  api.dispatch(logout());

  // Also reset the API cache
  api.dispatch(baseApi.util.resetApiState());

  // Show error message
  message.error(
    errorMessage || "Your session has expired. Please login again.",
    3
  );

  // Redirect to login page after a short delay
  setTimeout(() => {
    isLoggingOut = false;
    window.location.href = "/";
  }, 500);
};

// Custom base query with error handling for token expiry
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // If already logging out, don't make any more requests
  if (isLoggingOut) {
    return {
      error: {
        status: 401,
        data: { message: "Session expired" },
      } as FetchBaseQueryError,
    };
  }

  const result = await baseQuery(args, api, extraOptions);

  // Check for authentication errors
  if (result.error && isAuthError(result.error)) {
    const errorData = result.error.data as { message?: string; error?: { message?: string } } | undefined;
    const errorMessage =
      errorData?.message ||
      errorData?.error?.message ||
      "Your session has expired. Please login again.";

    handleLogout(api, errorMessage);

    // Bail out of retries for auth errors
    retry.fail(result.error);
  }

  return result;
};

// Base query with automatic retry on failure (exponential backoff)
// Auth errors are handled in baseQueryWithErrorHandling and bail out of retries
// Retries disabled - set maxRetries to 0 to prevent automatic retries
const baseQueryWithRetry = retry(baseQueryWithErrorHandling, {
  maxRetries: 0,
});

export const baseApi = createApi({
  // Unique key in Redux store - all API data stored under this path
  reducerPath: "api",

  // Base query with retry logic
  baseQuery: baseQueryWithRetry,

  // Define all tag types used across APIs for cache invalidation
  // Add new tags here as you create new APIs
  tagTypes: [
    "PO", // Purchase Orders
    "POItem", // PO Line Items
    "Dispatch", // Dispatch Details
    "User", // Users
    "Role", // Roles
    "Permission", // Permissions
    "Category", // Categories
    "OEM", // OEMs
    "Product", // Products
    "Client", // Clients
    "File", // File uploads
  ],

  // Base endpoints - empty, will be extended by feature APIs
  endpoints: () => ({}),
});

// If user is authenticated, add JWT token
// Note: Adjust the path if you store token differently
// Currently using currentUser object - add 'token' field to User interface if needed
//const currentUser = state.auth.currentUser;

// Example: If you add a token field to your User interface
// const token = currentUser?.token;
// if (token) {
//   headers.set('Authorization', `Bearer ${token}`);
// }

// For now, using a placeholder - update when JWT is implemented
// You can also use sessionStorage/localStorage for token storage
