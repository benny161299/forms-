import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export type ValidationErrorDetails = Record<string, string[]>;

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: ValidationErrorDetails,
  ) {
    super(message);
  }
}

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.errors) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
        errors: err.errors,
      });
    }

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("server error:", err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Internal server error",
  });
};
