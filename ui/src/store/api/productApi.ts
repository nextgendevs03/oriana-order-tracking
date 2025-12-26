import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
  ProductListResponse,
  ListProductRequest,
} from "@OrianaTypes";
import { baseApi } from "./baseApi";

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

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ListProductRequest | void>({
      query: (params) => ({
        url: "product/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: ApiResponse<ProductResponse[]>): ProductListResponse => ({
        data: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 20,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      }),
      providesTags: ["Product"],
    }),

    // Get filtered products by categoryId and/or oemId (backward compatibility)
    getFilteredProducts: builder.query<ProductResponse[], ListProductRequest>({
      query: (params) => ({
        url: "product/",
        method: "GET",
        params,
      }),
      transformResponse: (response: ApiResponse<ProductResponse[]>) => {
        return response.data || [];
      },
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<ProductResponse, CreateProductRequest>({
      query: (body) => ({
        url: "product/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<ProductResponse, { id: string; data: UpdateProductRequest }>({
      query: ({ id, data }) => ({
        url: `product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFilteredProductsQuery,
  useLazyGetFilteredProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
