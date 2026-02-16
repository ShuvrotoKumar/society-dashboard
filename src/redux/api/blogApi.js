import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "../../config/envConfig";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
  }),
  tagTypes: ["categories"],
    endpoints: (builder) => ({
        get_all_blogs: builder.query({
      query: () => "/blogs",
      providesTags: ["categories"],
    }),
    add_blog: builder.mutation({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    update_blog: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/blogs/${categoryId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    delete_blog: builder.mutation({
      query: (categoryId) => ({
        url: `/blogs/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGet_all_blogsQuery,
  useAdd_blogMutation,
  useUpdate_blogMutation,
  useDelete_blogMutation,
} = blogApi;
