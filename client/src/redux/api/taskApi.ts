import { createApi } from "@reduxjs/toolkit/query/react";
import { Task as TaskType, SubTask as SubTaskType } from "../../types";
import { baseQueryWithAccessToken } from "./baseQueryWithAccessToken";

interface TasksResponse {
  tasks: TaskType[];
}

interface TaskResponse {
  task: TaskType;
}

type Modify<T, R> = Omit<T, keyof R> & R;
type ModifiedTaskType = Modify<
  Omit<TaskType, "id" | "completed">,
  {
    subTasks: {
      name: string;
      description: string;
      price: number;
    }[];
  }
>;

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: baseQueryWithAccessToken,
  tagTypes: ["Task"],
  endpoints: (build) => ({
    getTasks: build.query<TaskType[], void>({
      query: () => "/api/tasks",
      transformResponse(response: TasksResponse, meta, arg) {
        return response.tasks;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Task" as const,
                id: id + "",
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    getTask: build.query<TaskType, number>({
      query: (id) => `api/task/${id}`,
      transformResponse(response: TaskResponse, meta, arg) {
        return response.task;
      },
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    addTask: build.mutation<any, ModifiedTaskType>({
      query: (body) => ({
        url: "/api/task",
        method: "POST",
        body,
        Credential: "include",
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(taskApi.util.invalidateTags([{ type: "Task", id: "LIST" }]));
        } catch (error) {
          throw error;
        }
      },
    }),
    updateTask: build.mutation<any, Omit<TaskType, "createdBy">>({
      query: (body) => ({
        url: "/api/task",
        method: "PUT",
        body,
        Credential: "include",
      }),
      async onQueryStarted({ id, ...rest }, { dispatch, queryFulfilled }) {
        const patchTaskResult = dispatch(
          taskApi.util.updateQueryData("getTask", id, (draft) => {
            draft = Object.assign(draft, rest);
            return draft;
          })
        );
        try {
          await queryFulfilled;
          dispatch(taskApi.util.invalidateTags([{ type: "Task", id: "LIST" }]));
        } catch (error) {
          patchTaskResult.undo();
          throw error;
        }
      },
    }),
    deleteTask: build.mutation<any, number>({
      query: (id) => ({
        url: "/api/task",
        method: "DELETE",
        body: { id },
        Credential: "include",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData("getTasks", undefined, (draftTasks) => {
            return draftTasks.filter((f) => f.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    addSubTask: build.mutation<any, Omit<SubTaskType, "id">>({
      query: (body) => ({
        url: "/api/subtask",
        method: "POST",
        body,
        Credential: "include",
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            taskApi.util.invalidateTags([{ type: "Task", id: body.rootTask }])
          );
        } catch (error) {
          throw error;
        }
      },
    }),
    updateSubTask: build.mutation<any, SubTaskType>({
      query: (body) => ({
        url: "/api/subtask",
        method: "PUT",
        body: {
          id: body.id,
          name: body.name,
          description: body.description,
          price: body.price,
        },
        Credential: "include",
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData("getTask", body.rootTask, (draft) => {
            if (!draft.subTasks) return draft;

            const paths = body.subTaskPath
              .split("->")
              .slice(1)
              .map((p) => p.trim().match(/[0-9]+/)?.[0])
              .map((p) => Number(p));
            let subTaskArr: SubTaskType[] = draft.subTasks;

            while (paths.length > 0 && subTaskArr && subTaskArr.length > 0) {
              const parentId = paths.shift();
              const parent: SubTaskType | undefined = subTaskArr.find(
                (s) => s.id === parentId!
              );

              if (!parent) return draft;
              if (!parent.children) return draft;
              subTaskArr = parent.children;
            }

            const updateIdx = subTaskArr.findIndex((s) => s.id !== body.id);
            subTaskArr[updateIdx] = Object.assign(subTaskArr[updateIdx], {
              id: body.id,
              name: body.name,
              description: body.description,
              price: body.price,
            });
            return draft;
          })
        );
        try {
          await queryFulfilled;
          dispatch(
            taskApi.util.invalidateTags([{ type: "Task", id: body.rootTask }])
          );
        } catch (error) {
          patchResult.undo();
          throw error;
        }
      },
    }),
    deleteSubTask: build.mutation<
      any,
      { id: number; rootTask: number; subTaskPath: string }
    >({
      query: (body) => ({
        url: "/api/subtask",
        method: "DELETE",
        body: { id: body.id },
        Credential: "include",
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskApi.util.updateQueryData("getTask", body.rootTask, (draft) => {
            if (!draft.subTasks) return draft;

            const paths = body.subTaskPath
              .split("->")
              .slice(1)
              .map((p) => p.trim().match(/[0-9]+/)?.[0])
              .map((p) => Number(p));
            let subTaskArr: SubTaskType[] = draft.subTasks;

            while (paths.length > 0 && subTaskArr && subTaskArr.length > 0) {
              const parentId = paths.shift();
              const parent: SubTaskType | undefined = subTaskArr.find(
                (s) => s.id === parentId!
              );

              if (!parent) return draft;
              if (!parent.children) return draft;
              subTaskArr = parent.children;
            }

            const deleteIdx = subTaskArr.findIndex((s) => s.id !== body.id);
            subTaskArr.splice(deleteIdx, 1);
            return draft;
          })
        );
        try {
          await queryFulfilled;
          dispatch(
            taskApi.util.invalidateTags([{ type: "Task", id: body.rootTask }])
          );
        } catch (error) {
          patchResult.undo();
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useAddSubTaskMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
} = taskApi;
