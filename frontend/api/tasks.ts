import useSWR, { mutate } from "swr";
import { useAuthContext } from "../context/AuthContext";
import { ApiResponse, Task } from "../types";
import { useCallback } from "react";
import { api, mkQueryString, swrFetcher } from "./utils";

export const useTasks = (filters: { [key: string]: any }) => {
  console.log(mkQueryString(filters));
  const { user } = useAuthContext();
  return useSWR<Task[]>(user ? `/tasks` : null, () =>
    swrFetcher(`/tasks?${mkQueryString(filters)}`)
  );
};

export const useUserTasks = (userId?: string) => {
  const { user } = useAuthContext();
  let key = null;

  if (user?.id && userId) {
    if (user.id === userId) {
      key = "/tasks";
    } else {
      key = `/users/tasks/${userId}`;
    }
  }

  return useSWR<Task[]>(key);
};

export const useCreateTask = () => {
  return useCallback(async (task: Task): Promise<ApiResponse> => {
    mutate(
      `/tasks`,
      (existingTasks: Task[] | null) =>
        existingTasks ? [...existingTasks, task] : [task],
      false
    );
    const { data } = await api.post("/task/create", task);
    mutate(`/tasks`);
    return data;
  }, []);
};

export const useEditTask = () => {
  return useCallback(
    async (
      taskId: string,
      taskUpdates: Partial<Task>
    ): Promise<ApiResponse> => {
      mutate(
        `/tasks`,
        (existingTasks: Task[]) =>
          existingTasks?.map((task) => {
            if (task.id === taskId) {
              return { ...task, taskUpdates };
            }
            return task;
          }),
        false
      );
      const { data } = await api.post(`/task/edit/${taskId}`, taskUpdates);
      mutate(`/tasks`);
      return data;
    },
    []
  );
};

export const useDeleteTask = () => {
  return useCallback(async (taskId: string): Promise<ApiResponse> => {
    mutate(
      `/tasks`,
      (existingTasks: Task[]) =>
        existingTasks.filter((task) => task.id !== taskId),
      false
    );
    const { data } = await api.delete(`/task/delete/${taskId}`);
    mutate(`/tasks`);
    return data;
  }, []);
};
