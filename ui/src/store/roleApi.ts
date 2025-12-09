import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

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

// Helper to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("token") || localStorage.getItem("authToken") || ""
  );
};

// Helper to get current user
const getCurrentUser = () => {
  return localStorage.getItem("loggedUser") || "system";
};

// Backend API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Custom base query with response transformation
const baseQueryWithTransform = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  const result = await fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/role`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  })(args, api, extraOptions);

  // Transform backend response structure
  if (result.data) {
    try {
      const apiResponse = result.data as ApiResponse<any>;

      // If response has error
      if (!apiResponse.success && apiResponse.error) {
        return {
          ...result,
          error: {
            status: result.meta?.response?.status || 400,
            data: apiResponse.error,
          },
        };
      }

      // If response is successful
      if (apiResponse.success && apiResponse.data !== undefined) {
        // For list responses (GET all roles), combine data array and meta into RoleListResponse format
        if (Array.isArray(apiResponse.data)) {
          return {
            ...result,
            data: {
              items: apiResponse.data,
              pagination: apiResponse.meta || {
                page: 1,
                limit: 10,
                total: apiResponse.data.length,
                totalPages: Math.ceil(apiResponse.data.length / 10),
              },
            } as RoleListResponse,
          };
        }
        // For single item responses
        return {
          ...result,
          data: apiResponse.data,
        };
      }
    } catch (error) {
      // If parsing fails, return original result
      console.error("Error transforming API response:", error);
    }
  }

  // Handle HTTP errors
  if (result.error) {
    try {
      const errorData = JSON.parse(
        result.error.data as string
      ) as ApiResponse<any>;
      if (errorData.error) {
        return {
          ...result,
          error: {
            ...result.error,
            data: errorData.error,
          },
        };
      }
    } catch (e) {
      // If error parsing fails, return original error
    }
  }

  return result;
};

// RTK Query API
export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQueryWithTransform,
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    // GET all roles
    getAllRoles: builder.query<RoleListResponse, ListRoleParams>({
      query: (params = {}) => {
        const { page = 1, limit = 10, isActive } = params;
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (isActive !== undefined) {
          queryParams.append("isActive", isActive.toString());
        }
        return `?${queryParams.toString()}`;
      },
      providesTags: ["Role"],
    }),

    // GET role by ID
    getRoleById: builder.query<RoleResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
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
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
