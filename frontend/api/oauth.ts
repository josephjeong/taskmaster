import { useCallback } from "react";
import { api } from "./utils";

export const useGetAuthUrl = () => {
  return useCallback(async (): Promise<string> => {
    const { data: response } = await api.get("/authenticate/googlecal");
    return response.data;
  }, []);
};

export const useSaveTokens = () => {
  return useCallback(
    async (refreshToken: string, accessToken: string): Promise<void> => {
      const { data: response } = await api.post("/oauthtokens/save", {
        refresh_token: refreshToken,
        access_token: accessToken,
      });
      if (response.error) {
        throw response.error;
      }
    },
    []
  );
};
