import useSWR, { mutate } from "swr";
import { useAuthContext } from "../context/AuthContext";
import { Task } from "../types";
import { useCallback } from "react";
import { api, mkQueryString } from "./utils";

export const useTasks = (filters: {[key: string]: any}) => {
  console.log(mkQueryString(filters));
  return useSWR<Task[]>(`/tasks?${mkQueryString(filters)}`);
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
  return useCallback(async (task: Task) => {
    mutate(
      "/tasks",
      (existingTasks: Task[] | null) =>
        existingTasks ? [...existingTasks, task] : [task],
      false
    );
    await api.post("/task/create", task);
    mutate("/tasks");
  }, []);
};

export const useEditTask = () => {
  return useCallback(async (taskId: string, taskUpdates: Partial<Task>) => {
    mutate(
      "/tasks",
      (existingTasks: Task[]) =>
        existingTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, taskUpdates };
          }
          return task;
        }),
      false
    );
    await api.post(`/task/edit/${taskId}`, taskUpdates);
    mutate("/tasks");
  }, []);
};

export const useDeleteTask = () => {
  return useCallback(async (taskId: string) => {
    mutate(
      "/tasks",
      (existingTasks: Task[]) =>
        existingTasks.filter((task) => task.id !== taskId),
      false
    );
    await api.delete(`/task/delete/${taskId}`);
    mutate("/tasks");
  }, []);
};
