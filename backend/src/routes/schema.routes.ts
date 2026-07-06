import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { schemaSchema } from '../types/schema.types.js';
import {
  createSchema,
  getSchemas,
  getSchemaDrafts,
  getSchemaById,
  updateSchema,
  deleteSchema,
} from '../controllers/schema.controller.js';

const router = Router();

const emptyObj = z.object({});

const idSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/)
});

router.post(
  '/',
  validateRequest({
    body: schemaSchema,
    query: emptyObj,
    params: emptyObj
  }),
  createSchema
);

router.get(
  '/',
  validateRequest({
    body: emptyObj,
    query: emptyObj,
    params: emptyObj
  }),
  getSchemas
);

router.get(
  '/drafts',
  validateRequest({
    body: emptyObj,
    query: emptyObj,
    params: emptyObj
  }),
  getSchemaDrafts
);

router.get(
  '/:id',
  validateRequest({
    params: idSchema,
    body: emptyObj,
    query: emptyObj
  }),
  getSchemaById
);

router.put(
  '/:id',
  validateRequest({
    params: idSchema,
    body: schemaSchema,
    query: emptyObj
  }),
  updateSchema
);

router.delete(
  '/:id',
  validateRequest({
    params: idSchema,
    body: emptyObj,
    query: emptyObj
  }),
  deleteSchema
);

export default router;