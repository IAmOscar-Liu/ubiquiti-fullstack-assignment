import { createApi } from "@reduxjs/toolkit/query/react";
import { Account as AccountType, LoginInput, RegisterInput } from "../../types";
import { clearCredintials, setCredentials } from "../auth/authSlice";
import { baseQueryWithAccessToken } from "./baseQueryWithAccessToken";

interface LogInAndRegisterResponse {
  account: AccountType;
  accessToken: string;
}

export const accountApi = createApi({
  reducerPath: "accountApi",
  tagTypes: ["Account"],
  baseQuery: baseQueryWithAccessToken,
  endpoints: (build) => ({
    me: build.query<Partial<LogInAndRegisterResponse>, void>({
      query: (body) => ({ url: "/api/auth/me", method: "POST", body }),
      providesTags: [{ type: "Account", id: "ME" }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log("start getting meQuery");
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken && data.account) {
            dispatch(setCredentials(data));
          }
        } catch (error) {
          throw error;
        }
      },
    }),
    login: build.mutation<LogInAndRegisterResponse, LoginInput>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // console.log("start login");
          const { data } = await queryFulfilled;
          // console.log("login fulfilled");
          window.localStorage.setItem("todoapp_access_token", data.accessToken);
          dispatch(setCredentials(data));
          /*dispatch(
            accountApi.util.updateQueryData("me", undefined, (draft) => {
              draft = data;
              return draft;
            })       
          );*/
          dispatch(
            accountApi.util.invalidateTags([{ type: "Account", id: "ME" }])
          );
          console.log("finish login");
        } catch (error) {
          throw error;
        }
      },
      // // Don't use invalidatesTags because it re-runs query immediately
      // invalidatesTags: (result) => [{ type: "Account", id: "ME" }],
    }),
    register: build.mutation<LogInAndRegisterResponse, RegisterInput>({
      query: (body) => ({ url: "api/auth/register", method: "POST", body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // console.log("start register");
          const { data } = await queryFulfilled;
          window.localStorage.setItem("todoapp_access_token", data.accessToken);
          dispatch(setCredentials(data));
          /*dispatch(
            accountApi.util.updateQueryData("me", undefined, (draft) => {
              draft = data;
              return draft;
            })
          );*/
          dispatch(
            accountApi.util.invalidateTags([{ type: "Account", id: "ME" }])
          );
          // console.log("finish register");
        } catch (error) {
          throw error;
        }
      },
    }),
    logout: build.mutation<any, void>({
      query: () => ({ url: "api/auth/logout", method: "POST" }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        window.localStorage.removeItem("todoapp_access_token");
        dispatch(clearCredintials());
        /*dispatch(
          accountApi.util.updateQueryData("me", undefined, (draft) => {
            draft = {};
            return draft;
          })
        );*/
        dispatch(
          accountApi.util.invalidateTags([{ type: "Account", id: "ME" }])
        );
        // console.log("start logout");
        await queryFulfilled;
        // console.log("finish logout");
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
} = accountApi;
