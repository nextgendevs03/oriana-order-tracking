import { baseApi } from "./baseApi";
import {
  RoleListResponse,
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  ListRoleRequest,
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

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query<RoleListResponse, ListRoleRequest | void>({
      query: (params: ListRoleRequest | void) => ({
        url: "role",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (
        response: ApiResponse<{ data: RoleResponse[]; pagination?: any }>
      ): RoleListResponse => ({
        data: (response.data?.data ?? response.data) || [],
        pagination: response.data?.pagination ||
          response.pagination || {
            page: 1,
            limit: 20,
            total: response.data?.data?.length || 0,
            totalPages: 1,
          },
      }),
      providesTags: ["Role"],
    }),

    createRole: builder.mutation<RoleResponse, CreateRoleRequest>({
      query: (body: CreateRoleRequest) => ({
        url: "role",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation<
      RoleResponse,
      { id: number; data: UpdateRoleRequest }
    >({
      query: ({ id, data }: { id: number; data: UpdateRoleRequest }) => ({
        url: `role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation<{ id: number; deleted: boolean }, number>({
      query: (id: number) => ({ url: `role/${id}`, method: "DELETE" }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
