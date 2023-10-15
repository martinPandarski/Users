import { validBoolean, validNumber, validString } from "../../utils";
import { api } from "./api";

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TodoPayload {
  page: number;
  completed: boolean | undefined;
  title: string | undefined;
  userId: number | undefined;
}

type TodoResponse = {
  todos: Todo[];
  totalPageCount: number;
};

export const tasksApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** @deprecated */
    getTodos: build.query<TodoResponse, TodoPayload>({
      query: (args) => {
        const { page, completed, title, userId } = args;
        const queryParams: string[] = [];

        if (validBoolean(completed)) {
          queryParams.push(`completed=${completed}`);
        }

        if (validString(title)) {
          queryParams.push(`title=${title}`);
        }

        if (validNumber(userId)) {
          queryParams.push(`userId=${userId}`);
        }

        const queryString =
          queryParams.length > 0 ? `&${queryParams.join("&")}` : "";

        return `todos?_page=${page}${queryString}`;
      },
      transformResponse(apiResponse: Todo[], meta) {
        if (meta?.response) {
          const count = Number(meta.response.headers.get("X-Total-Count")) / 10;
          return {
            todos: apiResponse,
            totalPageCount: count || 0,
          };
        }
        return {
          todos: apiResponse,
          totalPageCount: 0,
        };
      },
    }),
    getAllTodos: build.query<Todo[], void>({
      query: () => "todos",
    }),
  }),
});

export const { useGetAllTodosQuery, useGetTodosQuery } = tasksApi;
