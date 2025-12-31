import {
  CreatePermissionRequest,
  PermissionListResponse,
  PermissionResponse,
  UpdatePermissionRequest,
} from "@OrianaTypes";
import { baseApi } from "./baseApi";

// Backend wraps responses in { success: true, data: T, pagination?: ... }
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

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<
      PermissionListResponse,
      {
        page?: number;
        limit?: number;
        isActive?: boolean;
        searchKey?: string;
        searchTerm?: string;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", String(params.page));
          if (params.limit) queryParams.append("limit", String(params.limit));
          if (params.isActive !== undefined)
            queryParams.append("isActive", String(params.isActive));
          if (params.searchKey)
            queryParams.append("searchKey", params.searchKey);
          if (params.searchTerm)
            queryParams.append("searchTerm", params.searchTerm);
        }
        const queryString = queryParams.toString();
        return `/permission${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (
        response: ApiResponse<{
          data: PermissionResponse[];
          pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        }>
      ): PermissionListResponse => ({
        data: response.data?.data ?? [],
        pagination: response.data?.pagination ??
          response.pagination ?? {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
      }),
      providesTags: ["Permission"],
    }),

    createPermission: builder.mutation<
      PermissionResponse,
      CreatePermissionRequest
    >({
      query: (body) => ({
        url: "/permission",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<PermissionResponse>) =>
        response.data,
      invalidatesTags: ["Permission"],
    }),

    updatePermission: builder.mutation<
      PermissionResponse,
      { id: string } & UpdatePermissionRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/permission/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<PermissionResponse>) =>
        response.data,
      invalidatesTags: ["Permission"],
    }),

    deletePermission: builder.mutation<
      { permissionId: string; deleted: boolean },
      string
    >({
      query: (id) => ({
        url: `/permission/${id}`,
        method: "DELETE",
      }),
      transformResponse: (
        response: ApiResponse<{ permissionId: string; deleted: boolean }>
      ) => response.data,
      invalidatesTags: ["Permission"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
