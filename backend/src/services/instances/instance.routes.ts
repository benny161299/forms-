import { Router } from 'express';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { catchAsync } from '../../middlewares/error.middleware.js'; 

import {
  createInstanceValidation,
  getInstancesValidation,
  getInstanceByIdValidation,
  getInstancesBySchemaIdValidation,
  updateInstanceValidation,
  deleteInstanceValidation
} from './instance.validations.js';

import {
  createInstance,
  getInstances,
  getInstancesDrafts,
  getInstancesBySchemaId,
  getInstanceById,
  updateInstance,
  deleteInstance,
} from './instance.controller.js';

const router = Router();

router.post(
  '/', 
  validateRequest(createInstanceValidation), 
  catchAsync(createInstance)
);

router.get(
  '/', 
  validateRequest(getInstancesValidation), 
  catchAsync(getInstances)
);

router.get(
  '/drafts', 
  validateRequest(getInstancesValidation), 
  catchAsync(getInstancesDrafts)
);

router.get(
  '/schema/:schemaId', 
  validateRequest(getInstancesBySchemaIdValidation), 
  catchAsync(getInstancesBySchemaId)
);

router.get(
  '/:id', 
  validateRequest(getInstanceByIdValidation), 
  catchAsync(getInstanceById)
);

router.put(
  '/:id', 
  validateRequest(updateInstanceValidation), 
  catchAsync(updateInstance)
);

router.delete(
  '/:id', 
  validateRequest(deleteInstanceValidation), 
  catchAsync(deleteInstance)
);

export default router;