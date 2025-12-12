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

import { createApi } from '@reduxjs/toolkit/query/react';
import {fetchBaseQuery} from '@reduxjs/toolkit/query';
//import type { RootState } from '../index';

// API base URL - configure based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const baseApi = createApi({
  // Unique key in Redux store - all API data stored under this path
  reducerPath: 'api',

  // Base query configuration
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    // Prepare headers for every request
    prepareHeaders: (headers, { getState }) => {
  
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

