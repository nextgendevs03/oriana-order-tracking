import { baseApi } from "./baseApi";
import {
  CreateOEMRequest,
  UpdateOEMRequest,
  OEMResponse,
  OEMListResponse,
  ListOEMRequest,
} from "@OrianaTypes";

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

export const oemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOEMs: builder.query<OEMListResponse, ListOEMRequest | void>({
      query: (params) => ({
        url: "oem/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<OEMResponse[]>): OEMListResponse => ({
        data: (response.data || []).map((item: any) => ({
          ...item,
          isActive:
            typeof item.isActive === "boolean"
              ? item.isActive
              : item.status === "Active",
        })),
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      }),
      providesTags: ["OEM"],
    }),

    createOEM: builder.mutation<OEMResponse, CreateOEMRequest>({
      query: (body) => ({
        url: "oem/",
        method: "POST",
        body, 
      }),
      invalidatesTags: ["OEM"],
    }),

    updateOEM: builder.mutation<
      OEMResponse,
      { id: string; data: UpdateOEMRequest }
    >({
      query: ({ id, data }) => ({
        url: `oem/${id}`,
        method: "PUT",
        body: data, 
      }),
      invalidatesTags: ["OEM"],
    }),

    deleteOEM: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `oem/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OEM"],
    }),
  }),
});

export const {
  useGetOEMsQuery,
  useCreateOEMMutation,
  useUpdateOEMMutation,
  useDeleteOEMMutation,
} = oemApi;
