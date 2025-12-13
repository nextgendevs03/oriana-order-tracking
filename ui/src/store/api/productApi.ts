import { baseApi } from "./baseApi";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
} from "@OrianaTypes";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse[], void>({
      query: () => ({ url: "product/", method: "GET" }),
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

    updateProduct: builder.mutation<
      ProductResponse,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<{ deleted: boolean }, string>({
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
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
