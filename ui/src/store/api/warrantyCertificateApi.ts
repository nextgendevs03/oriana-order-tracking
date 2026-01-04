/**
 * Warranty Certificate API
 *
 * RTK Query API for Warranty Certificate operations.
 */

import { baseApi } from './baseApi';
import {
  CreateWarrantyCertificateRequest,
  UpdateWarrantyCertificateRequest,
  ListWarrantyCertificateRequest,
  WarrantyCertificateResponse,
  WarrantyCertificateListResponse,
  EligibleCommissioningResponse,
  DeleteWarrantyCertificateResponse,
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

export const warrantyCertificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarrantyCertificates: builder.query<WarrantyCertificateListResponse, ListWarrantyCertificateRequest | void>({
      query: (params) => ({
        url: '/warranty-certificate',
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<WarrantyCertificateResponse[]>) => ({
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
              ...result.data.map(({ warrantyCertificateId }) => ({
                type: 'WarrantyCertificate' as const,
                id: warrantyCertificateId,
              })),
              { type: 'WarrantyCertificate', id: 'LIST' },
            ]
          : [{ type: 'WarrantyCertificate', id: 'LIST' }],
    }),

    getWarrantyCertificatesByPoId: builder.query<WarrantyCertificateResponse[], string>({
      query: (poId) => `/warranty-certificate/po/${poId}`,
      transformResponse: (response: ApiResponse<WarrantyCertificateResponse[]>) => response.data,
      providesTags: (result, _error, poId) =>
        result
          ? [
              ...result.map(({ warrantyCertificateId }) => ({
                type: 'WarrantyCertificate' as const,
                id: warrantyCertificateId,
              })),
              { type: 'WarrantyCertificate', id: `PO-${poId}` },
            ]
          : [{ type: 'WarrantyCertificate', id: `PO-${poId}` }],
    }),

    getEligibleCommissionings: builder.query<EligibleCommissioningResponse[], string>({
      query: (poId) => `/warranty-certificate/po/${poId}/eligible`,
      transformResponse: (response: ApiResponse<EligibleCommissioningResponse[]>) => response.data,
      providesTags: (_result, _error, poId) => [
        { type: 'WarrantyCertificate', id: `ELIGIBLE-${poId}` },
        { type: 'Commissioning', id: `PO-${poId}` },
      ],
    }),

    getWarrantyCertificateById: builder.query<WarrantyCertificateResponse, number>({
      query: (id) => `/warranty-certificate/${id}`,
      transformResponse: (response: ApiResponse<WarrantyCertificateResponse>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'WarrantyCertificate', id }],
    }),

    createWarrantyCertificate: builder.mutation<WarrantyCertificateResponse[], CreateWarrantyCertificateRequest & { poId?: string }>({
      query: (data) => ({
        url: '/warranty-certificate',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<WarrantyCertificateResponse[]>) => response.data,
      invalidatesTags: (result) => [
        { type: 'WarrantyCertificate', id: 'LIST' },
        { type: 'Commissioning', id: 'LIST' },
        ...(result?.[0]?.poId ? [{ type: 'PO' as const, id: result[0].poId }] : []),
      ],
    }),

    updateWarrantyCertificate: builder.mutation<
      WarrantyCertificateResponse,
      { id: number; data: UpdateWarrantyCertificateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/warranty-certificate/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<WarrantyCertificateResponse>) => response.data,
      invalidatesTags: (result, _error, { id }) => [
        { type: 'WarrantyCertificate', id },
        { type: 'WarrantyCertificate', id: 'LIST' },
        ...(result?.poId ? [{ type: 'WarrantyCertificate' as const, id: `PO-${result.poId}` }] : []),
        ...(result?.poId ? [{ type: 'PO' as const, id: result.poId }] : []),
      ],
    }),

    deleteWarrantyCertificate: builder.mutation<DeleteWarrantyCertificateResponse, { id: number; poId?: string }>({
      query: ({ id }) => ({
        url: `/warranty-certificate/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<DeleteWarrantyCertificateResponse>) => response.data,
      invalidatesTags: (_result, _error, { id, poId }) => [
        { type: 'WarrantyCertificate', id },
        { type: 'WarrantyCertificate', id: 'LIST' },
        ...(poId ? [{ type: 'WarrantyCertificate' as const, id: `PO-${poId}` }] : []),
        ...(poId ? [{ type: 'WarrantyCertificate' as const, id: `ELIGIBLE-${poId}` }] : []),
        ...(poId ? [{ type: 'PO' as const, id: poId }] : []),
        { type: 'Commissioning', id: 'LIST' },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetWarrantyCertificatesQuery,
  useGetWarrantyCertificatesByPoIdQuery,
  useGetEligibleCommissioningsQuery,
  useGetWarrantyCertificateByIdQuery,
  useLazyGetWarrantyCertificatesQuery,
  useLazyGetWarrantyCertificatesByPoIdQuery,
  useLazyGetEligibleCommissioningsQuery,
  useCreateWarrantyCertificateMutation,
  useUpdateWarrantyCertificateMutation,
  useDeleteWarrantyCertificateMutation,
} = warrantyCertificateApi;
