import { z } from "zod";
import { emptyObj, mongoIdSchema } from "../../utils/validation.utils.js";
import { instanceSchema } from "./instance.types.js";

export const createInstanceValidation = {
  body: instanceSchema.pick({ schemaId: true }),
  query: emptyObj,
  params: emptyObj,
};

export const getInstancesValidation = {
  body: emptyObj,
  query: emptyObj,
  params: emptyObj,
};

export const getInstanceByIdValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const getInstancesBySchemaIdValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ schemaId: mongoIdSchema }),
};

export const updateInstanceValidation = {
  body: instanceSchema.pick({ answers: true }),
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const submitInstanceValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};

export const deleteInstanceValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema }),
};
