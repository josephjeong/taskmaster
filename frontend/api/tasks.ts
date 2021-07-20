import useSWR, { mutate } from "swr";
import { useAuthContext } from "../context/AuthContext";
import { Task } from "../types";
import { useCallback } from "react";
import { api } from "./utils";

export const useUserTasks = (userId: string) => {
  const { user } = useAuthContext();
  let key = null;

  if (user?.id) {
    if (user.id === userId) {
      key = "/tasks";
    } else {
      key = `/users/tasks/${userId}`;
    }
  }

  return useSWR<Task[]>(key);
};

export const useMyTasks = () => {
  return useSWR<Task[]>("/tasks");
};

export const useCreateTask = () => {
  return useCallback(async (task: Task) => {
    await api.post('/tasks/create', task);
    mutate('/tasks');
  }, []);
};

export const useEditTask = () => {
  return useCallback(async (taskUpdates: Partial<Task>) => {
    await api.post('/tasks/edit', taskUpdates);
    mutate('/tasks');
  }, []);
};
