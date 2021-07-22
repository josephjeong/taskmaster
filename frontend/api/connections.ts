import { useCallback } from "react";
import useSWR, { mutate } from "swr";
import { ConnectionStatus, User } from "../types";
import { api } from "./utils";

export const useRequestConnection = () => {
  return useCallback(async (userId: string) => {
    mutate(`/connection/status/${userId}`, ConnectionStatus.REQUESTED, false);
    await api.post("/connection/create", { id: userId });
    mutate(`/connection/status/${userId}`);
  }, []);
};

export const useDeleteConnection = () => {
  return useCallback(async (userId: string) => {
    mutate(`/connection/status/${userId}`, ConnectionStatus.UNCONNECTED, false);
    await api.post("/connection/delete", { id: userId });
    mutate(`/connection/status/${userId}`);
  }, []);
};

export const useAcceptConnection = () => {
  return useCallback(async (userId: string) => {
    mutate(`/connection/status/${userId}`, ConnectionStatus.CONNECTED, false);
    await api.post('/connection/accept', { id: userId });
    mutate(`/connection/status/${userId}`);
  }, []);
};

export const useDeclineConnection = () => {
  return useCallback(async (userId: string) => {
    mutate(`/connection/status/${userId}`, ConnectionStatus.UNCONNECTED, false);
    await api.post('/connection/decline', { id: userId });
    mutate(`/connection/status/${userId}`);
  }, []);
};

export const useConnectionStatus = (userId: string) => {
  return useSWR<ConnectionStatus>(`/connection/status/${userId}`);
};

export const useIncomingConnectionRequests = () => {
  return useSWR<User[]>(`/connection/incomingRequests`);
};

export const useOutgoingConnectionRequests = () => {
  return useSWR<User[]>(`/connection/outgoingRequests`);
};
