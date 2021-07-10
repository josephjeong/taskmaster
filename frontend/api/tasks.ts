import useSWR from "swr";
import { useAuthContext } from "../context/AuthContext";
import { Task } from "../types";

export const useUserTasks = (userId: string) => {
  const { user } = useAuthContext();
  let key = null;

  if (user) {
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
