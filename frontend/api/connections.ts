import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { ConnectionStatus } from "../types";
import { api } from "./utils";

export const useRequestConnection = () => {
  return useCallback(async (userId: string) => {
    mutate(`/connection/status/${userId}`, ConnectionStatus.REQUESTED, false);
    await api.post("/connection/create", { id: userId });
    mutate(`/connection/status/${userId}`);
  }, []);
};

export const useConnectionStatus = (userId: string) => {
  return useSWR<ConnectionStatus>(`/connection/status/${userId}`);
};
