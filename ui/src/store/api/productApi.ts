import { CreateProductRequest, ProductResponse, UpdateProductRequest } from "@OrianaTypes";
import { baseApi } from "./baseApi";

// Query params for filtered products
export interface GetProductsParams {
  categoryId?: string;
  oemId?: string;
  isActive?: boolean;
  name?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: ProductResponse[] }, void>({
      query: () => ({ url: "product/", method: "GET" }),
      providesTags: ["Product"],
    }),

    // Get filtered products by categoryId and/or oemId
    getFilteredProducts: builder.query<ProductResponse[], GetProductsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.categoryId) queryParams.append("categoryId", params.categoryId);
        if (params.oemId) queryParams.append("oemId", params.oemId);
        if (params.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
        if (params.name) queryParams.append("name", params.name);
        
        return {
          url: `product/?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
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
