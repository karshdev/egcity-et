import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}`,
    prepareHeaders: (headers, { endpoint }) => {
      const user = JSON.parse(localStorage.getItem("user"));
      headers.set("Authorization", `Bearer ${user?.token}`);
      headers.set("Cookie", "JSESSIONID=13CE0F53190CC7367FF06C791AC3FF27");
      if (endpoint !== "uploadFile") {
        headers.set("Content-Type", "application/json");
        return headers;
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (data) => ({
        url: `/transaction`,
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard"],
    }),
    getExistingParty: builder.query({
      query: () => ({
        url: `/transaction/party`,
        method: "GET",
      }),
      invalidatesTags: ["Dashboard"],
    }),
    getDashboardTransactionData: builder.query({
      query: (date) => ({
        url: `/dashboard/summary?dateOrMonth=${date}`,
        method: "GET",
      }),
    }),
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: `/file/upload`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: "DELETE",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetExistingPartyQuery,
  useUploadFileMutation,
  useGetDashboardTransactionDataQuery,
  useDeleteTransactionMutation
} = api;
