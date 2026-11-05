import axios, { type AxiosInstance } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TIMEOUT_MS = 15000;

export const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
});

export const isAxiosError = axios.isAxiosError;

export const isNotFoundError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;
