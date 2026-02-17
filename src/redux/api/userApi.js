import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamUser: builder.query({
      query: (params) => ({
        url: "/team-members",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["user"],
    }),
    createTeamUser:builder.mutation({
      query: (data) => {
        return {
          url: `/team-members`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...data }) => {
        return {
          url: `/team-members/${userId}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/team-members/delete/${userId}`,
        method: "DELETE",
        body: { id: userId },
      }),
      invalidatesTags: ["user"],
    }),
    
  }),
});

export const {
  useGetTeamUserQuery,
  useCreateTeamUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
