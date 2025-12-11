import { baseApi } from "./baseApi";
import { RoleListResponse, RoleResponse, CreateRoleRequest, UpdateRoleRequest, ListRoleRequest } from "@OrianaTypes";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query<RoleListResponse, ListRoleRequest>({
      query: (params) => ({ url: "role/", method: "GET", params }),
      providesTags: ["Role"],
    }),

    createRole: builder.mutation<RoleResponse, CreateRoleRequest>({
      query: (body) => ({
        url: "role/",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation<
      RoleResponse,
      { id: string; data: UpdateRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: `role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({ url: `role/${id}`, method: "DELETE" }),
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
