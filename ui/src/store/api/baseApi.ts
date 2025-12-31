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
} from "@reduxjs/toolkit/query/react";
import { message } from "antd";

// API base URL - configure based on environment
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

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

// Custom base query with error handling for token expiry
const baseQueryWithErrorHandling: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized or token expiry errors
  if (result.error) {
    const errorStatus = result.error.status;
    const errorData = result.error.data as any;

    // Check if it's a 401 error or token expiry message
    if (
      errorStatus === 401 ||
      errorData?.message?.toLowerCase().includes("access token has expired") ||
      errorData?.message?.toLowerCase().includes("unauthorized") ||
      errorData?.message?.toLowerCase().includes("token expired") ||
      errorData?.error?.message
        ?.toLowerCase()
        .includes("access token has expired")
    ) {
      // Clear the auth token
      sessionStorage.removeItem("authToken");

      // Show error message using static message API
      // Note: Static methods work but may not have full ConfigProvider context
      // This is acceptable for error handling in API middleware
      message.error(
        errorData?.message ||
          errorData?.error?.message ||
          "Your session has expired. Please login again.",
        5 // 5 seconds duration
      );

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }

  return result;
};

// Base query with automatic retry on failure (3 retries with exponential backoff)
// Note: 401 errors are handled in baseQueryWithErrorHandling which redirects to login
// We use a lower maxRetries to avoid excessive retries on auth errors
const baseQueryWithRetry = retry(baseQueryWithErrorHandling, {
  maxRetries: 2, // Reduced from 3 to minimize retries on auth errors
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
