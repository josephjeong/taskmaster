import { FC } from "react";

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
};

export enum ConnectionStatus {
  UNCONNECTED = "unconnected",
  REQUESTED = "requested",
  CONNECTED = "connected",
}

export type PropsOf<TComponent extends FC> = Parameters<TComponent>[0];

export type ApiError = {
  code: string;
  message: string;
};

export type ApiErrors = ApiError[];

export type ApiResponse<TData = any> =
  | { data: null; errors: ApiErrors }
  | { data: TData; errors: null };
