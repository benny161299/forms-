import { Request, Response, NextFunction } from 'express';
import { ZodType , z} from 'zod';

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: z.treeifyError(result.error),
      });
    }

    req.body = result.data;
    return next();
  };
};