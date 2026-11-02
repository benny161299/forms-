import { z } from "zod";
import { emptyObj, mongoIdSchema } from "../../utils/validation.utils.js";
import { draftSchema } from "./schema.types.js";

export const createSchemaValidation = {
  body: draftSchema.pick({ title: true, description: true, sections: true }),
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
  body: draftSchema.pick({ title: true, description: true, sections: true }),
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
