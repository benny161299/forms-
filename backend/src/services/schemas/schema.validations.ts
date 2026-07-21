import { z } from "zod";
import { emptyObj, mongoIdSchema } from "../../utils/validation.utils.js";
import { schemaSchema } from "./schema.types.js";

export const createSchemaValidation = {
  body: schemaSchema.pick({ title: true, sections: true }),
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
  body: schemaSchema.pick({ title: true, sections: true }),
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const publishSchemaValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const deleteSchemaValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};
