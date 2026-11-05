import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { type ZodType, z } from "zod";
import { AppError, type ValidationErrorDetails } from "./error.middleware.js";

interface RequestValidationSchemas {
  body: ZodType;
  query: ZodType;
  params: ZodType;
}

export const validateRequest = (schemas: RequestValidationSchemas) => {
  const validateSchema = z.object({
    body: schemas.body,
    query: schemas.query,
    params: schemas.params,
  });

  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validateSchema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors: ValidationErrorDetails = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "root";
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }

      return next(new AppError("Validation failed", StatusCodes.BAD_REQUEST, errors));
    }
    req.body = result.data.body;
    req.params = result.data.params as typeof req.params;
    Object.defineProperty(req, "query", {
      value: result.data.query,
      writable: true,
      configurable: true,
      enumerable: true,
    });

    return next();
  };
};
