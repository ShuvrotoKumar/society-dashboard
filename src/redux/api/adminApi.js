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
    createAdmin: builder.mutation({
      query: ({ requestData }) => ({
        url: "/admin/register",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["admin"],
    }),
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

export const { useGetAdminQuery, useCreateAdminMutation } = adminApi;
