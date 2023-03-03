import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Account as AccountType } from "../../types";

interface AuthState {
  account: AccountType | null;
  accessToken: string | undefined;
}

const initialState: AuthState = {
  account: null,
  accessToken: window.localStorage.getItem("todoapp_access_token") || undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<AuthState>>) => {
      if (action.payload.accessToken)
        state.accessToken = action.payload.accessToken;
      if (action.payload.account) state.account = action.payload.account;
    },
    clearCredintials: (state) => {
      state.account = null;
      state.accessToken = undefined;
    },
  },
});

export const { setCredentials, clearCredintials } = authSlice.actions;
export default authSlice.reducer;
