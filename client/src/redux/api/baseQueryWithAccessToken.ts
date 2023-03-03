import { BaseQueryApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import jwtDecode from "jwt-decode";
import { setCredentials } from "../auth/authSlice";

const isTokenValidOrUndefined = (token: string | undefined) => {
  if (!token) return true;

  try {
    const { exp }: any = jwtDecode(token);

    if (Date.now() >= exp * 1000) return false;
    return true;
  } catch (error) {
    return false;
  }
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_SERVER_BASE_URL,
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAccessToken = async (
  args: any,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const token = (api.getState() as RootState).auth.accessToken;

  if (isTokenValidOrUndefined(token)) return baseQuery(args, api, extraOptions);

  const result: any = await baseQuery(
    {
      url: "/api/refresh_token",
      method: "POST",
      credentials: "include",
    },
    api,
    extraOptions
  );

  console.log("fetch refresh_token: ", result);

  if (result?.data?.ok && result?.data?.access_token) {
    window.localStorage.setItem(
      "todoapp_access_token",
      result.data.access_token
    );
    api.dispatch(setCredentials({ accessToken: result.data.access_token }));
  } else {
    api.dispatch(setCredentials({ accessToken: undefined }));
  }

  return baseQuery(args, api, extraOptions);
};
