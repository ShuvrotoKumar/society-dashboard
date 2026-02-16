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
    updateAdmin: builder.mutation({
      query: ({ requestData }) => ({
        url: `/admin/edit-admin/${requestData.id}`,
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["admin"],
    }),
   deleteAdmin: builder.mutation({
      query: ({ requestData }) => ({
        url: `/admin/delete-admin/${requestData.id}`,
        method: "DELETE",
        body: requestData,
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const { useGetAdminQuery, useCreateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } = adminApi;
