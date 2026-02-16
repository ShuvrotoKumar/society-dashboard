import { baseApi } from "./baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmin: builder.query({
      query: () => ({
        url: "/admin/all-admins",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    // createAdmin: builder.mutation({
    //   query: ({ requestData }) => ({
    //     url: "/legal-docs/about-us",
    //     method: "POST",
    //     body: requestData,
    //   }),
    //   invalidatesTags: ["about"],
    // }),
    // updateAdmin: builder.mutation({
    //   query: ({ requestData }) => ({
    //     url: "/legal-docs/about-us",
    //     method: "PATCH",
    //     body: requestData,
    //   }),
    //   invalidatesTags: ["about"],
    // }),
  }),
});

export const { useGetAdminQuery, useCreateAdminMutation, useUpdateAdminMutation } = adminApi;
