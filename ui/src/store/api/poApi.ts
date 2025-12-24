/**
 * Purchase Order API
 *
 * This file contains all API endpoints related to Purchase Orders.
 * It extends the baseApi using `injectEndpoints`.
 *
 * Endpoints:
 * - getPOs: Fetch list of POs with pagination and filters
 * - getPOById: Fetch a single PO by ID
 * - createPO: Create a new PO
 * - updatePO: Update an existing PO
 * - deletePO: Delete a PO
 */

import { baseApi } from './baseApi';
import {
  CreatePORequest,
  UpdatePORequest,
  ListPORequest,
  POResponse,
  POListResponse,
} from '@OrianaTypes';

// Re-export types for convenience
export type { CreatePORequest, UpdatePORequest, ListPORequest, POResponse, POListResponse };

// ============================================
// API Response Wrapper (matches backend format)
// ============================================

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// PO API Endpoints
// ============================================

export const poApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /po
     * Fetch paginated list of Purchase Orders
     *
     * @param params - Pagination and filter parameters
     * @returns Paginated list of POs
     *
     * Usage:
     * const { data, isLoading } = useGetPOsQuery({ page: 1, limit: 10 });
     */
    getPOs: builder.query<POListResponse, ListPORequest | void>({
      query: (params) => ({
        url: '/po',
        params: params || {},
      }),
      // Transform the API response to extract data
      transformResponse: (response: ApiResponse<POResponse[]>) => ({
        items: response.data,
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: response.data.length,
          totalPages: 1,
        },
      }),
      // Tag this data for cache invalidation
      providesTags: (result) =>
        result
          ? [
              // Tag each individual PO
              ...result.items.map(({ poId }) => ({ type: 'PO' as const, id: poId })),
              // Tag for the entire list
              { type: 'PO', id: 'LIST' },
            ]
          : [{ type: 'PO', id: 'LIST' }],
    }),

    /**
     * GET /po/:poId
     * Fetch a single Purchase Order by ID
     *
     * @param poId - PO ID
     * @returns Single PO object
     *
     * Usage:
     * const { data, isLoading } = useGetPOByIdQuery('OSG-00000001');
     */
    getPOById: builder.query<POResponse, string>({
      query: (poId) => `/po/${poId}`,
      // Transform the API response to extract data
      transformResponse: (response: ApiResponse<POResponse>) => response.data,
      // Tag this specific PO
      providesTags: (result, error, poId) => [{ type: 'PO', id: poId }],
    }),

    /**
     * POST /po
     * Create a new Purchase Order
     *
     * @param newPO - PO data to create
     * @returns Created PO object
     *
     * Usage:
     * const [createPO, { isLoading }] = useCreatePOMutation();
     * await createPO(poData).unwrap();
     */
    createPO: builder.mutation<POResponse, CreatePORequest>({
      query: (newPO) => ({
        url: '/po',
        method: 'POST',
        body: newPO,
      }),
      // Transform the API response to extract data
      transformResponse: (response: ApiResponse<POResponse>) => response.data,
      // Invalidate the list cache so it refetches
      invalidatesTags: [{ type: 'PO', id: 'LIST' }],
    }),

    /**
     * PUT /po/:poId
     * Update an existing Purchase Order
     *
     * @param updateData - PO data including poId
     * @returns Updated PO object
     *
     * Usage:
     * const [updatePO, { isLoading }] = useUpdatePOMutation();
     * await updatePO({ poId: 'OSG-00000001', clientId: 'new-client-id' }).unwrap();
     */
    updatePO: builder.mutation<POResponse, UpdatePORequest>({
      query: ({ poId, ...body }) => ({
        url: `/po/${poId}`,
        method: 'PUT',
        body,
      }),
      // Transform the API response to extract data
      transformResponse: (response: ApiResponse<POResponse>) => response.data,
      // Invalidate both the specific PO and the list
      invalidatesTags: (result, error, { poId }) => [
        { type: 'PO', id: poId },
        { type: 'PO', id: 'LIST' },
      ],
    }),

    /**
     * DELETE /po/:poId
     * Delete a Purchase Order
     *
     * @param poId - PO ID to delete
     * @returns Deletion confirmation
     *
     * Usage:
     * const [deletePO, { isLoading }] = useDeletePOMutation();
     * await deletePO('OSG-00000001').unwrap();
     */
    deletePO: builder.mutation<{ poId: string; deleted: boolean }, string>({
      query: (poId) => ({
        url: `/po/${poId}`,
        method: 'DELETE',
      }),
      // Transform the API response to extract data
      transformResponse: (
        response: ApiResponse<{ poId: string; deleted: boolean }>
      ) => response.data,
      // Invalidate the list cache
      invalidatesTags: (result, error, poId) => [
        { type: 'PO', id: poId },
        { type: 'PO', id: 'LIST' },
      ],
    }),
  }),

  // Don't override existing endpoints if they exist
  overrideExisting: false,
});

// ============================================
// Export Auto-Generated Hooks
// ============================================

export const {
  // Query hooks
  useGetPOsQuery,
  useGetPOByIdQuery,
  useLazyGetPOsQuery, // Lazy version - trigger manually
  useLazyGetPOByIdQuery, // Lazy version - trigger manually

  // Mutation hooks
  useCreatePOMutation,
  useUpdatePOMutation,
  useDeletePOMutation,
} = poApi;
