import { baseApi } from ".";
// Backend Response Types (matching backend schema)
export interface RoleResponse {
  roleId: string;
  roleName: string;
  description: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleListResponse {
  items: RoleResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Types (matching backend schema)
export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  createdBy: string;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  roleName?: string;
  description?: string;
  updatedBy: string;
  isActive?: boolean;
}

export interface ListRoleParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

// Frontend Display Type (for UI)
export interface RoleType {
  key: string;
  roleId: string;
  roleName: string;
  description: string;
  permissions: number;
  users: number;
  locked?: boolean;
  isActive?: boolean;
}

// Helper to get current user
const getCurrentUser = () => {
  return localStorage.getItem("loggedUser") || "system";
};

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query<RoleListResponse, ListRoleParams>({
      query: (params) => ({
        url: "role/",
        method: "GET",
        params: params,
      }),
      providesTags: ["Role"],
    }),
    // POST create role
    createRole: builder.mutation<
      RoleResponse,
      Omit<CreateRoleRequest, "createdBy">
    >({
      query: (body) => ({
        url: "/",
        method: "POST",
        body: {
          ...body,
          createdBy: getCurrentUser(),
        },
      }),
      invalidatesTags: ["Role"],
    }),
    // PUT update role
    updateRole: builder.mutation<
      RoleResponse,
      { id: string; data: Omit<UpdateRoleRequest, "updatedBy"> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: {
          ...data,
          updatedBy: getCurrentUser(),
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        "Role",
      ],
    }),
    // DELETE role
    deleteRole: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
