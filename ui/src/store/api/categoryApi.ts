import { baseApi } from "./baseApi";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from "@OrianaTypes";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => ({ url: "category/", method: "GET" }),
      transformResponse: (response: any) => {
        return response.data; 
      },
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: "category/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      CategoryResponse,
      { id: string; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<{ deleted: boolean }, string>({
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
