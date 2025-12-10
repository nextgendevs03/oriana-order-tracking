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

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// API base URL - configure based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

/**
 * Base API slice with authentication
 *
 * This creates a single API instance that all feature APIs will extend.
 * Using a single base API ensures:
 * - One middleware instance
 * - Shared caching
 * - Consistent authentication
 */
export const baseApi = createApi({
  // Unique key in Redux store - all API data stored under this path
  reducerPath: 'api',

  // Base query configuration
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    // Prepare headers for every request
    prepareHeaders: (headers, { getState }) => {
      // Get current auth state
      const state = getState() as RootState;

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
      const token = sessionStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Set content type for JSON requests
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),

  // Define all tag types used across APIs for cache invalidation
  // Add new tags here as you create new APIs
  tagTypes: [
    'PO', // Purchase Orders
    'POItem', // PO Line Items
    'Dispatch', // Dispatch Details
    'User', // Users
    'Role', // Roles
    'Permission', // Permissions
  ],

  // Base endpoints - empty, will be extended by feature APIs
  endpoints: () => ({}),
});

