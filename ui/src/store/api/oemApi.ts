import { baseApi } from "./baseApi";
import { CreateOEMRequest, UpdateOEMRequest, OEMResponse } from "@OrianaTypes";

export const oemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOEMs: builder.query<OEMResponse[], void>({
      query: () => ({ url: "oem/", method: "GET" }),
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
