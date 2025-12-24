/**
 * Base API Configuration
 *
 * This file sets up the foundation for all RTK Query APIs.
 * It handles:
 * - Base URL configuration
 * - JWT token injection for authenticated requests
 * - Common headers
 *
 * All feature-specific APIs should use `baseApi.injectEndpoints()`
 * to add their endpoints.
 */

import { createApi, retry } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// API base URL - configure based on environment
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Base query with automatic retry on failure (3 retries with exponential backoff)
const baseQueryWithRetry = retry(
  fetchBaseQuery({
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
  }),
  { maxRetries: 3 } // Retry up to 3 times on failure
);

export const baseApi = createApi({
  // Unique key in Redux store - all API data stored under this path
  reducerPath: "api",

  // Base query with retry logic
  baseQuery: baseQueryWithRetry,

  // Define all tag types used across APIs for cache invalidation
  // Add new tags here as you create new APIs
  tagTypes: [
    'PO', // Purchase Orders
    'POItem', // PO Line Items
    'Dispatch', // Dispatch Details
    'User', // Users
    'Role', // Roles
    'Permission', // Permissions
    'Category', // Categories
    'OEM', // OEMs
    'Product', // Products
    'Client', // Clients
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
