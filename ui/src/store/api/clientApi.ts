import { baseApi } from "./baseApi";
import {
  CreateClientRequest,
  UpdateClientRequest,
  ClientResponse,
  ClientListResponse,
  ListClientRequest,
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

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientListResponse, ListClientRequest | void>({
      query: (params) => ({
        url: "client",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (
        response: ApiResponse<ClientResponse[]>
      ): ClientListResponse => ({
        data: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      }),
      providesTags: ["Client"],
    }),

    createClient: builder.mutation<ClientResponse, CreateClientRequest>({
      query: (body) => ({
        url: "client",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Client"],
    }),

    updateClient: builder.mutation<
      ClientResponse,
      { id: number; data: UpdateClientRequest }
    >({
      query: ({ id, data }) => ({
        url: `client/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Client"],
    }),

    deleteClient: builder.mutation<{ deleted: boolean }, number>({
      query: (id) => ({
        url: `client/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
