import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useAuthContext } from "../context/AuthContext";
import { User } from "../types";
import { api } from "./utils";

export const fetchProfile = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/details/${userId}`);
  return response.data;
};

export type UpdateProfileInput = Partial<Omit<User, "id">>;

export const useUpdateProfile = () => {
  const { user } = useAuthContext();
  const userId = user?.id;

  return useCallback(async (changes: UpdateProfileInput) => {
    const updater = (data: User | null) => data && { ...data, ...changes };
    // Optimistic update
    mutate("/users/me", updater, false);

    if (userId) {
      mutate(`/users/details/${userId}`, updater, false);
    }

    await api.post("/users/update", { changes });

    mutate("/users/me");
    mutate(`/users/details/${userId}`);
  }, []);
};

export const useUserProfile = (userId: string, initialProfile?: User) => {
  return useSWR<User>(`/users/details/${userId}`, {
    initialData: initialProfile,
  });
};