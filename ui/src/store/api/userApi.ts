import {
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  ListUserRequest,
} from "@OrianaTypes";
import { baseApi } from "./baseApi";

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, ListUserRequest | void>({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<UserListResponse["data"]>) => ({
        data: response.data,
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data.length,
          totalPages: 1,
        },
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<UserListResponse, CreateUserRequest>({
      query: (body: CreateUserRequest) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      { userId: string; username: string; email: string; role: string; isActive: boolean },
      { userId: string; data: UpdateUserRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/user/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
