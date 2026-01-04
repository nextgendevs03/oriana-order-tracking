/**
 * Dispatch API
 *
 * RTK Query API for Dispatch operations.
 * Provides hooks for CRUD operations on dispatches.
 */

import { baseApi } from './baseApi';
import {
  CreateDispatchRequest,
  UpdateDispatchDetailsRequest,
  UpdateDispatchDocumentsRequest,
  UpdateDeliveryConfirmationRequest,
  ListDispatchRequest,
  DispatchResponse,
  DispatchListResponse,
  DeleteDispatchResponse,
  DispatchAccordionStatusResponse,
} from '@OrianaTypes';

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

export const dispatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /dispatch
     * Fetch paginated list of dispatches
     */
    getDispatches: builder.query<DispatchListResponse, ListDispatchRequest | void>({
      query: (params) => ({
        url: '/dispatch',
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<DispatchResponse[]>) => ({
        data: response.data,
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data.length,
          totalPages: 1,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ dispatchId }) => ({
                type: 'Dispatch' as const,
                id: dispatchId,
              })),
              { type: 'Dispatch', id: 'LIST' },
            ]
          : [{ type: 'Dispatch', id: 'LIST' }],
    }),

    /**
     * GET /dispatch/po/:poId
     * Fetch all dispatches for a specific PO
     */
    getDispatchesByPoId: builder.query<DispatchResponse[], string>({
      query: (poId) => `/dispatch/po/${poId}`,
      transformResponse: (response: ApiResponse<DispatchResponse[]>) => response.data,
      providesTags: (result, _error, poId) =>
        result
          ? [
              ...result.map(({ dispatchId }) => ({
                type: 'Dispatch' as const,
                id: dispatchId,
              })),
              { type: 'Dispatch', id: `PO-${poId}` },
            ]
          : [{ type: 'Dispatch', id: `PO-${poId}` }],
    }),

    /**
     * GET /dispatch/po/:poId/status
     * Fetch accordion status for Dispatch, Document, and Delivery sections
     */
    getDispatchAccordionStatus: builder.query<DispatchAccordionStatusResponse, string>({
      query: (poId) => `/dispatch/po/${poId}/status`,
      transformResponse: (response: ApiResponse<DispatchAccordionStatusResponse>) => response.data,
      providesTags: (_result, _error, poId) => [
        { type: 'Dispatch', id: `STATUS-${poId}` },
      ],
    }),

    /**
     * GET /dispatch/:id
     * Fetch a single dispatch by ID
     */
    getDispatchById: builder.query<DispatchResponse, number>({
      query: (id) => `/dispatch/${id}`,
      transformResponse: (response: ApiResponse<DispatchResponse>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Dispatch', id }],
    }),

    /**
     * POST /dispatch
     * Create a new dispatch
     */
    createDispatch: builder.mutation<DispatchResponse, CreateDispatchRequest>({
      query: (newDispatch) => ({
        url: '/dispatch',
        method: 'POST',
        body: newDispatch,
      }),
      transformResponse: (response: ApiResponse<DispatchResponse>) => response.data,
      invalidatesTags: (_result, _error, { poId }) => [
        { type: 'Dispatch', id: 'LIST' },
        { type: 'Dispatch', id: `PO-${poId}` },
        { type: 'PO', id: poId }, // Invalidate PO cache to refresh dispatch count
      ],
    }),

    /**
     * PUT /dispatch/:id
     * Update dispatch details (Section 1)
     */
    updateDispatchDetails: builder.mutation<
      DispatchResponse,
      { id: number; data: UpdateDispatchDetailsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/dispatch/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<DispatchResponse>) => response.data,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'Dispatch', id },
        { type: 'Dispatch', id: 'LIST' },
        ...(result ? [{ type: 'Dispatch' as const, id: `PO-${result.poId}` }] : []),
      ],
    }),

    /**
     * PUT /dispatch/:id/documents
     * Update dispatch documents (Section 2)
     */
    updateDispatchDocuments: builder.mutation<
      DispatchResponse,
      { id: number; data: UpdateDispatchDocumentsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/dispatch/${id}/documents`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<DispatchResponse>) => response.data,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'Dispatch', id },
        { type: 'Dispatch', id: 'LIST' },
        ...(result ? [{ type: 'Dispatch' as const, id: `PO-${result.poId}` }] : []),
      ],
    }),

    /**
     * PUT /dispatch/:id/delivery
     * Update delivery confirmation (Section 3)
     */
    updateDeliveryConfirmation: builder.mutation<
      DispatchResponse,
      { id: number; data: UpdateDeliveryConfirmationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/dispatch/${id}/delivery`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<DispatchResponse>) => response.data,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'Dispatch', id },
        { type: 'Dispatch', id: 'LIST' },
        ...(result ? [{ type: 'Dispatch' as const, id: `PO-${result.poId}` }] : []),
      ],
    }),

    /**
     * DELETE /dispatch/:id
     * Delete a dispatch
     */
    deleteDispatch: builder.mutation<DeleteDispatchResponse, { id: number; poId: string }>({
      query: ({ id }) => ({
        url: `/dispatch/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<DeleteDispatchResponse>) => response.data,
      invalidatesTags: (_result, _error, { id, poId }) => [
        { type: 'Dispatch', id },
        { type: 'Dispatch', id: 'LIST' },
        { type: 'Dispatch', id: `PO-${poId}` },
      ],
    }),
  }),

  overrideExisting: false,
});

// Export hooks
export const {
  useGetDispatchesQuery,
  useGetDispatchesByPoIdQuery,
  useGetDispatchAccordionStatusQuery,
  useGetDispatchByIdQuery,
  useLazyGetDispatchesQuery,
  useLazyGetDispatchesByPoIdQuery,
  useLazyGetDispatchByIdQuery,
  useCreateDispatchMutation,
  useUpdateDispatchDetailsMutation,
  useUpdateDispatchDocumentsMutation,
  useUpdateDeliveryConfirmationMutation,
  useDeleteDispatchMutation,
} = dispatchApi;

