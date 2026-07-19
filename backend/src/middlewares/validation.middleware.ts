import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { type ZodType, z } from "zod";
import { AppError } from "./error.middleware.js";

interface RequestValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validateRequest = (schemas: RequestValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        return next(
          new AppError("Invalid Params", StatusCodes.BAD_REQUEST, z.treeifyError(result.error)),
        );
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        return next(
          new AppError("Invalid Query", StatusCodes.BAD_REQUEST, z.treeifyError(result.error)),
        );
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        return next(
          new AppError("Invalid Body", StatusCodes.BAD_REQUEST, z.treeifyError(result.error)),
        );
      }
      req.body = result.data;
    }

    return next();
  };
};
