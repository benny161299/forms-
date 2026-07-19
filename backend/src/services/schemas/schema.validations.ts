import { z } from "zod";
import { schemaSchema } from "./schema.types.js";

export const emptyObj = z.object({});
export const mongoIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/);

export const createSchemaValidation = {
  body: schemaSchema,
  query: emptyObj,
  params: emptyObj,
};

export const getSchemasValidation = {
  body: emptyObj,
  query: emptyObj,
  params: emptyObj,
};

export const getSchemaByIdValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const updateSchemaValidation = {
  body: schemaSchema,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const deleteSchemaValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};
