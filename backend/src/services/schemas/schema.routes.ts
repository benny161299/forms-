import { Router } from 'express';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { catchAsync } from '../../middlewares/error.middleware.js'; 

import {
  createSchemaValidation,
  getSchemasValidation,
  getSchemaByIdValidation,
  updateSchemaValidation,
  deleteSchemaValidation
} from './schema.validations.js';

import {
  createSchema,
  getSchemas,
  getSchemaDrafts,
  getSchemaById,
  updateSchema,
  deleteSchema,
} from './schema.controller.js';

const router = Router();

router.post(
  '/', 
  validateRequest(createSchemaValidation), 
  catchAsync(createSchema)
);

router.get(
  '/', 
  validateRequest(getSchemasValidation), 
  catchAsync(getSchemas)
);

router.get(
  '/drafts', 
  validateRequest(getSchemasValidation), 
  catchAsync(getSchemaDrafts)
);

router.get(
  '/:id', 
  validateRequest(getSchemaByIdValidation), 
  catchAsync(getSchemaById)
);

router.put(
  '/:id', 
  validateRequest(updateSchemaValidation), 
  catchAsync(updateSchema)
);

router.delete(
  '/:id', 
  validateRequest(deleteSchemaValidation), 
  catchAsync(deleteSchema)
);

export default router;