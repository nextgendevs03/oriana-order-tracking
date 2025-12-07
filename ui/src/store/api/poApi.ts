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

// ============================================
// Type Definitions
// ============================================

/**
 * PO Item in a Purchase Order
 */
export interface POItem {
  id?: string;
  category: string;
  oemName: string;
  product: string;
  quantity: number;
  spareQuantity: number;
  totalQuantity: number;
  pricePerUnit: number;
  totalPrice: number;
  warranty: string;
}

/**
 * Purchase Order Response from API
 */
export interface POResponse {
  id: string;
  date: string;
  clientName: string;
  osgPiNo: number;
  osgPiDate: string;
  clientPoNo: number;
  clientPoDate: string;
  poStatus: string;
  noOfDispatch: string;
  clientAddress: string;
  clientContact: string;
  poItems: POItem[];
  dispatchPlanDate: string;
  siteLocation: string;
  oscSupport: string;
  confirmDateOfDispatch: string;
  paymentStatus: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request params for listing POs
 */
export interface ListPOParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  clientName?: string;
  poStatus?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Request body for creating a PO
 */
export interface CreatePORequest {
  date: string;
  clientName: string;
  osgPiNo: number;
  osgPiDate: string;
  clientPoNo: number;
  clientPoDate: string;
  poStatus: string;
  noOfDispatch: string;
  clientAddress: string;
  clientContact: string;
  poItems: POItem[];
  dispatchPlanDate: string;
  siteLocation: string;
  oscSupport: string;
  confirmDateOfDispatch: string;
  paymentStatus: string;
  remarks?: string;
}

/**
 * Request body for updating a PO
 */
export interface UpdatePORequest extends Partial<CreatePORequest> {
  id: string;
}

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
    getPOs: builder.query<PaginatedResponse<POResponse>, ListPOParams | void>({
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
              ...result.items.map(({ id }) => ({ type: 'PO' as const, id })),
              // Tag for the entire list
              { type: 'PO', id: 'LIST' },
            ]
          : [{ type: 'PO', id: 'LIST' }],
    }),

    /**
     * GET /po/:id
     * Fetch a single Purchase Order by ID
     *
     * @param id - PO ID
     * @returns Single PO object
     *
     * Usage:
     * const { data, isLoading } = useGetPOByIdQuery('po-123');
     */
    getPOById: builder.query<POResponse, string>({
      query: (id) => `/po/${id}`,
      // Transform the API response to extract data
      transformResponse: (response: ApiResponse<POResponse>) => response.data,
      // Tag this specific PO
      providesTags: (result, error, id) => [{ type: 'PO', id }],
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
     * PUT /po/:id
     * Update an existing Purchase Order
     *
     * @param updateData - PO data including ID
     * @returns Updated PO object
     *
     * Usage:
     * const [updatePO, { isLoading }] = useUpdatePOMutation();
     * await updatePO({ id: 'po-123', clientName: 'New Name' }).unwrap();
     */
    updatePO: builder.mutation<POResponse, UpdatePORequest>({
      query: ({ id, ...body }) => ({
        url: `/po/${id}`,
        method: 'PUT',
        body,
      }),
      // Transform the API response to extract data
      transformResponse: (response: ApiResponse<POResponse>) => response.data,
      // Invalidate both the specific PO and the list
      invalidatesTags: (result, error, { id }) => [
        { type: 'PO', id },
        { type: 'PO', id: 'LIST' },
      ],
    }),

    /**
     * DELETE /po/:id
     * Delete a Purchase Order
     *
     * @param id - PO ID to delete
     * @returns Deletion confirmation
     *
     * Usage:
     * const [deletePO, { isLoading }] = useDeletePOMutation();
     * await deletePO('po-123').unwrap();
     */
    deletePO: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({
        url: `/po/${id}`,
        method: 'DELETE',
      }),
      // Transform the API response to extract data
      transformResponse: (
        response: ApiResponse<{ id: string; deleted: boolean }>
      ) => response.data,
      // Invalidate the list cache
      invalidatesTags: (result, error, id) => [
        { type: 'PO', id },
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

