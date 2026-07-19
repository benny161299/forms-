import type { NextFunction, Request, Response } from "express";
import { type ZodType, z } from "zod";

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
      return next(result.error);
    }
    req.body = result.data.body;

    return next();
  };
};
