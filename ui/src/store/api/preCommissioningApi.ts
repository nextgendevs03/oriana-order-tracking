/**
 * Pre-Commissioning API
 *
 * RTK Query API for Pre-Commissioning operations.
 */

import { baseApi } from './baseApi';
import {
  CreatePreCommissioningRequest,
  UpdatePreCommissioningRequest,
  ListPreCommissioningRequest,
  PreCommissioningResponse,
  PreCommissioningListResponse,
  EligibleSerialResponse,
  PreCommissioningStatusResponse,
  DeletePreCommissioningResponse,
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

export const preCommissioningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreCommissionings: builder.query<PreCommissioningListResponse, ListPreCommissioningRequest | void>({
      query: (params) => ({
        url: '/pre-commissioning',
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<PreCommissioningResponse[]>) => ({
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
              ...result.data.map(({ preCommissioningId }) => ({
                type: 'PreCommissioning' as const,
                id: preCommissioningId,
              })),
              { type: 'PreCommissioning', id: 'LIST' },
            ]
          : [{ type: 'PreCommissioning', id: 'LIST' }],
    }),

    getPreCommissioningsByPoId: builder.query<PreCommissioningResponse[], string>({
      query: (poId) => `/pre-commissioning/po/${poId}`,
      transformResponse: (response: ApiResponse<PreCommissioningResponse[]>) => response.data,
      providesTags: (result, _error, poId) =>
        result
          ? [
              ...result.map(({ preCommissioningId }) => ({
                type: 'PreCommissioning' as const,
                id: preCommissioningId,
              })),
              { type: 'PreCommissioning', id: `PO-${poId}` },
            ]
          : [{ type: 'PreCommissioning', id: `PO-${poId}` }],
    }),

    getPreCommissioningStatus: builder.query<PreCommissioningStatusResponse, string>({
      query: (poId) => `/pre-commissioning/po/${poId}/status`,
      transformResponse: (response: ApiResponse<PreCommissioningStatusResponse>) => response.data,
      providesTags: (_result, _error, poId) => [
        { type: 'PreCommissioning', id: `STATUS-${poId}` },
      ],
    }),

    getEligibleSerials: builder.query<EligibleSerialResponse[], string>({
      query: (poId) => `/pre-commissioning/po/${poId}/eligible`,
      transformResponse: (response: ApiResponse<EligibleSerialResponse[]>) => response.data,
      providesTags: (_result, _error, poId) => [
        { type: 'PreCommissioning', id: `ELIGIBLE-${poId}` },
        { type: 'Dispatch', id: `PO-${poId}` },
      ],
    }),

    getPreCommissioningById: builder.query<PreCommissioningResponse, number>({
      query: (id) => `/pre-commissioning/${id}`,
      transformResponse: (response: ApiResponse<PreCommissioningResponse>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'PreCommissioning', id }],
    }),

    createPreCommissioning: builder.mutation<PreCommissioningResponse[], CreatePreCommissioningRequest>({
      query: (data) => ({
        url: '/pre-commissioning',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<PreCommissioningResponse[]>) => response.data,
      invalidatesTags: [{ type: 'PreCommissioning', id: 'LIST' }],
    }),

    updatePreCommissioning: builder.mutation<
      PreCommissioningResponse,
      { id: number; data: UpdatePreCommissioningRequest }
    >({
      query: ({ id, data }) => ({
        url: `/pre-commissioning/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<PreCommissioningResponse>) => response.data,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'PreCommissioning', id },
        { type: 'PreCommissioning', id: 'LIST' },
        ...(result?.poId ? [{ type: 'PreCommissioning' as const, id: `PO-${result.poId}` }] : []),
        ...(result?.poId ? [{ type: 'PreCommissioning' as const, id: `STATUS-${result.poId}` }] : []),
        { type: 'Commissioning', id: 'LIST' },
      ],
    }),

    deletePreCommissioning: builder.mutation<DeletePreCommissioningResponse, { id: number; poId?: string }>({
      query: ({ id }) => ({
        url: `/pre-commissioning/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<DeletePreCommissioningResponse>) => response.data,
      invalidatesTags: (_result, _error, { id, poId }) => [
        { type: 'PreCommissioning', id },
        { type: 'PreCommissioning', id: 'LIST' },
        ...(poId ? [{ type: 'PreCommissioning' as const, id: `PO-${poId}` }] : []),
        ...(poId ? [{ type: 'PreCommissioning' as const, id: `STATUS-${poId}` }] : []),
        ...(poId ? [{ type: 'PreCommissioning' as const, id: `ELIGIBLE-${poId}` }] : []),
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetPreCommissioningsQuery,
  useGetPreCommissioningsByPoIdQuery,
  useGetPreCommissioningStatusQuery,
  useGetEligibleSerialsQuery,
  useGetPreCommissioningByIdQuery,
  useLazyGetPreCommissioningsQuery,
  useLazyGetPreCommissioningsByPoIdQuery,
  useLazyGetEligibleSerialsQuery,
  useCreatePreCommissioningMutation,
  useUpdatePreCommissioningMutation,
  useDeletePreCommissioningMutation,
} = preCommissioningApi;
