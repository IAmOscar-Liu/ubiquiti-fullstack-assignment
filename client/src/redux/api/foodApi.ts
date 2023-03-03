import { createApi } from "@reduxjs/toolkit/query/react";
import { Food as FoodType } from "../../types";
import { baseQueryWithAccessToken } from "./baseQueryWithAccessToken";

interface FoodsResponse {
  foods: FoodType[];
}

interface FoodResponse {
  food: FoodType;
}

export const foodApi = createApi({
  reducerPath: "foodApi",
  baseQuery: baseQueryWithAccessToken,
  tagTypes: ["Food"],
  endpoints: (build) => ({
    getFoods: build.query<FoodType[], void>({
      query: () => "/api/foods",
      transformResponse(response: FoodsResponse, meta, arg) {
        return response.foods;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Food" as const,
                id,
              })),
              { type: "Food", id: "LIST" },
            ]
          : [{ type: "Food", id: "LIST" }],
    }),
    getFood: build.query<FoodType, number>({
      query: (id) => `api/food/${id}`,
      transformResponse(response: FoodResponse, meta, arg) {
        return response.food;
      },
      providesTags: (result, error, id) => [{ type: "Food", id }],
    }),
    addFood: build.mutation<any, Omit<FoodType, "id">>({
      query: (body) => ({
        url: "/api/food",
        method: "POST",
        body,
        Credential: "include",
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(foodApi.util.invalidateTags([{ type: "Food", id: "LIST" }]));
        } catch (error) {
          throw error;
        }
      },
    }),
    updateFood: build.mutation<any, Omit<FoodType, "createdBy">>({
      query: (body) => ({
        url: "/api/food",
        method: "PUT",
        body,
        Credential: "include",
      }),
      async onQueryStarted({ id, ...rest }, { dispatch, queryFulfilled }) {
        const patchFoodResult = dispatch(
          foodApi.util.updateQueryData("getFood", id, (draft) => {
            draft = Object.assign(draft, rest);
            return draft;
          })
        );
        try {
          await queryFulfilled;
          dispatch(foodApi.util.invalidateTags([{ type: "Food", id }]));
        } catch (error) {
          patchFoodResult.undo();
          throw error;
        }
      },
    }),
    deleteFood: build.mutation<any, number>({
      query: (id) => ({
        url: "/api/food",
        method: "DELETE",
        body: { id },
        Credential: "include",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          foodApi.util.updateQueryData("getFoods", undefined, (draftFoods) => {
            return draftFoods.filter((f) => f.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetFoodsQuery,
  useGetFoodQuery,
  useUpdateFoodMutation,
  useAddFoodMutation,
  useDeleteFoodMutation,
} = foodApi;
