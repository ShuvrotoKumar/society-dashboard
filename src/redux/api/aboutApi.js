import { baseApi } from "./baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: "/legal-docs/about-us",
        method: "GET",
      }),
      providesTags: ["about"],
    }),
    createAbout: builder.mutation({
      query: ({ requestData }) => ({
        url: "/legal-docs/about-us",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["about"],
    }),
    updateAbout: builder.mutation({
      query: ({ requestData }) => ({
        url: "/legal-docs/about-us",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["about"],
    }),
  }),
});

export const { useGetAboutQuery, useCreateAboutMutation, useUpdateAboutMutation } = aboutApi;
