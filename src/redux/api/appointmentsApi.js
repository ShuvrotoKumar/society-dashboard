import { baseApi } from "./baseApi";

export const allAppointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAppointments: builder.query({
      query: (params) => ({
        url: "/appointments",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["appointments"],
    }),
  }),
});

export const { useGetAllAppointmentsQuery } = allAppointmentsApi;
