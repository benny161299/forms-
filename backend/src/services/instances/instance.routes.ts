import { Router } from "express";
import { catchAsync } from "../../middlewares/error.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  createInstance,
  deleteInstance,
  getInstanceById,
  getInstances,
  getInstancesBySchemaId,
  getInstancesDrafts,
  updateInstance,
} from "./instance.controller.js";
import {
  createInstanceValidation,
  deleteInstanceValidation,
  getInstanceByIdValidation,
  getInstancesBySchemaIdValidation,
  getInstancesValidation,
  updateInstanceValidation,
} from "./instance.validations.js";

const router = Router();

router.post("/", validateRequest(createInstanceValidation), catchAsync(createInstance));

router.get("/", validateRequest(getInstancesValidation), catchAsync(getInstances));

router.get("/drafts", validateRequest(getInstancesValidation), catchAsync(getInstancesDrafts));

router.get(
  "/schema/:schemaId",
  validateRequest(getInstancesBySchemaIdValidation),
  catchAsync(getInstancesBySchemaId),
);

router.get("/:id", validateRequest(getInstanceByIdValidation), catchAsync(getInstanceById));

router.put("/:id", validateRequest(updateInstanceValidation), catchAsync(updateInstance));

router.delete("/:id", validateRequest(deleteInstanceValidation), catchAsync(deleteInstance));

export default router;
