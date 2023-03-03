import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { foodApi } from "./api/foodApi";
import { taskApi } from "./api/taskApi";
import { accountApi } from "./api/accountApi";
import auth from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    [foodApi.reducerPath]: foodApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    auth,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      foodApi.middleware,
      taskApi.middleware,
      accountApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
