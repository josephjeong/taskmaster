import { useCallback } from "react";
import useSWR from "swr";
import { useAuthContext } from "../context/AuthContext";
import { User } from "../types";
import { api } from "./utils";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await api.post("/users/login", { email, password });
  return response.data.token;
};

export type SignupInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  bio?: string;
};

export const signup = async (args: SignupInput) => {
  if (!args.bio) {
    args.bio = "";
  }

  const response = await api.post("/users/signup", args);

  return response.data.token;
};

export const useMe = (runQuery: boolean) => {
  return useSWR<User | null>(runQuery ? "/users/me" : null);
};

export const useLogout = () => {
  const { setToken } = useAuthContext();
  return useCallback(() => {
    setToken(null);
  }, [setToken]);
};
