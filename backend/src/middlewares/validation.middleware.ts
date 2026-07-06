import { Request, Response, NextFunction } from 'express';
import { ZodType, z } from 'zod';

interface RequestValidationSchemas {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}

export const validateRequest = (schemas: RequestValidationSchemas) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                return res.status(400).json({ status: 'error', message: 'Invalid Params', errors: z.treeifyError(result.error) });
            }
        }

        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                return res.status(400).json({ status: 'error', message: 'Invalid Query', errors: z.treeifyError(result.error) });
            }
        }

        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ status: 'error', message: 'Invalid Body', errors: z.treeifyError(result.error) });
            }
            req.body = result.data;
        }

        return next();
    };
};