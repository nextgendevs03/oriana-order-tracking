import { baseApi } from "./baseApi";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoryListResponse,
  ListCategoryRequest,
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

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoryListResponse,
      ListCategoryRequest | void
    >({
      query: (params) => ({
        url: "category",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (
        response: ApiResponse<CategoryResponse[]>
      ): CategoryListResponse => ({
        data: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: "category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      CategoryResponse,
      { id: number; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<{ deleted: boolean }, number>({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
