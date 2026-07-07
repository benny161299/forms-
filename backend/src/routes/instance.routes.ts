import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { instanceSchema } from '../types/instance.types.js';
import {
  createInstance,
  getInstances,
  getInstancesDrafts, 
  getInstancesBySchemaId,
  getInstanceById,
  updateInstance,
  deleteInstance,
} from '../controllers/instance.controller.js';

const router = Router();

const emptyObj = z.object({});

const idSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/)
});


router.post(
  '/',
  validateRequest({
    body: instanceSchema,
    query: emptyObj,
    params: emptyObj
  }),
  createInstance
);

router.get(
  '/',
  validateRequest({
    body: emptyObj,
    query: emptyObj,
    params: emptyObj
  }),
  getInstances
);

router.get(
  '/drafts',
  validateRequest({
    body: emptyObj,
    query: emptyObj,
    params: emptyObj
  }),
  getInstancesDrafts
);

router.get(
  '/schema/:schemaId',
  validateRequest({
    params: idSchema,
    body: emptyObj,
    query: emptyObj
  }),
  getInstancesBySchemaId
);

router.get(
  '/:id',
  validateRequest({
    params: idSchema,
    body: emptyObj,
    query: emptyObj
  }),
  getInstanceById
);