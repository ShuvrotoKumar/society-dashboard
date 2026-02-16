import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../config/envConfig";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["blog"],
    endpoints: (builder) => ({
        get_all_blogs: builder.query({
      query: () => "/blogs",
      providesTags: ["blog"],
    }),
    add_blog: builder.mutation({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    update_blog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    delete_blog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useGet_all_blogsQuery,
  useAdd_blogMutation,
  useUpdate_blogMutation,
  useDelete_blogMutation,
} = blogApi;
