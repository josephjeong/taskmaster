import axios from "axios";
import { LOCALSTORAGE_TOKEN_KEY } from "../context/AuthContext";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Automatically add jwt header to request
api.interceptors.request.use((request) => {
  if (!request.headers.jwt && typeof window !== "undefined") {
    request.headers.jwt = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) ?? "null"
    );
  }
  return request;
});

export const swrFetcher = async (url: string) => {
  const response = await api.get(url);
  // if (response.data.data) {
  //   return response.data.data;
  // }
  // throw response.data.errors;
  return response.data;
};
