export type ErrorDetails = Record<string, string[]>;

export interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: ErrorDetails;
}