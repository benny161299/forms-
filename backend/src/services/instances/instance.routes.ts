import { Router } from "express";
import { catchAsync } from "../../middlewares/error.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  createInstance,
  deleteInstance,
  getInstanceById,
  getInstances,
  getInstancesDrafts,
  submitInstance,
  updateInstance,
} from "./instance.controller.js";
import {
  createInstanceValidation,
  deleteInstanceValidation,
  getInstanceByIdValidation,
  getInstancesValidation,
  submitInstanceValidation,
  updateInstanceValidation,
} from "./instance.validations.js";

const router = Router();

router.get("/", validateRequest(getInstancesValidation), catchAsync(getInstances));

router.get("/drafts", validateRequest(getInstancesValidation), catchAsync(getInstancesDrafts));

router.get("/:id", validateRequest(getInstanceByIdValidation), catchAsync(getInstanceById));

router.post("/", validateRequest(createInstanceValidation), catchAsync(createInstance));

router.put("/:id", validateRequest(updateInstanceValidation), catchAsync(updateInstance));

router.patch("/:id/submit", validateRequest(submitInstanceValidation), catchAsync(submitInstance));

router.delete("/:id", validateRequest(deleteInstanceValidation), catchAsync(deleteInstance));

export default router;
