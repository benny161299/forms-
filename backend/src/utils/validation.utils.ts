import { z } from "zod";

export const emptyObj = z.object({}).optional().default({});
export const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
