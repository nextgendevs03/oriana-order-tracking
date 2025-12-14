import { baseApi } from "./baseApi";
import {
  CreateClientRequest,
  UpdateClientRequest,
  ClientResponse,
} from "@OrianaTypes";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      ClientResponse[],
      { isActive?: boolean; clientName?: string } | void
    >({
      query: (params) => ({
        url: "client/",
        method: "GET",
        params: params
          ? {
              ...(params.isActive !== undefined && {
                isActive: String(params.isActive),
              }),
              ...(params.clientName && { clientName: params.clientName }),
            }
          : undefined,
      }),
      transformResponse: (response: any) => {
        return response.data;
      },
      providesTags: ["Client"],
    }),

    createClient: builder.mutation<ClientResponse, CreateClientRequest>({
      query: (body) => ({
        url: "client/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Client"],
    }),

    updateClient: builder.mutation<
      ClientResponse,
      { id: string; data: UpdateClientRequest }
    >({
      query: ({ id, data }) => ({
        url: `client/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Client"],
    }),

    deleteClient: builder.mutation<{ deleted: boolean }, string>({
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
