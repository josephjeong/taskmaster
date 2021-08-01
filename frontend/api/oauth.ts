import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useAuthContext } from "../context/AuthContext";
import { ApiResponse } from "../types";
import { api } from "./utils";

export const useGetAuthUrl = () => {
  return useCallback(async (): Promise<string> => {
    const { data: response } = await api.get("/authenticate/googlecal");
    return response.data;
  }, []);
};

export const useHadSavedCredentials = () => {
  const { user } = useAuthContext();

  return useSWR<boolean>(user ? "/oauthtokens/check" : null);
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

export const useDeleteCredential = () => {
  return useCallback(async () => {
    await api.post<ApiResponse<string>>("/oauthtokens/clear");
    mutate("/oauthtokens/check", false);
  }, []);
};
