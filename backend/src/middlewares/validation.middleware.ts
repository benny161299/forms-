import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { type ZodType, z } from "zod";
import { AppError } from "./error.middleware.js";

interface RequestValidationSchemas {
  body: ZodType;
  query: ZodType;
  params: ZodType;
}

export const validateRequest = (schemas: RequestValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validateSchema = z.object({
      body: schemas.body,
      query: schemas.query,
      params: schemas.params,
    });

    const result = validateSchema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          StatusCodes.BAD_REQUEST,
          z.flattenError(result.error).fieldErrors,
        ),
      );
    }
    req.body = result.data.body ?? {};

    return next();
  };
};
