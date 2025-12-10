/**
 * Authentication API
 *
 * This file contains all API endpoints related to Authentication.
 * It extends the baseApi using `injectEndpoints`.
 *
 * Endpoints:
 * - login: Authenticate user with username and password
 */

import { baseApi } from "./baseApi";

// ============================================
// Type Definitions
// ============================================

/**
 * Login Request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login Response from API
 */
export interface LoginResponse {
  success: boolean;
  message: string;
}

// ============================================
// API Response Wrapper (matches backend format)
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ============================================
// Auth API Endpoints
// ============================================

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /login
     * Authenticate user with username and password
     *
     * @param credentials - Username and password
     * @returns Login response with success status and message
     *
     * Usage:
     * const [login, { isLoading }] = useLoginMutation();
     * await login({ username: 'user', password: 'pass' }).unwrap();
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // Transform the API response to match expected format
      transformResponse: (
        response: ApiResponse<LoginResponse> | LoginResponse
      ) => {
        // Handle both response formats
        if ("success" in response && "message" in response) {
          return response as LoginResponse;
        }
        // If wrapped in ApiResponse format
        return {
          success: response.success,
          message: response.message || "Login successful",
        };
      },
    }),
  }),

  // Don't override existing endpoints if they exist
  overrideExisting: false,
});

// ============================================
// Export Auto-Generated Hooks
// ============================================

export const {
  // Mutation hooks
  useLoginMutation,
} = authApi;
