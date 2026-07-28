import axios, { type AxiosInstance } from "axios";
import type { ErrorDetails, ApiErrorResponse } from "../types/api.types";

export class ApiError extends Error {
  status?: number;
  errors?: ErrorDetails;

  constructor(message: string, status?: number, errors?: ErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      if (!error.response) {
        throw new ApiError("server is offline");
      }

      const responseData = error.response.data;
      const message = responseData?.message || "something went wrong";
      const status = error.response.status;
      const errors = responseData?.errors;

      throw new ApiError(message, status, errors);
    }

    throw new ApiError("something went wrong");
  }
);