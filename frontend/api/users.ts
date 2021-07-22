import { useCallback } from "react";
import { User } from "../types";
import { api } from "./utils";

export const useSearchUserByEmail = () => {
  return useCallback(async (email: string): Promise<User | null> => {
    const { data: response } = await api.post("/users/by-email", { email });
    if ("data" in response) return response.data;
    throw response.error;
  }, []);
};
