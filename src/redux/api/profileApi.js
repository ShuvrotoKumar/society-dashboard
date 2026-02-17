import { baseApi } from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getUserProfile: builder.query({
    //   query: (params) => ({
    //     url: "user/user-detail",
    //     method: "GET",
    //     params,
    //   }),
    //   providesTags: ["profile"],
    // }),
    // updateProfile: builder.mutation({
    //   query: (file) => ({
    //     url: "user/update-profile",
    //     method: "PATCH",
    //     body: file,
    //   }),
    //   invalidatesTags: ["profile"],
    // }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetUserProfileQuery,
  useGetUserDetailsQuery,
} = profileApi;
