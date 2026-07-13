import { z } from 'zod';
import { instanceSchema } from './instance.types.js';


export const emptyObj = z.object({});

export const mongoIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/);

export const createInstanceValidation = {
  body: instanceSchema,
  query: emptyObj,
  params: emptyObj
};

export const getInstancesValidation = {
  body: emptyObj,
  query: emptyObj,
  params: emptyObj
};

export const getInstanceByIdValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema })
};

export const getInstancesBySchemaIdValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ schemaId: mongoIdSchema })
};

export const updateInstanceValidation = {
  body: instanceSchema,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema })
};

export const deleteInstanceValidation = {
  body: emptyObj,
  query: emptyObj,
  params: z.object({ id: mongoIdSchema })
};