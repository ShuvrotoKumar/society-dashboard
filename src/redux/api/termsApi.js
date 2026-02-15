import { baseApi } from "./baseApi";

const termsAndConditionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditions: builder.query({
      query: () => ({
        url: "/legal-docs/terms-conditions",
        method: "GET",
      }),
      providesTags: ["termsAndConditions"],
    }),
    createTermsAndConditions: builder.mutation({
      query: ({ requestData }) => ({
        url: "/legal-docs/terms-conditions",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["termsAndConditions"],
    }),
    updateTermsAndConditions: builder.mutation({
      query: ({ requestData }) => ({
        url: "/legal-docs/terms-conditions",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["termsAndConditions"],
    }),
  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useCreateTermsAndConditionsMutation,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionsApi;
