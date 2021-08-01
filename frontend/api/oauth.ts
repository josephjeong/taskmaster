import { useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import { ApiResponse } from "../types";
import { api } from "./utils";

export const useGetAuthUrl = () => {
  return useCallback(async (): Promise<string> => {
    const { data: response } = await api.get("/authenticate/googlecal");
    return response.data;
  }, []);
};

export const useSaveOAuthCode = () => {
  const { token } = useAuthContext();

  return useCallback(
    async (code: string): Promise<ApiResponse<{}>> => {
      const { data: response } = await api.post("/oauthtokens/save", {
        code,
        jwt: token,
      });
      return response;
    },
    [token]
  );
};
