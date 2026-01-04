/**
 * Commissioning API
 *
 * RTK Query API for Commissioning operations.
 */

import { baseApi } from './baseApi';
import {
  CreateCommissioningRequest,
  UpdateCommissioningRequest,
  ListCommissioningRequest,
  CommissioningResponse,
  CommissioningListResponse,
  EligiblePreCommissioningResponse,
  DeleteCommissioningResponse,
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

export const commissioningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommissionings: builder.query<CommissioningListResponse, ListCommissioningRequest | void>({
      query: (params) => ({
        url: '/commissioning',
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<CommissioningResponse[]>) => ({
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
              ...result.data.map(({ commissioningId }) => ({
                type: 'Commissioning' as const,
                id: commissioningId,
              })),
              { type: 'Commissioning', id: 'LIST' },
            ]
          : [{ type: 'Commissioning', id: 'LIST' }],
    }),

    getCommissioningsByPoId: builder.query<CommissioningResponse[], string>({
      query: (poId) => `/commissioning/po/${poId}`,
      transformResponse: (response: ApiResponse<CommissioningResponse[]>) => response.data,
      providesTags: (result, _error, poId) =>
        result
          ? [
              ...result.map(({ commissioningId }) => ({
                type: 'Commissioning' as const,
                id: commissioningId,
              })),
              { type: 'Commissioning', id: `PO-${poId}` },
            ]
          : [{ type: 'Commissioning', id: `PO-${poId}` }],
    }),

    getEligiblePreCommissionings: builder.query<EligiblePreCommissioningResponse[], string>({
      query: (poId) => `/commissioning/po/${poId}/eligible`,
      transformResponse: (response: ApiResponse<EligiblePreCommissioningResponse[]>) => response.data,
      providesTags: (_result, _error, poId) => [
        { type: 'Commissioning', id: `ELIGIBLE-${poId}` },
        { type: 'PreCommissioning', id: `PO-${poId}` },
      ],
    }),

    getCommissioningById: builder.query<CommissioningResponse, number>({
      query: (id) => `/commissioning/${id}`,
      transformResponse: (response: ApiResponse<CommissioningResponse>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Commissioning', id }],
    }),

    createCommissioning: builder.mutation<CommissioningResponse[], CreateCommissioningRequest & { poId?: string }>({
      query: (data) => ({
        url: '/commissioning',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<CommissioningResponse[]>) => response.data,
      invalidatesTags: (result) => [
        { type: 'Commissioning', id: 'LIST' },
        { type: 'PreCommissioning', id: 'LIST' },
        ...(result?.[0]?.poId ? [{ type: 'PO' as const, id: result[0].poId }] : []),
      ],
    }),

    updateCommissioning: builder.mutation<
      CommissioningResponse,
      { id: number; data: UpdateCommissioningRequest }
    >({
      query: ({ id, data }) => ({
        url: `/commissioning/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<CommissioningResponse>) => response.data,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'Commissioning', id },
        { type: 'Commissioning', id: 'LIST' },
        ...(result?.poId ? [{ type: 'Commissioning' as const, id: `PO-${result.poId}` }] : []),
        ...(result?.poId ? [{ type: 'PO' as const, id: result.poId }] : []),
        { type: 'WarrantyCertificate', id: 'LIST' },
      ],
    }),

    deleteCommissioning: builder.mutation<DeleteCommissioningResponse, { id: number; poId?: string }>({
      query: ({ id }) => ({
        url: `/commissioning/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<DeleteCommissioningResponse>) => response.data,
      invalidatesTags: (_result, _error, { id, poId }) => [
        { type: 'Commissioning', id },
        { type: 'Commissioning', id: 'LIST' },
        ...(poId ? [{ type: 'Commissioning' as const, id: `PO-${poId}` }] : []),
        ...(poId ? [{ type: 'Commissioning' as const, id: `ELIGIBLE-${poId}` }] : []),
        ...(poId ? [{ type: 'PO' as const, id: poId }] : []),
        { type: 'PreCommissioning', id: 'LIST' },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCommissioningsQuery,
  useGetCommissioningsByPoIdQuery,
  useGetEligiblePreCommissioningsQuery,
  useGetCommissioningByIdQuery,
  useLazyGetCommissioningsQuery,
  useLazyGetCommissioningsByPoIdQuery,
  useLazyGetEligiblePreCommissioningsQuery,
  useCreateCommissioningMutation,
  useUpdateCommissioningMutation,
  useDeleteCommissioningMutation,
} = commissioningApi;
