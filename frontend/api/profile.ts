import useSWR from "swr";
import { User } from "../types";
import { api } from "./utils";

export const fetchProfile = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/details/${userId}`);
  return response.data;
};

export const useUserProfile = (userId: string) => {
  return useSWR<User>(`/users/details/${userId}`);
};
